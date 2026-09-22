import Link from 'next/link';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import ThemeToggle from '@/components/theme/ThemeToggle';

export default function SourcesPage() {
  const sources = [
    {
      name: 'Tanzil Project (tanzil.net)',
      type: 'Holy Qur\'an (Arabic Text)',
      license: 'CC BY 3.0',
      description: 'The canonical, immutable Uthmani text verified by international Quranic scholars and preserved character for character.',
    },
    {
      name: 'QuranEnc (quranenc.com)',
      type: 'Translations & Concise Exegesis',
      license: 'Public Trust & Scholarly Review',
      description: 'Carefully vetted modern English translations, primarily Saheeh International, alongside concise scholarly exegesis (Al-Mukhtasar).',
    },
    {
      name: 'HadeethEnc (hadeethenc.com)',
      type: 'Prophetic Traditions & Sharh',
      license: 'Islamic Endowment (Waqf)',
      description: 'Authenticated hadith from Sahih al-Bukhari, Sahih Muslim, and major Sunan with verified authenticity grading (Sahih / Hasan) and explanatory commentary.',
    },
    {
      name: 'Quran Foundation (quran.foundation)',
      type: 'Digital Quran API & Reference Data',
      license: 'Quran.com Open Data',
      description: 'Standardized digital Quranic surah and ayah metadata for cross-referencing and verification.',
    },
  ];

  return (
    <main className="flex-1 flex flex-col max-w-3xl mx-auto w-full px-6 py-12 md:py-16">
      <header className="w-full flex items-center justify-between pb-8 border-b border-[#e4dfd5] dark:border-[#1c202a]">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-[#636877] dark:text-[#717684] hover:text-[#1c1e24] dark:hover:text-[#e4e1da] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Sanctuary</span>
        </Link>
        <ThemeToggle />
      </header>

      <article className="my-12 space-y-10">
        <div className="space-y-3">
          <span className="font-arabic text-2xl text-[#7c7365] dark:text-[#8e8a80]">مُوَاسَاة</span>
          <h1 className="text-3xl md:text-4xl font-serif-heading font-normal text-[#181a20] dark:text-[#f4f2ed]">
            Source Provenance &amp; Integrity
          </h1>
          <p className="text-sm font-mono uppercase tracking-wider text-[#7a7263] dark:text-[#787d89]">
            Zero Hallucination • Verified Citations • Immutable Scripture
          </p>
        </div>

        <div className="space-y-4 text-[#2b2e38] dark:text-[#dedad2] text-sm md:text-base leading-relaxed font-light">
          <p>
            Muwāsā operates under an uncompromising principle: <strong>an AI model should never be the author or authority on religious scripture</strong>.
          </p>
          <p>
            Every verse and narration rendered in Muwāsā originates from a curated, offline-verified database. If a citation cannot be verified against our source records, the system rejects it rather than guessing.
          </p>
        </div>

        <div className="space-y-4 pt-4">
          <h2 className="text-base font-medium text-[#1c1e24] dark:text-[#f4f2ed]">Curated Source Registries</h2>
          <div className="space-y-3">
            {sources.map((s, i) => (
              <div
                key={i}
                className="p-5 rounded-xl border border-[#ded8cb] dark:border-[#262a36] bg-[#fbfaf8] dark:bg-[#12141c] space-y-2"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-[#1c1e24] dark:text-[#edeae3] flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#8a7a63] dark:text-[#8f8574]" />
                    <span>{s.name}</span>
                  </h3>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#f0ebe0] dark:bg-[#1a1d26] text-[#787d8a] dark:text-[#9ea3b2] border border-[#ded8cb] dark:border-[#2b303d]">
                    {s.license}
                  </span>
                </div>
                <p className="text-xs text-[#7d8291] font-mono">{s.type}</p>
                <p className="text-xs text-[#525765] dark:text-[#9297a5] font-light leading-relaxed">
                  {s.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </article>
    </main>
  );
}
