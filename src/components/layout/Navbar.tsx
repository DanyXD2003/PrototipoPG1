import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, ChevronDown, User, LayoutDashboard, LogOut } from 'lucide-react'
import { useAuth } from '../../context/auth'
import Button from '../ui/Button'

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, isLoggedIn, logout } = useAuth()
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
    setUserMenuOpen(false)
  }

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
          {isLoggedIn && user ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 cursor-pointer hover:bg-[#F2EDE1] rounded-lg px-2 py-1 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-[#2D4A3E] flex items-center justify-center text-white text-sm font-medium">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-[#1A1C14] text-sm max-w-[100px] truncate">
                  {user.name.length > 15 ? user.name.slice(0, 15) + '...' : user.name}
                </span>
                <ChevronDown className="w-4 h-4 text-[#5C6355]" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-[#FAF7EF] border border-[#E8E0D0] rounded-xl shadow-lg overflow-hidden">
                  <Link
                    to={user.role === 'organization' ? '/org/configuracion' : '/perfil/editar'}
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-[#1A1C14] hover:bg-[#F2EDE1] cursor-pointer transition-colors"
                  >
                    <User className="w-4 h-4 text-[#5C6355]" />
                    Mi perfil
                  </Link>
                  <Link
                    to={user.role === 'student' ? '/dashboard' : '/creator/dashboard'}
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-[#1A1C14] hover:bg-[#F2EDE1] cursor-pointer transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4 text-[#5C6355]" />
                    Dashboard
                  </Link>
                  <hr className="border-[#E8E0D0]" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 w-full cursor-pointer transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Button variant="outline" size="sm" onClick={() => navigate('/login')}>
                Iniciar sesión
              </Button>
              <Button variant="primary" size="sm" onClick={() => navigate('/registro')}>
                Comenzar gratis
              </Button>
            </>
          )}
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

            {isLoggedIn && user ? (
              <div className="flex flex-col gap-2 pt-2 border-t border-[#E8E0D0]">
                <div className="flex items-center gap-3 py-2">
                  <div className="w-10 h-10 rounded-full bg-[#2D4A3E] flex items-center justify-center text-white font-medium">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-[#1A1C14] font-medium">{user.name}</span>
                </div>
                <Link
                  to={user.role === 'organization' ? '/org/configuracion' : '/perfil/editar'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 py-2 text-[#1A1C14] cursor-pointer"
                >
                  <User className="w-4 h-4 text-[#5C6355]" />
                  Mi perfil
                </Link>
                <Link
                  to={user.role === 'student' ? '/dashboard' : '/creator/dashboard'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 py-2 text-[#1A1C14] cursor-pointer"
                >
                  <LayoutDashboard className="w-4 h-4 text-[#5C6355]" />
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 py-2 text-red-600 cursor-pointer text-left"
                >
                  <LogOut className="w-4 h-4" />
                  Cerrar sesión
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 pt-2 border-t border-[#E8E0D0]">
                <Button variant="outline" size="sm" className="w-full" onClick={() => navigate('/login')}>
                  Iniciar sesión
                </Button>
                <Button variant="primary" size="sm" className="w-full" onClick={() => navigate('/registro')}>
                  Comenzar gratis
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}