import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Camera } from 'lucide-react'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import { useAuth } from '../../context/auth'

export default function EditProfilePage() {
  const navigate = useNavigate()
  const { user, logout, login: updateUser } = useAuth()

  const [name, setName] = useState('')
  const [bio, setBio] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    if (user) {
      setName(user.name)
      setBio(user.bio || '')
    }
  }, [user])

  const handleSave = () => {
    if (!user) return

    const updatedUser = { ...user, name, bio }
    updateUser(updatedUser)
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  if (!user) return null

  const roleLabels: Record<string, string> = {
    student: 'Estudiante',
    organization: 'Organización',
    instructor: 'Instructor',
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-[#1A1C14] mb-6">Mi perfil</h1>

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
          <h2 className="text-lg font-semibold text-[#1A1C14]">{user.name}</h2>
          <p className="text-[#5C6355]">{user.email}</p>
          <Badge variant="primary" className="mt-2">
            {roleLabels[user.role] || user.role}
          </Badge>
        </div>
      </div>

      <div className="space-y-4">
        <Input
          id="edit-name"
          label="Nombre completo"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <div>
          <label htmlFor="edit-email" className="block text-sm font-medium text-[#1A1C14] mb-2">
            Correo electrónico
          </label>
          <input
            id="edit-email"
            type="email"
            value={user.email}
            disabled
            className="w-full px-4 py-3 rounded-lg border border-[#E8E0D0] bg-[#F2EDE1] text-[#5C6355] cursor-not-allowed"
          />
        </div>

        <div>
          <label htmlFor="edit-bio" className="block text-sm font-medium text-[#1A1C14] mb-2">
            Bio
          </label>
          <textarea
            id="edit-bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Cuéntanos sobre ti..."
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
        <h3 className="text-sm font-medium text-red-600 mb-4">Zona de peligro</h3>
        <Button variant="outline" onClick={handleLogout} className="text-red-600 border-red-300 hover:bg-red-50">
          Cerrar sesión
        </Button>
      </div>
    </div>
  )
}