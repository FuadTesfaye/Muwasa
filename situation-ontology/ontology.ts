export interface EmotionDefinition {
  slug: string;
  nameEn: string;
  nameAr?: string;
  category: "negative" | "positive" | "neutral";
  description: string;
}

export interface SituationDefinition {
  slug: string;
  nameEn: string;
  nameAr?: string;
  category: "loss" | "relationships" | "self" | "worship" | "worldly_pressure";
  description: string;
  parent?: string;
}

export interface SpiritualStateDefinition {
  slug: string;
  nameEn: string;
  nameAr?: string;
  description: string;
  relatedConcepts: string[];
}

export interface SafetyStateDefinition {
  slug: string;
  nameEn: string;
  severity: "critical" | "serious" | "elevated";
  action: "crisis_response" | "safety_redirect" | "gentle_check_in";
  description: string;
  indicators: string[];
}

export const EMOTIONS: Record<string, EmotionDefinition> = {
  sadness: {
    slug: "sadness",
    nameEn: "Sadness",
    nameAr: "حزن (Huzn)",
    category: "negative",
    description: "General feeling of sorrow, pain, or emotional hurt.",
  },
  grief: {
    slug: "grief",
    nameEn: "Grief",
    nameAr: "غم (Ghamm)",
    category: "negative",
    description: "Deep, agonizing sorrow caused by bereavement or significant loss.",
  },
  fear: {
    slug: "fear",
    nameEn: "Fear",
    nameAr: "خوف (Khawf)",
    category: "negative",
    description: "Anxiety or apprehension about the future, danger, or harm.",
  },
  anger: {
    slug: "anger",
    nameEn: "Anger",
    nameAr: "غضب (Ghadab)",
    category: "negative",
    description: "Intense emotional response to perceived injustice or mistreatment.",
  },
  guilt: {
    slug: "guilt",
    nameEn: "Guilt",
    nameAr: "ذنب (Dhanb)",
    category: "negative",
    description: "Painful feeling of remorse over personal sins or wrongdoing.",
  },
  shame: {
    slug: "shame",
    nameEn: "Shame",
    nameAr: "خجل (Khajal) / عار",
    category: "negative",
    description: "Painful feeling of humiliation or unworthiness as a person.",
  },
  loneliness: {
    slug: "loneliness",
    nameEn: "Loneliness",
    nameAr: "وحشة (Wahshah)",
    category: "negative",
    description: "Feeling isolated, misunderstood, or lacking human connection.",
  },
  regret: {
    slug: "regret",
    nameEn: "Regret",
    nameAr: "ندم (Nadam)",
    category: "negative",
    description: "Wishing a past action or decision had been different.",
  },
  hopelessness: {
    slug: "hopelessness",
    nameEn: "Hopelessness",
    nameAr: "يأس (Ya's)",
    category: "negative",
    description: "Belief that no positive change is possible; loss of hope.",
  },
  confusion: {
    slug: "confusion",
    nameEn: "Confusion",
    nameAr: "حيرة (Hayrah)",
    category: "negative",
    description: "Uncertainty, internal conflict, or difficulty discerning right from wrong.",
  },
  frustration: {
    slug: "frustration",
    nameEn: "Frustration",
    nameAr: "إحباط (Ihbat)",
    category: "negative",
    description: "Agitation resulting from obstacles to one's goals or desires.",
  },
  overwhelm: {
    slug: "overwhelm",
    nameEn: "Overwhelm",
    nameAr: "إنهاك (Inhak)",
    category: "negative",
    description: "Feeling crushed by the weight of simultaneous responsibilities.",
  },
  anxiety: {
    slug: "anxiety",
    nameEn: "Anxiety",
    nameAr: "قلق (Qalaq)",
    category: "negative",
    description: "Persistent mental distress, rumination, or dread.",
  },
  peace: {
    slug: "peace",
    nameEn: "Peace",
    nameAr: "سكينة (Sakinah)",
    category: "positive",
    description: "Inner tranquility, serenity, and God-given stillness of heart.",
  },
  hope: {
    slug: "hope",
    nameEn: "Hope",
    nameAr: "رجاء (Raja')",
    category: "positive",
    description: "Expectation of Allah's mercy, forgiveness, and future good.",
  },
  gratitude: {
    slug: "gratitude",
    nameEn: "Gratitude",
    nameAr: "شكر (Shukr)",
    category: "positive",
    description: "Conscious thankfulness to Allah for His blessings in hardship and ease.",
  },
  contentment: {
    slug: "contentment",
    nameEn: "Contentment",
    nameAr: "رضا (Rida)",
    category: "positive",
    description: "Peaceful acceptance of divine decree and satisfaction with Allah.",
  },
};

export const SITUATIONS: Record<string, SituationDefinition> = {
  // LOSS
  death: {
    slug: "death",
    nameEn: "Death of a Loved One",
    nameAr: "وفاة",
    category: "loss",
    description: "Grieving the passing of a family member, spouse, or friend.",
  },
  breakup: {
    slug: "breakup",
    nameEn: "Breakup",
    category: "loss",
    description: "Ending of an emotional or romantic relationship.",
  },
  friendship_loss: {
    slug: "friendship_loss",
    nameEn: "Friendship Loss",
    category: "loss",
    description: "Losing a close friend through drifting apart, betrayal, or conflict.",
  },
  job_loss: {
    slug: "job_loss",
    nameEn: "Job Loss",
    category: "loss",
    description: "Being laid off, fired, or facing sudden loss of livelihood.",
  },

  // RELATIONSHIPS
  parent_pressure: {
    slug: "parent_pressure",
    nameEn: "Parent Pressure",
    category: "relationships",
    description: "Facing overwhelming expectations, emotional pressure, or disappointment from parents.",
  },
  marriage_difficulty: {
    slug: "marriage_difficulty",
    nameEn: "Marriage Difficulty",
    category: "relationships",
    description: "Experiencing friction, communication breakdowns, or discord within a marriage.",
  },
  family_comparison: {
    slug: "family_comparison",
    nameEn: "Family Comparison",
    category: "relationships",
    description: "Being unfavorably compared to siblings, cousins, or peers by parents or relatives.",
  },
  betrayal: {
    slug: "betrayal",
    nameEn: "Betrayal",
    category: "relationships",
    description: "Having trust broken by someone close.",
  },

  // SELF
  academic_failure: {
    slug: "academic_failure",
    nameEn: "Academic Failure",
    category: "self",
    description: "Failing exams, struggling at university, or falling behind in studies.",
  },
  career_failure: {
    slug: "career_failure",
    nameEn: "Career Failure",
    category: "self",
    description: "Struggling professionally or feeling like a failure in one's career.",
  },
  insecurity: {
    slug: "insecurity",
    nameEn: "Insecurity & Low Self-Esteem",
    category: "self",
    description: "Persistent feelings of inadequacy, defectiveness, or worthlessness.",
  },
  addiction: {
    slug: "addiction",
    nameEn: "Addiction & Habit Relapse",
    category: "self",
    description: "Struggling with repeated compulsive behaviors or relapses.",
  },

  // WORSHIP
  weak_iman: {
    slug: "weak_iman",
    nameEn: "Weak Iman",
    nameAr: "ضعف الإيمان",
    category: "worship",
    description: "Feeling spiritually empty, distant from Allah, or lacking motivation in worship.",
  },
  missed_salah: {
    slug: "missed_salah",
    nameEn: "Missed Salah",
    nameAr: "تفريط في الصلاة",
    category: "worship",
    description: "Guilt and struggle with performing obligatory daily prayers on time.",
  },
  quran_guilt: {
    slug: "quran_guilt",
    nameEn: "Quran Guilt",
    category: "worship",
    description: "Feeling heavy remorse for having abandoned reading or reflecting upon the Quran.",
  },
  dua_unanswered: {
    slug: "dua_unanswered",
    nameEn: "Dua Feels Unanswered",
    category: "worship",
    description: "Distress or confusion over persistent supplications that seem unanswered.",
  },
  repentance: {
    slug: "repentance",
    nameEn: "Seeking Repentance (Tawbah)",
    nameAr: "توبة",
    category: "worship",
    description: "Desiring to turn back to Allah after committing sins; fear of unworthiness.",
  },
  waswas: {
    slug: "waswas",
    nameEn: "Intrusive Thoughts / Whispers (Waswas)",
    nameAr: "وسوسة",
    category: "worship",
    description: "Torment by intrusive religious doubts, repetitive purity doubts, or blasphemous thoughts.",
  },

  // WORLDLY PRESSURE
  financial_problem: {
    slug: "financial_problem",
    nameEn: "Financial Hardship",
    nameAr: "ضيق الرزق",
    category: "worldly_pressure",
    description: "Severe financial stress, debt, or inability to meet basic obligations.",
  },
  illness: {
    slug: "illness",
    nameEn: "Physical Illness",
    nameAr: "مرض",
    category: "worldly_pressure",
    description: "Coping with acute or chronic physical sickness, pain, or diagnosis.",
  },
};

export const SAFETY_STATES: Record<string, SafetyStateDefinition> = {
  self_harm: {
    slug: "self_harm",
    nameEn: "Self-Harm",
    severity: "critical",
    action: "crisis_response",
    description: "Expressions of deliberate self-inflicted physical injury.",
    indicators: ["cutting", "hurting myself", "burn myself", "bleed"],
  },
  suicidal_ideation: {
    slug: "suicidal_ideation",
    nameEn: "Suicidal Ideation",
    severity: "critical",
    action: "crisis_response",
    description: "Direct or indirect expressions of wanting to end one's life.",
    indicators: [
      "want to die",
      "kill myself",
      "no reason to live",
      "better off dead",
      "end it all",
      "don't want to wake up",
      "disappear forever",
    ],
  },
  imminent_danger: {
    slug: "imminent_danger",
    nameEn: "Imminent Danger",
    severity: "critical",
    action: "crisis_response",
    description: "Immediate physical threat to safety.",
    indicators: ["in danger", "help me now", "trapped", "violence"],
  },
  harm_to_others: {
    slug: "harm_to_others",
    nameEn: "Harm to Others",
    severity: "serious",
    action: "safety_redirect",
    description: "Desire or intent to inflict violence on someone else.",
    indicators: ["want to hurt them", "kill him", "make them pay with violence"],
  },
  abuse_disclosure: {
    slug: "abuse_disclosure",
    nameEn: "Abuse Disclosure",
    severity: "serious",
    action: "safety_redirect",
    description: "Disclosure of experiencing domestic, sexual, or physical abuse.",
    indicators: ["abusing me", "hitting me", "threatens my life", "forced me"],
  },
};
