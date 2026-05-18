import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'

interface SearchBarProps {
  defaultValue?: string
  placeholder?: string
  onSearch?: (query: string) => void
  size?: 'sm' | 'lg'
  className?: string
}

export default function SearchBar({
  defaultValue = '',
  placeholder = 'Buscar cursos...',
  onSearch,
  size = 'sm',
  className = '',
}: SearchBarProps) {
  const [query, setQuery] = useState(defaultValue)
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSearch) {
      onSearch(query)
    } else {
      navigate(`/cursos/buscar?q=${encodeURIComponent(query)}`)
    }
  }

  const sizeClasses = {
    sm: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-4 text-lg',
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex items-center gap-2 bg-white border border-[#E8E0D0] rounded-xl focus-within:border-[#2D4A3E] focus-within:ring-1 focus-within:ring-[#2D4A3E] ${className}`}
    >
      <Search className={`text-[#5C6355] ${size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'}`} />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className={`flex-1 bg-transparent outline-none text-[#1A1C14] placeholder:text-[#5C6355] ${sizeClasses[size]}`}
      />
      {size === 'lg' && (
        <button
          type="submit"
          className="px-6 py-3 bg-[#C9A84C] text-[#1A1C14] font-semibold rounded-lg hover:bg-[#B8970A] transition-colors duration-200 cursor-pointer"
        >
          Buscar
        </button>
      )}
    </form>
  )
}