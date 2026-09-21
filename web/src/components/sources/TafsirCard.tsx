import { TafsirSource } from '@/lib/types';

export default function TafsirCard({ source }: { source: TafsirSource }) {
  return (
    <article className="w-full my-5 rounded-xl border border-[#222631] bg-[#11131a] overflow-hidden text-[#d4d6dd] shadow-sm">
      {/* Header Bar */}
      <header className="px-5 py-3 border-b border-[#1a1d26] flex items-center justify-between bg-[#0f1116]">
        <div className="flex items-center gap-2.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#707c96]" />
          <span className="text-[11px] font-mono tracking-widest text-[#8492ae] uppercase font-medium">
            Scholarly Exegesis (Tafsir)
          </span>
          {source.verseKey && (
            <>
              <span className="text-[11px] text-[#555a66] font-mono">•</span>
              <span className="text-xs text-[#b8b3a7] font-serif-heading">
                Surah {source.verseKey}
              </span>
            </>
          )}
        </div>
      </header>

      {/* Exegesis Content */}
      <div className="p-6 md:p-8 space-y-4">
        <p className="text-[#dedad2] text-sm md:text-base leading-relaxed font-light">
          {source.text}
        </p>
      </div>

      {/* Attribution Footer */}
      <footer className="px-5 py-2.5 bg-[#0e1015] border-t border-[#1a1d26] flex items-center justify-between text-[11px] text-[#555a66] font-mono">
        <span>Source: {source.tafsirName}</span>
        <span>Author: {source.author}</span>
      </footer>
    </article>
  );
}
