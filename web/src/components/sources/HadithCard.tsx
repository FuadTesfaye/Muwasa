import { useState } from 'react';
import { HadithSource } from '@/lib/types';
import { Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';

export default function HadithCard({ source }: { source: HadithSource }) {
  const [copied, setCopied] = useState(false);
  const [showSharh, setShowSharh] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(
      `${source.arabicMatn}\n\n"${source.englishText}"\n— ${source.collection} #${source.hadithNumber} (${source.grade})`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <article className="w-full my-5 rounded-xl border border-[#27262f] bg-[#13141c] overflow-hidden text-[#d4d6dd] shadow-sm">
      {/* Header Bar */}
      <header className="px-5 py-3 border-b border-[#1c1d25] flex items-center justify-between bg-[#101117]">
        <div className="flex items-center gap-2.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#9c7d5c]" />
          <span className="text-[11px] font-mono tracking-widest text-[#a68968] uppercase font-medium">
            Sunnah &amp; Hadith
          </span>
          <span className="text-[11px] text-[#555663] font-mono">•</span>
          <span className="text-xs text-[#bcb2a2] font-serif-heading">
            {source.collection} #{source.hadithNumber}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#1c1d26] text-[#c2b6a2] border border-[#2d2c38]">
            {source.grade || 'Sahih'}
          </span>
          <button
            onClick={handleCopy}
            title="Copy hadith text"
            className="inline-flex items-center gap-1 text-[11px] text-[#6d707c] hover:text-[#c4c0b5] transition-colors p-1"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#9c7d5c]" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="p-6 md:p-8 space-y-6">
        {/* Arabic Matn */}
        {source.arabicMatn && (
          <div className="py-2">
            <p
              className="font-arabic text-xl md:text-2xl text-right leading-[2.4] text-[#f4f2ed] dir-rtl select-text"
              dir="rtl"
            >
              {source.arabicMatn}
            </p>
          </div>
        )}

        {/* English Text */}
        <div className="pt-4 border-t border-[#1b1c25]">
          <p className="text-[#dedad2] text-sm md:text-base leading-relaxed font-light">
            &ldquo;{source.englishText}&rdquo;
          </p>
        </div>

        {/* Sharh / Scholarly Commentary */}
        {source.explanation && (
          <div className="pt-3 border-t border-[#1b1c25]">
            <button
              onClick={() => setShowSharh(!showSharh)}
              className="flex items-center justify-between w-full text-xs text-[#9c7d5c] hover:text-[#c4b5a0] transition-colors py-1"
            >
              <span>Scholarly Commentary (Sharh)</span>
              {showSharh ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
            {showSharh && (
              <div className="mt-2.5 p-4 rounded-lg bg-[#0e0f14] border border-[#1e1e28] text-xs text-[#8c909e] leading-relaxed font-light">
                {source.explanation}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Attribution Footer */}
      <footer className="px-5 py-2.5 bg-[#0e0f14] border-t border-[#1c1d25] flex items-center justify-between text-[11px] text-[#555663] font-mono">
        <span>Grading: {source.grader || 'Verified Authentic'}</span>
        <span>Source: HadeethEnc.com (Waqf)</span>
      </footer>
    </article>
  );
}
