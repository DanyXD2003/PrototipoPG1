import { Link } from 'react-router-dom'
import { FileSearch } from 'lucide-react'
import Button from '../../components/ui/Button'

export default function NotFoundPage() {
  return (
    <div className="bg-[#FAF7EF] min-h-[80vh] flex items-center justify-center px-6">
      <div className="text-center">
        <div className="relative mb-8">
          <span className="text-[12rem] md:text-[16rem] font-bold text-[#E8E0D0] leading-none select-none">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <FileSearch className="w-16 h-16 text-[#C9A84C]" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-[#1A1C14] mb-4">Página no encontrada</h1>
        <p className="text-[#5C6355] mb-8 max-w-md mx-auto">
          La página que buscas no existe o fue movida.
        </p>

        <Link to="/">
          <Button variant="primary">Volver al inicio</Button>
        </Link>
      </div>
    </div>
  )
}