import type { CompletedCourseCredential } from '../../types'
import GradeBadge from '../learning/GradeBadge'

interface CredentialBadgeProps {
  credential: CompletedCourseCredential
  size?: 'sm' | 'md'
}

const monthNames = [
  'ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'
]

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const month = monthNames[date.getMonth()]
  const year = date.getFullYear()
  return `${month} ${year}`
}

export default function CredentialBadge({ credential, size = 'md' }: CredentialBadgeProps) {
  const isSm = size === 'sm'
  
  return (
    <div className={`bg-[#F2EDE1] border border-[#E8E0D0] rounded-xl ${isSm ? 'p-3' : 'p-4'}`}>
      <div className="flex items-center gap-2 mb-1">
        <GradeBadge grade={credential.grade} />
      </div>
      <div className={`font-medium text-[#1A1C14] ${isSm ? 'text-sm' : ''}`}>
        {credential.courseTitle}
      </div>
      <div className={`text-[#5C6355] ${isSm ? 'text-xs' : 'text-sm'}`}>
        {credential.orgName} · {formatDate(credential.completedAt)}
      </div>
    </div>
  )
}