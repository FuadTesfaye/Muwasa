import { useState } from 'react';
import { HadithSource } from '@/lib/types';
import { Scroll, Copy, Check, ChevronDown, ChevronUp, ShieldCheck } from 'lucide-react';
import GradeBadge from '../shared/GradeBadge';

export default function HadithCard({ source }: { source: HadithSource }) {
  const [copied, setCopied] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(
      `${source.arabicMatn}\n\n"${source.englishText}"\n— ${source.collection} #${source.hadithNumber} (${source.grade})`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full my-4 border border-amber-800/40 bg-gradient-to-b from-amber-950/20 via-slate-900/60 to-slate-900/80 rounded-2xl overflow-hidden shadow-xl backdrop-blur-sm transition-all hover:border-amber-700/50">
      {/* Header */}
      <div className="px-5 py-3 border-b border-amber-900/30 flex items-center justify-between bg-amber-950/30">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-full bg-amber-900/60 border border-amber-700/40 flex items-center justify-center text-amber-300 text-xs">
            <Scroll className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold tracking-widest text-amber-300 uppercase">
            Prophetic Sunnah
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            title="Copy hadith"
            className="p-1.5 rounded-lg text-amber-400/60 hover:text-amber-300 hover:bg-amber-900/40 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-amber-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          <GradeBadge grade={source.grade || 'Sahih'} />
        </div>
      </div>

      {/* Content */}
      <div className="p-6 md:p-8 space-y-6">
        {/* Arabic Matn */}
        {source.arabicMatn && (
          <div className="py-2">
            <p
              className="font-arabic text-xl md:text-3xl text-center leading-[2.5] text-amber-100 dir-rtl select-text"
              dir="rtl"
            >
              {source.arabicMatn}
            </p>
          </div>
        )}

        {/* English Narration */}
        <div className="pt-4 border-t border-amber-900/20">
          <p className="text-slate-200 text-base md:text-lg leading-relaxed font-light text-center max-w-2xl mx-auto">
            "{source.englishText}"
          </p>
        </div>

        {/* Sharh / Scholarly Commentary */}
        {source.explanation && (
          <div className="mt-4 pt-4 border-t border-amber-900/20">
            <button
              onClick={() => setShowExplanation(!showExplanation)}
              className="flex items-center justify-between w-full text-xs text-amber-400/80 hover:text-amber-300 font-medium py-1"
            >
              <span>Scholarly Explanation & Context (Sharh)</span>
              {showExplanation ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {showExplanation && (
              <div className="mt-3 p-4 rounded-xl bg-slate-950/60 border border-amber-900/20 text-xs md:text-sm text-slate-300 leading-relaxed font-light animate-in fade-in duration-200">
                {source.explanation}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Attribution Footer */}
      <div className="px-5 py-2.5 bg-amber-950/40 border-t border-amber-900/30 flex items-center justify-between text-[11px] text-amber-400/60 font-light">
        <span>
          {source.collection} • Hadith #{source.hadithNumber}
        </span>
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-emerald-400" />
          Verified Source: HadeethEnc.com
        </span>
      </div>
    </div>
  );
}
