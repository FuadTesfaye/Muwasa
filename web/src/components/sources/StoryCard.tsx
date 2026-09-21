import { StorySource } from '@/lib/types';

export default function StoryCard({ source }: { source: StorySource }) {
  return (
    <div className="w-full border border-indigo-900/30 bg-indigo-950/10 rounded-2xl overflow-hidden shadow-sm">
      <div className="px-5 py-3 border-b border-indigo-900/20 flex items-center justify-between bg-indigo-950/20">
        <div className="flex items-center gap-2">
          <span className="text-indigo-400">📖</span>
          <span className="text-xs font-bold tracking-wider text-indigo-300/80 uppercase">From the Sunnah / Seerah</span>
        </div>
        <span className="text-xs px-2 py-1 bg-indigo-900/40 text-indigo-300 rounded-md">
          {source.sourceType}
        </span>
      </div>
      
      <div className="p-6 space-y-4">
        <h4 className="text-lg font-medium text-indigo-100">{source.title}</h4>
        <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
          {source.content}
        </p>
      </div>
      
      <div className="px-5 py-3 bg-indigo-950/20 border-t border-indigo-900/20 text-xs text-indigo-400/60">
        Figure: {source.figure}
      </div>
    </div>
  );
}
