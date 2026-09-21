import { useState } from 'react';
import { ChatMessage } from '@/lib/types';
import QuranCard from '../sources/QuranCard';
import HadithCard from '../sources/HadithCard';
import TafsirCard from '../sources/TafsirCard';
import StoryCard from '../sources/StoryCard';
import DuaCard from '../sources/DuaCard';
import ResponseFeedback from '../feedback/ResponseFeedback';
import { Copy, Check } from 'lucide-react';

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
      <div className="flex justify-end w-full py-2 animate-in fade-in duration-200">
        <div className="max-w-[85%] md:max-w-[70%] rounded-xl bg-[#ede9e1] dark:bg-[#1a1d26] border border-[#ded8cb] dark:border-[#2b303d] px-5 py-3.5 text-[#1c1e24] dark:text-[#edeae3] text-sm md:text-[15px] font-light leading-relaxed shadow-sm dark:shadow-none">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-3 space-y-4 animate-in fade-in duration-300">
      {/* Editorial Header Mark */}
      <div className="flex items-center justify-between pb-1 border-b border-[#e4dfd5] dark:border-[#1b1e27] transition-colors duration-200">
        <div className="flex items-center gap-2">
          <span className="font-arabic text-sm text-[#746957] dark:text-[#9c9586]">مُوَاسَاة</span>
          <span className="text-[11px] text-[#8a8f9d] dark:text-[#555a66] font-mono">•</span>
          <span className="text-[11px] font-mono text-[#656b7c] dark:text-[#6e7380] uppercase tracking-wider">
            Reflection
          </span>
        </div>

        {!isStreaming && (
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1 text-[11px] text-[#767c8a] dark:text-[#555a66] hover:text-[#1c1e24] dark:hover:text-[#b0ac9f] transition-colors"
            title="Copy reflection"
          >
            {copied ? <Check className="w-3 h-3 text-[#746957] dark:text-[#9c9586]" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        )}
      </div>

      {/* Main Prose Text */}
      {message.content && (
        <div className="text-[#1f2229] dark:text-[#e2ded5] text-sm md:text-[15px] leading-[1.85] font-light space-y-4 whitespace-pre-wrap">
          {message.content}
          {isStreaming && (
            <span className="inline-block w-1.5 h-3.5 ml-1 bg-[#7a6e5b] dark:bg-[#8f8574] animate-pulse align-middle" />
          )}
        </div>
      )}

      {/* Scripture Evidence Insets */}
      {message.sources && message.sources.length > 0 && (
        <div className="space-y-4 pt-2">
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

      {/* Discrete Feedback */}
      {!isStreaming && <ResponseFeedback messageId={message.id} />}
    </div>
  );
}
