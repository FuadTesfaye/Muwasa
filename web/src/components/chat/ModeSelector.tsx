import { Card } from '@/components/ui/card';

interface ModeSelectorProps {
  onSelect: (message: string) => void;
}

const MODES = [
  { id: 'vent', icon: '🖤', title: 'I need to vent', message: 'I need to vent.' },
  { id: 'understand', icon: '📖', title: 'Help me understand', message: 'Help me understand my situation from an Islamic perspective.' },
  { id: 'dua', icon: '🤲', title: 'Give me something', message: "Give me a du'a or verse for what I'm feeling." },
  { id: 'reflect', icon: '🌙', title: 'I want to reflect', message: 'I want to reflect on my spiritual state.' },
  { id: 'guidance', icon: '🧭', title: 'I need guidance', message: 'I need guidance on a matter.' },
  { id: 'feelings', icon: '🧩', title: "Help me understand what I'm feeling", message: "Help me figure out what I'm feeling right now." },
];

export default function ModeSelector({ onSelect }: ModeSelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
      {MODES.map((mode) => (
        <Card
          key={mode.id}
          className="p-6 cursor-pointer hover:bg-slate-800/50 transition-colors border-slate-800 bg-slate-900/50"
          onClick={() => onSelect(mode.message)}
        >
          <div className="flex items-center gap-4">
            <span className="text-3xl">{mode.icon}</span>
            <span className="text-lg font-medium text-slate-200">{mode.title}</span>
          </div>
        </Card>
      ))}
    </div>
  );
}
