import { useState } from 'react';
import { DuaSource } from '@/lib/types';
import { Copy, Check } from 'lucide-react';

export default function DuaCard({ source }: { source: DuaSource }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(
      `${source.arabicText}\n\n"${source.translation}"\n— ${source.sourceReference}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <article className="w-full my-5 rounded-xl border border-[#232732] bg-[#12141a] overflow-hidden text-[#d4d6dd] shadow-sm">
      {/* Header Bar */}
      <header className="px-5 py-3 border-b border-[#1a1e27] flex items-center justify-between bg-[#0f1117]">
        <div className="flex items-center gap-2.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#6f8279]" />
          <span className="text-[11px] font-mono tracking-widest text-[#84968d] uppercase font-medium">
            Supplication (Du&rsquo;a)
          </span>
          {source.title && (
            <>
              <span className="text-[11px] text-[#555a66] font-mono">•</span>
              <span className="text-xs text-[#b8b3a7] font-serif-heading">
                {source.title}
              </span>
            </>
          )}
        </div>

        <button
          onClick={handleCopy}
          title="Copy supplication"
          className="inline-flex items-center gap-1 text-[11px] text-[#6d7280] hover:text-[#c4c0b5] transition-colors p-1"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-[#6f8279]" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </header>

      {/* Content */}
      <div className="p-6 md:p-8 space-y-5 text-center">
        {/* Arabic Text */}
        <div className="py-2">
          <p
            className="font-arabic text-xl md:text-2xl text-center leading-[2.6] text-[#f4f2ed] dir-rtl select-text"
            dir="rtl"
          >
            {source.arabicText}
          </p>
        </div>

        {/* Transliteration */}
        {source.transliteration && (
          <p className="text-xs text-[#7f8899] font-mono tracking-wide italic max-w-xl mx-auto">
            {source.transliteration}
          </p>
        )}

        {/* Translation */}
        <div className="pt-4 border-t border-[#1a1e27]">
          <p className="text-[#dedad2] text-sm md:text-base leading-relaxed font-light italic max-w-xl mx-auto">
            &ldquo;{source.translation}&rdquo;
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="px-5 py-2.5 bg-[#0e1015] border-t border-[#1a1e27] flex items-center justify-between text-[11px] text-[#555a66] font-mono">
        <span>Reference: {source.sourceReference}</span>
        <span>Remembrance &amp; Ease</span>
      </footer>
    </article>
  );
}
