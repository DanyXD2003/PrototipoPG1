import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import { useAuth } from '../../context/auth'
import type { CourseCategory } from '../../types'

const CATEGORIES: CourseCategory[] = [
  'Tecnología',
  'Negocios',
  'Diseño',
  'Marketing',
  'Finanzas',
  'Salud',
  'Educación',
  'Desarrollo Personal',
]

export default function RegisterInstructorPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [name, setName] = useState('')
  const [title, setTitle] = useState('')
  const [selectedExpertise, setSelectedExpertise] = useState<CourseCategory[]>([])
  const [bio, setBio] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!name.trim()) {
      newErrors.name = 'El nombre es requerido'
    }
    if (!title.trim()) {
      newErrors.title = 'El título profesional es requerido'
    }
    if (selectedExpertise.length === 0) {
      newErrors.expertise = 'Selecciona al menos un área de expertise'
    }
    if (!email.trim()) {
      newErrors.email = 'El correo es requerido'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Ingresa un correo válido'
    }
    if (!password || password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres'
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return

    const newUser = {
      id: 'inst-new-' + Date.now(),
      name,
      email,
      role: 'instructor' as const,
      instructorSlug: name.toLowerCase().replace(/\s+/g, '-'),
      bio,
    }
    login(newUser)
    navigate('/creator/dashboard')
  }

  const toggleExpertise = (category: CourseCategory) => {
    setSelectedExpertise((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-[#1A1C14] text-center">Comienza a enseñar en Nexora</h2>

      <div className="mt-6 space-y-4">
        <Input
          id="register-inst-name"
          label="Nombre completo"
          placeholder="Carlos Mendoza"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
          required
        />

        <Input
          id="register-inst-title"
          label="Título profesional"
          placeholder="ej: Especialista en Data Science"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={errors.title}
          required
        />

        <div>
          <label className="block text-sm font-medium text-[#1A1C14] mb-2">
            Áreas de expertise <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {selectedExpertise.map((category) => (
              <span
                key={category}
                className="inline-flex items-center gap-1 px-3 py-1 bg-[#2D4A3E] text-white rounded-full text-sm"
              >
                {category}
                <button
                  onClick={() => toggleExpertise(category)}
                  className="hover:text-[#C9A84C] cursor-pointer"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => toggleExpertise(category)}
                disabled={selectedExpertise.includes(category)}
                className={`px-3 py-1 rounded-full text-sm transition-colors cursor-pointer ${
                  selectedExpertise.includes(category)
                    ? 'bg-[#2D4A3E] text-white'
                    : 'bg-white border border-[#E8E0D0] text-[#1A1C14] hover:border-[#2D4A3E]'
                }`}
              >
                + {category}
              </button>
            ))}
          </div>
          {errors.expertise && <p className="mt-1 text-sm text-red-500">{errors.expertise}</p>}
        </div>

        <div>
          <label htmlFor="register-inst-bio" className="block text-sm font-medium text-[#1A1C14] mb-2">
            Bio corta
          </label>
          <textarea
            id="register-inst-bio"
            value={bio}
            onChange={(e) => setBio(e.target.value.slice(0, 200))}
            placeholder="Cuéntanos sobre ti y tu experiencia..."
            rows={3}
            className="w-full px-4 py-3 rounded-lg border border-[#E8E0D0] focus:border-[#2D4A3E] focus:ring-1 focus:ring-[#2D4A3E] transition-colors duration-200 bg-white placeholder-[#5C6355]/50 resize-none"
          />
          <p className="text-sm text-[#5C6355] mt-1">{bio.length}/200 caracteres</p>
        </div>

        <Input
          id="register-inst-email"
          label="Correo electrónico"
          type="email"
          placeholder="tu@correo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          required
        />

        <Input
          id="register-inst-password"
          label="Contraseña"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          required
          showToggle
        />

        <Input
          id="register-inst-confirm-password"
          label="Confirmar contraseña"
          type="password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={errors.confirmPassword}
          required
          showToggle
        />
      </div>

      <Button variant="primary" className="w-full mt-6" onClick={handleSubmit}>
        Crear perfil de instructor
      </Button>

      <p className="mt-6 text-center text-[#5C6355]">
        ¿Ya tienes cuenta?{' '}
        <button
          onClick={() => navigate('/login')}
          className="text-[#2D4A3E] font-medium hover:underline cursor-pointer"
        >
          Iniciar sesión
        </button>
      </p>
    </div>
  )
}