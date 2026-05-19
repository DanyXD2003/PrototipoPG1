import { useState } from 'react'
import SettingsTabs from '../../components/ui/SettingsTabs'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import Toast from '../../components/ui/Toast'
import { Monitor, Smartphone } from 'lucide-react'

const sessions = [
  { id: '1', device: 'Chrome', os: 'Windows', location: 'Esta sesión', isActive: true },
  { id: '2', device: 'Safari', os: 'iPhone', location: 'Guatemala', lastAccess: 'hace 2 días', isActive: false },
]

export default function SettingsSecurityPage() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [twoFactorEnabled, _setTwoFactorEnabled] = useState(false)
  const [show2FAModal, setShow2FAModal] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [toast, setToast] = useState({ visible: false, message: '' })

  const handleChangePassword = () => {
    setPasswordError('')
    
    if (currentPassword !== 'password') {
      setPasswordError('Contraseña actual incorrecta')
      return
    }
    
    if (newPassword.length < 8) {
      setPasswordError('La contraseña debe tener al menos 8 caracteres')
      return
    }
    
    if (newPassword !== confirmPassword) {
      setPasswordError('Las contraseñas no coinciden')
      return
    }

    setIsChangingPassword(true)
    setTimeout(() => {
      setIsChangingPassword(false)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setToast({ visible: true, message: 'Contraseña actualizada' })
    }, 600)
  }

  const handleToggle2FA = () => {
    if (!twoFactorEnabled) {
      setShow2FAModal(true)
    }
  }

  const handleCloseSession = () => {
    setToast({ visible: true, message: 'Sesión cerrada' })
  }

  return (
    <div className="min-h-screen bg-[#FAF7EF] pt-20 pb-12 px-4">
      <div className="max-w-2xl mx-auto">
        <SettingsTabs activeTab="seguridad" />

        <div className="bg-white rounded-xl border border-[#E8E0D0] p-6">
          <h3 className="text-lg font-semibold text-[#1A1C14] mb-6">Cambiar contraseña</h3>

          <div className="space-y-4">
            <Input
              id="currentPassword"
              label="Contraseña actual"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              showToggle
            />

            <Input
              id="newPassword"
              label="Nueva contraseña"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              showToggle
              hint="Mínimo 8 caracteres"
            />

            <Input
              id="confirmPassword"
              label="Confirmar nueva contraseña"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              showToggle
              error={passwordError}
            />

            <div className="pt-2">
              <Button
                variant="primary"
                onClick={handleChangePassword}
                disabled={isChangingPassword}
              >
                {isChangingPassword ? 'Actualizando...' : 'Actualizar contraseña'}
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#E8E0D0] p-6 mt-6">
          <h3 className="text-lg font-semibold text-[#1A1C14] mb-4">Autenticación de dos factores (2FA)</h3>
          
          <div className="flex items-center justify-between">
            <span className="text-[#5C6355]">
              {twoFactorEnabled ? 'Activo' : 'Desactivado'}
            </span>
            <button
              onClick={handleToggle2FA}
              className={`w-12 h-6 rounded-full transition-colors duration-200 cursor-pointer ${
                twoFactorEnabled ? 'bg-[#2D4A3E]' : 'bg-[#E8E0D0]'
              }`}
            >
              <span className={`block w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 mx-0.5 ${
                twoFactorEnabled ? 'translate-x-6' : 'translate-x-0'
              }`} />
            </button>
          </div>

          {!twoFactorEnabled && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShow2FAModal(true)}
              className="mt-4"
            >
              Activar 2FA
            </Button>
          )}
        </div>

        <div className="bg-white rounded-xl border border-[#E8E0D0] p-6 mt-6">
          <h3 className="text-lg font-semibold text-[#1A1C14] mb-4">Sesiones activas</h3>

          <div className="space-y-3">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between p-4 bg-[#F2EDE1] rounded-lg"
              >
                <div className="flex items-center gap-3">
                  {session.device === 'Chrome' ? (
                    <Monitor className="w-5 h-5 text-[#5C6355]" />
                  ) : (
                    <Smartphone className="w-5 h-5 text-[#5C6355]" />
                  )}
                  <div>
                    <p className="text-[#1A1C14] font-medium">
                      {session.device} · {session.os}
                    </p>
                    <p className="text-sm text-[#5C6355]">
                      {session.location} {session.isActive ? '• Activo ahora' : `• ${session.lastAccess}`}
                    </p>
                  </div>
                </div>
                {!session.isActive && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCloseSession}
                  >
                    Cerrar sesión
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {show2FAModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-[#1A1C14] mb-2">
              Autenticación de dos factores
            </h3>
            <p className="text-[#5C6355] mb-6">
              La autenticación de dos factores agrega una capa extra de seguridad.
              Esta funcionalidad estará disponible próximamente.
            </p>
            <Button variant="primary" onClick={() => setShow2FAModal(false)} className="w-full">
              Entendido
            </Button>
          </div>
        </div>
      )}

      <Toast
        visible={toast.visible}
        message={toast.message}
        onHide={() => setToast({ visible: false, message: '' })}
      />
    </div>
  )
}