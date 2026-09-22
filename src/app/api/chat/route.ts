import { z } from 'zod';
import { NextRequest, NextResponse } from 'next/server';
import { assessSafety } from '@/lib/safety/classifier';
import { generateCrisisResponse } from '@/lib/safety/escalation';
import { classifySituation } from '@/lib/ai/classifier';
import { buildRetrievalQueries } from '@/lib/rag/query';
import { retrieveSources } from '@/lib/rag/retrieve';
import { rerankAndFilterEvidence } from '@/lib/rag/rerank';
import { generateStreamResponse } from '@/lib/ai/generator';
import { checkRateLimit } from '@/lib/cache/redis';

export const runtime = 'nodejs';
export const maxDuration = 60;

const chatRequestSchema = z.object({
  message: z.string().min(1).max(2000),
  conversationId: z.string().optional(),
  history: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string(),
      })
    )
    .optional(),
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = chatRequestSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid message request payload', details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { message, history = [] } = parsed.data;

    // 1. Rate Limiting Check
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const rateLimit = await checkRateLimit(ip);
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: 'Too many reflections. Please pause for a moment before speaking again.' },
        { status: 429 }
      );
    }

    // 2. Safety Assessment
    const safety = await assessSafety(message);
    if (safety.riskLevel === 'critical' || safety.recommendedAction === 'crisis_response') {
      const crisis = generateCrisisResponse();
      return NextResponse.json(
        {
          isCrisis: true,
          content: crisis.message,
          resources: crisis.resources,
        },
        {
          headers: {
            'X-Muwasa-Safety': 'crisis',
          },
        }
      );
    }

    // 3. Situation & Emotional Classification
    const situation = await classifySituation(message, history);

    // 4. Query Expansion & Scripture Retrieval
    const { primaryQuery } = buildRetrievalQueries(message, situation);
    const rawSources = await retrieveSources({
      query: primaryQuery,
      situation,
      limit: 6,
    });

    // 5. Evidence Reranking & Budgeting
    const evidencePack = rerankAndFilterEvidence(rawSources, situation, 4);

    // 6. Response Generation via Gemini & AI SDK
    const stream = generateStreamResponse({
      message,
      history,
      situation,
      sources: evidencePack,
    });

    // 7. Format sources for client card rendering
    const clientSources = evidencePack.map((s) => ({
      id: s.id,
      type: s.type,
      reference: s.reference,
      title: s.title,
      arabicText: s.arabicText,
      translation: s.translation,
      grade: s.grade,
      grader: s.grader,
      collection: s.collection,
      explanation: s.explanation,
    }));

    return stream.toTextStreamResponse({
      headers: {
        'X-Muwasa-Safety': safety.riskLevel,
        'X-Muwasa-Situation': encodeURIComponent(JSON.stringify(situation)),
        'X-Muwasa-Sources': encodeURIComponent(JSON.stringify(clientSources)),
      },
    });
  } catch (error: any) {
    console.error('[ChatRoute] Unhandled pipeline error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while reflecting. Please try again.' },
      { status: 500 }
    );
  }
}
