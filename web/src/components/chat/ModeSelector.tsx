interface ModeSelectorProps {
  onSelect: (message: string) => void;
}

const MODES = [
  {
    index: '01',
    titleAr: 'تَفْرِيغُ الهَمّ',
    titleEn: 'I need to speak plainly',
    message: 'I am overwhelmed and need a quiet space to express what is on my heart without judgment.',
  },
  {
    index: '02',
    titleAr: 'فَهْمُ الابْتِلَاء',
    titleEn: 'Help me understand this test',
    message: 'Help me understand what I am experiencing from an authentic Islamic and spiritual perspective.',
  },
  {
    index: '03',
    titleAr: 'دُعَاءٌ وَآيَة',
    titleEn: 'Give me an anchor',
    message: "Give me an authentic Qur'an verse or prophetic du'a to hold onto for what I am feeling tonight.",
  },
  {
    index: '04',
    titleAr: 'مُحَاسَبَةُ النَّفْس',
    titleEn: 'Reflect on my spiritual state',
    message: 'I want to reflect honestly on my spiritual condition and relationship with Allah.',
  },
  {
    index: '05',
    titleAr: 'طَلَبُ الرُّشْد',
    titleEn: 'I need guidance on a crossroad',
    message: 'I am facing a difficult life situation and need guidance anchored in prophetic wisdom.',
  },
  {
    index: '06',
    titleAr: 'تَمْيِيزُ المَشَاعِر',
    titleEn: 'Untangle what I am feeling',
    message: "I feel confused, numb, and distressed. Help me untangle what I am feeling right now.",
  },
];

export default function ModeSelector({ onSelect }: ModeSelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
      {MODES.map((mode) => (
        <button
          key={mode.index}
          onClick={() => onSelect(mode.message)}
          className="text-left p-5 rounded-lg border border-[#1d212b] bg-[#11131a] hover:bg-[#151822] hover:border-[#2b303d] transition-all group flex flex-col justify-between space-y-3"
        >
          <div className="flex items-center justify-between w-full">
            <span className="font-mono text-[10px] text-[#555a66] tracking-wider">
              {mode.index}
            </span>
            <span className="font-arabic text-xs text-[#8c867a] dir-rtl">
              {mode.titleAr}
            </span>
          </div>
          <div>
            <h4 className="text-sm font-medium text-[#edeae3] group-hover:text-white transition-colors">
              {mode.titleEn}
            </h4>
          </div>
        </button>
      ))}
    </div>
  );
}
