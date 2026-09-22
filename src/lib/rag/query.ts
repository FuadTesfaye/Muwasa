import { SituationProfile } from '@/lib/ai/classifier';

export function buildRetrievalQueries(
  message: string,
  situation: SituationProfile
): { primaryQuery: string; searchKeywords: string[] } {
  const keywords: string[] = [];

  // Map emotions to Islamic themes
  for (const emotion of situation.emotions) {
    if (emotion === 'grief' || emotion === 'sadness') {
      keywords.push('patience in hardship', 'sabr', 'reward of sorrow', 'relief after hardship');
    } else if (emotion === 'guilt' || emotion === 'shame' || emotion === 'regret') {
      keywords.push('repentance', 'tawbah', 'mercy of Allah', 'forgiveness of sins');
    } else if (emotion === 'fear' || emotion === 'anxiety') {
      keywords.push('tawakkul', 'trust in divine decree', 'qadr', 'ease');
    }
  }

  // Map situations to themes
  for (const sit of situation.situations) {
    if (sit === 'parent_pressure') {
      keywords.push('kindness to parents', 'dealing with family hardship', 'seeking acceptance from Allah alone');
    } else if (sit === 'recurring_sin') {
      keywords.push('turning back to Allah repeatedly', 'hope in divine forgiveness', 'do not despair');
    } else if (sit === 'bereavement') {
      keywords.push('loss of loved one', 'reunion in Jannah', 'sorrow of the Prophet');
    }
  }

  const primaryQuery = `${message} ${situation.emotions.join(' ')} ${situation.situations.join(' ')}`;

  return {
    primaryQuery,
    searchKeywords: Array.from(new Set(keywords)),
  };
}
