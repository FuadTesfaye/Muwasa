import { z } from 'zod';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { userFeedback } from '@/lib/db/schema';

const feedbackSchema = z.object({
  messageId: z.string().optional(),
  responseHelpful: z.boolean(),
  responseTone: z.string().optional(),
  sourceRelevant: z.boolean().optional(),
  comment: z.string().max(1000).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = feedbackSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid feedback data' }, { status: 400 });
    }

    try {
      await db.insert(userFeedback).values({
        messageId: parsed.data.messageId,
        responseHelpful: parsed.data.responseHelpful,
        responseTone: parsed.data.responseTone,
        sourceRelevant: parsed.data.sourceRelevant,
        comment: parsed.data.comment,
      });
    } catch (dbError) {
      // Soft logging if database is offline
      console.warn('[FeedbackRoute] Database insert skipped:', dbError);
    }

    return NextResponse.json({ success: true, message: 'JazakAllahu Khayran for your feedback.' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to record feedback' }, { status: 500 });
  }
}
