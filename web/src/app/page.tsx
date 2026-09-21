'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ArrowRight, Shield, BookOpen, Compass } from 'lucide-react';

const CONTEMPLATIVE_PATHS = [
  {
    index: '01',
    titleEn: 'Grief & Heavy Loss',
    titleAr: 'بَثُّ الحُزْن',
    desc: 'When carrying the ache of bereavement, separation, or quiet emptiness.',
    prompt: 'I am carrying a deep sadness and grief that feels heavy to speak about.',
  },
  {
    index: '02',
    titleEn: 'Guilt & Spiritual Distance',
    titleAr: 'التَّوْبَةُ وَالرَّجَاء',
    desc: 'When feeling unworthy, burdened by recurring mistakes, or struggling to pray.',
    prompt: 'I feel distant from Allah and weighed down by guilt over my sins and shortcomings.',
  },
  {
    index: '03',
    titleEn: 'Family & Unspoken Pressure',
    titleAr: 'ضِيقُ الصَّدْر',
    desc: 'When expectations from loved ones feel suffocating and you feel misunderstood.',
    prompt: 'I am overwhelmed by pressure and expectations from my family that I cannot meet.',
  },
  {
    index: '04',
    titleEn: 'An Anchor for Tonight',
    titleAr: 'السَّكِينَةُ وَالدُّعَاء',
    desc: 'An authentic Ayah or Prophetic supplication to hold onto when thoughts will not still.',
    prompt: "Give me an authentic verse or du'a to hold onto right now. My chest feels constricted.",
  },
  {
    index: '05',
    titleEn: 'Hard Decisions & Uncertainty',
    titleAr: 'الاسْتِرْشَاد',
    desc: 'Navigating life crossroads, fear of the future, and leaning on divine decree.',
    prompt: 'I am facing a difficult decision and feeling consumed by fear of what lies ahead.',
  },
  {
    index: '06',
    titleEn: 'When Words Fail',
    titleAr: 'تَفْرِيجُ الكَرْب',
    desc: 'When you are exhausted, numb, or simply need a safe place to untangle what hurts.',
    prompt: 'I feel exhausted and numb. Help me untangle what I am feeling right now.',
  },
];

export default function LandingPage() {
  const router = useRouter();
  const [inputValue, setInputValue] = useState('');

  const handleStart = (text: string) => {
    sessionStorage.setItem('initial_message', text);
    router.push('/chat');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      handleStart(inputValue.trim());
    }
  };

  return (
    <main className="flex-1 flex flex-col justify-between max-w-4xl mx-auto w-full px-6 py-12 md:py-16">
      {/* Top Header */}
      <header className="w-full flex items-center justify-between pb-12 border-b border-[#1c202a]">
        <div className="flex items-center gap-3">
          <span className="font-arabic text-xl tracking-wide text-[#e8e5df]">مُوَاسَاة</span>
          <span className="text-xs font-serif-heading italic text-[#787d89]">Muwāsā</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-[#6e737f] font-mono tracking-wider uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-[#526359]" />
          <span>Private Sanctuary</span>
        </div>
      </header>

      {/* Hero & Central Space */}
      <section className="my-14 md:my-20 space-y-8">
        <div className="space-y-4">
          <p className="font-arabic text-lg md:text-xl text-[#8e8a80] select-none text-right md:text-left">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
          <h1 className="text-3xl md:text-5xl font-serif-heading font-normal text-[#f4f2ed] tracking-tight leading-[1.25]">
            When your heart is heavy, speak.
          </h1>
          <p className="text-sm md:text-base text-[#9297a5] font-light max-w-xl leading-relaxed">
            A quiet space that listens before it speaks. You will not be met with cliché platitudes
            or told to &ldquo;just have sabr.&rdquo; Your situation is heard, understood, and grounded in
            the authentic Qur&rsquo;an, Sunnah, and scholarly wisdom.
          </p>
        </div>

        {/* Primary Input Vessel */}
        <form onSubmit={handleSubmit} className="pt-2">
          <div className="relative rounded-xl border border-[#232732] bg-[#12141a] transition-all duration-200 focus-within:border-[#424858]">
            <textarea
              rows={3}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (inputValue.trim()) handleStart(inputValue.trim());
                }
              }}
              placeholder="What is weighing on your heart tonight? Speak plainly..."
              className="w-full bg-transparent p-5 text-sm md:text-base text-[#f2f0eb] placeholder-[#4f5462] resize-none focus:outline-none font-light leading-relaxed"
            />
            <div className="flex items-center justify-between px-5 py-3 border-t border-[#1a1d26] text-xs text-[#555a66]">
              <span className="hidden sm:inline font-mono text-[11px]">Enter to begin • Shift+Enter for new line</span>
              <button
                type="submit"
                disabled={!inputValue.trim()}
                className="ml-auto inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#20242e] hover:bg-[#2b303d] text-[#e8e5df] text-xs font-medium tracking-wide transition-colors disabled:opacity-30 disabled:cursor-not-allowed border border-[#2d3240]"
              >
                <span>Enter Sanctuary</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#a19d94]" />
              </button>
            </div>
          </div>
        </form>
      </section>

      {/* Contemplative Entry Points */}
      <section className="my-10 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#1c202a]">
          <span className="text-[11px] font-mono tracking-widest text-[#5c6170] uppercase">
            Contemplative Paths
          </span>
          <span className="text-[11px] text-[#5c6170]">Choose where to begin</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {CONTEMPLATIVE_PATHS.map((item) => (
            <button
              key={item.index}
              onClick={() => handleStart(item.prompt)}
              className="text-left p-5 rounded-lg border border-[#1b1f28] bg-[#111319] hover:bg-[#151821] hover:border-[#2b303d] transition-all group flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-[#555a66] tracking-wider">
                    {item.index}
                  </span>
                  <span className="font-arabic text-xs text-[#8c867a] dir-rtl">
                    {item.titleAr}
                  </span>
                </div>
                <h3 className="text-sm font-medium text-[#e4e1da] group-hover:text-white transition-colors">
                  {item.titleEn}
                </h3>
                <p className="text-xs text-[#7d8291] font-light leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="text-[11px] text-[#4f5462] group-hover:text-[#a39f96] flex items-center gap-1 transition-colors pt-2">
                <span>Reflect</span>
                <ArrowRight className="w-3 h-3 transform group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Dignified Footer */}
      <footer className="pt-16 pb-6 border-t border-[#1c202a] text-xs text-[#636875] grid grid-cols-1 md:grid-cols-3 gap-6 font-light">
        <div className="flex items-start gap-2.5">
          <Shield className="w-4 h-4 text-[#7d796f] shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-[#c0bcb2]">Private & Unrecorded</p>
            <p className="text-[11px] text-[#5c6170] mt-0.5">Sessions are ephemeral. Delete your conversation at any time with one click.</p>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <BookOpen className="w-4 h-4 text-[#7d796f] shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-[#c0bcb2]">Bound to Sacred Sources</p>
            <p className="text-[11px] text-[#5c6170] mt-0.5">Anchored in verified Qur&rsquo;an (Tanzil.net) and authenticated Hadith (HadeethEnc).</p>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <Compass className="w-4 h-4 text-[#7d796f] shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-[#c0bcb2]">Listening Before Advice</p>
            <p className="text-[11px] text-[#5c6170] mt-0.5">No superficial dismissals. Your grief and struggle are acknowledged with dignity.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
