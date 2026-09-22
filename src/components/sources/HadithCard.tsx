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
    <article className="w-full my-5 rounded-xl border border-[#ded8cc] dark:border-[#27262f] bg-[#faf8f4] dark:bg-[#13141c] overflow-hidden text-[#1c1e24] dark:text-[#d4d6dd] shadow-sm dark:shadow-none transition-colors duration-200">
      {/* Header Bar */}
      <header className="px-5 py-3 border-b border-[#eee8dc] dark:border-[#1c1d25] flex items-center justify-between bg-[#f6f2e8] dark:bg-[#101117] transition-colors duration-200">
        <div className="flex items-center gap-2.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#967652] dark:bg-[#9c7d5c]" />
          <span className="text-[11px] font-mono tracking-widest text-[#8a6845] dark:text-[#a68968] uppercase font-medium">
            Sunnah &amp; Hadith
          </span>
          <span className="text-[11px] text-[#8a8f9d] dark:text-[#555663] font-mono">•</span>
          <span className="text-xs text-[#1c1e24] dark:text-[#bcb2a2] font-serif-heading font-medium">
            {source.collection} #{source.hadithNumber}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#eee8dc] dark:bg-[#1c1d26] text-[#5e4e3a] dark:text-[#c2b6a2] border border-[#ded7c8] dark:border-[#2d2c38]">
            {source.grade || 'Sahih'}
          </span>
          <button
            onClick={handleCopy}
            title="Copy hadith text"
            className="inline-flex items-center gap-1 text-[11px] text-[#767c8a] dark:text-[#6d707c] hover:text-[#1c1e24] dark:hover:text-[#c4c0b5] transition-colors p-1"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#967652] dark:text-[#9c7d5c]" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="p-6 md:p-8 space-y-6">
        {/* Arabic Matn */}
        {source.arabicMatn && (
          <div className="py-2">
            <p
              className="font-arabic text-xl md:text-2xl text-right leading-[2.4] text-[#121317] dark:text-[#f4f2ed] dir-rtl select-text"
              dir="rtl"
            >
              {source.arabicMatn}
            </p>
          </div>
        )}

        {/* English Text */}
        <div className="pt-4 border-t border-[#eee8dc] dark:border-[#1b1c25]">
          <p className="text-[#2b2e38] dark:text-[#dedad2] text-sm md:text-base leading-relaxed font-light">
            &ldquo;{source.englishText}&rdquo;
          </p>
        </div>

        {/* Sharh / Scholarly Commentary */}
        {source.explanation && (
          <div className="pt-3 border-t border-[#eee8dc] dark:border-[#1b1c25]">
            <button
              onClick={() => setShowSharh(!showSharh)}
              className="flex items-center justify-between w-full text-xs text-[#8a6845] dark:text-[#9c7d5c] hover:text-[#1c1e24] dark:hover:text-[#c4b5a0] transition-colors py-1"
            >
              <span>Scholarly Commentary (Sharh)</span>
              {showSharh ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
            {showSharh && (
              <div className="mt-2.5 p-4 rounded-lg bg-[#f4efe5] dark:bg-[#0e0f14] border border-[#ded7c8] dark:border-[#1e1e28] text-xs text-[#484c58] dark:text-[#8c909e] leading-relaxed font-light">
                {source.explanation}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Attribution Footer */}
      <footer className="px-5 py-2.5 bg-[#f6f2e8] dark:bg-[#0e0f14] border-t border-[#eee8dc] dark:border-[#1c1d25] flex items-center justify-between text-[11px] text-[#717684] dark:text-[#555663] font-mono transition-colors duration-200">
        <span>Grading: {source.grader || 'Verified Authentic'}</span>
        <span>Source: HadeethEnc.com (Waqf)</span>
      </footer>
    </article>
  );
}
