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
        className="relative flex items-end rounded-xl border border-[#262934] bg-[#12141b] transition-all duration-200 focus-within:border-[#3e4455] p-2"
      >
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Speak what is on your heart..."
          disabled={disabled}
          className="w-full bg-transparent px-3 py-2.5 text-sm md:text-base text-[#edeae3] placeholder-[#4f535f] resize-none max-h-[180px] focus:outline-none font-light leading-relaxed"
          rows={1}
        />
        <button
          type="submit"
          disabled={disabled || !input.trim()}
          title="Send reflection"
          className="shrink-0 p-2.5 rounded-lg bg-[#222632] hover:bg-[#2d3242] text-[#d4d1c9] disabled:opacity-20 disabled:cursor-not-allowed transition-colors border border-[#2f3444]"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      </form>

      <div className="flex items-center justify-between px-2 text-[11px] text-[#555a66] font-mono">
        <span>Enter ↵ to speak • Shift+Enter for new line</span>
        <span className="hidden sm:inline">Unrecorded Session</span>
      </div>
    </div>
  );
}
