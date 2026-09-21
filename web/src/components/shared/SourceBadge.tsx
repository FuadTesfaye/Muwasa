interface SourceBadgeProps {
  type: string;
  tier?: string;
  className?: string;
}

export default function SourceBadge({ type, tier, className = '' }: SourceBadgeProps) {
  let colorClass = 'bg-slate-900/40 text-slate-300'; // Default

  if (type === 'quran') {
    colorClass = 'bg-emerald-900/40 text-emerald-300';
  } else if (type === 'hadith') {
    colorClass = 'bg-amber-900/40 text-amber-300';
  } else if (type === 'tafsir') {
    colorClass = 'bg-blue-900/40 text-blue-300';
  } else if (type === 'story') {
    colorClass = 'bg-indigo-900/40 text-indigo-300';
  } else if (type === 'dua') {
    colorClass = 'bg-purple-900/40 text-purple-300';
  }

  return (
    <span className={`text-xs px-2 py-1 rounded-md font-medium uppercase tracking-wide flex items-center gap-1 ${colorClass} ${className}`}>
      {type}
      {tier && <span className="opacity-70">• {tier}</span>}
    </span>
  );
}
