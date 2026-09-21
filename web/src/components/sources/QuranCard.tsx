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
    <article className="w-full my-5 rounded-xl border border-[#262a36] bg-[#12141c] overflow-hidden text-[#d4d6dd] shadow-sm">
      {/* Header Bar */}
      <header className="px-5 py-3 border-b border-[#1c202a] flex items-center justify-between bg-[#101218]">
        <div className="flex items-center gap-2.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#8f8574]" />
          <span className="text-[11px] font-mono tracking-widest text-[#9e9686] uppercase font-medium">
            Holy Qur&rsquo;an
          </span>
          <span className="text-[11px] text-[#555b68] font-mono">•</span>
          <span className="text-xs text-[#b8b3a7] font-serif-heading">
            Surah {source.verseKey}
          </span>
        </div>

        <button
          onClick={handleCopy}
          title="Copy verse and translation"
          className="inline-flex items-center gap-1 text-[11px] text-[#6d7280] hover:text-[#c4c0b5] transition-colors p-1"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-[#8f8574]" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </header>

      {/* Main Scripture Canvas */}
      <div className="p-6 md:p-8 space-y-6">
        {/* Arabic Uthmani Text */}
        <div className="py-2">
          <p
            className="font-arabic text-2xl md:text-3xl text-right leading-[2.5] text-[#f4f2ed] dir-rtl select-text"
            dir="rtl"
          >
            {source.arabicUthmani}
          </p>
        </div>

        {/* Translation */}
        <div className="pt-4 border-t border-[#1b1f28]">
          <p className="text-[#dedad2] text-sm md:text-base leading-relaxed font-light italic">
            &ldquo;{source.translation}&rdquo;
          </p>
        </div>

        {/* Collapsible Tafsir Exegesis */}
        {source.tafsirExcerpt && (
          <div className="pt-3 border-t border-[#1b1f28]">
            <button
              onClick={() => setShowTafsir(!showTafsir)}
              className="flex items-center justify-between w-full text-xs text-[#8f8574] hover:text-[#c4c0b5] transition-colors py-1"
            >
              <span>Scholarly Context & Exegesis (Tafsir)</span>
              {showTafsir ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
            {showTafsir && (
              <div className="mt-2.5 p-4 rounded-lg bg-[#0e1015] border border-[#1e222c] text-xs text-[#8c92a2] leading-relaxed font-light">
                {source.tafsirExcerpt}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Quiet Attribution Footer */}
      <footer className="px-5 py-2.5 bg-[#0e1015] border-t border-[#1c202a] flex items-center justify-between text-[11px] text-[#555a66] font-mono">
        <span>Translation: {source.translatorName || 'Saheeh International'}</span>
        <span>Text: Tanzil.net (Immutable)</span>
      </footer>
    </article>
  );
}
