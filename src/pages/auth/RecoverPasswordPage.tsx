import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MailCheck } from 'lucide-react'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'

export default function RecoverPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email.trim()) {
      setError('El correo es requerido')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Ingresa un correo válido')
      return
    }

    setIsLoading(true)

    setTimeout(() => {
      setIsLoading(false)
      setIsSubmitted(true)
    }, 600)
  }

  if (isSubmitted) {
    return (
      <div className="text-center">
        <MailCheck className="w-16 h-16 text-[#C9A84C] mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-[#1A1C14]">¡Revisa tu correo!</h2>
        <p className="text-[#5C6355] mt-2">
          Enviamos instrucciones a:
          <br />
          <span className="font-medium text-[#1A1C14]">{email}</span>
        </p>
        <p className="text-sm text-[#5C6355] mt-4">
          Si no ves el correo, revisa tu carpeta de spam o correo no deseado.
        </p>

        <div className="mt-8 flex flex-col gap-3">
          <Button variant="outline" onClick={() => setIsSubmitted(false)}>
            Reenviar correo
          </Button>
          <Link to="/login" className="text-[#2D4A3E] hover:underline cursor-pointer">
            ← Volver al login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-[#1A1C14]">¿Olvidaste tu contraseña?</h2>
      <p className="text-[#5C6355] mt-2 mb-6">Ingresa tu correo y te enviaremos instrucciones.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="recover-email"
          label="Correo electrónico"
          type="email"
          placeholder="tu@correo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={error}
          required
        />

        <Button type="submit" variant="primary" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-[#1A1C14]/30 border-t-[#1A1C14] rounded-full animate-spin" />
              Enviando...
            </span>
          ) : (
            'Enviar instrucciones'
          )}
        </Button>
      </form>

      <Link
        to="/login"
        className="block mt-6 text-center text-[#2D4A3E] hover:underline cursor-pointer"
      >
        ← Volver al login
      </Link>
    </div>
  )
}