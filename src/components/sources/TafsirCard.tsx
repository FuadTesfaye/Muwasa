import { TafsirSource } from '@/lib/types';

export default function TafsirCard({ source }: { source: TafsirSource }) {
  return (
    <article className="w-full my-5 rounded-xl border border-[#d6dbe5] dark:border-[#222631] bg-[#f8f9fb] dark:bg-[#11131a] overflow-hidden text-[#1c1e24] dark:text-[#d4d6dd] shadow-sm dark:shadow-none transition-colors duration-200">
      {/* Header Bar */}
      <header className="px-5 py-3 border-b border-[#e6ebf3] dark:border-[#1a1d26] flex items-center justify-between bg-[#edf2f8] dark:bg-[#0f1116] transition-colors duration-200">
        <div className="flex items-center gap-2.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#5d6c8a] dark:bg-[#707c96]" />
          <span className="text-[11px] font-mono tracking-widest text-[#516182] dark:text-[#8492ae] uppercase font-medium">
            Scholarly Exegesis (Tafsir)
          </span>
          {source.verseKey && (
            <>
              <span className="text-[11px] text-[#8a8f9d] dark:text-[#555a66] font-mono">•</span>
              <span className="text-xs text-[#1c1e24] dark:text-[#b8b3a7] font-serif-heading font-medium">
                Surah {source.verseKey}
              </span>
            </>
          )}
        </div>
      </header>

      {/* Exegesis Content */}
      <div className="p-6 md:p-8 space-y-4">
        <p className="text-[#2b2e38] dark:text-[#dedad2] text-sm md:text-base leading-relaxed font-light">
          {source.text}
        </p>
      </div>

      {/* Attribution Footer */}
      <footer className="px-5 py-2.5 bg-[#edf2f8] dark:bg-[#0e1015] border-t border-[#e6ebf3] dark:border-[#1a1d26] flex items-center justify-between text-[11px] text-[#717684] dark:text-[#555a66] font-mono transition-colors duration-200">
        <span>Source: {source.tafsirName}</span>
        <span>Author: {source.author}</span>
      </footer>
    </article>
  );
}
