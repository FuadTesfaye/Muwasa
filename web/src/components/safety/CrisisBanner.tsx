import { Phone, Heart, ExternalLink } from 'lucide-react';

export default function CrisisBanner() {
  return (
    <div className="w-full bg-gradient-to-r from-slate-900 via-rose-950/70 to-slate-900 border-b border-rose-800/40 text-rose-100 p-4 shadow-xl backdrop-blur-md z-40 animate-in slide-in-from-top duration-300">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs md:text-sm">
        <div className="flex items-center gap-2.5 text-center md:text-left">
          <div className="w-7 h-7 rounded-full bg-rose-900/60 border border-rose-700/50 flex items-center justify-center shrink-0">
            <Heart className="w-3.5 h-3.5 text-rose-300" />
          </div>
          <div>
            <p className="font-medium text-rose-200">
              Your life has immense value in the sight of Allah. Please don't carry this alone.
            </p>
            <p className="text-[11px] text-rose-300/70">
              Struggling right now does NOT make you a bad Muslim. Free, confidential human support is available 24/7.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 shrink-0">
          <a
            href="tel:988"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-900/60 hover:bg-rose-900 border border-rose-700/50 text-white font-medium text-xs transition-colors shadow-sm"
          >
            <Phone className="w-3 h-3 text-rose-300" />
            <span>Call/Text 988 (US)</span>
          </a>
          <a
            href="tel:18666273342"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-rose-800/40 text-rose-200 text-xs transition-colors shadow-sm"
          >
            <Phone className="w-3 h-3 text-emerald-400" />
            <span>Naseeha Helpline</span>
          </a>
          <a
            href="https://findahelpline.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-rose-300/80 hover:text-white text-xs transition-colors"
          >
            <span>International</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
