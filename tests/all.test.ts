import { describe, expect, test } from "bun:test";
import { EMOTIONS, SITUATIONS, SAFETY_STATES } from "../situation-ontology/ontology";
import { normalizeArabic } from "../islamic-kb/scripts/utils";
import { calculateBudget, assessComplexity } from "../retrieval-engine/src/evidence-budget";
import { filterByTier, filterByGrade, deduplicate, SearchResult } from "../retrieval-engine/src/filters";
import { getCrisisResponse } from "../server/src/pipeline/safety";
import { verifyCitations } from "../server/src/pipeline/citation";

describe("1. Situation Ontology (TypeScript)", () => {
  test("contains core emotional states", () => {
    expect(EMOTIONS.sadness).toBeDefined();
    expect(EMOTIONS.grief).toBeDefined();
    expect(EMOTIONS.fear).toBeDefined();
    expect(EMOTIONS.guilt).toBeDefined();
    expect(EMOTIONS.shame).toBeDefined();
    expect(EMOTIONS.peace).toBeDefined();
    expect(EMOTIONS.hope).toBeDefined();
  });

  test("contains core life situations", () => {
    expect(SITUATIONS.death).toBeDefined();
    expect(SITUATIONS.academic_failure).toBeDefined();
    expect(SITUATIONS.parent_pressure).toBeDefined();
    expect(SITUATIONS.weak_iman).toBeDefined();
    expect(SITUATIONS.financial_problem).toBeDefined();
  });

  test("contains critical safety states", () => {
    expect(SAFETY_STATES.self_harm.action).toBe("crisis_response");
    expect(SAFETY_STATES.suicidal_ideation.action).toBe("crisis_response");
    expect(SAFETY_STATES.imminent_danger.action).toBe("crisis_response");
  });
});

describe("2. Arabic Normalization (TypeScript)", () => {
  test("strips tashkeel / harakat", () => {
    const vocalized = "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ";
    const normalized = normalizeArabic(vocalized);
    expect(normalized).not.toContain("ِ");
    expect(normalized).not.toContain("ّ");
    expect(normalized).not.toContain("ْ");
  });

  test("normalizes hamza variants", () => {
    expect(normalizeArabic("إيمان")).toBe("ايمان");
    expect(normalizeArabic("أحمد")).toBe("احمد");
    expect(normalizeArabic("آمن")).toBe("امن");
  });

  test("normalizes ta marbuta and alif maqsura", () => {
    expect(normalizeArabic("رحمة")).toBe("رحمه");
    expect(normalizeArabic("هدى")).toBe("هدي");
  });
});

describe("3. Evidence Budget & Pacing (TypeScript)", () => {
  test("calculates simple budget", () => {
    const budget = calculateBudget({ situations: ["academic_failure"], spiritualContext: [] });
    expect(budget.quran).toBe(1);
    expect(budget.hadith).toBe(1);
    expect(budget.tafsir).toBe(0);
  });

  test("calculates deep budget for complex multifaceted situation", () => {
    const budget = calculateBudget({
      situations: ["academic_failure", "parent_pressure", "family_comparison"],
      spiritualContext: ["sabr", "qadr"],
    });
    expect(budget.quran).toBe(3);
    expect(budget.hadith).toBe(2);
    expect(budget.tafsir).toBe(2);
  });

  test("calculates crisis budget prioritizing human safety", () => {
    const budget = calculateBudget({
      situations: ["hopelessness"],
      riskAssessment: "critical",
    });
    expect(budget.quran).toBe(1);
    expect(budget.hadith).toBe(0);
    expect(budget.dua).toBe(1);
  });
});

describe("4. Retrieval Filters (TypeScript)", () => {
  const r1: SearchResult = { type: "quran_verses", id: "1", content: "ayah", score: 0.9, metadata: { source_tier: 0 } };
  const r2: SearchResult = { type: "hadiths", id: "2", content: "hadith", score: 0.8, metadata: { source_tier: 2, grade: "Sahih" } };
  const r3: SearchResult = { type: "hadiths", id: "3", content: "weak", score: 0.4, metadata: { source_tier: 5, grade: "Da'if" } };

  test("filters by source tier (excluding weak tier 5-6)", () => {
    const filtered = filterByTier([r1, r2, r3], 0, 2);
    expect(filtered.length).toBe(2);
    expect(filtered).not.toContain(r3);
  });

  test("filters by hadith authenticity grade", () => {
    const filtered = filterByGrade([r1, r2, r3], ["sahih", "hasan"]);
    expect(filtered.length).toBe(2);
    expect(filtered).not.toContain(r3);
  });

  test("deduplicates results", () => {
    const deduped = deduplicate([r1, r1, r2]);
    expect(deduped.length).toBe(2);
  });
});

describe("5. Safety & Crisis Protocol (TypeScript)", () => {
  test("generates anti-guilt, compassionate crisis text", () => {
    const text = getCrisisResponse();
    // Must NOT condemn the user
    expect(text.toLowerCase()).toContain("does not make you a bad muslim");
    expect(text.toLowerCase()).toContain("immense value");
    // Must contain trusted hotlines
    expect(text).toContain("988");
    expect(text).toContain("741741");
    expect(text).toContain("1-866-NASEEHA");
  });
});

describe("6. Citation Verifier (TypeScript)", () => {
  const evidence = {
    quran: [{ verseKey: "39:53", arabicUthmani: "", translation: "", translatorName: "" }],
    hadith: [],
    duas: [],
  };

  test("verifies valid citations matching evidence", async () => {
    const res = await verifyCitations("Look at Qur'an 39:53 for reassurance.", evidence);
    expect(res.allVerified).toBe(true);
  });

  test("flags citations not found in retrieved evidence pack", async () => {
    const res = await verifyCitations("Look at Qur'an 99:99 for reassurance.", evidence);
    expect(res.allVerified).toBe(false);
    expect(res.unverifiedClaims.length).toBeGreaterThan(0);
  });
});
