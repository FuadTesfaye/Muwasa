import OpenAI from "openai";
import { serverConfig } from "../config";

const openai = new OpenAI({ apiKey: serverConfig.openaiApiKey });

export type SafetyAction = "NORMAL" | "GENTLE_CHECK" | "SAFETY_REDIRECT" | "CRISIS_RESPONSE";

export interface SafetyResult {
  isSafe: boolean;
  isCrisis: boolean;
  riskCategory: string | null;
  confidence: number;
  action: SafetyAction;
}

export async function checkSafety(message: string): Promise<SafetyResult> {
  // Offline / fast fallback if placeholder key
  if (!serverConfig.openaiApiKey || serverConfig.openaiApiKey.startsWith("sk-placeholder")) {
    const lower = message.toLowerCase();
    const crisisTriggers = [
      "kill myself",
      "suicide",
      "want to die",
      "end my life",
      "better off without me",
      "never wake up",
      "hit me",
      "hit my child",
      "end it all",
      "jump off",
      "punished myself",
      "pills",
      "point anymore",
      "locks me in",
      "hurt them",
      "kill them",
      "abuse",
      "touch me",
      "bleeding",
      "slit",
      "overdose",
      "hanging",
    ];
    if (crisisTriggers.some((t) => lower.includes(t))) {
      return {
        isSafe: false,
        isCrisis: true,
        riskCategory: "suicidal_ideation",
        confidence: 0.95,
        action: "CRISIS_RESPONSE",
      };
    }
    return {
      isSafe: true,
      isCrisis: false,
      riskCategory: null,
      confidence: 1.0,
      action: "NORMAL",
    };
  }

  try {
    const prompt = `
    You are a safety classifier for Muwāsā, an Islamic emotional support AI.
    Analyze the user's message for: self_harm, suicidal_ideation, imminent_danger, harm_to_others, abuse, child_safety, severe_distress.
    Respond with JSON:
    {
      "isSafe": boolean,
      "isCrisis": boolean,
      "riskCategory": "string or null",
      "confidence": float (0.0 to 1.0),
      "action": "NORMAL" | "GENTLE_CHECK" | "SAFETY_REDIRECT" | "CRISIS_RESPONSE"
    }
    `;

    const response = await openai.chat.completions.create({
      model: serverConfig.safetyModel,
      messages: [
        { role: "system", content: prompt },
        { role: "user", content: message },
      ],
      response_format: { type: "json_object" },
      temperature: 0.0,
    });

    const parsed = JSON.parse(response.choices[0].message.content || "{}");
    return {
      isSafe: parsed.isSafe ?? true,
      isCrisis: parsed.isCrisis ?? false,
      riskCategory: parsed.riskCategory ?? null,
      confidence: parsed.confidence ?? 1.0,
      action: parsed.action || "NORMAL",
    };
  } catch (error) {
    console.warn("Safety classifier warning:", error);
    return {
      isSafe: true,
      isCrisis: false,
      riskCategory: null,
      confidence: 1.0,
      action: "NORMAL",
    };
  }
}

export function getCrisisResponse(): string {
  return (
    "I am so deeply sorry for the immense pain and weight you are carrying right now. " +
    "Your life has immense value in the sight of Allah, and your pain is real and heard.\n\n" +
    "Please know that struggling right now does NOT make you a bad Muslim—it simply means " +
    "you are carrying a burden too heavy to bear alone. You deserve care, safety, and support.\n\n" +
    "Please reach out to someone who can help keep you safe immediately:\n" +
    "• Suicide & Crisis Lifeline: Call or text 988 (US & Canada, 24/7)\n" +
    "• Crisis Text Line: Text HOME to 741741\n" +
    "• Naseeha Muslim Youth & Mental Health Helpline: 1-866-NASEEHA (1-866-627-3342)\n" +
    "• UK Samaritans: Call 116 123\n" +
    "• International Helplines: befrienders.org\n\n" +
    "I am here with you. Would you like to take a breath and talk through what brought you to this moment?"
  );
}
