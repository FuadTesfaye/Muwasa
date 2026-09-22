import Link from 'next/link';
import { ArrowLeft, Shield, HeartHandshake, BookOpen } from 'lucide-react';
import ThemeToggle from '@/components/theme/ThemeToggle';

export default function AboutPage() {
  return (
    <main className="flex-1 flex flex-col max-w-3xl mx-auto w-full px-6 py-12 md:py-16">
      {/* Header */}
      <header className="w-full flex items-center justify-between pb-8 border-b border-[#e4dfd5] dark:border-[#1c202a]">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-[#636877] dark:text-[#717684] hover:text-[#1c1e24] dark:hover:text-[#e4e1da] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Sanctuary</span>
        </Link>
        <div className="flex items-center gap-3">
          <ThemeToggle />
        </div>
      </header>

      {/* Content */}
      <article className="my-12 space-y-10">
        <div className="space-y-3">
          <span className="font-arabic text-2xl text-[#7c7365] dark:text-[#8e8a80]">مُوَاسَاة</span>
          <h1 className="text-3xl md:text-4xl font-serif-heading font-normal text-[#181a20] dark:text-[#f4f2ed]">
            About Muwāsā
          </h1>
          <p className="text-sm font-mono uppercase tracking-wider text-[#7a7263] dark:text-[#787d89]">
            The Philosophy of Consolation &amp; Grounded Accompaniment
          </p>
        </div>

        <div className="space-y-6 text-[#2b2e38] dark:text-[#dedad2] text-sm md:text-base leading-relaxed font-light">
          <p>
            In the classical Arabic tradition, <strong>Muwāsā (مُوَاسَاة)</strong> signifies being there for someone in hardship—consoling them, sharing in their burden, and offering quiet, steadfast companionship without judgment.
          </p>

          <p>
            Many Muslims experiencing anxiety, family pressure, grief, or personal shortcomings feel caught between two extremes: impersonal secular therapy that may misunderstand their spiritual convictions, or superficial religious clichés that dismiss their pain with an unhelpful &ldquo;just have sabr.&rdquo;
          </p>

          <p>
            Muwāsā was created to bridge this divide. It is designed to <strong>understand first, and advise second</strong>. It does not replace a doctor, psychiatrist, or qualified mufti; instead, it offers a safe, dignified space to untangle what hurts, anchored in the authentic Qur&rsquo;an, Sunnah, and scholarly wisdom.
          </p>
        </div>

        {/* Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
          <div className="p-5 rounded-xl border border-[#ded8cb] dark:border-[#262a36] bg-[#fbfaf8] dark:bg-[#12141c] space-y-2">
            <HeartHandshake className="w-4 h-4 text-[#8a7a63] dark:text-[#8f8574]" />
            <h3 className="text-sm font-medium text-[#1c1e24] dark:text-[#f4f2ed]">Dignified Listening</h3>
            <p className="text-xs text-[#636877] dark:text-[#8c92a2] leading-relaxed">
              Your pain is acknowledged as real. Suffering is never framed as divine punishment.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-[#ded8cb] dark:border-[#262a36] bg-[#fbfaf8] dark:bg-[#12141c] space-y-2">
            <BookOpen className="w-4 h-4 text-[#8a7a63] dark:text-[#8f8574]" />
            <h3 className="text-sm font-medium text-[#1c1e24] dark:text-[#f4f2ed]">Source-Bound</h3>
            <p className="text-xs text-[#636877] dark:text-[#8c92a2] leading-relaxed">
              Only authentic, verifiable Qur&rsquo;an and Hadith narrations are cited, with explicit provenance.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-[#ded8cb] dark:border-[#262a36] bg-[#fbfaf8] dark:bg-[#12141c] space-y-2">
            <Shield className="w-4 h-4 text-[#8a7a63] dark:text-[#8f8574]" />
            <h3 className="text-sm font-medium text-[#1c1e24] dark:text-[#f4f2ed]">Private by Default</h3>
            <p className="text-xs text-[#636877] dark:text-[#8c92a2] leading-relaxed">
              No tracking, no selling of vulnerable conversations. One-click wipe removes session memory permanently.
            </p>
          </div>
        </div>
      </article>
    </main>
  );
}
