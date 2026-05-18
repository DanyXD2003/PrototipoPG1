import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Camera, BadgeCheck } from 'lucide-react'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import { useAuth } from '../../context/auth'

const INDUSTRIES = [
  'Tecnología',
  'Finanzas',
  'Salud',
  'Educación Superior',
  'Emprendimiento',
  'Manufactura',
  'Retail',
  'Servicios',
  'Otro',
]

export default function EditOrgPage() {
  const navigate = useNavigate()
  const { user, logout, login: updateUser } = useAuth()

  const [name, setName] = useState('')
  const [industry, setIndustry] = useState('')
  const [website, setWebsite] = useState('')
  const [description, setDescription] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    if (user?.role !== 'organization') {
      navigate('/', { replace: true })
      return
    }

    if (user) {
      setName(user.name)
      setDescription(user.bio || '')
    }
  }, [user, navigate])

  const handleSave = () => {
    if (!user) return

    const updatedUser = {
      ...user,
      name,
      bio: description,
    }
    updateUser(updatedUser)
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  if (!user || user.role !== 'organization') return null

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-[#1A1C14] mb-6">Configuración de organización</h1>

      <div className="flex items-center gap-6 mb-8">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-[#2D4A3E] flex items-center justify-center text-white text-2xl font-medium">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 hover:opacity-100 transition-opacity cursor-pointer group">
            <Camera className="w-6 h-6 text-white" />
          </div>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-[#1A1C14] flex items-center gap-2">
            {user.name}
            <BadgeCheck className="w-5 h-5 text-[#C9A84C]" />
          </h2>
          <Badge variant="primary" className="mt-2">
            Organización verificada
          </Badge>
        </div>
      </div>

      <div className="space-y-4">
        <Input
          id="edit-org-name"
          label="Nombre de la organización"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <div>
          <label htmlFor="edit-industry" className="block text-sm font-medium text-[#1A1C14] mb-2">
            Industria <span className="text-red-500">*</span>
          </label>
          <select
            id="edit-industry"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-[#E8E0D0] focus:border-[#2D4A3E] focus:ring-1 focus:ring-[#2D4A3E] transition-colors duration-200 bg-white"
          >
            <option value="">Selecciona una industria</option>
            {INDUSTRIES.map((ind) => (
              <option key={ind} value={ind}>
                {ind}
              </option>
            ))}
          </select>
        </div>

        <Input
          id="edit-website"
          label="Sitio web"
          type="url"
          placeholder="https://tuempresa.com"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />

        <div>
          <label htmlFor="edit-description" className="block text-sm font-medium text-[#1A1C14] mb-2">
            Descripción
          </label>
          <textarea
            id="edit-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Cuéntanos sobre tu organización..."
            rows={4}
            className="w-full px-4 py-3 rounded-lg border border-[#E8E0D0] focus:border-[#2D4A3E] focus:ring-1 focus:ring-[#2D4A3E] transition-colors duration-200 bg-white placeholder-[#5C6355]/50 resize-none"
          />
        </div>
      </div>

      {showSuccess && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg">
          ✓ Cambios guardados
        </div>
      )}

      <Button variant="primary" className="mt-6" onClick={handleSave}>
        Guardar cambios
      </Button>

      <div className="mt-12 pt-6 border-t border-[#E8E0D0]">
        <Button variant="outline" onClick={handleLogout} className="text-red-600 border-red-300 hover:bg-red-50">
          Cerrar sesión
        </Button>
      </div>
    </div>
  )
}