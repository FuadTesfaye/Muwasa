import { useState } from 'react';
import { QuranSource } from '@/lib/types';
import { BookOpen, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';

export default function QuranCard({ source }: { source: QuranSource }) {
  const [copied, setCopied] = useState(false);
  const [showTafsir, setShowTafsir] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(`${source.arabicUthmani}\n\n"${source.translation}" (Qur'an ${source.verseKey})`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full my-4 border border-emerald-800/40 bg-gradient-to-b from-emerald-950/20 via-slate-900/60 to-slate-900/80 rounded-2xl overflow-hidden shadow-xl backdrop-blur-sm transition-all hover:border-emerald-700/50">
      {/* Header */}
      <div className="px-5 py-3 border-b border-emerald-900/30 flex items-center justify-between bg-emerald-950/30">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-full bg-emerald-900/60 border border-emerald-700/40 flex items-center justify-center text-emerald-300 text-xs">
            <BookOpen className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold tracking-widest text-emerald-300 uppercase">
            Holy Qur'an
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            title="Copy verse"
            className="p-1.5 rounded-lg text-emerald-400/60 hover:text-emerald-300 hover:bg-emerald-900/40 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          <span className="text-xs font-mono font-medium px-2.5 py-0.5 bg-emerald-900/50 text-emerald-300 rounded-full border border-emerald-700/30">
            Surah {source.verseKey}
          </span>
        </div>
      </div>

      {/* Scripture Content */}
      <div className="p-6 md:p-8 space-y-6">
        {/* Arabic Uthmani Script */}
        <div className="py-2">
          <p
            className="font-arabic text-2xl md:text-4xl text-center leading-[2.6] text-emerald-50 dir-rtl selection:bg-emerald-900/60 select-text"
            dir="rtl"
          >
            {source.arabicUthmani}
          </p>
        </div>

        {/* Translation */}
        <div className="pt-4 border-t border-emerald-900/20">
          <p className="text-slate-200 text-base md:text-lg leading-relaxed font-light italic text-center max-w-2xl mx-auto">
            "{source.translation}"
          </p>
        </div>

        {/* Optional Tafsir Reflection */}
        {source.tafsirExcerpt && (
          <div className="mt-4 pt-4 border-t border-emerald-900/20">
            <button
              onClick={() => setShowTafsir(!showTafsir)}
              className="flex items-center justify-between w-full text-xs text-emerald-400/80 hover:text-emerald-300 font-medium py-1"
            >
              <span>Reflect on this verse (Tafsir context)</span>
              {showTafsir ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {showTafsir && (
              <div className="mt-3 p-4 rounded-xl bg-slate-950/60 border border-emerald-900/20 text-xs md:text-sm text-slate-300 leading-relaxed font-light animate-in fade-in duration-200">
                {source.tafsirExcerpt}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Attribution Footer */}
      <div className="px-5 py-2.5 bg-emerald-950/40 border-t border-emerald-900/30 flex items-center justify-between text-[11px] text-emerald-400/60 font-light">
        <span>Translation: {source.translatorName || 'Saheeh International'}</span>
        <span>Source: Tanzil Project (CC BY 3.0)</span>
      </div>
    </div>
  );
}
