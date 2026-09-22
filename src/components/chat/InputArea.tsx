import React, { useRef, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

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
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
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
        className="relative flex items-end rounded-xl border border-[#ded7cb] dark:border-[#262934] bg-[#ffffff] dark:bg-[#12141b] transition-all duration-200 focus-within:border-[#8f8574] dark:focus-within:border-[#3e4455] p-2 shadow-sm dark:shadow-none"
      >
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Speak what is on your heart..."
          disabled={disabled}
          className="w-full bg-transparent px-3 py-2.5 text-sm md:text-base text-[#1c1e24] dark:text-[#edeae3] placeholder-[#9a958b] dark:placeholder-[#4f535f] resize-none max-h-[180px] focus:outline-none font-light leading-relaxed"
          rows={1}
        />
        <button
          type="submit"
          disabled={disabled || !input.trim()}
          title="Send reflection"
          className="shrink-0 p-2.5 rounded-lg bg-[#1c1f26] hover:bg-[#2e3340] text-[#ffffff] dark:bg-[#222632] dark:hover:bg-[#2d3242] dark:text-[#d4d1c9] disabled:opacity-20 disabled:cursor-not-allowed transition-colors border border-[#2b303d] dark:border-[#2f3444]"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      </form>

      <div className="flex items-center justify-between px-2 text-[11px] text-[#787d8a] dark:text-[#555a66] font-mono">
        <span>Enter ↵ to speak • Shift+Enter for new line</span>
        <span className="hidden sm:inline">Unrecorded Session</span>
      </div>
    </div>
  );
}
