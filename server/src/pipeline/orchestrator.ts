import { SituationProfile } from "../../../retrieval-engine/src/evidence-budget";
import { checkSafety, getCrisisResponse } from "./safety";
import { understandSituation } from "./understanding";
import { retrieveEvidence } from "./retrieval";
import { generateResponse, StreamChunk } from "./generation";
import { verifyCitations } from "./citation";

interface SessionData {
  history: Array<{ role: string; content: string }>;
  profile: SituationProfile | null;
  lastActive: Date;
}

// In-memory session store with automatic 24h expiration
export const sessions = new Map<string, SessionData>();

export function getOrCreateSession(sessionId: string): SessionData {
  let session = sessions.get(sessionId);
  if (!session) {
    session = {
      history: [],
      profile: null,
      lastActive: new Date(),
    };
    sessions.set(sessionId, session);
  }
  session.lastActive = new Date();
  return session;
}

export function deleteSession(sessionId: string): boolean {
  return sessions.delete(sessionId);
}

export async function* processMessage(
  sessionId: string,
  userMessage: string
): AsyncGenerator<StreamChunk> {
  const session = getOrCreateSession(sessionId);

  // 1. Safety Gateway
  const safety = await checkSafety(userMessage);
  if (safety.action === "CRISIS_RESPONSE") {
    yield {
      type: "text",
      content: getCrisisResponse(),
    };
    yield { type: "done", content: "" };
    return;
  }

  // 2. Situation Understanding
  const newProfile = await understandSituation(userMessage, session.history, session.profile);
  session.profile = newProfile;

  // 3. Evidence Retrieval
  const evidence = await retrieveEvidence(userMessage, newProfile, session.history.length > 2);

  // 4. Response Generation & Streaming
  let fullResponse = "";
  for await (const chunk of generateResponse(userMessage, session.history, newProfile, evidence)) {
    if (chunk.type === "text") {
      fullResponse += chunk.content;
    }
    yield chunk;
  }

  // 5. Post-generation Citation Check
  const verification = await verifyCitations(fullResponse, evidence);
  if (!verification.allVerified) {
    console.warn("Citation verification warning:", verification.unverifiedClaims);
  }

  // 6. Update Session History
  session.history.push({ role: "user", content: userMessage });
  session.history.push({ role: "assistant", content: fullResponse });

  if (session.history.length > 20) {
    session.history = session.history.slice(-10);
  }
}
