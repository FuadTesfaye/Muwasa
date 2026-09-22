interface ArabicTextProps {
  text: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export default function ArabicText({ text, size = 'md', className = '' }: ArabicTextProps) {
  const sizeClasses = {
    sm: 'text-xl leading-[2]',
    md: 'text-2xl leading-[2.2]',
    lg: 'text-3xl leading-[2.5]',
    xl: 'text-4xl leading-[3]',
  };

  return (
    <p 
      className={`font-arabic text-right dir-rtl ${sizeClasses[size]} ${className}`} 
      dir="rtl"
    >
      {text}
    </p>
  );
}
