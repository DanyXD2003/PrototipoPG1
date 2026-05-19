import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
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

export default function RegisterOrgPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [orgName, setOrgName] = useState('')
  const [industry, setIndustry] = useState('')
  const [website, setWebsite] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!orgName.trim()) {
      newErrors.orgName = 'El nombre de la organización es requerido'
    }
    if (!industry) {
      newErrors.industry = 'La industria es requerida'
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
      id: 'org-new-' + Date.now(),
      name: orgName,
      email,
      role: 'organization' as const,
      orgSlug: orgName.toLowerCase().replace(/\s+/g, '-'),
    }
    login(newUser)
    navigate('/creator/dashboard')
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-[#1A1C14] text-center">Registra tu organización en Nexora</h2>

      <div className="mt-6 space-y-4">
        <Input
          id="register-org-name"
          label="Nombre de la organización"
          placeholder="TechCorp Latam"
          value={orgName}
          onChange={(e) => setOrgName(e.target.value)}
          error={errors.orgName}
          required
        />

        <div>
          <label htmlFor="register-industry" className="block text-sm font-medium text-[#1A1C14] mb-2">
            Industria <span className="text-red-500">*</span>
          </label>
          <select
            id="register-industry"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            className={`w-full px-4 py-3 rounded-lg border transition-colors duration-200 bg-white ${
              errors.industry
                ? 'border-red-400 ring-1 ring-red-400'
                : 'border-[#E8E0D0] focus:border-[#2D4A3E] focus:ring-1 focus:ring-[#2D4A3E]'
            }`}
          >
            <option value="">Selecciona una industria</option>
            {INDUSTRIES.map((ind) => (
              <option key={ind} value={ind}>
                {ind}
              </option>
            ))}
          </select>
          {errors.industry && <p className="mt-1 text-sm text-red-500">{errors.industry}</p>}
        </div>

        <Input
          id="register-website"
          label="Sitio web"
          type="url"
          placeholder="https://tuempresa.com"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />

        <Input
          id="register-org-email"
          label="Correo de contacto"
          type="email"
          placeholder="contacto@tuempresa.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          required
        />

        <Input
          id="register-org-password"
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
          id="register-org-confirm-password"
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
        Crear organización
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