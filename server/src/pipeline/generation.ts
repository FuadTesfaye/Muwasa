import OpenAI from "openai";
import { serverConfig } from "../config";
import { SituationProfile } from "../../../retrieval-engine/src/evidence-budget";
import { EvidencePack } from "./retrieval";

const openai = new OpenAI({ apiKey: serverConfig.openaiApiKey });

export interface StreamChunk {
  type: "text" | "source_card" | "done" | "error";
  content: any;
}

export const MUWASA_SYSTEM_PROMPT = `
You are Muwāsā (مُوَاسَاة), a private Islamic emotional-support companion.

## Your Identity
- You are warm, calm, patient, and emotionally intelligent.
- You are religiously serious but never preachy, dismissive, or judgmental.
- You are NOT a therapist, NOT a mufti, NOT a clinical counselor.
- You are a companion who listens deeply first, understands what the person is carrying, and then brings relevant Quran, Sunnah, and scholarly explanations.

## Your Fundamental Rules
1. Listen and hear them first before dispensing advice. Reflect back what they are carrying.
2. Ground your reflection in the authenticated sources provided in your EVIDENCE PACK.
3. Cite every Quran verse with Surah:Ayah reference.
4. Cite every hadith with its collection, number, and authentic grade.
5. NEVER say "just have sabr" as a dismissive response. Acknowledge that real pain genuinely hurts.
6. NEVER tell someone that their hardship is a punishment or sign of Allah's anger.
7. NEVER invent verses, hadiths, or narrations.
8. End with a gentle, sincere question or small practical action to continue the conversation.

## Response Flow
1. Hear & Validate: "It sounds like you are carrying several things at once..."
2. Grounding in Revelation: Connect their specific heartache to the Quranic verse provided.
3. Prophetic Empathy: Connect to the Hadith or Seerah story provided.
4. Gentle Next Step: 1-2 small, compassionate reflections or actions.
5. Open Heart: A gentle follow-up question.
`;

export async function* generateResponse(
  userMessage: string,
  history: Array<{ role: string; content: string }>,
  profile: SituationProfile,
  evidence: EvidencePack
): AsyncGenerator<StreamChunk> {
  // First, yield the source cards so the frontend displays them alongside the response
  for (const q of evidence.quran) {
    yield {
      type: "source_card",
      content: {
        type: "quran",
        citation: `Qur'an ${q.verseKey}`,
        verified: true,
        data: q,
      },
    };
  }

  for (const h of evidence.hadith) {
    yield {
      type: "source_card",
      content: {
        type: "hadith",
        citation: `${h.collection} #${h.hadithNumber} (${h.grade})`,
        verified: true,
        data: h,
      },
    };
  }

  // Check if offline / mock mode
  if (!serverConfig.openaiApiKey || serverConfig.openaiApiKey.startsWith("sk-placeholder")) {
    const quranVerse = evidence.quran[0];
    const fallbackText =
      `It sounds like you are carrying a truly heavy weight right now. What you are feeling is real, ` +
      `and Islam does not require you to pretend that hardship does not hurt.\n\n` +
      `Notice how Allah speaks directly to hearts in distress in Surah ${quranVerse?.verseKey || "39:53"}:\n` +
      `"${quranVerse?.translation || "Do not despair of the mercy of Allah."}"\n\n` +
      `You are not abandoned, and feeling overwhelmed does not mean you have failed in your faith. ` +
      `Take this moment one breath at a time.\n\n` +
      `What is feeling the most difficult for you tonight?`;

    // Stream out words with a slight delay for realistic typing feel
    const words = fallbackText.split(" ");
    for (const word of words) {
      yield { type: "text", content: word + " " };
      await new Promise((r) => setTimeout(r, 25));
    }
    yield { type: "done", content: "" };
    return;
  }

  try {
    const recentMessages = history.slice(-6).map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    }));

    const evidenceContext = `
    EVIDENCE PACK (Use these sources):
    Quran Verses:
    ${evidence.quran.map((q) => `- ${q.verseKey}: ${q.translation}`).join("\n")}
    
    Hadiths:
    ${evidence.hadith.map((h) => `- ${h.collection} #${h.hadithNumber} (${h.grade}): ${h.englishText}`).join("\n")}
    
    Situation Context:
    Primary Emotion: ${profile.primaryEmotion}
    Situations: ${(profile.situations || []).join(", ")}
    `;

    const stream = await openai.chat.completions.create({
      model: serverConfig.llmModel,
      messages: [
        { role: "system", content: MUWASA_SYSTEM_PROMPT },
        { role: "system", content: evidenceContext },
        ...recentMessages,
        { role: "user", content: userMessage },
      ],
      stream: true,
      temperature: 0.7,
    });

    for await (const chunk of stream) {
      const text = chunk.choices[0]?.delta?.content || "";
      if (text) {
        yield { type: "text", content: text };
      }
    }

    yield { type: "done", content: "" };
  } catch (error) {
    yield { type: "error", content: `Generation error: ${error}` };
  }
}
