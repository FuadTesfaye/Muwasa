import { StorySource } from '@/lib/types';

export default function StoryCard({ source }: { source: StorySource }) {
  return (
    <article className="w-full my-5 rounded-xl border border-[#dfd8cc] dark:border-[#27252e] bg-[#fbf9f5] dark:bg-[#13141b] overflow-hidden text-[#1c1e24] dark:text-[#d4d6dd] shadow-sm dark:shadow-none transition-colors duration-200">
      {/* Header Bar */}
      <header className="px-5 py-3 border-b border-[#eee7db] dark:border-[#1c1a24] flex items-center justify-between bg-[#f5efe4] dark:bg-[#101117] transition-colors duration-200">
        <div className="flex items-center gap-2.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#8c775e] dark:bg-[#9c8973]" />
          <span className="text-[11px] font-mono tracking-widest text-[#7d684e] dark:text-[#ad9a84] uppercase font-medium">
            Historical Tradition &amp; Seerah
          </span>
          {source.sourceType && (
            <>
              <span className="text-[11px] text-[#8a8f9d] dark:text-[#555663] font-mono">•</span>
              <span className="text-[11px] font-mono text-[#717684] dark:text-[#8a857d] uppercase">
                {source.sourceType}
              </span>
            </>
          )}
        </div>
      </header>

      {/* Narrative Body */}
      <div className="p-6 md:p-8 space-y-4">
        {source.title && (
          <h4 className="text-base md:text-lg font-serif-heading font-medium text-[#181a20] dark:text-[#f2efe9]">
            {source.title}
          </h4>
        )}
        <p className="text-[#2b2e38] dark:text-[#dedad2] text-sm md:text-base leading-relaxed font-light whitespace-pre-wrap">
          {source.content}
        </p>
      </div>

      {/* Attribution Footer */}
      {source.figure && (
        <footer className="px-5 py-2.5 bg-[#f5efe4] dark:bg-[#0e0f14] border-t border-[#eee7db] dark:border-[#1c1a24] flex items-center justify-between text-[11px] text-[#717684] dark:text-[#555663] font-mono transition-colors duration-200">
          <span>Relating to: {source.figure}</span>
          <span>Preserved Scholarly Accounts</span>
        </footer>
      )}
    </article>
  );
}
