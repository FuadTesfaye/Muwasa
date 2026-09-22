import { useState } from 'react';
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
      <div className="text-[11px] text-[#5e695f] dark:text-[#717684] pt-1 font-light animate-in fade-in duration-200">
        جَزَاكَ اللَّهُ خَيْرًا • May Allah grant you tranquility and ease.
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 pt-1 text-[11px] text-[#787d8c] dark:text-[#555a66]">
      <span>Did this reflection bring peace or perspective?</span>
      <div className="flex items-center gap-2">
        <button
          onClick={() => handleFeedback(true)}
          className="hover:text-[#1c1e24] dark:hover:text-[#c4c0b5] transition-colors"
        >
          Yes
        </button>
        <span>•</span>
        <button
          onClick={() => handleFeedback(false)}
          className="hover:text-[#1c1e24] dark:hover:text-[#c4c0b5] transition-colors"
        >
          Not quite
        </button>
      </div>
    </div>
  );
}
