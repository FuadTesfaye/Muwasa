import { useState } from 'react';
import { DuaSource } from '@/lib/types';
import { Sparkles, Copy, Check } from 'lucide-react';

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
    <div className="w-full my-4 border border-violet-800/40 bg-gradient-to-b from-violet-950/20 via-slate-900/60 to-slate-900/80 rounded-2xl overflow-hidden shadow-xl backdrop-blur-sm transition-all hover:border-violet-700/50">
      {/* Header */}
      <div className="px-5 py-3 border-b border-violet-900/30 flex items-center justify-between bg-violet-950/30">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-full bg-violet-900/60 border border-violet-700/40 flex items-center justify-center text-violet-300 text-xs">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold tracking-widest text-violet-300 uppercase">
            Supplication (Du'a)
          </span>
        </div>

        <button
          onClick={handleCopy}
          title="Copy du'a"
          className="p-1.5 rounded-lg text-violet-400/60 hover:text-violet-300 hover:bg-violet-900/40 transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-violet-400" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Content */}
      <div className="p-6 md:p-8 space-y-6">
        <h3 className="text-center text-sm font-medium text-violet-300/80 tracking-wide">
          {source.title}
        </h3>

        {/* Arabic Text */}
        <div className="py-2">
          <p
            className="font-arabic text-xl md:text-3xl text-center leading-[2.6] text-violet-50 dir-rtl select-text"
            dir="rtl"
          >
            {source.arabicText}
          </p>
        </div>

        {/* Transliteration */}
        {source.transliteration && (
          <p className="text-xs md:text-sm text-center text-violet-300/70 font-mono tracking-wide italic">
            {source.transliteration}
          </p>
        )}

        {/* Translation */}
        <div className="pt-4 border-t border-violet-900/20">
          <p className="text-slate-200 text-base leading-relaxed font-light text-center max-w-2xl mx-auto italic">
            "{source.translation}"
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-2.5 bg-violet-950/40 border-t border-violet-900/30 flex items-center justify-between text-[11px] text-violet-400/60 font-light">
        <span>Reference: {source.sourceReference}</span>
        <span>Peace for the Heart</span>
      </div>
    </div>
  );
}
