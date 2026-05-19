import { Link, useLocation } from 'react-router-dom'

type TabType = 'cuenta' | 'seguridad' | 'notificaciones'

interface SettingsTabsProps {
  activeTab?: TabType
}

const tabs: { key: TabType; label: string; path: string }[] = [
  { key: 'cuenta', label: 'Mi cuenta', path: '/configuracion' },
  { key: 'seguridad', label: 'Seguridad', path: '/configuracion/seguridad' },
  { key: 'notificaciones', label: 'Notificaciones', path: '/configuracion/notificaciones' },
]

export default function SettingsTabs({ activeTab: _activeTab }: SettingsTabsProps) {
  const location = useLocation()

  return (
    <div>
      <h2 className="text-2xl font-bold text-[#1A1C14] mb-6">Configuración</h2>
      <div className="flex gap-6 border-b border-[#E8E0D0] mb-8">
        {tabs.map(tab => {
          const isActive = location.pathname === tab.path
          return (
            <Link
              key={tab.key}
              to={tab.path}
              className={`pb-3 transition-colors cursor-pointer ${
                isActive
                  ? 'border-b-2 border-[#2D4A3E] text-[#2D4A3E] font-medium'
                  : 'text-[#5C6355] hover:text-[#2D4A3E]'
              }`}
            >
              {tab.label}
            </Link>
          )
        })}
      </div>
    </div>
  )
}