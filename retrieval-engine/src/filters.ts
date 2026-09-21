export interface SearchResult {
  type: "quran_verses" | "hadiths" | "stories" | "duas" | "quran_tafsirs";
  id: string;
  content: string;
  score: number;
  metadata: Record<string, any>;
}

export function filterByTier(results: SearchResult[], minTier: number, maxTier: number): SearchResult[] {
  return results.filter((r) => {
    const tier = typeof r.metadata.source_tier === "number" ? r.metadata.source_tier : 3;
    return tier >= minTier && tier <= maxTier;
  });
}

export function filterByGrade(results: SearchResult[], allowedGrades: string[]): SearchResult[] {
  const allowedLower = allowedGrades.map((g) => g.toLowerCase());
  return results.filter((r) => {
    if (r.type !== "hadiths") return true;
    const grade = (r.metadata.grade || "").toLowerCase();
    return allowedLower.some((allowed) => grade.includes(allowed));
  });
}

export function deduplicate(results: SearchResult[]): SearchResult[] {
  const seen = new Set<string>();
  const unique: SearchResult[] = [];

  for (const r of results) {
    const uid = `${r.type}_${r.id}`;
    if (!seen.has(uid)) {
      seen.add(uid);
      unique.push(r);
    }
  }

  return unique;
}
