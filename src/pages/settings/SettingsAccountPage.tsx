import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SettingsTabs from '../../components/ui/SettingsTabs'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import Toast from '../../components/ui/Toast'
import { useAuth } from '../../context/auth'

const LANGUAGES = [
  { value: 'es-GT', label: 'Español (Guatemala)' },
  { value: 'es-ES', label: 'Español (España)' },
  { value: 'en-US', label: 'English' },
]

const TIMEZONES = [
  { value: 'America/Guatemala', label: 'America/Guatemala (UTC-6)' },
  { value: 'America/Mexico_City', label: 'America/Mexico City (UTC-6)' },
  { value: 'America/Bogota', label: 'America/Bogota (UTC-5)' },
  { value: 'America/Santiago', label: 'America/Santiago (UTC-4)' },
  { value: 'America/Buenos_Aires', label: 'America/Buenos Aires (UTC-3)' },
]

export default function SettingsAccountPage() {
  const { user, login, logout } = useAuth()
  const navigate = useNavigate()
  
  const [displayName, setDisplayName] = useState(user?.name || '')
  const [language, setLanguage] = useState('es-GT')
  const [timezone, setTimezone] = useState('America/Guatemala')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [toast, setToast] = useState({ visible: false, message: '' })

  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => {
      if (user) {
        login({ ...user, name: displayName })
      }
      setIsSaving(false)
      setToast({ visible: true, message: 'Cambios guardados' })
    }, 600)
  }

  const handleDeleteAccount = () => {
    logout()
    setToast({ visible: true, message: 'Cuenta eliminada' })
    setTimeout(() => navigate('/'), 500)
  }

  return (
    <div className="min-h-screen bg-[#FAF7EF] pt-20 pb-12 px-4">
      <div className="max-w-2xl mx-auto">
        <SettingsTabs activeTab="cuenta" />

        <div className="bg-white rounded-xl border border-[#E8E0D0] p-6">
          <h3 className="text-lg font-semibold text-[#1A1C14] mb-6">Mi cuenta</h3>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#1A1C14] mb-2">
                Correo electrónico
              </label>
              <div className="w-full px-4 py-3 rounded-lg border border-[#E8E0D0] bg-[#F2EDE1] text-[#5C6355]">
                {user?.email}
              </div>
              <p className="mt-1 text-xs text-[#5C6355]">El correo no puede modificarse.</p>
            </div>

            <Input
              id="displayName"
              label="Nombre para mostrar"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />

            <div>
              <label className="block text-sm font-medium text-[#1A1C14] mb-2">
                Idioma de la plataforma
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-[#E8E0D0] bg-white text-[#1A1C14] focus:outline-none focus:border-[#2D4A3E] cursor-pointer"
              >
                {LANGUAGES.map(lang => (
                  <option key={lang.value} value={lang.value}>{lang.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1A1C14] mb-2">
                Zona horaria
              </label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-[#E8E0D0] bg-white text-[#1A1C14] focus:outline-none focus:border-[#2D4A3E] cursor-pointer"
              >
                {TIMEZONES.map(tz => (
                  <option key={tz.value} value={tz.value}>{tz.label}</option>
                ))}
              </select>
            </div>

            <div className="pt-4">
              <Button
                variant="primary"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? 'Guardando...' : 'Guardar cambios'}
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#E8E0D0] p-6 mt-6">
          <h3 className="text-lg font-semibold text-red-600 mb-4">Zona de peligro</h3>
          <Button
            variant="outline"
            onClick={() => setShowDeleteModal(true)}
            className="!text-red-600 !border-red-400 hover:!bg-red-50"
          >
            Eliminar mi cuenta
          </Button>
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-[#1A1C14] mb-2">
              ¿Seguro que quieres eliminar tu cuenta?
            </h3>
            <p className="text-[#5C6355] mb-6">
              Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowDeleteModal(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                onClick={handleDeleteAccount}
                className="flex-1 !bg-red-600 hover:!bg-red-700"
              >
                Sí, eliminar
              </Button>
            </div>
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