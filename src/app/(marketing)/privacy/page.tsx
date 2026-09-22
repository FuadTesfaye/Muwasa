import Link from 'next/link';
import { ArrowLeft, Lock, Trash2, EyeOff } from 'lucide-react';
import ThemeToggle from '@/components/theme/ThemeToggle';

export default function PrivacyPage() {
  return (
    <main className="flex-1 flex flex-col max-w-3xl mx-auto w-full px-6 py-12 md:py-16">
      <header className="w-full flex items-center justify-between pb-8 border-b border-[#e4dfd5] dark:border-[#1c202a]">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-[#636877] dark:text-[#717684] hover:text-[#1c1e24] dark:hover:text-[#e4e1da] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Sanctuary</span>
        </Link>
        <ThemeToggle />
      </header>

      <article className="my-12 space-y-10">
        <div className="space-y-3">
          <span className="font-arabic text-2xl text-[#7c7365] dark:text-[#8e8a80]">مُوَاسَاة</span>
          <h1 className="text-3xl md:text-4xl font-serif-heading font-normal text-[#181a20] dark:text-[#f4f2ed]">
            Privacy &amp; Sanctuary Pledge
          </h1>
          <p className="text-sm font-mono uppercase tracking-wider text-[#7a7263] dark:text-[#787d89]">
            A Sacred Trust (Amanah) • Unrecorded Conversations • Ephemeral by Default
          </p>
        </div>

        <div className="space-y-4 text-[#2b2e38] dark:text-[#dedad2] text-sm md:text-base leading-relaxed font-light">
          <p>
            When someone opens their heart about guilt, grief, family pain, or spiritual distress, it is an <strong>Amanah (sacred trust)</strong>. We treat your reflections with the highest standard of technical privacy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          <div className="p-5 rounded-xl border border-[#ded8cb] dark:border-[#262a36] bg-[#fbfaf8] dark:bg-[#12141c] space-y-2">
            <EyeOff className="w-4 h-4 text-[#8a7a63] dark:text-[#8f8574]" />
            <h3 className="text-sm font-medium text-[#1c1e24] dark:text-[#edeae3]">No Third-Party Trackers</h3>
            <p className="text-xs text-[#525765] dark:text-[#9297a5] font-light leading-relaxed">
              We do not embed Facebook, Google Ads, or behavioral tracking scripts.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-[#ded8cb] dark:border-[#262a36] bg-[#fbfaf8] dark:bg-[#12141c] space-y-2">
            <Lock className="w-4 h-4 text-[#8a7a63] dark:text-[#8f8574]" />
            <h3 className="text-sm font-medium text-[#1c1e24] dark:text-[#edeae3]">No Training on Secrets</h3>
            <p className="text-xs text-[#525765] dark:text-[#9297a5] font-light leading-relaxed">
              Your conversations are never used to train public models or shared with brokers.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-[#ded8cb] dark:border-[#262a36] bg-[#fbfaf8] dark:bg-[#12141c] space-y-2">
            <Trash2 className="w-4 h-4 text-[#8a7a63] dark:text-[#8f8574]" />
            <h3 className="text-sm font-medium text-[#1c1e24] dark:text-[#edeae3]">One-Click Total Wipe</h3>
            <p className="text-xs text-[#525765] dark:text-[#9297a5] font-light leading-relaxed">
              Clicking &ldquo;End &amp; Clear&rdquo; purges the conversation from active memory immediately.
            </p>
          </div>
        </div>
      </article>
    </main>
  );
}
