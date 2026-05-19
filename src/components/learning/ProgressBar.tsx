interface ProgressBarProps {
  progress: number
  size?: 'sm' | 'md'
  color?: string
}

export default function ProgressBar({ progress, size = 'md', color }: ProgressBarProps) {
  const height = size === 'sm' ? 'h-1.5' : 'h-2.5'
  const fillColor = color || 'bg-[#2D4A3E]'

  return (
    <div className="flex items-center gap-2">
      <div className={`flex-1 bg-[#E8E0D0] rounded-full overflow-hidden ${height}`}>
        <div
          className={`${fillColor} rounded-full transition-all duration-300`}
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
      {size === 'md' && (
        <span className="text-sm text-[#5C6355] font-medium min-w-[40px]">
          {Math.round(progress)}%
        </span>
      )}
    </div>
  )
}