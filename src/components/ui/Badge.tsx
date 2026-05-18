type BadgeVariant = 'level' | 'category' | 'price' | 'featured' | 'primary'

interface BadgeProps {
  label?: string
  variant: BadgeVariant
  children?: React.ReactNode
  className?: string
}

const variantStyles: Record<BadgeVariant, string> = {
  level: 'bg-[#E8F5E9] text-[#2E7D32]',
  category: 'bg-[#F2EDE1] text-[#5C6355]',
  price: 'bg-[#E8F5E9] text-[#2E7D32]',
  featured: 'bg-[#C9A84C] text-[#1A1C14]',
  primary: 'bg-[#2D4A3E] text-white',
}

const levelColors: Record<string, string> = {
  Principiante: 'bg-[#E8F5E9] text-[#2E7D32]',
  Intermedio: 'bg-[#FFF8E1] text-[#F57F17]',
  Avanzado: 'bg-[#FFEBEE] text-[#C62828]',
}

export default function Badge({ label, variant, children, className = '' }: BadgeProps) {
  const isLevel = variant === 'level'
  const content = children || label
  const baseStyles = 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium'

  return (
    <span
      className={`${baseStyles} ${className} ${
        isLevel && content && levelColors[content as string] ? levelColors[content as string] : variantStyles[variant]
      }`}
    >
      {content}
    </span>
  )
}