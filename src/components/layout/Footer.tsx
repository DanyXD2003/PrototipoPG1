import { Link } from 'react-router-dom'
import { Globe, Mail } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[#2D4A3E] py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-0 cursor-pointer">
              <span className="font-bold text-xl text-white">Nexora</span>
              <span className="text-[#C9A84C]">.</span>
            </Link>
            <p className="text-white/70 text-sm leading-relaxed">
              La plataforma de aprendizaje que conecta tu desarrollo profesional con oportunidades laborales reales.
            </p>
            <div className="flex gap-3 pt-2">
              <a
                href="#"
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200 cursor-pointer"
              >
                <Globe className="w-5 h-5 text-white" />
              </a>
              <a
                href="#"
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200 cursor-pointer"
              >
                <Mail className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Plataforma</h4>
            <ul className="space-y-3">
              <li>
                <a href="/cursos" className="text-white/70 hover:text-white transition-colors duration-200 cursor-pointer text-sm">
                  Explorar cursos
                </a>
              </li>
              <li>
                <a href="/org" className="text-white/70 hover:text-white transition-colors duration-200 cursor-pointer text-sm">
                  Para organizaciones
                </a>
              </li>
              <li>
                <a href="/instructores" className="text-white/70 hover:text-white transition-colors duration-200 cursor-pointer text-sm">
                  Para instructores
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-white transition-colors duration-200 cursor-pointer text-sm">
                  Precios
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Recursos</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-white/70 hover:text-white transition-colors duration-200 cursor-pointer text-sm">
                  Centro de ayuda
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-white transition-colors duration-200 cursor-pointer text-sm">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-white transition-colors duration-200 cursor-pointer text-sm">
                  Documentación
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-white transition-colors duration-200 cursor-pointer text-sm">
                  API
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Empresa</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-white/70 hover:text-white transition-colors duration-200 cursor-pointer text-sm">
                  Sobre nosotros
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-white transition-colors duration-200 cursor-pointer text-sm">
                  Trabaja con nosotros
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-white transition-colors duration-200 cursor-pointer text-sm">
                  Privacidad
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-white transition-colors duration-200 cursor-pointer text-sm">
                  Términos
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/50 text-sm">
            © {currentYear} Nexora. Todos los derechos reservados.
          </p>
          <button className="text-white/50 text-sm hover:text-white transition-colors cursor-pointer">
            Español (Latinoamérica) ▼
          </button>
        </div>
      </div>
    </footer>
  )
}