import { useState } from 'react';
import { ChatMessage } from '@/lib/types';
import QuranCard from '../sources/QuranCard';
import HadithCard from '../sources/HadithCard';
import TafsirCard from '../sources/TafsirCard';
import StoryCard from '../sources/StoryCard';
import DuaCard from '../sources/DuaCard';
import ResponseFeedback from '../feedback/ResponseFeedback';
import { Sparkles, ShieldCheck, Copy, Check } from 'lucide-react';

interface MessageBubbleProps {
  message: ChatMessage;
  isStreaming?: boolean;
}

export default function MessageBubble({ message, isStreaming }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isUser) {
    return (
      <div className="flex justify-end w-full animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-slate-700/40 text-slate-100 px-6 py-4 rounded-3xl rounded-tr-md max-w-[85%] md:max-w-[75%] shadow-lg shadow-black/20 text-sm md:text-base leading-relaxed">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3 md:gap-4 w-full animate-in fade-in slide-in-from-bottom-3 duration-300">
      {/* Muwasa Brand Icon Avatar */}
      <div className="shrink-0 w-8 h-8 md:w-9 md:h-9 rounded-2xl bg-gradient-to-br from-emerald-900 to-teal-950 border border-emerald-700/40 flex items-center justify-center text-emerald-300 shadow-md shadow-emerald-950">
        <span className="font-arabic font-bold text-sm md:text-base">م</span>
      </div>

      <div className="flex-1 space-y-4 max-w-[95%]">
        {/* Main Content Bubble */}
        {message.content && (
          <div className="bg-slate-900/70 border border-slate-800/80 text-slate-200 p-6 md:p-7 rounded-3xl rounded-tl-md w-full backdrop-blur-md shadow-xl leading-relaxed text-sm md:text-base font-light space-y-4">
            <div className="whitespace-pre-wrap leading-relaxed">
              {message.content}
              {isStreaming && (
                <span className="inline-block w-2 h-4 ml-1.5 bg-emerald-400 animate-pulse align-middle rounded-full" />
              )}
            </div>

            {/* Message Action Strip */}
            {!isStreaming && (
              <div className="pt-3 border-t border-slate-800/50 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1.5 text-emerald-400/70">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Source-Verified Reflection
                </span>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 hover:text-slate-300 transition-colors p-1"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Scriptural Evidence Cards */}
        {message.sources && message.sources.length > 0 && (
          <div className="space-y-4 w-full">
            <div className="flex items-center gap-2 pt-2 px-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
                Anchored in Sacred Sources
              </span>
            </div>

            {message.sources.map((source, idx) => {
              switch (source.type) {
                case 'quran':
                  return <QuranCard key={idx} source={source.data as any} />;
                case 'hadith':
                  return <HadithCard key={idx} source={source.data as any} />;
                case 'tafsir':
                  return <TafsirCard key={idx} source={source.data as any} />;
                case 'story':
                  return <StoryCard key={idx} source={source.data as any} />;
                case 'dua':
                  return <DuaCard key={idx} source={source.data as any} />;
                default:
                  return null;
              }
            })}
          </div>
        )}

        {!isStreaming && <ResponseFeedback messageId={message.id} />}
      </div>
    </div>
  );
}
