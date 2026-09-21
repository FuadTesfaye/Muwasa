import React, { useRef, useEffect } from 'react';
import { Send, Sparkles } from 'lucide-react';

interface InputAreaProps {
  onSend: (msg: string) => void;
  disabled: boolean;
}

export default function InputArea({ onSend, disabled }: InputAreaProps) {
  const [input, setInput] = React.useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !disabled) {
        onSend(input.trim());
        setInput('');
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput('');
    }
  };

  return (
    <div className="w-full space-y-2">
      <form
        onSubmit={handleSubmit}
        className="relative flex items-end gap-2 bg-slate-900/80 backdrop-blur-xl border border-emerald-900/40 rounded-3xl p-2.5 shadow-2xl transition-all focus-within:border-emerald-500/60 focus-within:ring-2 focus-within:ring-emerald-500/20"
      >
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Speak what is on your heart... I am listening."
          disabled={disabled}
          className="w-full bg-transparent text-slate-100 placeholder:text-slate-500 resize-none max-h-[200px] py-3 px-4 focus:outline-none text-sm md:text-base leading-relaxed font-light"
          rows={1}
        />
        <button
          type="submit"
          disabled={disabled || !input.trim()}
          title="Send message"
          className="shrink-0 p-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-500 hover:to-teal-500 disabled:opacity-20 disabled:cursor-not-allowed transition-all shadow-md shadow-emerald-950/50"
        >
          {disabled ? (
            <Sparkles className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </form>

      <div className="flex items-center justify-between px-4 text-[11px] text-slate-500 font-light">
        <span>Enter to speak • Shift + Enter for new line</span>
        <span className="hidden md:inline">Private & Ephemeral Session</span>
      </div>
    </div>
  );
}
