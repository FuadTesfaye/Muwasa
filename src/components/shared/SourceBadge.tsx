interface SourceBadgeProps {
  type: string;
  tier?: string;
  className?: string;
}

export default function SourceBadge({ type, tier, className = '' }: SourceBadgeProps) {
  let colorClass = 'bg-[#ede8df] text-[#555047] border-[#ddd7cc] dark:bg-[#181a22] dark:text-[#9ba1b0] dark:border-[#272b38]'; // Default

  if (type === 'quran') {
    colorClass = 'bg-[#edf2ee] text-[#3d5a49] border-[#d5e0d7] dark:bg-[#181d19] dark:text-[#96ab9b] dark:border-[#273229]';
  } else if (type === 'hadith') {
    colorClass = 'bg-[#f4efe4] text-[#6b5837] border-[#e2d8c3] dark:bg-[#201d17] dark:text-[#baab90] dark:border-[#363024]';
  } else if (type === 'tafsir') {
    colorClass = 'bg-[#edf1f7] text-[#3d4b68] border-[#d5dce8] dark:bg-[#171922] dark:text-[#8e98b0] dark:border-[#262b3a]';
  } else if (type === 'story') {
    colorClass = 'bg-[#f4eee6] text-[#655543] border-[#e3d7c7] dark:bg-[#1e1a17] dark:text-[#b3a490] dark:border-[#332b24]';
  } else if (type === 'dua') {
    colorClass = 'bg-[#edf3f2] text-[#3c5952] border-[#d5e2df] dark:bg-[#181c1c] dark:text-[#8eab9f] dark:border-[#273330]';
  }

  return (
    <span className={`text-[11px] font-mono px-2 py-0.5 rounded border tracking-wider uppercase flex items-center gap-1 font-medium ${colorClass} ${className} transition-colors duration-200`}>
      <span>{type}</span>
      {tier && <span className="opacity-60 text-[10px]">• {tier}</span>}
    </span>
  );
}
