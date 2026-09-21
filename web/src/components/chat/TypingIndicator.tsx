export default function TypingIndicator() {
  return (
    <div className="flex items-center gap-2.5 py-3 text-xs text-[#717684] font-mono animate-in fade-in duration-200">
      <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#8f8574] animate-pulse" />
      <span>Muwāsā is reflecting...</span>
      <span className="font-arabic text-[11px] text-[#5c616e]">يَتَأَمَّلُ</span>
    </div>
  );
}
