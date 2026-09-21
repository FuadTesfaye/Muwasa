import { XMLParser } from "fast-xml-parser";
import { getDatabaseConnection, normalizeArabic } from "./utils";

const SURAH_NAMES = [
  { number: 1, nameAr: "الفاتحة", nameEn: "Al-Fatihah", translit: "The Opening", place: "makkah", ayahs: 7 },
  { number: 2, nameAr: "البقرة", nameEn: "Al-Baqarah", translit: "The Cow", place: "madinah", ayahs: 286 },
  { number: 3, nameAr: "آل عمران", nameEn: "Ali 'Imran", translit: "Family of Imran", place: "madinah", ayahs: 200 },
  { number: 4, nameAr: "النساء", nameEn: "An-Nisa", translit: "The Women", place: "madinah", ayahs: 176 },
  { number: 5, nameAr: "المائدة", nameEn: "Al-Ma'idah", translit: "The Table Spread", place: "madinah", ayahs: 120 },
  { number: 6, nameAr: "الأنعام", nameEn: "Al-An'am", translit: "The Cattle", place: "makkah", ayahs: 165 },
  { number: 7, nameAr: "الأعراف", nameEn: "Al-A'raf", translit: "The Heights", place: "makkah", ayahs: 206 },
  { number: 8, nameAr: "الأنفال", nameEn: "Al-Anfal", translit: "The Spoils of War", place: "madinah", ayahs: 75 },
  { number: 9, nameAr: "التوبة", nameEn: "At-Tawbah", translit: "The Repentance", place: "madinah", ayahs: 129 },
  { number: 10, nameAr: "يونس", nameEn: "Yunus", translit: "Jonah", place: "makkah", ayahs: 109 },
  { number: 11, nameAr: "هود", nameEn: "Hud", translit: "Hud", place: "makkah", ayahs: 123 },
  { number: 12, nameAr: "يوسف", nameEn: "Yusuf", translit: "Joseph", place: "makkah", ayahs: 111 },
  { number: 13, nameAr: "الرعد", nameEn: "Ar-Ra'd", translit: "The Thunder", place: "madinah", ayahs: 43 },
  { number: 14, nameAr: "إبراهيم", nameEn: "Ibrahim", translit: "Abraham", place: "makkah", ayahs: 52 },
  { number: 15, nameAr: "الحجر", nameEn: "Al-Hijr", translit: "The Rocky Tract", place: "makkah", ayahs: 99 },
  { number: 16, nameAr: "النحل", nameEn: "An-Nahl", translit: "The Bee", place: "makkah", ayahs: 128 },
  { number: 17, nameAr: "الإسراء", nameEn: "Al-Isra", translit: "The Night Journey", place: "makkah", ayahs: 111 },
  { number: 18, nameAr: "الكهف", nameEn: "Al-Kahf", translit: "The Cave", place: "makkah", ayahs: 110 },
  { number: 19, nameAr: "مريم", nameEn: "Maryam", translit: "Mary", place: "makkah", ayahs: 98 },
  { number: 20, nameAr: "طه", nameEn: "Taha", translit: "Ta-Ha", place: "makkah", ayahs: 135 },
  { number: 21, nameAr: "الأنبياء", nameEn: "Al-Anbya", translit: "The Prophets", place: "makkah", ayahs: 112 },
  { number: 22, nameAr: "الحج", nameEn: "Al-Hajj", translit: "The Pilgrimage", place: "madinah", ayahs: 78 },
  { number: 23, nameAr: "المؤمنون", nameEn: "Al-Mu'minun", translit: "The Believers", place: "makkah", ayahs: 118 },
  { number: 24, nameAr: "النور", nameEn: "An-Nur", translit: "The Light", place: "madinah", ayahs: 64 },
  { number: 25, nameAr: "الفرقان", nameEn: "Al-Furqan", translit: "The Criterion", place: "makkah", ayahs: 77 },
  { number: 26, nameAr: "الشعراء", nameEn: "Ash-Shu'ara", translit: "The Poets", place: "makkah", ayahs: 227 },
  { number: 27, nameAr: "النمل", nameEn: "An-Naml", translit: "The Ant", place: "makkah", ayahs: 93 },
  { number: 28, nameAr: "القصص", nameEn: "Al-Qasas", translit: "The Stories", place: "makkah", ayahs: 88 },
  { number: 29, nameAr: "العنكبوت", nameEn: "Al-'Ankabut", translit: "The Spider", place: "makkah", ayahs: 69 },
  { number: 30, nameAr: "الروم", nameEn: "Ar-Rum", translit: "The Romans", place: "makkah", ayahs: 60 },
  { number: 31, nameAr: "لقمان", nameEn: "Luqman", translit: "Luqman", place: "makkah", ayahs: 34 },
  { number: 32, nameAr: "السجدة", nameEn: "As-Sajdah", translit: "The Prostration", place: "makkah", ayahs: 30 },
  { number: 33, nameAr: "الأحزاب", nameEn: "Al-Ahzab", translit: "The Combined Forces", place: "madinah", ayahs: 73 },
  { number: 34, nameAr: "سبأ", nameEn: "Saba", translit: "Sheba", place: "makkah", ayahs: 54 },
  { number: 35, nameAr: "فاطر", nameEn: "Fatir", translit: "Originator", place: "makkah", ayahs: 45 },
  { number: 36, nameAr: "يس", nameEn: "Ya-Sin", translit: "Ya-Sin", place: "makkah", ayahs: 83 },
  { number: 37, nameAr: "الصافات", nameEn: "As-Saffat", translit: "Those who set the Ranks", place: "makkah", ayahs: 182 },
  { number: 38, nameAr: "ص", nameEn: "Sad", translit: "The Letter Sad", place: "makkah", ayahs: 88 },
  { number: 39, nameAr: "الزمر", nameEn: "Az-Zumar", translit: "The Troops", place: "makkah", ayahs: 75 },
  { number: 40, nameAr: "غافر", nameEn: "Ghafir", translit: "The Forgiver", place: "makkah", ayahs: 85 },
  { number: 41, nameAr: "فصلت", nameEn: "Fussilat", translit: "Explained in Detail", place: "makkah", ayahs: 54 },
  { number: 42, nameAr: "الشورى", nameEn: "Ash-Shuraa", translit: "The Consultation", place: "makkah", ayahs: 53 },
  { number: 43, nameAr: "الزخرف", nameEn: "Az-Zukhruf", translit: "The Ornaments of Gold", place: "makkah", ayahs: 89 },
  { number: 44, nameAr: "الدخان", nameEn: "Ad-Dukhan", translit: "The Smoke", place: "makkah", ayahs: 59 },
  { number: 45, nameAr: "الجاثية", nameEn: "Al-Jathiyah", translit: "The Crouching", place: "makkah", ayahs: 37 },
  { number: 46, nameAr: "الأحقاف", nameEn: "Al-Ahqaf", translit: "The Wind-Curved Sandhills", place: "makkah", ayahs: 35 },
  { number: 47, nameAr: "محمد", nameEn: "Muhammad", translit: "Muhammad", place: "madinah", ayahs: 38 },
  { number: 48, nameAr: "الفتح", nameEn: "Al-Fath", translit: "The Victory", place: "madinah", ayahs: 29 },
  { number: 49, nameAr: "الحجرات", nameEn: "Al-Hujurat", translit: "The Rooms", place: "madinah", ayahs: 18 },
  { number: 50, nameAr: "ق", nameEn: "Qaf", translit: "The Letter Qaf", place: "makkah", ayahs: 45 },
  { number: 51, nameAr: "الذاريات", nameEn: "Adh-Dhariyat", translit: "The Winnowing Winds", place: "makkah", ayahs: 60 },
  { number: 52, nameAr: "الطور", nameEn: "At-Tur", translit: "The Mount", place: "makkah", ayahs: 49 },
  { number: 53, nameAr: "النجم", nameEn: "An-Najm", translit: "The Star", place: "makkah", ayahs: 62 },
  { number: 54, nameAr: "القمر", nameEn: "Al-Qamar", translit: "The Moon", place: "makkah", ayahs: 55 },
  { number: 55, nameAr: "الرحمن", nameEn: "Ar-Rahman", translit: "The Beneficent", place: "madinah", ayahs: 78 },
  { number: 56, nameAr: "الواقعة", nameEn: "Al-Waqi'ah", translit: "The Inevitable", place: "makkah", ayahs: 96 },
  { number: 57, nameAr: "الحديد", nameEn: "Al-Hadid", translit: "The Iron", place: "madinah", ayahs: 29 },
  { number: 58, nameAr: "المجادلة", nameEn: "Al-Mujadila", translit: "The Pleading Woman", place: "madinah", ayahs: 22 },
  { number: 59, nameAr: "الحشر", nameEn: "Al-Hashr", translit: "The Exile", place: "madinah", ayahs: 24 },
  { number: 60, nameAr: "الممتحنة", nameEn: "Al-Mumtahanah", translit: "She that is to be examined", place: "madinah", ayahs: 13 },
  { number: 61, nameAr: "الصف", nameEn: "As-Saf", translit: "The Ranks", place: "madinah", ayahs: 14 },
  { number: 62, nameAr: "الجمعة", nameEn: "Al-Jumu'ah", translit: "The Congregation", place: "madinah", ayahs: 11 },
  { number: 63, nameAr: "المنافقون", nameEn: "Al-Munafiqun", translit: "The Hypocrites", place: "madinah", ayahs: 11 },
  { number: 64, nameAr: "التغابن", nameEn: "At-Taghabun", translit: "The Mutual Disillusion", place: "madinah", ayahs: 18 },
  { number: 65, nameAr: "الطلاق", nameEn: "At-Talaq", translit: "The Divorce", place: "madinah", ayahs: 12 },
  { number: 66, nameAr: "التحريم", nameEn: "At-Tahrim", translit: "The Prohibition", place: "madinah", ayahs: 12 },
  { number: 67, nameAr: "الملك", nameEn: "Al-Mulk", translit: "The Sovereignty", place: "makkah", ayahs: 30 },
  { number: 68, nameAr: "القلم", nameEn: "Al-Qalam", translit: "The Pen", place: "makkah", ayahs: 52 },
  { number: 69, nameAr: "الحاقة", nameEn: "Al-Haqqah", translit: "The Reality", place: "makkah", ayahs: 52 },
  { number: 70, nameAr: "المعارج", nameEn: "Al-Ma'arij", translit: "The Ascending Stairways", place: "makkah", ayahs: 44 },
  { number: 71, nameAr: "نوح", nameEn: "Nuh", translit: "Noah", place: "makkah", ayahs: 28 },
  { number: 72, nameAr: "الجن", nameEn: "Al-Jinn", translit: "The Jinn", place: "makkah", ayahs: 28 },
  { number: 73, nameAr: "المزمل", nameEn: "Al-Muzzammil", translit: "The Enshrouded One", place: "makkah", ayahs: 20 },
  { number: 74, nameAr: "المدثر", nameEn: "Al-Muddaththir", translit: "The Cloaked One", place: "makkah", ayahs: 56 },
  { number: 75, nameAr: "القيامة", nameEn: "Al-Qiyamah", translit: "The Resurrection", place: "makkah", ayahs: 40 },
  { number: 76, nameAr: "الإنسان", nameEn: "Al-Insan", translit: "The Man", place: "madinah", ayahs: 31 },
  { number: 77, nameAr: "المرسلات", nameEn: "Al-Mursalat", translit: "The Emissaries", place: "makkah", ayahs: 50 },
  { number: 78, nameAr: "النبأ", nameEn: "An-Naba", translit: "The Tidings", place: "makkah", ayahs: 40 },
  { number: 79, nameAr: "النازعات", nameEn: "An-Nazi'at", translit: "Those who drag forth", place: "makkah", ayahs: 46 },
  { number: 80, nameAr: "عبس", nameEn: "Abasa", translit: "He Frowned", place: "makkah", ayahs: 42 },
  { number: 81, nameAr: "التكوير", nameEn: "At-Takwir", translit: "The Overthrowing", place: "makkah", ayahs: 29 },
  { number: 82, nameAr: "الانفطار", nameEn: "Al-Infitar", translit: "The Cleaving", place: "makkah", ayahs: 19 },
  { number: 83, nameAr: "المطففين", nameEn: "Al-Mutaffifin", translit: "The Defrauding", place: "makkah", ayahs: 36 },
  { number: 84, nameAr: "الانشقاق", nameEn: "Al-Inshiqaq", translit: "The Splitting Open", place: "makkah", ayahs: 25 },
  { number: 85, nameAr: "البروج", nameEn: "Al-Buruj", translit: "The Mansions of the Stars", place: "makkah", ayahs: 22 },
  { number: 86, nameAr: "الطارق", nameEn: "At-Tariq", translit: "The Morning Star", place: "makkah", ayahs: 17 },
  { number: 87, nameAr: "الأعلى", nameEn: "Al-A'la", translit: "The Most High", place: "makkah", ayahs: 19 },
  { number: 88, nameAr: "الغاشية", nameEn: "Al-Ghashiyah", translit: "The Overwhelming", place: "makkah", ayahs: 26 },
  { number: 89, nameAr: "الفجر", nameEn: "Al-Fajr", translit: "The Dawn", place: "makkah", ayahs: 30 },
  { number: 90, nameAr: "البلد", nameEn: "Al-Balad", translit: "The City", place: "makkah", ayahs: 20 },
  { number: 91, nameAr: "الشمس", nameEn: "Ash-Shams", translit: "The Sun", place: "makkah", ayahs: 15 },
  { number: 92, nameAr: "الليل", nameEn: "Al-Layl", translit: "The Night", place: "makkah", ayahs: 21 },
  { number: 93, nameAr: "الضحى", nameEn: "Ad-Duhaa", translit: "The Morning Hours", place: "makkah", ayahs: 11 },
  { number: 94, nameAr: "الشرح", nameEn: "Ash-Sharh", translit: "The Relief", place: "makkah", ayahs: 8 },
  { number: 95, nameAr: "التين", nameEn: "At-Tin", translit: "The Fig", place: "makkah", ayahs: 8 },
  { number: 96, nameAr: "العلق", nameEn: "Al-'Alaq", translit: "The Clot", place: "makkah", ayahs: 19 },
  { number: 97, nameAr: "القدر", nameEn: "Al-Qadr", translit: "The Power", place: "makkah", ayahs: 5 },
  { number: 98, nameAr: "البينة", nameEn: "Al-Bayyinah", translit: "The Clear Proof", place: "madinah", ayahs: 8 },
  { number: 99, nameAr: "الزلزلة", nameEn: "Az-Zalzalah", translit: "The Earthquake", place: "madinah", ayahs: 8 },
  { number: 100, nameAr: "العاديات", nameEn: "Al-'Adiyat", translit: "The Courser", place: "makkah", ayahs: 11 },
  { number: 101, nameAr: "القارعة", nameEn: "Al-Qari'ah", translit: "The Calamity", place: "makkah", ayahs: 11 },
  { number: 102, nameAr: "التكاثر", nameEn: "At-Takathur", translit: "The Rivalry in world increase", place: "makkah", ayahs: 8 },
  { number: 103, nameAr: "العصر", nameEn: "Al-'Asr", translit: "The Declining Day", place: "makkah", ayahs: 3 },
  { number: 104, nameAr: "الهمزة", nameEn: "Al-Humazah", translit: "The Traducer", place: "makkah", ayahs: 9 },
  { number: 105, nameAr: "الفيل", nameEn: "Al-Fil", translit: "The Elephant", place: "makkah", ayahs: 5 },
  { number: 106, nameAr: "قريش", nameEn: "Quraysh", translit: "Quraysh", place: "makkah", ayahs: 4 },
  { number: 107, nameAr: "الماعون", nameEn: "Al-Ma'un", translit: "The Small Kindnesses", place: "makkah", ayahs: 7 },
  { number: 108, nameAr: "الكوثر", nameEn: "Al-Kawthar", translit: "The Abundance", place: "makkah", ayahs: 3 },
  { number: 109, nameAr: "الكافرون", nameEn: "Al-Kafirun", translit: "The Disbelievers", place: "makkah", ayahs: 6 },
  { number: 110, nameAr: "النصر", nameEn: "An-Nasr", translit: "The Divine Support", place: "madinah", ayahs: 3 },
  { number: 111, nameAr: "المسد", nameEn: "Al-Masad", translit: "The Palm Fiber", place: "makkah", ayahs: 5 },
  { number: 112, nameAr: "الإخلاص", nameEn: "Al-Ikhlas", translit: "The Sincerity", place: "makkah", ayahs: 4 },
  { number: 113, nameAr: "الفلق", nameEn: "Al-Falaq", translit: "The Daybreak", place: "makkah", ayahs: 5 },
  { number: 114, nameAr: "الناس", nameEn: "An-Nas", translit: "Mankind", place: "makkah", ayahs: 6 },
];

async function ingestTanzil() {
  console.log("📥 Ingesting Quran Text from Tanzil.net (TypeScript)...");
  const sql = getDatabaseConnection();

  try {
    // 1. Ensure Tanzil source registry entry exists
    const [tanzilSource] = await sql`
      SELECT id FROM source_registry WHERE name = 'Tanzil'
    `;
    const sourceId = tanzilSource?.id;

    // 2. Insert Surahs
    console.log("Inserting 114 Surahs...");
    for (const s of SURAH_NAMES) {
      await sql`
        INSERT INTO quran_surahs (surah_number, name_arabic, name_english, name_transliteration, revelation_place, verses_count)
        VALUES (${s.number}, ${s.nameAr}, ${s.nameEn}, ${s.translit}, ${s.place}, ${s.ayahs})
        ON CONFLICT (surah_number) DO UPDATE SET
          name_arabic = EXCLUDED.name_arabic,
          name_english = EXCLUDED.name_english,
          name_transliteration = EXCLUDED.name_transliteration;
      `;
    }
    console.log("✅ Surahs inserted.");

    // 3. Download Quran XML from Tanzil
    console.log("Fetching Tanzil Uthmani XML (https://tanzil.net)...");
    const res = await fetch("https://tanzil.net/pub/download/download.php?quranType=uthmani&outType=xml&agree=true");
    if (!res.ok) {
      throw new Error(`Failed to download Tanzil XML: HTTP ${res.status}`);
    }
    const xmlText = await res.text();

    console.log("Parsing Quran XML...");
    const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_" });
    const parsed = parser.parse(xmlText);
    const suras = parsed.quran.sura;

    let totalVerses = 0;

    for (const sura of suras) {
      const suraIndex = parseInt(sura["@_index"], 10);
      const ayas = Array.isArray(sura.aya) ? sura.aya : [sura.aya];

      for (const aya of ayas) {
        const ayaIndex = parseInt(aya["@_index"], 10);
        const uthmaniText = aya["@_text"];
        const verseKey = `${suraIndex}:${ayaIndex}`;
        const simpleClean = normalizeArabic(uthmaniText);

        await sql`
          INSERT INTO quran_verses (
            surah_number, ayah_number, verse_key,
            arabic_uthmani, arabic_simple, arabic_simple_clean,
            source_id, kb_version
          ) VALUES (
            ${suraIndex}, ${ayaIndex}, ${verseKey},
            ${uthmaniText}, ${simpleClean}, ${simpleClean},
            ${sourceId}, '1.0.0'
          )
          ON CONFLICT (surah_number, ayah_number) DO UPDATE SET
            arabic_uthmani = EXCLUDED.arabic_uthmani,
            arabic_simple = EXCLUDED.arabic_simple,
            arabic_simple_clean = EXCLUDED.arabic_simple_clean;
        `;

        totalVerses++;
      }
    }

    console.log(`🎉 Ingested ${totalVerses} Quran verses from Tanzil! Attribution: Tanzil.net (CC BY 3.0)`);
  } catch (err) {
    console.error("❌ Tanzil ingestion failed:", err);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

ingestTanzil();
