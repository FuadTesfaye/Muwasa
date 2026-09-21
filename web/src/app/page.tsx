'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { ArrowRight, ShieldCheck, BookOpen, Heart, Sparkles } from 'lucide-react';

const SANCTUARY_MODES = [
  {
    id: 'vent',
    icon: '🖤',
    titleAr: 'بَثُّ الشَّكْوَى',
    titleEn: 'I need to vent',
    desc: 'When your chest is constricted and you need someone to hear what you are carrying without judgment.',
    message: 'I need to vent about what is hurting inside me right now.',
    color: 'from-rose-950/30 to-slate-900/40 border-rose-900/30 hover:border-rose-700/50',
  },
  {
    id: 'understand',
    icon: '📖',
    titleAr: 'تَأَمُّلٌ وَهِدَايَة',
    titleEn: 'Help me understand',
    desc: 'Finding divine wisdom, meaning, and perspective on why this trial is happening to you.',
    message: 'Help me understand my situation and emotional trial from an Islamic perspective.',
    color: 'from-emerald-950/30 to-slate-900/40 border-emerald-900/30 hover:border-emerald-700/50',
  },
  {
    id: 'dua',
    icon: '🤲',
    titleAr: 'دُعَاءٌ وَسَكِينَة',
    titleEn: 'Give me something',
    desc: 'An authentic Ayah of reassurance, prophetic supplication, or remembrance to hold onto tonight.',
    message: "Give me an authentic du'a or Quranic verse for what my heart is feeling right now.",
    color: 'from-amber-950/30 to-slate-900/40 border-amber-900/30 hover:border-amber-700/50',
  },
  {
    id: 'reflect',
    icon: '🌙',
    titleAr: 'مُحَاسَبَةٌ وَتَوْبَة',
    titleEn: 'I want to reflect',
    desc: 'Quiet contemplation on spiritual struggles, prayer, feeling far from Allah, or seeking repentance.',
    message: 'I want to reflect on my spiritual state, my prayer, and returning to Allah with hope.',
    color: 'from-indigo-950/30 to-slate-900/40 border-indigo-900/30 hover:border-indigo-700/50',
  },
  {
    id: 'guidance',
    icon: '🧭',
    titleAr: 'اسْتِرْشَادٌ فِي الْأَمْر',
    titleEn: 'I need guidance',
    desc: 'Navigating heavy family expectations, relational strain, comparison, or academic hardship.',
    message: 'I need guidance on navigating a difficult life situation and family pressure.',
    color: 'from-teal-950/30 to-slate-900/40 border-teal-900/30 hover:border-teal-700/50',
  },
  {
    id: 'feelings',
    icon: '🧩',
    titleAr: 'تَفْرِيجُ الْكَرْب',
    titleEn: 'Untangle my heart',
    desc: 'When feelings are tangled between sadness, guilt, shame, and numbness and you cannot find words.',
    message: "Help me untangle what I am feeling right now. My thoughts feel heavy and scattered.",
    color: 'from-violet-950/30 to-slate-900/40 border-violet-900/30 hover:border-violet-700/50',
  },
];

export default function LandingPage() {
  const router = useRouter();
  const [inputValue, setInputValue] = useState('');

  const handleStartChat = (messageText: string) => {
    sessionStorage.setItem('initial_message', messageText);
    router.push('/chat');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      handleStartChat(inputValue.trim());
    }
  };

  return (
    <main className="flex-1 flex flex-col items-center justify-between p-4 md:p-8 max-w-5xl mx-auto w-full relative z-10">
      {/* Top Bismillah Header */}
      <div className="w-full pt-4 pb-8 flex flex-col items-center justify-center text-center space-y-2">
        <span className="text-xs uppercase tracking-[0.3em] text-emerald-400/80 font-medium">
          A Private Islamic Emotional Sanctuary
        </span>
        <p className="font-arabic text-xl md:text-2xl text-emerald-300/60 select-none">
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </p>
      </div>

      {/* Hero Section */}
      <div className="text-center space-y-6 max-w-2xl mx-auto my-6">
        <div className="space-y-3">
          <h1 className="text-6xl md:text-8xl font-arabic font-bold text-transparent bg-clip-text bg-gradient-to-b from-slate-50 via-emerald-100 to-emerald-400/70 tracking-tight filter drop-shadow-sm">
            مُوَاسَاة
          </h1>
          <p className="text-xl md:text-2xl font-serif-heading italic text-slate-300 tracking-wide">
            Muwāsā
          </p>
        </div>

        <p className="text-2xl md:text-3xl font-light text-slate-200 tracking-wide leading-relaxed">
          When your heart is heavy, speak.
        </p>
        
        <p className="text-sm md:text-base text-slate-400 max-w-lg mx-auto leading-relaxed font-light">
          A quiet place that listens first, understands the weight you carry, and gently connects you with authentic guidance from the Qur'an and Sunnah.
        </p>
      </div>

      {/* Primary Input Bar */}
      <form onSubmit={handleSubmit} className="w-full max-w-2xl my-6">
        <div className="relative flex items-center shadow-2xl rounded-2xl overflow-hidden bg-slate-900/80 border border-emerald-900/40 p-2 backdrop-blur-xl focus-within:border-emerald-500/60 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Tell me what is weighing on your heart tonight..."
            className="flex-1 bg-transparent px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none text-base"
          />
          <button
            type="submit"
            disabled={!inputValue.trim()}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium text-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-md shadow-emerald-950"
          >
            <span>Speak</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* Mode Selection Cards */}
      <div className="w-full my-8">
        <div className="flex items-center justify-between mb-4 px-1">
          <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Or Enter Through a Reflection Mode
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
          {SANCTUARY_MODES.map((mode) => (
            <Card
              key={mode.id}
              onClick={() => handleStartChat(mode.message)}
              className={`p-5 cursor-pointer bg-gradient-to-br ${mode.color} border transition-all duration-300 hover:scale-[1.01] hover:shadow-xl group flex flex-col justify-between rounded-2xl`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl p-2 rounded-xl bg-slate-900/60 border border-slate-800/80 shadow-inner">
                    {mode.icon}
                  </span>
                  <span className="font-arabic text-sm text-emerald-400/80 dir-rtl font-medium">
                    {mode.titleAr}
                  </span>
                </div>
                <div>
                  <h3 className="font-medium text-slate-100 text-base group-hover:text-emerald-300 transition-colors">
                    {mode.titleEn}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed font-light">
                    {mode.desc}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/40 flex items-center justify-between text-xs text-slate-500 group-hover:text-emerald-400 transition-colors">
                <span>Reflect</span>
                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Trust & Privacy Guardrails */}
      <div className="w-full max-w-3xl pt-8 pb-4 border-t border-slate-900/60 grid grid-cols-1 md:grid-cols-3 gap-4 text-center text-xs text-slate-400">
        <div className="flex items-center justify-center gap-2 p-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Strictly Private • One-Click Delete</span>
        </div>
        <div className="flex items-center justify-center gap-2 p-2">
          <BookOpen className="w-4 h-4 text-amber-400" />
          <span>Source-Bound to Qur'an & Sunnah</span>
        </div>
        <div className="flex items-center justify-center gap-2 p-2">
          <Heart className="w-4 h-4 text-rose-400" />
          <span>Zero Judgment • Listening First</span>
        </div>
      </div>
    </main>
  );
}
