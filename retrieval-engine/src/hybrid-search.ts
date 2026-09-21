import postgres from "postgres";
import { SearchResult } from "./filters";

export function reciprocalRankFusion(rankings: SearchResult[][], k = 60): SearchResult[] {
  const scores = new Map<string, { result: SearchResult; score: number }>();

  for (const list of rankings) {
    list.forEach((item, index) => {
      const uid = `${item.type}_${item.id}`;
      const rrfContribution = 1.0 / (k + (index + 1));

      if (scores.has(uid)) {
        scores.get(uid)!.score += rrfContribution;
      } else {
        scores.set(uid, { result: item, score: rrfContribution });
      }
    });
  }

  return Array.from(scores.values())
    .sort((a, b) => b.score - a.score)
    .map((entry) => ({
      ...entry.result,
      score: entry.score,
    }));
}

export async function hybridSearchQuran(
  sql: postgres.Sql,
  query: string,
  embedding?: number[],
  limit = 5
): Promise<SearchResult[]> {
  const textQuery = sql`
    SELECT
      id,
      verse_key,
      arabic_uthmani,
      arabic_simple,
      0 as source_tier
    FROM quran_verses
    WHERE search_tsv @@ plainto_tsquery('arabic', ${query})
    LIMIT ${limit * 2}
  `;

  let rows: any[] = [];
  try {
    rows = await textQuery;
  } catch {
    // If full-text index is empty or error, fallback to ILIKE
    rows = await sql`
      SELECT id, verse_key, arabic_uthmani, arabic_simple, 0 as source_tier
      FROM quran_verses
      WHERE arabic_simple_clean ILIKE ${`%${query}%`}
      LIMIT ${limit}
    `;
  }

  return rows.map((r, i) => ({
    type: "quran_verses",
    id: r.id,
    content: r.arabic_uthmani,
    score: 1.0 / (i + 1),
    metadata: {
      verse_key: r.verse_key,
      arabic_simple: r.arabic_simple,
      source_tier: 0,
    },
  }));
}
