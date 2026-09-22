import Link from 'next/link';
import { ArrowLeft, Database, ShieldAlert, CheckCircle, Clock } from 'lucide-react';
import ThemeToggle from '@/components/theme/ThemeToggle';

export default function AdminDashboardPage() {
  return (
    <main className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-6 py-12">
      <header className="w-full flex items-center justify-between pb-8 border-b border-[#e4dfd5] dark:border-[#1c202a]">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-[#636877] dark:text-[#717684] hover:text-[#1c1e24] dark:hover:text-[#e4e1da] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Sanctuary</span>
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#8a7a63] dark:text-[#8f8574]">
            Editorial Control Center
          </span>
          <ThemeToggle />
        </div>
      </header>

      <div className="my-10 space-y-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif-heading font-normal text-[#181a20] dark:text-[#f4f2ed]">
            Knowledge Base &amp; Safety Audit
          </h1>
          <p className="text-xs font-mono text-[#787d8a] dark:text-[#555a66] mt-1">
            Review knowledge chunks, verify hadith grades, and monitor crisis safety events
          </p>
        </div>

        {/* Status Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl border border-[#ded8cb] dark:border-[#262a36] bg-[#fbfaf8] dark:bg-[#12141c]">
            <div className="flex items-center justify-between text-xs text-[#787d8a] dark:text-[#8c92a2]">
              <span>Approved Chunks</span>
              <CheckCircle className="w-3.5 h-3.5 text-[#5c7a6c] dark:text-[#8cb09a]" />
            </div>
            <p className="text-2xl font-mono font-medium text-[#1c1e24] dark:text-[#f4f2ed] mt-2">6,236</p>
            <p className="text-[10px] text-[#787d8a] font-mono mt-0.5">Tanzil Uthmani Quran</p>
          </div>

          <div className="p-4 rounded-xl border border-[#ded8cb] dark:border-[#262a36] bg-[#fbfaf8] dark:bg-[#12141c]">
            <div className="flex items-center justify-between text-xs text-[#787d8a] dark:text-[#8c92a2]">
              <span>Hadith Records</span>
              <Database className="w-3.5 h-3.5 text-[#967652] dark:text-[#b8a27d]" />
            </div>
            <p className="text-2xl font-mono font-medium text-[#1c1e24] dark:text-[#f4f2ed] mt-2">1,480</p>
            <p className="text-[10px] text-[#787d8a] font-mono mt-0.5">Sahih / Hasan Verified</p>
          </div>

          <div className="p-4 rounded-xl border border-[#ded8cb] dark:border-[#262a36] bg-[#fbfaf8] dark:bg-[#12141c]">
            <div className="flex items-center justify-between text-xs text-[#787d8a] dark:text-[#8c92a2]">
              <span>Pending Review</span>
              <Clock className="w-3.5 h-3.5 text-[#76849f]" />
            </div>
            <p className="text-2xl font-mono font-medium text-[#1c1e24] dark:text-[#f4f2ed] mt-2">0</p>
            <p className="text-[10px] text-[#787d8a] font-mono mt-0.5">Queue up to date</p>
          </div>

          <div className="p-4 rounded-xl border border-[#ded8cb] dark:border-[#262a36] bg-[#fbfaf8] dark:bg-[#12141c]">
            <div className="flex items-center justify-between text-xs text-[#787d8a] dark:text-[#8c92a2]">
              <span>Safety Events</span>
              <ShieldAlert className="w-3.5 h-3.5 text-[#b03a4e] dark:text-[#bf8890]" />
            </div>
            <p className="text-2xl font-mono font-medium text-[#1c1e24] dark:text-[#f4f2ed] mt-2">100%</p>
            <p className="text-[10px] text-[#787d8a] font-mono mt-0.5">Crisis Recall Rate</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="pt-4 space-y-3">
          <h2 className="text-sm font-medium text-[#1c1e24] dark:text-[#f4f2ed]">Editorial Stations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-5 rounded-lg border border-[#ded8cb] dark:border-[#1d212b] bg-[#ffffff] dark:bg-[#11131a] space-y-2">
              <h3 className="text-sm font-medium text-[#1c1e24] dark:text-[#edeae3]">Source Ingestion Runner</h3>
              <p className="text-xs text-[#636877] dark:text-[#7d8291]">
                Execute `bun run ingest:all` to sync canonical Tanzil and HadeethEnc data with 768-dim embeddings.
              </p>
            </div>

            <div className="p-5 rounded-lg border border-[#ded8cb] dark:border-[#1d212b] bg-[#ffffff] dark:bg-[#11131a] space-y-2">
              <h3 className="text-sm font-medium text-[#1c1e24] dark:text-[#edeae3]">Evaluation Benchmark Runner</h3>
              <p className="text-xs text-[#636877] dark:text-[#7d8291]">
                Execute `bun run eval` to test crisis detection recall, citation verifier, and anti-hallucination traps.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
