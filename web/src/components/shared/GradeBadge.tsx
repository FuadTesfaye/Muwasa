interface GradeBadgeProps {
  grade: string;
}

export default function GradeBadge({ grade }: GradeBadgeProps) {
  const gradeLower = grade.toLowerCase();
  
  // Refined mineral palette for classical grades
  let colorClass = 'bg-[#181a22] text-[#9ba1b0] border-[#272b38]'; // Default

  if (gradeLower.includes('sahih') || gradeLower.includes('authentic')) {
    colorClass = 'bg-[#15201a] text-[#8cb09a] border-[#24352b]';
  } else if (gradeLower.includes('hasan') || gradeLower.includes('good')) {
    colorClass = 'bg-[#201c15] text-[#b8a27d] border-[#362e22]';
  } else if (gradeLower.includes("da'if") || gradeLower.includes('weak')) {
    colorClass = 'bg-[#23181a] text-[#bf8890] border-[#382428]';
  }

  return (
    <span className={`text-[11px] font-mono px-2 py-0.5 rounded border tracking-wider uppercase font-medium ${colorClass}`}>
      {grade}
    </span>
  );
}
