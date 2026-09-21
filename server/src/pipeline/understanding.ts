import OpenAI from "openai";
import { serverConfig } from "../config";
import { SituationProfile } from "../../../retrieval-engine/src/evidence-budget";

const openai = new OpenAI({ apiKey: serverConfig.openaiApiKey });

export async function understandSituation(
  message: string,
  history: Array<{ role: string; content: string }>,
  currentProfile?: SituationProfile | null
): Promise<SituationProfile> {
  if (!serverConfig.openaiApiKey || serverConfig.openaiApiKey.startsWith("sk-placeholder")) {
    // Offline heuristic mapping for development & testing
    const lower = message.toLowerCase();
    const emotions: string[] = [];
    const situations: string[] = [];

    if (lower.includes("sad") || lower.includes("cry")) emotions.push("sadness");
    if (lower.includes("fail") || lower.includes("exam")) situations.push("academic_failure");
    if (lower.includes("parent") || lower.includes("father") || lower.includes("mother")) situations.push("parent_pressure");
    if (lower.includes("sin") || lower.includes("guilt")) emotions.push("guilt");

    return {
      primaryEmotion: emotions[0] || "sadness",
      secondaryEmotions: emotions.slice(1),
      situations: situations.length ? situations : ["insecurity"],
      spiritualContext: ["sabr", "tawakkul"],
      riskAssessment: "none_detected",
    };
  }

  try {
    const systemPrompt = `
    You are an empathetic situation understanding model for Muwāsā, an Islamic emotional support companion.
    Analyze the user's emotional state, life situation, and spiritual dilemma.
    
    Allowed Emotions: sadness, grief, fear, anger, guilt, shame, loneliness, regret, hopelessness, confusion, frustration, overwhelm, anxiety, peace, hope, gratitude.
    Allowed Situations: death, breakup, friendship_loss, job_loss, parent_pressure, marriage_difficulty, family_comparison, betrayal, academic_failure, career_failure, insecurity, addiction, weak_iman, missed_salah, quran_guilt, dua_unanswered, repentance, waswas, financial_problem, illness.
    
    Respond in JSON:
    {
      "primaryEmotion": "string",
      "secondaryEmotions": ["string"],
      "situations": ["string"],
      "spiritualContext": ["string"],
      "riskAssessment": "none_detected" | "elevated" | "serious" | "critical"
    }
    `;

    const recentHistory = history.slice(-6).map((m) => `${m.role}: ${m.content}`).join("\n");
    const userPrompt = `
    Previous Profile: ${JSON.stringify(currentProfile || {})}
    Conversation context:
    ${recentHistory}
    
    Current User Message: "${message}"
    Update the situation profile based on what the user is carrying.
    `;

    const response = await openai.chat.completions.create({
      model: serverConfig.classifierModel,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.1,
    });

    return JSON.parse(response.choices[0].message.content || "{}");
  } catch (err) {
    console.warn("Situation understanding warning:", err);
    return {
      primaryEmotion: "sadness",
      secondaryEmotions: [],
      situations: ["insecurity"],
      spiritualContext: ["sabr"],
      riskAssessment: "none_detected",
    };
  }
}
