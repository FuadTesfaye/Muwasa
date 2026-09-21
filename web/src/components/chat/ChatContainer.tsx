'use client';

import { useEffect, useRef } from 'react';
import { ChatMessage } from '@/lib/types';
import MessageBubble from './MessageBubble';
import InputArea from './InputArea';
import TypingIndicator from './TypingIndicator';

interface ChatContainerProps {
  messages: ChatMessage[];
  onSendMessage: (msg: string) => void;
  isStreaming: boolean;
}

const GENTLE_PROMPTS = [
  'I am carrying a sadness I cannot easily explain.',
  'I feel guilty about recurring sins and weak in my prayer.',
  'The expectations around me are feeling suffocating.',
  'I am hurting from a loss and struggling with acceptance.',
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
        className="flex-1 overflow-y-auto px-4 md:px-8 py-8 pb-36 scroll-smooth"
      >
        <div className="max-w-2xl mx-auto space-y-8">
          {messages.length === 0 ? (
            <div className="my-16 md:my-24 space-y-6 text-center animate-in fade-in duration-300">
              <div className="space-y-3">
                <p className="font-arabic text-2xl md:text-3xl text-[#b8b3a7] dir-rtl">
                  السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ
                </p>
                <p className="text-sm md:text-base font-light text-[#9499a8] max-w-md mx-auto leading-relaxed">
                  Take an unhurried breath. This is a private place where you do not have to perform or hide what hurts.
                </p>
              </div>

              <div className="pt-6 max-w-md mx-auto space-y-2">
                <span className="text-[11px] font-mono tracking-wider text-[#555a66] uppercase">
                  Or begin with a quiet thought
                </span>
                <div className="flex flex-col gap-2 pt-1">
                  {GENTLE_PROMPTS.map((p, i) => (
                    <button
                      key={i}
                      onClick={() => onSendMessage(p)}
                      className="text-left px-4 py-2.5 rounded-lg border border-[#1d212b] bg-[#12141a] hover:bg-[#161922] hover:border-[#2b303d] text-xs text-[#8c91a0] hover:text-[#d4d1c9] transition-all"
                    >
                      &ldquo;{p}&rdquo;
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

      {/* Floating Bottom Input Slate */}
      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-[#0e1015] via-[#0e1015]/95 to-transparent pt-10 pointer-events-auto">
        <div className="max-w-2xl mx-auto">
          <InputArea onSend={onSendMessage} disabled={isStreaming} />
        </div>
      </div>
    </div>
  );
}
