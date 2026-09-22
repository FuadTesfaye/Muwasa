interface GradeBadgeProps {
  grade: string;
}

export default function GradeBadge({ grade }: GradeBadgeProps) {
  const gradeLower = grade.toLowerCase();
  
  // Refined mineral palette for classical grades
  let colorClass = 'bg-[#ede8df] text-[#555047] border-[#ddd7cc] dark:bg-[#181a22] dark:text-[#9ba1b0] dark:border-[#272b38]'; // Default

  if (gradeLower.includes('sahih') || gradeLower.includes('authentic')) {
    colorClass = 'bg-[#edf2ee] text-[#3d5a49] border-[#d5e0d7] dark:bg-[#15201a] dark:text-[#8cb09a] dark:border-[#24352b]';
  } else if (gradeLower.includes('hasan') || gradeLower.includes('good')) {
    colorClass = 'bg-[#f4efe4] text-[#6b5837] border-[#e2d8c3] dark:bg-[#201c15] dark:text-[#b8a27d] dark:border-[#362e22]';
  } else if (gradeLower.includes("da'if") || gradeLower.includes('weak')) {
    colorClass = 'bg-[#f7ecee] text-[#7d3b45] border-[#e8ced2] dark:bg-[#23181a] dark:text-[#bf8890] dark:border-[#382428]';
  }

  return (
    <span className={`text-[11px] font-mono px-2 py-0.5 rounded border tracking-wider uppercase font-medium ${colorClass} transition-colors duration-200`}>
      {grade}
    </span>
  );
}
