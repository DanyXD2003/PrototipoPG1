import { useState } from 'react'
import SettingsTabs from '../../components/ui/SettingsTabs'
import Button from '../../components/ui/Button'
import Toast from '../../components/ui/Toast'
import { useAuth } from '../../context/auth'
import type { NotificationPreferences } from '../../types'

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={`w-11 h-6 rounded-full transition-colors duration-200 cursor-pointer ${
        checked ? 'bg-[#2D4A3E]' : 'bg-[#E8E0D0]'
      }`}
    >
      <span className={`block w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 mx-1 ${
        checked ? 'translate-x-5' : 'translate-x-0'
      }`} />
    </button>
  )
}

export default function SettingsNotificationsPage() {
  const { user } = useAuth()
  const isOrg = user?.role === 'organization'

  const [prefs, setPrefs] = useState<NotificationPreferences>({
    platform_block_active: true,
    platform_block_expiring: true,
    platform_block_graded: true,
    platform_course_completed: true,
    platform_talent_match: true,
    platform_new_enrollment: true,
    email_block_expiring: true,
    email_course_completed: true,
    email_talent_match: false,
    email_newsletter: false,
  })

  const [isSaving, setIsSaving] = useState(false)
  const [toast, setToast] = useState({ visible: false, message: '' })

  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      setToast({ visible: true, message: 'Preferencias guardadas' })
    }, 600)
  }

  const togglePref = (key: keyof NotificationPreferences) => {
    setPrefs(prev => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="min-h-screen bg-[#FAF7EF] pt-20 pb-12 px-4">
      <div className="max-w-2xl mx-auto">
        <SettingsTabs activeTab="notificaciones" />

        <div className="bg-white rounded-xl border border-[#E8E0D0] p-6">
          <h3 className="text-lg font-semibold text-[#1A1C14] mb-2">Preferencias de notificaciones</h3>
          <p className="text-[#5C6355] text-sm mb-8">
            Controla qué notificaciones recibes y cómo.
          </p>

          <div className="border-b border-[#E8E0D0] pb-4 mb-4">
            <div className="grid grid-cols-3 text-sm font-medium text-[#5C6355]">
              <div></div>
              <div className="text-center">En plataforma</div>
              <div className="text-center">Por email</div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-semibold text-[#1A1C14] mb-4">Aprendizaje</h4>
              <div className="space-y-4">
                <div className="grid grid-cols-3 items-center">
                  <span className="text-[#1A1C14]">Bloque activado</span>
                  <div className="flex justify-center">
                    <Toggle
                      checked={prefs.platform_block_active}
                      onChange={() => togglePref('platform_block_active')}
                    />
                  </div>
                  <div className="flex justify-center">
                    <span className="text-[#5C6355] text-sm">—</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 items-center">
                  <span className="text-[#1A1C14]">Bloque próximo a vencer</span>
                  <div className="flex justify-center">
                    <Toggle
                      checked={prefs.platform_block_expiring}
                      onChange={() => togglePref('platform_block_expiring')}
                    />
                  </div>
                  <div className="flex justify-center">
                    <Toggle
                      checked={prefs.email_block_expiring}
                      onChange={() => togglePref('email_block_expiring')}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 items-center">
                  <span className="text-[#1A1C14]">Examen calificado</span>
                  <div className="flex justify-center">
                    <Toggle
                      checked={prefs.platform_block_graded}
                      onChange={() => togglePref('platform_block_graded')}
                    />
                  </div>
                  <div className="flex justify-center">
                    <Toggle
                      checked={prefs.email_course_completed}
                      onChange={() => togglePref('email_course_completed')}
                    />
                  </div>
                </div>
              </div>
            </div>

            {isOrg && (
              <div>
                <h4 className="text-sm font-semibold text-[#1A1C14] mb-4">Reclutamiento</h4>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 items-center">
                    <span className="text-[#1A1C14]">Nuevo candidato</span>
                    <div className="flex justify-center">
                      <Toggle
                        checked={prefs.platform_talent_match}
                        onChange={() => togglePref('platform_talent_match')}
                      />
                    </div>
                    <div className="flex justify-center">
                      <Toggle
                        checked={prefs.email_talent_match}
                        onChange={() => togglePref('email_talent_match')}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div>
              <h4 className="text-sm font-semibold text-[#1A1C14] mb-4">General</h4>
              <div className="grid grid-cols-3 items-center">
                <span className="text-[#1A1C14]">Newsletter y novedades</span>
                <div className="flex justify-center">
                  <span className="text-[#5C6355] text-sm">—</span>
                </div>
                <div className="flex justify-center">
                  <Toggle
                    checked={prefs.email_newsletter}
                    onChange={() => togglePref('email_newsletter')}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-[#E8E0D0]">
            <Button
              variant="primary"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? 'Guardando...' : 'Guardar preferencias'}
            </Button>
          </div>
        </div>
      </div>

      <Toast
        visible={toast.visible}
        message={toast.message}
        onHide={() => setToast({ visible: false, message: '' })}
      />
    </div>
  )
}