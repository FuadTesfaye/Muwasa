import { z } from 'zod';
import { generateObject } from 'ai';
import { chatModel } from '@/lib/ai/model';
import { SAFETY_CLASSIFIER_PROMPT } from '@/lib/ai/prompts';
import { checkSafetyRules } from './rules';

export const safetySchema = z.object({
  riskLevel: z.enum(['none', 'low', 'moderate', 'high', 'critical']),
  categories: z.array(z.string()),
  confidence: z.number().min(0).max(1),
  recommendedAction: z.enum(['normal', 'gentle_check_in', 'safety_redirect', 'crisis_response']),
  explanation: z.string().optional(),
});

export type SafetyAssessment = z.infer<typeof safetySchema>;

export async function assessSafety(userMessage: string): Promise<SafetyAssessment> {
  // Layer 1: Zero-latency deterministic rule check
  const ruleResult = checkSafetyRules(userMessage);
  if (ruleResult.isCritical) {
    return {
      riskLevel: 'critical',
      categories: [ruleResult.category || 'suicide'],
      confidence: 0.99,
      recommendedAction: 'crisis_response',
      explanation: 'Matched acute critical pattern rule.',
    };
  }

  // Layer 2: LLM classifier for nuanced or indirect distress
  try {
    const { object } = await generateObject({
      model: chatModel,
      schema: safetySchema,
      system: SAFETY_CLASSIFIER_PROMPT,
      prompt: `User message to analyze for safety risk:\n"${userMessage}"`,
    });
    return object;
  } catch (error) {
    // Graceful offline fallback
    console.warn('[SafetyClassifier] LLM evaluation skipped or errored; relying on rules.', error);
    return {
      riskLevel: 'none',
      categories: [],
      confidence: 0.8,
      recommendedAction: 'normal',
    };
  }
}
