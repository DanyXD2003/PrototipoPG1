import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

interface InputProps {
  label: string
  type?: string
  placeholder?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  error?: string
  required?: boolean
  hint?: string
  id: string
  showToggle?: boolean
  textarea?: boolean
  rows?: number
}

export default function Input({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  required,
  hint,
  id,
  showToggle,
  textarea,
  rows = 3,
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false)
  const inputType = showToggle && type === 'password' ? (showPassword ? 'text' : 'password') : type

  const inputClasses = `w-full px-4 py-3 rounded-lg border transition-colors duration-200 bg-white placeholder-[#5C6355]/50 focus:outline-none ${
    error
      ? 'border-red-400 ring-1 ring-red-400'
      : 'border-[#E8E0D0] focus:border-[#2D4A3E] focus:ring-1 focus:ring-[#2D4A3E]'
  }`

  return (
    <div className="w-full">
      <label htmlFor={id} className="block text-sm font-medium text-[#1A1C14] mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {textarea ? (
        <textarea
          id={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={rows}
          className={inputClasses}
        />
      ) : (
        <div className="relative">
          <input
            id={id}
            type={inputType}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`${inputClasses} ${showToggle ? 'pr-12' : ''}`}
          />
          {showToggle && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#5C6355] hover:text-[#2D4A3E] cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          )}
        </div>
      )}

      {hint && !error && <p className="mt-1 text-sm text-[#5C6355]">{hint}</p>}

      {error && (
        <p role="alert" className="mt-1 text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  )
}