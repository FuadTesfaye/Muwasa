import { useState } from 'react';
import { ThumbsUp, ThumbsDown, Heart } from 'lucide-react';
import { submitFeedback } from '@/lib/api';

export default function ResponseFeedback({ messageId }: { messageId: string }) {
  const [submitted, setSubmitted] = useState(false);

  const handleFeedback = async (isHelpful: boolean) => {
    try {
      await submitFeedback({
        messageId,
        responseHelpful: isHelpful,
      });
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-emerald-400/80 mt-2 px-1 animate-in fade-in duration-300">
        <Heart className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400/20" />
        <span>جَزَاكَ اللَّهُ خَيْرًا • May Allah grant you tranquility and ease.</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 mt-2 px-1 text-[11px] text-slate-500">
      <span>Did this bring comfort or clarity?</span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => handleFeedback(true)}
          className="flex items-center gap-1 px-2 py-1 text-slate-400 hover:text-emerald-300 hover:bg-emerald-950/40 rounded-lg transition-colors"
          title="This reflection was comforting"
        >
          <ThumbsUp className="w-3 h-3" />
          <span>Comforting</span>
        </button>
        <button
          onClick={() => handleFeedback(false)}
          className="flex items-center gap-1 px-2 py-1 text-slate-400 hover:text-rose-300 hover:bg-rose-950/30 rounded-lg transition-colors"
          title="Not quite what I needed"
        >
          <ThumbsDown className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
