import { streamText } from 'ai';
import { chatModel } from './model';
import { MUWASA_SYSTEM_PROMPT } from './prompts';
import { RetrievedSource } from '@/lib/rag/retrieve';
import { SituationProfile } from './classifier';
import { buildEvidenceContext } from '@/lib/rag/context';

export interface GenerateResponseOptions {
  message: string;
  history?: { role: 'user' | 'assistant'; content: string }[];
  situation: SituationProfile;
  sources: RetrievedSource[];
}

export function generateStreamResponse({
  message,
  history = [],
  situation,
  sources,
}: GenerateResponseOptions) {
  const evidenceContext = buildEvidenceContext(sources, situation);
  const systemPrompt = `${MUWASA_SYSTEM_PROMPT}\n\n${evidenceContext}`;

  const conversationMessages = [
    ...history.slice(-6).map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    })),
    {
      role: 'user' as const,
      content: message,
    },
  ];

  return streamText({
    model: chatModel,
    system: systemPrompt,
    messages: conversationMessages,
    temperature: 0.6,
  });
}
