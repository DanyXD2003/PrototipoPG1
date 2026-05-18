import { Link } from 'react-router-dom'

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps {
  variant?: ButtonVariant
  size?: ButtonSize
  children: React.ReactNode
  onClick?: () => void
  href?: string
  className?: string
  type?: 'button' | 'submit'
  disabled?: boolean
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-[#C9A84C] text-[#1A1C14] hover:bg-[#B8970A] hover:-translate-y-0.5',
  secondary: 'bg-[#2D4A3E] text-white hover:bg-[#4A7C59] hover:-translate-y-0.5',
  outline: 'border-2 border-[#2D4A3E] text-[#2D4A3E] hover:bg-[#F2EDE1] hover:-translate-y-0.5',
  ghost: 'text-[#5C6355] hover:bg-[#F2EDE1] hover:text-[#1A1C14]',
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  href,
  className = '',
  type = 'button',
  disabled = false,
}: ButtonProps) {
  const baseStyles = `
    inline-flex items-center justify-center font-semibold rounded-lg
    transition-all duration-200 cursor-pointer
    ${variantStyles[variant]} ${sizeStyles[size]} ${className}
  `.trim()

  if (href) {
    return (
      <Link to={href} className={baseStyles}>
        {children}
      </Link>
    )
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={baseStyles}
    >
      {children}
    </button>
  )
}