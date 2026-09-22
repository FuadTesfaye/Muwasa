import { RetrievedSource } from './retrieve';
import { SituationProfile } from '@/lib/ai/classifier';

export function buildEvidenceContext(sources: RetrievedSource[], situation: SituationProfile): string {
  const blocks: string[] = [];

  blocks.push(`### USER SITUATION PROFILE`);
  blocks.push(`- Identified Emotions: ${situation.emotions.join(', ')}`);
  blocks.push(`- Identified Situations: ${situation.situations.join(', ')}`);
  blocks.push(`- Spiritual Themes: ${situation.spiritualStates.join(', ')}`);
  blocks.push(`- Risk Level: ${situation.riskLevel}\n`);

  blocks.push(`### VERIFIED ISLAMIC EVIDENCE PACK`);
  blocks.push(`(STRICT INSTRUCTION: Use ONLY these verified sources for scriptural quotations. Do not quote unlisted verses or narrations.)\n`);

  for (const src of sources) {
    blocks.push(`<source id="${src.id}" type="${src.type}" reference="${src.reference}">`);
    blocks.push(`Title: ${src.title}`);
    if (src.arabicText) blocks.push(`Arabic: ${src.arabicText}`);
    if (src.translation) blocks.push(`Translation: ${src.translation}`);
    if (src.grade) blocks.push(`Authenticity Grade: ${src.grade} (${src.grader || 'Verified'})`);
    if (src.collection) blocks.push(`Collection: ${src.collection}`);
    if (src.explanation) blocks.push(`Scholarly Commentary: ${src.explanation}`);
    blocks.push(`</source>\n`);
  }

  return blocks.join('\n');
}
