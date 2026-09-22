import { db } from '../../src/lib/db';
import { sources, knowledgeChunks, emotions, situations, spiritualStates } from '../../src/lib/db/schema';
import { generateDocumentEmbedding } from '../../src/lib/rag/embed';

async function seedDatabase() {
  console.log('🌱 Starting Muwāsā Islamic Knowledge Base Seeding...');

  try {
    // 1. Seed Sources
    console.log('📖 Registering canonical source authorities...');
    const [tanzil] = await db
      .insert(sources)
      .values({
        type: 'quran',
        name: 'Tanzil Project',
        version: '1.0',
        license: 'CC BY 3.0',
        url: 'https://tanzil.net',
        publisher: 'Tanzil.net',
        verified: true,
      })
      .onConflictDoNothing()
      .returning();

    const [hadeethEnc] = await db
      .insert(sources)
      .values({
        type: 'hadith',
        name: 'HadeethEnc Encyclopedia',
        version: '1.0',
        license: 'Islamic Endowment (Waqf)',
        url: 'https://hadeethenc.com',
        publisher: 'HadeethEnc.com',
        verified: true,
      })
      .onConflictDoNothing()
      .returning();

    // 2. Seed Core Knowledge Chunks
    console.log('✨ Ingesting foundational scripture chunks with embeddings...');

    const sampleChunks = [
      {
        sourceType: 'quran',
        sourceReference: 'Qur\'an 39:53',
        title: 'Surah Az-Zumar (The Crowds), Ayah 53',
        arabicText: 'قُلْ يَا عِبَادِيَ الَّذِينَ أَسْرَفُوا عَلَىٰ أَنفُسِهِمْ لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ ۚ إِنَّ اللَّهَ يَغْفِرُ الذُّنُوبَ جَمِيعًا ۚ إِنَّهُ هُوَ الْغَفُورُ الرَّحِيمُ',
        translation: 'Say, "O My servants who have transgressed against themselves [by sinning], do not despair of the mercy of Allah. Indeed, Allah forgives all sins. Indeed, it is He who is the Forgiving, the Merciful."',
        content: 'This verse is known as the most hopeful verse in the Qur\'an. It commands believers who feel overwhelmed by mistakes never to lose hope in the vastness of divine mercy.',
        tags: ['repentance', 'mercy', 'forgiveness', 'hope', 'guilt', 'recurring_sin'],
        metadata: { surah: 39, ayah: 53, revelation: 'Meccan' },
        status: 'approved',
      },
      {
        sourceType: 'quran',
        sourceReference: 'Qur\'an 94:5-6',
        title: 'Surah Ash-Sharh (The Relief), Ayat 5-6',
        arabicText: 'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا ۝ إِنَّ مَعَ الْعُسْرِ يُسْرًا',
        translation: 'For indeed, with hardship [will be] ease. Indeed, with hardship [will be] ease.',
        content: 'Hardship does not arrive in isolation; embedded within its very unfolding is the divine ease that accompanies it. A single hardship cannot overcome a double ease.',
        tags: ['hardship', 'ease', 'patience', 'grief', 'relief'],
        metadata: { surah: 94, ayah: '5-6', revelation: 'Meccan' },
        status: 'approved',
      },
      {
        sourceType: 'hadith',
        sourceReference: 'Sahih Muslim #2999',
        title: 'The Wonderful Affair of the Believer',
        arabicText: 'عَجَبًا لِأَمْرِ الْمُؤْمِنِ إِنَّ أَمْرَهُ كُلَّهُ خَيْرٌ وَلَيْسَ ذَاكَ لِأَحَدٍ إِلَّا لِلْمُؤْمِنِ إِنْ أَصَابَتْهُ سَرَّاءُ شَكَرَ فَكَانَ خَيْرًا لَهُ وَإِنْ أَصَابَتْهُ ضَرَّاءُ صَبَرَ فَكَانَ خَيْرًا لَهُ',
        translation: 'How wonderful is the affair of the believer! For his affairs are all good, and this is for no one except the believer. If ease comes to him, he is grateful, and that is good for him; and if hardship strikes him, he is patient, and that is good for him.',
        content: 'A prophetic guarantee that no state of the believer is wasted or without spiritual elevation when met with gratitude or patient endurance.',
        tags: ['patience', 'gratitude', 'hardship', 'grief', 'acceptance'],
        metadata: { collection: 'Sahih Muslim', hadithNumber: '2999', grade: 'Sahih', grader: 'Imam Muslim' },
        status: 'approved',
      },
      {
        sourceType: 'hadith',
        sourceReference: 'Sahih Muslim #2749',
        title: 'The Human Need for Divine Forgiveness',
        arabicText: 'وَالَّذِي نَفْسِي بِيَدِهِ لَوْ لَمْ تُذْنِبُوا لَذَهَبَ اللَّهُ بِكُمْ وَلَجَاءَ بِقَوْمٍ يُذْنِبُونَ فَيَسْتَغْفِرُونَ اللَّهَ فَيَغْفِرُ لَهُمْ',
        translation: 'By the One in Whose Hand is my soul, if you did not commit sins, Allah would replace you with a people who sin and then seek forgiveness from Allah, and He would forgive them.',
        content: 'Human struggle with mistakes is innate; Allah loves the humility of the servant who continually turns back in tawbah.',
        tags: ['repentance', 'guilt', 'recurring_sin', 'mercy', 'forgiveness'],
        metadata: { collection: 'Sahih Muslim', hadithNumber: '2749', grade: 'Sahih', grader: 'Imam Muslim' },
        status: 'approved',
      },
    ];

    for (const chunk of sampleChunks) {
      const textToEmbed = `${chunk.arabicText || ''} | ${chunk.translation || ''} | ${chunk.content}`;
      const embedding = await generateDocumentEmbedding(textToEmbed);

      await db
        .insert(knowledgeChunks)
        .values({
          sourceId: chunk.sourceType === 'quran' ? tanzil?.id : hadeethEnc?.id,
          sourceType: chunk.sourceType,
          sourceReference: chunk.sourceReference,
          title: chunk.title,
          arabicText: chunk.arabicText,
          translation: chunk.translation,
          content: chunk.content,
          tags: chunk.tags,
          metadata: chunk.metadata,
          status: chunk.status,
          embedding,
        })
        .onConflictDoNothing();
    }

    console.log('✅ Seeding completed successfully!');
  } catch (error: any) {
    console.warn('⚠️ Seeding note:', error.message);
  }
}

seedDatabase().catch(console.error);
