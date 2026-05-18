import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import Button from '../ui/Button'

export default function Navbar() {
  const location = useLocation()
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { to: '/cursos', label: 'Explorar cursos' },
    { to: '/org', label: 'Organizaciones' },
    { to: '/instructores', label: 'Instructores' },
  ]

  return (
    <nav
      className={`fixed top-4 left-4 right-4 z-50 rounded-2xl border transition-all duration-200 ${
        isScrolled
          ? 'bg-[#FAF7EF]/95 shadow-sm border-[#E8E0D0]'
          : 'bg-[#FAF7EF]/85 backdrop-blur-md border-[#E8E0D0]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-0 cursor-pointer">
          <span className="font-bold text-xl text-[#2D4A3E]">Nexora</span>
          <span className="text-[#C9A84C]">.</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-[#5C6355] hover:text-[#2D4A3E] transition-colors duration-200 cursor-pointer ${
                location.pathname === link.to ? 'text-[#2D4A3E] font-medium' : ''
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Button variant="outline" size="sm">
            Iniciar sesión
          </Button>
          <Button variant="primary" size="sm">
            Comenzar gratis
          </Button>
        </div>

        <button
          className="md:hidden p-2 cursor-pointer"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6 text-[#2D4A3E]" />
          ) : (
            <Menu className="w-6 h-6 text-[#2D4A3E]" />
          )}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E8E0D0] px-6 py-4 bg-[#FAF7EF] rounded-b-2xl">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-[#5C6355] hover:text-[#2D4A3E] transition-colors cursor-pointer ${
                  location.pathname === link.to ? 'text-[#2D4A3E] font-medium' : ''
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-2 pt-2 border-t border-[#E8E0D0]">
              <Button variant="outline" size="sm" className="w-full">
                Iniciar sesión
              </Button>
              <Button variant="primary" size="sm" className="w-full">
                Comenzar gratis
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}