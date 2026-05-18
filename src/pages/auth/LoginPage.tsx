import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Info } from 'lucide-react'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import { useAuth } from '../../context/auth'
import { mockUsers, DEMO_PASSWORD } from '../../data/mockUsers'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const demoAccounts = [
    { email: 'estudiante@nexora.com', label: 'estudiante@nexora.com' },
    { email: 'empresa@techcorp.com', label: 'empresa@techcorp.com' },
    { email: 'instructor@nexora.com', label: 'instructor@nexora.com' },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email.trim()) {
      setError('El correo es requerido')
      return
    }
    if (!password.trim()) {
      setError('La contraseña es requerida')
      return
    }

    setIsLoading(true)

    setTimeout(() => {
      const foundUser = mockUsers.find(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      )

      if (!foundUser) {
        setError('No encontramos una cuenta con ese correo')
        setIsLoading(false)
        return
      }

      if (password !== DEMO_PASSWORD) {
        setError('Contraseña incorrecta')
        setIsLoading(false)
        return
      }

      login(foundUser)
      setIsLoading(false)
      navigate('/')
    }, 600)
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-[#1A1C14]">Bienvenido de vuelta</h2>
      <p className="text-[#5C6355] mt-2 mb-6">Ingresa a tu cuenta de Nexora</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="login-email"
          label="Correo electrónico"
          type="email"
          placeholder="tu@correo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Input
          id="login-password"
          label="Contraseña"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          showToggle
        />

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="rounded border-[#E8E0D0]" />
            <span className="text-[#5C6355]">Recordarme</span>
          </label>
          <button
            type="button"
            onClick={() => navigate('/recuperar-contrasena')}
            className="text-[#2D4A3E] hover:underline cursor-pointer"
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>

        {error && (
          <div role="alert" className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3">
            {error}
          </div>
        )}

        <Button type="submit" variant="primary" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-[#1A1C14]/30 border-t-[#1A1C14] rounded-full animate-spin" />
              Iniciando...
            </span>
          ) : (
            'Iniciar sesión'
          )}
        </Button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#E8E0D0]" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-[#FAF7EF] text-[#5C6355]">o</span>
        </div>
      </div>

      <Button
        variant="outline"
        className="w-full"
        onClick={() => navigate('/registro')}
      >
        Crear cuenta gratis
      </Button>

      <div className="bg-[#F2EDE1] border border-[#E8E0D0] rounded-xl p-4 mt-6">
        <div className="flex items-center gap-2 mb-3">
          <Info className="w-5 h-5 text-[#C9A84C]" />
          <span className="text-sm font-medium text-[#1A1C14]">Cuentas demo disponibles</span>
        </div>
        <div className="space-y-1">
          {demoAccounts.map((account) => (
            <button
              key={account.email}
              onClick={() => setEmail(account.email)}
              className="block text-sm text-[#5C6355] hover:text-[#2D4A3E] cursor-pointer text-left w-full"
            >
              {account.label}
            </button>
          ))}
          <span className="block text-sm text-[#5C6355]">Contraseña: password</span>
        </div>
      </div>
    </div>
  )
}