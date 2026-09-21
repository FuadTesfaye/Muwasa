export default function TypingIndicator() {
  return (
    <div className="flex items-center gap-3.5 text-slate-400 px-4 py-3 bg-slate-900/40 border border-slate-800/60 rounded-2xl w-fit backdrop-blur-sm animate-in fade-in duration-300">
      <div className="flex gap-1.5 items-center">
        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '160ms' }} />
        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '320ms' }} />
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs md:text-sm font-light text-slate-300">
          Muwāsā is reflecting on your words...
        </span>
        <span className="font-arabic text-xs text-emerald-400/80 font-medium">
          يَتَأَمَّلُ
        </span>
      </div>
    </div>
  );
}
