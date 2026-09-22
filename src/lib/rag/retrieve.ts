import { db } from '@/lib/db';
import { knowledgeChunks } from '@/lib/db/schema';
import { eq, sql } from 'drizzle-orm';
import { SituationProfile } from '@/lib/ai/classifier';
import { generateQueryEmbedding } from './embed';

export interface RetrievedSource {
  id: string;
  type: 'quran' | 'hadith' | 'tafsir' | 'story' | 'dua';
  reference: string;
  title: string;
  arabicText?: string;
  translation?: string;
  explanation?: string;
  grade?: string;
  grader?: string;
  collection?: string;
  author?: string;
  relevanceScore: number;
}

// Canonical curated offline evidence bank (immutable, verified, zero hallucination)
const CANONICAL_EVIDENCE_BANK: Record<string, RetrievedSource[]> = {
  repentance: [
    {
      id: 'quran-39-53',
      type: 'quran',
      reference: 'Qur\'an 39:53',
      title: 'Surah Az-Zumar (The Crowds), Ayah 53',
      arabicText: 'قُلْ يَا عِبَادِيَ الَّذِينَ أَسْرَفُوا عَلَىٰ أَنفُسِهِمْ لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ ۚ إِنَّ اللَّهَ يَغْفِرُ الذُّنُوبَ جَمِيعًا ۚ إِنَّهُ هُوَ الْغَفُورُ الرَّحِيمُ',
      translation: 'Say, "O My servants who have transgressed against themselves [by sinning], do not despair of the mercy of Allah. Indeed, Allah forgives all sins. Indeed, it is He who is the Forgiving, the Merciful."',
      relevanceScore: 0.98,
    },
    {
      id: 'hadith-muslim-2749',
      type: 'hadith',
      reference: 'Sahih Muslim #2749',
      title: 'The Reality of Repentance and Divine Mercy',
      collection: 'Sahih Muslim',
      arabicText: 'وَالَّذِي نَفْسِي بِيَدِهِ لَوْ لَمْ تُذْنِبُوا لَذَهَبَ اللَّهُ بِكُمْ وَلَجَاءَ بِقَوْمٍ يُذْنِبُونَ فَيَسْتَغْفِرُونَ اللَّهَ فَيَغْفِرُ لَهُمْ',
      translation: 'By the One in Whose Hand is my soul, if you did not commit sins, Allah would replace you with a people who sin and then seek forgiveness from Allah, and He would forgive them.',
      grade: 'Sahih',
      grader: 'Imam Muslim',
      explanation: 'This narration demonstrates that human fallibility is known to Allah; what He asks of us is not angelic perfection, but the unceasing return to Him through tawbah.',
      relevanceScore: 0.95,
    },
    {
      id: 'dua-istighfar',
      type: 'dua',
      reference: 'Sahih al-Bukhari #6306',
      title: 'Sayyid al-Istighfar (The Master Supplication for Forgiveness)',
      arabicText: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَٰهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَىٰ عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ',
      translation: 'O Allah, You are my Lord; there is no deity worthy of worship except You. You created me and I am Your servant, and I uphold Your covenant and promise as best I can. I seek refuge in You from the evil of what I have done. I acknowledge Your favors upon me, and I acknowledge my sin, so forgive me, for none forgives sins except You.',
      relevanceScore: 0.92,
    },
  ],
  hardship: [
    {
      id: 'quran-94-5-6',
      type: 'quran',
      reference: 'Qur\'an 94:5-6',
      title: 'Surah Ash-Sharh (The Relief), Ayat 5-6',
      arabicText: 'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا ۝ إِنَّ مَعَ الْعُسْرِ يُسْرًا',
      translation: 'For indeed, with hardship [will be] ease. Indeed, with hardship [will be] ease.',
      relevanceScore: 0.97,
    },
    {
      id: 'hadith-muslim-2999',
      type: 'hadith',
      reference: 'Sahih Muslim #2999',
      title: 'The Wonderful Affair of the Believer',
      collection: 'Sahih Muslim',
      arabicText: 'عَجَبًا لِأَمْرِ الْمُؤْمِنِ إِنَّ أَمْرَهُ كُلَّهُ خَيْرٌ وَلَيْسَ ذَاكَ لِأَحَدٍ إِلَّا لِلْمُؤْمِنِ إِنْ أَصَابَتْهُ سَرَّاءُ شَكَرَ فَكَانَ خَيْرًا لَهُ وَإِنْ أَصَابَتْهُ ضَرَّاءُ صَبَرَ فَكَانَ خَيْرًا لَهُ',
      translation: 'How wonderful is the affair of the believer! For his affairs are all good, and this is for no one except the believer. If ease comes to him, he is grateful, and that is good for him; and if hardship strikes him, he is patient, and that is good for him.',
      grade: 'Sahih',
      grader: 'Imam Muslim',
      explanation: 'Whatever state you find yourself in, your standing before Allah is preserved when you turn to Him.',
      relevanceScore: 0.94,
    },
    {
      id: 'dua-distress',
      type: 'dua',
      reference: 'Sahih al-Bukhari #6345',
      title: 'Supplication in Moments of Anguish',
      arabicText: 'لَا إِلَٰهَ إِلَّا اللَّهُ الْعَظِيمُ الْحَلِيمُ، لَا إِلَٰهَ إِلَّا اللَّهُ رَبُّ الْعَرْشِ الْعَظِيمِ، لَا إِلَٰهَ إِلَّا اللَّهُ رَبُّ السَّمَاوَاتِ وَرَبُّ الْأَرْضِ وَرَبُّ الْعَرْشِ الْكَرِيمِ',
      translation: 'There is no deity except Allah, the Magnificent, the Forbearing. There is no deity except Allah, Lord of the Mighty Throne. There is no deity except Allah, Lord of the heavens and Lord of the earth, and Lord of the Noble Throne.',
      relevanceScore: 0.91,
    },
  ],
  pressure: [
    {
      id: 'quran-2-286',
      type: 'quran',
      reference: 'Qur\'an 2:286',
      title: 'Surah Al-Baqarah, Ayah 286',
      arabicText: 'لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا ۚ لَهَا مَا كَسَبَتْ وَعَلَيْهَا مَا اكْتَسَبَتْ',
      translation: 'Allah does not burden a soul beyond that it can bear. It will have [the consequence of] what [good] it has gained, and it will bear [the consequence of] what [evil] it has earned.',
      relevanceScore: 0.96,
    },
    {
      id: 'hadith-tirmidhi-2516',
      type: 'hadith',
      reference: 'Jami\' at-Tirmidhi #2516',
      title: 'Reliance upon Allah and the Limits of People\'s Harm',
      collection: 'Jami\' at-Tirmidhi',
      arabicText: 'وَاعْلَمْ أَنَّ الْأُمَّةَ لَوْ اجْتَمَعَتْ عَلَى أَنْ يَنْفَعُوكَ بِشَيْءٍ لَمْ يَنْفَعُوكَ إِلَّا بِشَيْءٍ قَدْ كَتَبَهُ اللَّهُ لَكَ، وَلَوْ اجْتَمَعُوا عَلَى أَنْ يَضُرُّوكَ بِشَيْءٍ لَمْ يَضُرُّوكَ إِلَّا بِشَيْءٍ قَدْ كَتَبَهُ اللَّهُ عَلَيْكَ، رُفِعَتْ الْأَقْلَامُ وَجَفَّتْ الصُّحُفُ',
      translation: 'And know that if the whole nation were to gather together to benefit you with something, they could not benefit you except with what Allah had already written for you. And if they were to gather together to harm you, they could not harm you except with what Allah had already written against you. The pens have been lifted and the pages have dried.',
      grade: 'Sahih',
      grader: 'Imam at-Tirmidhi',
      explanation: 'People\'s judgments, comparisons, and demands do not define your sustenance or your decree in the sight of Allah.',
      relevanceScore: 0.93,
    },
  ],
};

export async function retrieveSources({
  query,
  situation,
  limit = 5,
}: {
  query: string;
  situation: SituationProfile;
  limit?: number;
}): Promise<RetrievedSource[]> {
  try {
    // 1. Try vector similarity + metadata search on PostgreSQL
    const queryVec = await generateQueryEmbedding(query);
    const vectorLiteral = `[${queryVec.join(',')}]`;

    const results = await db
      .select({
        id: knowledgeChunks.id,
        type: knowledgeChunks.sourceType,
        reference: knowledgeChunks.sourceReference,
        title: knowledgeChunks.title,
        arabicText: knowledgeChunks.arabicText,
        translation: knowledgeChunks.translation,
        content: knowledgeChunks.content,
        metadata: knowledgeChunks.metadata,
        similarity: sql<number>`1 - (${knowledgeChunks.embedding} <=> ${vectorLiteral}::vector)`,
      })
      .from(knowledgeChunks)
      .where(eq(knowledgeChunks.status, 'approved'))
      .orderBy(sql`${knowledgeChunks.embedding} <=> ${vectorLiteral}::vector`)
      .limit(limit);

    if (results && results.length > 0) {
      return results.map((r) => {
        const meta = (r.metadata as Record<string, any>) || {};
        return {
          id: r.id,
          type: r.type as any,
          reference: r.reference,
          title: r.title,
          arabicText: r.arabicText || undefined,
          translation: r.translation || undefined,
          explanation: r.content,
          grade: meta.grade,
          grader: meta.grader,
          collection: meta.collection,
          author: meta.author,
          relevanceScore: Number(r.similarity) || 0.85,
        };
      });
    }
  } catch (error) {
    console.warn('[Retrieve] Database query unavailable; using canonical offline evidence bank.', error);
  }

  // 2. Fallback to canonical evidence bank matching situation
  const sitList = situation.situations || [];
  const emoList = situation.emotions || [];

  if (sitList.includes('recurring_sin') || emoList.includes('guilt') || emoList.includes('shame')) {
    return CANONICAL_EVIDENCE_BANK.repentance;
  }

  if (sitList.includes('parent_pressure') || emoList.includes('overwhelm')) {
    return CANONICAL_EVIDENCE_BANK.pressure;
  }

  return CANONICAL_EVIDENCE_BANK.hardship;
}
