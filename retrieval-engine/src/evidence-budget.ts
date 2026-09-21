export interface EvidenceBudget {
  quran: number;
  hadith: number;
  tafsir: number;
  story: number;
  dua: number;
}

export interface SituationProfile {
  primaryEmotion?: string;
  secondaryEmotions?: string[];
  situations?: string[];
  spiritualContext?: string[];
  riskAssessment?: string;
}

export function assessComplexity(profile: SituationProfile): "crisis" | "deep" | "moderate" | "simple" {
  if (profile.riskAssessment === "high" || profile.riskAssessment === "critical") {
    return "crisis";
  }

  const situations = profile.situations || [];
  const spiritual = profile.spiritualContext || [];
  const totalTags = situations.length + spiritual.length;

  if (totalTags > 3) {
    return "deep";
  } else if (totalTags > 1) {
    return "moderate";
  } else {
    return "simple";
  }
}

export function calculateBudget(profile: SituationProfile, isFollowUp = false): EvidenceBudget {
  if (isFollowUp) {
    return { quran: 1, hadith: 0, tafsir: 0, story: 0, dua: 0 };
  }

  const complexity = assessComplexity(profile);

  if (complexity === "crisis") {
    // Safety first: 1 gentle Quran reassurance, 1 du'a, 0 heavy hadiths
    return { quran: 1, hadith: 0, tafsir: 0, story: 0, dua: 1 };
  } else if (complexity === "deep") {
    return { quran: 3, hadith: 2, tafsir: 2, story: 1, dua: 1 };
  } else if (complexity === "moderate") {
    return { quran: 2, hadith: 1, tafsir: 1, story: 1, dua: 0 };
  } else {
    // simple
    return { quran: 1, hadith: 1, tafsir: 0, story: 0, dua: 0 };
  }
}
