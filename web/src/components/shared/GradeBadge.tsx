interface GradeBadgeProps {
  grade: string;
}

export default function GradeBadge({ grade }: GradeBadgeProps) {
  const gradeLower = grade.toLowerCase();
  let colorClass = 'bg-slate-900/40 text-slate-300'; // Default

  if (gradeLower.includes('sahih') || gradeLower.includes('authentic')) {
    colorClass = 'bg-emerald-900/40 text-emerald-300';
  } else if (gradeLower.includes('hasan') || gradeLower.includes('good')) {
    colorClass = 'bg-amber-900/40 text-amber-300';
  } else if (gradeLower.includes("da'if") || gradeLower.includes('weak')) {
    colorClass = 'bg-rose-900/40 text-rose-300';
  }

  return (
    <span className={`text-xs px-2 py-1 rounded-md font-medium ${colorClass}`}>
      {grade}
    </span>
  );
}
