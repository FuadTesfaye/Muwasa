'use client';

import { useEffect, useRef } from 'react';
import { ChatMessage } from '@/lib/types';
import MessageBubble from './MessageBubble';
import InputArea from './InputArea';
import TypingIndicator from './TypingIndicator';
import { Sparkles, HeartHandshake } from 'lucide-react';

interface ChatContainerProps {
  messages: ChatMessage[];
  onSendMessage: (msg: string) => void;
  isStreaming: boolean;
}

const STARTER_PROMPTS = [
  'I feel so overwhelmed by my responsibilities and lack of sleep.',
  'I feel guilty about past mistakes and feeling far from Allah.',
  'My parents have expectations that are suffocating me.',
  'I am grieving the loss of someone dear and my heart is aching.',
];

export default function ChatContainer({ messages, onSendMessage, isStreaming }: ChatContainerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isStreaming]);

  return (
    <div className="flex-1 flex flex-col min-h-0 relative">
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 md:p-8 pb-36 scroll-smooth"
      >
        <div className="max-w-3xl mx-auto space-y-8">
          {messages.length === 0 ? (
            <div className="text-center my-12 md:my-16 space-y-6 animate-in fade-in zoom-in-95 duration-500">
              <div className="w-14 h-14 mx-auto rounded-3xl bg-gradient-to-br from-emerald-900/60 via-slate-900 to-slate-950 border border-emerald-700/30 flex items-center justify-center shadow-xl shadow-emerald-950/40">
                <HeartHandshake className="w-7 h-7 text-emerald-300" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl md:text-3xl font-arabic text-emerald-200 dir-rtl">
                  السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ
                </h2>
                <p className="text-base md:text-lg font-light text-slate-300 max-w-lg mx-auto leading-relaxed">
                  Take a breath. You are in a safe, private space. You do not need to be strong or pretend here.
                </p>
              </div>

              <div className="pt-4 max-w-xl mx-auto">
                <span className="text-xs uppercase tracking-wider text-slate-500 font-medium flex items-center justify-center gap-1.5 mb-3">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Or choose a place to begin
                </span>

                <div className="flex flex-wrap gap-2 justify-center">
                  {STARTER_PROMPTS.map((prompt, i) => (
                    <button
                      key={i}
                      onClick={() => onSendMessage(prompt)}
                      className="px-4 py-2.5 rounded-2xl bg-slate-900/70 border border-slate-800/80 hover:border-emerald-700/50 hover:bg-slate-800/60 text-slate-300 hover:text-emerald-200 text-xs transition-all text-left shadow-sm"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            messages.map((msg, i) => (
              <MessageBubble
                key={msg.id || i}
                message={msg}
                isStreaming={isStreaming && i === messages.length - 1 && msg.role === 'assistant'}
              />
            ))
          )}

          {isStreaming && messages.length > 0 && messages[messages.length - 1].role === 'user' && (
            <TypingIndicator />
          )}
        </div>
      </div>

      {/* Floating Sanctuary Input Area with subtle gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-[#070b14] via-[#070b14]/95 to-transparent pt-12 pointer-events-auto">
        <div className="max-w-3xl mx-auto">
          <InputArea onSend={onSendMessage} disabled={isStreaming} />
        </div>
      </div>
    </div>
  );
}
