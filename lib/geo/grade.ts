export type Grade = 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'Critical';

export function scoreToGrade(score: number): Grade {
  if (score >= 90) return 'Excellent';
  if (score >= 75) return 'Good';
  if (score >= 60) return 'Fair';
  if (score >= 40) return 'Poor';
  return 'Critical';
}

export function gradeColor(grade: Grade): string {
  const colors: Record<Grade, string> = {
    Excellent: '#22c55e',
    Good: '#3b82f6',
    Fair: '#f59e0b',
    Poor: '#f97316',
    Critical: '#ef4444',
  };
  return colors[grade];
}

export function gradeToTailwind(grade: Grade): string {
  const classes: Record<Grade, string> = {
    Excellent: 'text-green-500',
    Good: 'text-blue-500',
    Fair: 'text-amber-500',
    Poor: 'text-orange-500',
    Critical: 'text-red-500',
  };
  return classes[grade];
}

export function gradeToBgTailwind(grade: Grade): string {
  const classes: Record<Grade, string> = {
    Excellent: 'bg-green-500/10 border-green-500/20',
    Good: 'bg-blue-500/10 border-blue-500/20',
    Fair: 'bg-amber-500/10 border-amber-500/20',
    Poor: 'bg-orange-500/10 border-orange-500/20',
    Critical: 'bg-red-500/10 border-red-500/20',
  };
  return classes[grade];
}
