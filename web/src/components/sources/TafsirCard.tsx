import { TafsirSource } from '@/lib/types';

export default function TafsirCard({ source }: { source: TafsirSource }) {
  return (
    <div className="w-full border border-blue-900/30 bg-blue-950/10 rounded-2xl overflow-hidden shadow-sm">
      <div className="px-5 py-3 border-b border-blue-900/20 flex items-center justify-between bg-blue-950/20">
        <div className="flex items-center gap-2">
          <span className="text-blue-400">💡</span>
          <span className="text-xs font-bold tracking-wider text-blue-300/80 uppercase">Explanation</span>
        </div>
        <span className="text-xs px-2 py-1 bg-blue-900/40 text-blue-300 rounded-md">
          {source.verseKey}
        </span>
      </div>
      
      <div className="p-6">
        <p className="text-slate-300 leading-relaxed">
          {source.text}
        </p>
      </div>
      
      <div className="px-5 py-3 bg-blue-950/20 border-t border-blue-900/20 text-xs text-blue-400/60">
        Based on: {source.tafsirName} by {source.author}
      </div>
    </div>
  );
}
