interface GradeBadgeProps {
  grade: number
  passingGrade?: number
}

export default function GradeBadge({ grade, passingGrade = 70 }: GradeBadgeProps) {
  const isPassing = grade >= passingGrade

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-sm font-medium ${
        isPassing
          ? 'bg-green-50 text-green-700'
          : 'bg-red-50 text-red-700'
      }`}
    >
      <span>{grade}</span>
      <span className="opacity-70">·</span>
      <span>{isPassing ? 'Aprobado' : 'Reprobado'}</span>
    </span>
  )
}