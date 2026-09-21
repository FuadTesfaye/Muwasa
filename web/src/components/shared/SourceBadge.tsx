interface SourceBadgeProps {
  type: string;
  tier?: string;
  className?: string;
}

export default function SourceBadge({ type, tier, className = '' }: SourceBadgeProps) {
  let colorClass = 'bg-[#181a22] text-[#9ba1b0] border-[#272b38]'; // Default

  if (type === 'quran') {
    colorClass = 'bg-[#181d19] text-[#96ab9b] border-[#273229]';
  } else if (type === 'hadith') {
    colorClass = 'bg-[#201d17] text-[#baab90] border-[#363024]';
  } else if (type === 'tafsir') {
    colorClass = 'bg-[#171922] text-[#8e98b0] border-[#262b3a]';
  } else if (type === 'story') {
    colorClass = 'bg-[#1e1a17] text-[#b3a490] border-[#332b24]';
  } else if (type === 'dua') {
    colorClass = 'bg-[#181c1c] text-[#8eab9f] border-[#273330]';
  }

  return (
    <span className={`text-[11px] font-mono px-2 py-0.5 rounded border tracking-wider uppercase flex items-center gap-1 font-medium ${colorClass} ${className}`}>
      <span>{type}</span>
      {tier && <span className="opacity-60 text-[10px]">• {tier}</span>}
    </span>
  );
}
