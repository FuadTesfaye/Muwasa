import { useState } from 'react';
import { QuranSource } from '@/lib/types';
import { Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';

export default function QuranCard({ source }: { source: QuranSource }) {
  const [copied, setCopied] = useState(false);
  const [showTafsir, setShowTafsir] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(`${source.arabicUthmani}\n\n"${source.translation}" (Qur'an ${source.verseKey})`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <article className="w-full my-5 rounded-xl border border-[#ded8cb] dark:border-[#262a36] bg-[#fbfaf8] dark:bg-[#12141c] overflow-hidden text-[#1c1e24] dark:text-[#d4d6dd] shadow-sm dark:shadow-none transition-colors duration-200">
      {/* Header Bar */}
      <header className="px-5 py-3 border-b border-[#eee9de] dark:border-[#1c202a] flex items-center justify-between bg-[#f5f1e8] dark:bg-[#101218] transition-colors duration-200">
        <div className="flex items-center gap-2.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#8a7a63] dark:bg-[#8f8574]" />
          <span className="text-[11px] font-mono tracking-widest text-[#7d6f58] dark:text-[#9e9686] uppercase font-medium">
            Holy Qur&rsquo;an
          </span>
          <span className="text-[11px] text-[#8a8f9d] dark:text-[#555b68] font-mono">•</span>
          <span className="text-xs text-[#1c1e24] dark:text-[#b8b3a7] font-serif-heading font-medium">
            Surah {source.verseKey}
          </span>
        </div>

        <button
          onClick={handleCopy}
          title="Copy verse and translation"
          className="inline-flex items-center gap-1 text-[11px] text-[#767c8a] dark:text-[#6d7280] hover:text-[#1c1e24] dark:hover:text-[#c4c0b5] transition-colors p-1"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-[#8a7a63] dark:text-[#8f8574]" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </header>

      {/* Main Scripture Canvas */}
      <div className="p-6 md:p-8 space-y-6">
        {/* Arabic Uthmani Text */}
        <div className="py-2">
          <p
            className="font-arabic text-2xl md:text-3xl text-right leading-[2.5] text-[#121317] dark:text-[#f4f2ed] dir-rtl select-text"
            dir="rtl"
          >
            {source.arabicUthmani}
          </p>
        </div>

        {/* Translation */}
        <div className="pt-4 border-t border-[#eee9de] dark:border-[#1b1f28]">
          <p className="text-[#2b2e38] dark:text-[#dedad2] text-sm md:text-base leading-relaxed font-light italic">
            &ldquo;{source.translation}&rdquo;
          </p>
        </div>

        {/* Collapsible Tafsir Exegesis */}
        {source.tafsirExcerpt && (
          <div className="pt-3 border-t border-[#eee9de] dark:border-[#1b1f28]">
            <button
              onClick={() => setShowTafsir(!showTafsir)}
              className="flex items-center justify-between w-full text-xs text-[#7d6f58] dark:text-[#8f8574] hover:text-[#1c1e24] dark:hover:text-[#c4c0b5] transition-colors py-1"
            >
              <span>Scholarly Context &amp; Exegesis (Tafsir)</span>
              {showTafsir ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
            {showTafsir && (
              <div className="mt-2.5 p-4 rounded-lg bg-[#f4f0e7] dark:bg-[#0e1015] border border-[#ded7ca] dark:border-[#1e222c] text-xs text-[#484c58] dark:text-[#8c92a2] leading-relaxed font-light">
                {source.tafsirExcerpt}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Quiet Attribution Footer */}
      <footer className="px-5 py-2.5 bg-[#f5f1e8] dark:bg-[#0e1015] border-t border-[#eee9de] dark:border-[#1c202a] flex items-center justify-between text-[11px] text-[#717684] dark:text-[#555a66] font-mono transition-colors duration-200">
        <span>Translation: {source.translatorName || 'Saheeh International'}</span>
        <span>Text: Tanzil.net (Immutable)</span>
      </footer>
    </article>
  );
}
