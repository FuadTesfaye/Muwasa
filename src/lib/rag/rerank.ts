import { RetrievedSource } from './retrieve';
import { SituationProfile } from '@/lib/ai/classifier';

export function rerankAndFilterEvidence(
  sources: RetrievedSource[],
  situation: SituationProfile,
  maxBudget = 4
): RetrievedSource[] {
  // Sort descending by relevance
  const sorted = [...sources].sort((a, b) => b.relevanceScore - a.relevanceScore);

  // Deduplicate by reference
  const seenRefs = new Set<string>();
  const deduplicated: RetrievedSource[] = [];

  for (const src of sorted) {
    if (!seenRefs.has(src.reference)) {
      seenRefs.add(src.reference);
      deduplicated.push(src);
    }
  }

  // Ensure balance: prioritize at least 1 Quran, 1 Hadith if available
  const quranSources = deduplicated.filter((s) => s.type === 'quran');
  const hadithSources = deduplicated.filter((s) => s.type === 'hadith');
  const otherSources = deduplicated.filter((s) => s.type !== 'quran' && s.type !== 'hadith');

  const selected: RetrievedSource[] = [];
  if (quranSources.length > 0) selected.push(quranSources[0]);
  if (hadithSources.length > 0) selected.push(hadithSources[0]);

  for (const s of [...quranSources.slice(1), ...hadithSources.slice(1), ...otherSources]) {
    if (selected.length < maxBudget && !selected.includes(s)) {
      selected.push(s);
    }
  }

  return selected;
}
