import { Phone, ExternalLink } from 'lucide-react';

export default function CrisisBanner() {
  return (
    <aside className="w-full bg-[#faf2f3] dark:bg-[#161214] border-b border-[#f2d4d8] dark:border-[#3b2327] text-[#3d2126] dark:text-[#d4cbd0] px-6 py-3.5 z-40 text-xs transition-colors duration-200">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="text-center md:text-left space-y-0.5">
          <p className="font-medium text-[#6b1e2b] dark:text-[#f0e2e7]">
            Your life has immense value in the sight of Allah. Please do not carry this alone.
          </p>
          <p className="text-[11px] text-[#82444e] dark:text-[#9c8990]">
            Struggling right now does NOT make you a bad Muslim. Confidential human support is available 24/7.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 text-xs">
          <a
            href="tel:988"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#fae6e9] hover:bg-[#f5d6da] border border-[#efbec5] text-[#8e2233] dark:bg-[#2d1b20] dark:hover:bg-[#3d242b] dark:border-[#522c34] dark:text-[#f2cad2] font-mono transition-colors"
          >
            <Phone className="w-3 h-3 text-[#b03a4e] dark:text-[#d97c8d]" />
            <span>988 (Call/Text)</span>
          </a>
          <a
            href="tel:18666273342"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#f0edf5] hover:bg-[#e7e2ef] border border-[#d8d0e5] text-[#3e3452] dark:bg-[#1d212b] dark:hover:bg-[#252b38] dark:border-[#303646] dark:text-[#cad0e0] font-mono transition-colors"
          >
            <span>Naseeha Helpline</span>
          </a>
          <a
            href="https://findahelpline.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] text-[#7a6468] dark:text-[#857b80] hover:text-[#1c1e24] dark:hover:text-[#e4e1da] transition-colors p-1"
            title="International helplines"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </aside>
  );
}
