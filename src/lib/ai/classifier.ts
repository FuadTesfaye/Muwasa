import { z } from 'zod';
import { generateObject } from 'ai';
import { chatModel } from './model';
import { SITUATION_CLASSIFIER_PROMPT } from './prompts';

export const situationSchema = z.object({
  emotions: z.array(z.string()).describe('Active emotional states, e.g. grief, guilt, sadness, fear, hope'),
  situations: z.array(z.string()).describe('Life situations, e.g. parent_pressure, recurring_sin, bereavement'),
  spiritualStates: z.array(z.string()).describe('Spiritual states, e.g. repentance, lack_of_hope, fear_of_allah, weak_iman'),
  riskLevel: z.enum(['none', 'low', 'moderate', 'high', 'critical']),
  confidence: z.number().min(0).max(1),
  primaryTopic: z.string().optional(),
});

export type SituationProfile = z.infer<typeof situationSchema>;

// Canonical fallback heuristic for offline operation and deterministic tests
export function heuristicClassify(message: string): SituationProfile {
  const text = message.toLowerCase();
  const emotions: string[] = [];
  const situations: string[] = [];
  const spiritualStates: string[] = [];

  if (text.includes('grief') || text.includes('loss') || text.includes('passed away') || text.includes('died')) {
    emotions.push('grief', 'sadness');
    situations.push('bereavement');
    spiritualStates.push('sabr');
  }

  if (text.includes('sin') || text.includes('guilt') || text.includes('forgive') || text.includes('relapse')) {
    emotions.push('guilt', 'regret');
    situations.push('recurring_sin');
    spiritualStates.push('repentance', 'fear_of_allah');
  }

  if (text.includes('parent') || text.includes('family') || text.includes('disappoint') || text.includes('expectations')) {
    emotions.push('overwhelm', 'shame');
    situations.push('parent_pressure');
  }

  if (text.includes('fail') || text.includes('exam') || text.includes('career') || text.includes('job')) {
    emotions.push('fear', 'hopelessness');
    situations.push('academic_failure');
  }

  if (emotions.length === 0) emotions.push('confusion');
  if (situations.length === 0) situations.push('general_distress');
  if (spiritualStates.length === 0) spiritualStates.push('seeking_guidance');

  return {
    emotions,
    situations,
    spiritualStates,
    riskLevel: 'none',
    confidence: 0.85,
    primaryTopic: situations[0],
  };
}

export async function classifySituation(
  currentMessage: string,
  history: { role: string; content: string }[] = []
): Promise<SituationProfile> {
  try {
    const formattedHistory = history
      .slice(-5)
      .map((h) => `${h.role}: ${h.content}`)
      .join('\n');

    const promptText = formattedHistory
      ? `Recent Conversation Context:\n${formattedHistory}\n\nLatest User Message:\n"${currentMessage}"`
      : `User Message:\n"${currentMessage}"`;

    const { object } = await generateObject({
      model: chatModel,
      schema: situationSchema,
      system: SITUATION_CLASSIFIER_PROMPT,
      prompt: promptText,
    });

    return object;
  } catch (error) {
    console.warn('[SituationClassifier] Falling back to heuristic ontology matching.', error);
    return heuristicClassify(currentMessage);
  }
}
