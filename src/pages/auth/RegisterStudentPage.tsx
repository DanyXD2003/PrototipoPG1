import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import StepIndicator from '../../components/ui/StepIndicator'
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

export default function RegisterStudentPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [step, setStep] = useState(1)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [selectedInterests, setSelectedInterests] = useState<CourseCategory[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {}
    if (!name.trim() || name.length < 2) {
      newErrors.name = 'El nombre es requerido (mínimo 2 caracteres)'
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

  const handleContinue = () => {
    if (validateStep1()) {
      setStep(2)
    }
  }

  const handleSubmit = () => {
    const newUser = {
      id: 'user-new-' + Date.now(),
      name,
      email,
      role: 'student' as const,
      bio: '',
    }
    login(newUser)
    navigate('/')
  }

  const toggleInterest = (category: CourseCategory) => {
    setSelectedInterests((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    )
  }

  return (
    <div>
      <StepIndicator totalSteps={2} currentStep={step} />

      {step === 1 && (
        <>
          <h2 className="text-2xl font-bold text-[#1A1C14] text-center">Crea tu cuenta de estudiante</h2>

          <div className="mt-6 space-y-4">
            <Input
              id="register-name"
              label="Nombre completo"
              placeholder="María García"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={errors.name}
              required
            />

            <Input
              id="register-email"
              label="Correo electrónico"
              type="email"
              placeholder="tu@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              required
            />

            <Input
              id="register-password"
              label="Contraseña"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              required
              showToggle
              hint="Mínimo 8 caracteres"
            />

            <Input
              id="register-confirm-password"
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

          <Button variant="primary" className="w-full mt-6" onClick={handleContinue}>
            Continuar →
          </Button>
        </>
      )}

      {step === 2 && (
        <>
          <h2 className="text-2xl font-bold text-[#1A1C14] text-center">¿Qué quieres aprender?</h2>
          <p className="text-[#5C6355] text-center mt-2 mb-6">
            Elige las áreas que más te interesan (opcional)
          </p>

          <div className="flex flex-wrap gap-2 mb-6">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => toggleInterest(category)}
                className={`px-4 py-2 rounded-full text-sm transition-colors cursor-pointer ${
                  selectedInterests.includes(category)
                    ? 'bg-[#2D4A3E] text-white'
                    : 'bg-white border border-[#E8E0D0] text-[#1A1C14] hover:border-[#2D4A3E]'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="flex gap-4">
            <Button variant="outline" onClick={() => setStep(1)}>
              ← Atrás
            </Button>
            <Button variant="primary" className="flex-1" onClick={handleSubmit}>
              Crear mi cuenta
            </Button>
          </div>
        </>
      )}

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