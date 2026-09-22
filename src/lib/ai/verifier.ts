import { RetrievedSource } from '@/lib/rag/retrieve';

export interface VerificationResult {
  isValid: boolean;
  verifiedCitations: string[];
  unverifiedCitations: string[];
  allowedSourceIds: string[];
}

export function verifyCitations(
  responseContent: string,
  evidencePack: RetrievedSource[]
): VerificationResult {
  const allowedSourceIds = evidencePack.map((s) => s.id);
  const allowedReferences = new Set(
    evidencePack.map((s) => s.reference.toLowerCase().replace(/['’]/g, ''))
  );

  // Extract Quran patterns: e.g. "Qur'an 39:53" or "Quran 39:53" or "Surah 39:53"
  const quranMatches = responseContent.match(/Qur['’]?an\s+(\d+:\d+(?:-\d+)?)/gi) || [];
  
  // Extract Hadith patterns: e.g. "Sahih Muslim #2999" or "Bukhari #1234"
  const hadithMatches = responseContent.match(/(Sahih\s+(?:Muslim|al-Bukhari|Bukhari)|Jami['’]?\s+at-Tirmidhi|Sunan\s+\w+)\s+(?:#|hadith\s+)?(\d+)/gi) || [];

  const verifiedCitations: string[] = [];
  const unverifiedCitations: string[] = [];

  for (const match of quranMatches) {
    const normalized = match.toLowerCase().replace(/['’]/g, '');
    const isPresent = Array.from(allowedReferences).some((ref) => ref.includes(normalized) || normalized.includes(ref));
    if (isPresent) {
      verifiedCitations.push(match);
    } else {
      unverifiedCitations.push(match);
    }
  }

  for (const match of hadithMatches) {
    const normalized = match.toLowerCase().replace(/['’]/g, '');
    const isPresent = Array.from(allowedReferences).some((ref) => ref.includes(normalized) || normalized.includes(ref));
    if (isPresent) {
      verifiedCitations.push(match);
    } else {
      unverifiedCitations.push(match);
    }
  }

  return {
    isValid: unverifiedCitations.length === 0,
    verifiedCitations: Array.from(new Set(verifiedCitations)),
    unverifiedCitations: Array.from(new Set(unverifiedCitations)),
    allowedSourceIds,
  };
}
