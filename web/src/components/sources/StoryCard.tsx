import { StorySource } from '@/lib/types';

export default function StoryCard({ source }: { source: StorySource }) {
  return (
    <article className="w-full my-5 rounded-xl border border-[#27252e] bg-[#13141b] overflow-hidden text-[#d4d6dd] shadow-sm">
      {/* Header Bar */}
      <header className="px-5 py-3 border-b border-[#1c1a24] flex items-center justify-between bg-[#101117]">
        <div className="flex items-center gap-2.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#9c8973]" />
          <span className="text-[11px] font-mono tracking-widest text-[#ad9a84] uppercase font-medium">
            Historical Tradition &amp; Seerah
          </span>
          {source.sourceType && (
            <>
              <span className="text-[11px] text-[#555663] font-mono">•</span>
              <span className="text-[11px] font-mono text-[#8a857d] uppercase">
                {source.sourceType}
              </span>
            </>
          )}
        </div>
      </header>

      {/* Narrative Body */}
      <div className="p-6 md:p-8 space-y-4">
        {source.title && (
          <h4 className="text-base md:text-lg font-serif-heading font-medium text-[#f2efe9]">
            {source.title}
          </h4>
        )}
        <p className="text-[#dedad2] text-sm md:text-base leading-relaxed font-light whitespace-pre-wrap">
          {source.content}
        </p>
      </div>

      {/* Attribution Footer */}
      {source.figure && (
        <footer className="px-5 py-2.5 bg-[#0e0f14] border-t border-[#1c1a24] flex items-center justify-between text-[11px] text-[#555663] font-mono">
          <span>Relating to: {source.figure}</span>
          <span>Preserved Scholarly Accounts</span>
        </footer>
      )}
    </article>
  );
}
