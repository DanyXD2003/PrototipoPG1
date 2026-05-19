import type { LucideIcon } from 'lucide-react'
import Button from './Button'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  actionHref?: string
  size?: 'sm' | 'md' | 'lg'
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  actionHref,
  size = 'md',
}: EmptyStateProps) {
  const sizeStyles = {
    sm: {
      icon: 'w-9 h-9',
      py: 'py-8',
      title: 'text-base',
      description: 'text-sm',
    },
    md: {
      icon: 'w-12 h-12',
      py: 'py-12',
      title: 'text-lg',
      description: 'text-sm',
    },
    lg: {
      icon: 'w-16 h-16',
      py: 'py-16',
      title: 'text-xl',
      description: 'text-base',
    },
  }

  const styles = sizeStyles[size]

  return (
    <div className={`text-center ${styles.py} px-4`}>
      <Icon className={`${styles.icon} text-[#E8E0D0] mx-auto mb-4`} />
      <h3 className={`${styles.title} font-semibold text-[#1A1C14] mb-2`}>
        {title}
      </h3>
      {description && (
        <p className={`${styles.description} text-[#5C6355] max-w-sm mx-auto mt-2`}>
          {description}
        </p>
      )}
      {(actionLabel && (onAction || actionHref)) && (
        <div className="mt-6">
          <Button
            variant="primary"
            onClick={onAction}
            href={actionHref}
          >
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  )
}