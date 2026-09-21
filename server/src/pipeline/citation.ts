import { EvidencePack } from "./retrieval";

export interface CitationVerificationResult {
  allVerified: boolean;
  unverifiedClaims: string[];
}

export async function verifyCitations(
  response: string,
  evidence: EvidencePack
): Promise<CitationVerificationResult> {
  const unverifiedClaims: string[] = [];

  // Check Quran citations
  const quranMatches = response.match(/(?:Qur['’]an|Surah)\s*(\d+:\d+)/gi);
  if (quranMatches) {
    const availableKeys = new Set(evidence.quran.map((q) => q.verseKey));
    for (const match of quranMatches) {
      const key = match.replace(/[^0-9:]/g, "");
      if (key && !availableKeys.has(key)) {
        unverifiedClaims.push(`Cited verse ${key} was not present in evidence pack`);
      }
    }
  }

  return {
    allVerified: unverifiedClaims.length === 0,
    unverifiedClaims,
  };
}
