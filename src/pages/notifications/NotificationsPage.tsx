import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, PlayCircle, AlertCircle, ClipboardList, Award, UserCheck, Users, CheckCircle } from 'lucide-react'
import type { AppNotification } from '../../types'
import { notificationsMock, getNotificationMeta } from '../../data/notificationsData'
import EmptyState from '../../components/ui/EmptyState'
import Toast from '../../components/ui/Toast'

function getRelativeTime(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffTime = now.getTime() - date.getTime()
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60))
  const diffDays = Math.floor(diffHours / 24)

  if (diffHours < 1) return 'ahora'
  if (diffHours < 24) return `hace ${diffHours}h`
  if (diffDays === 1) return 'hace 1 día'
  if (diffDays < 7) return `hace ${diffDays} días`
  return `hace ${Math.floor(diffDays / 7)} semanas`
}

const NOTIFICATION_ICONS: Record<string, React.ElementType> = {
  block_active: PlayCircle,
  block_expiring: AlertCircle,
  block_graded: ClipboardList,
  course_completed: Award,
  talent_match: UserCheck,
  new_enrollment: Users,
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<AppNotification[]>(notificationsMock)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')
  const [toast, setToast] = useState({ visible: false, message: '' })
  const navigate = useNavigate()

  const filteredNotifications = notifications
    .filter(n => filter === 'unread' ? !n.read : true)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const handleNotificationClick = (notification: AppNotification) => {
    if (!notification.read) {
      setNotifications(prev => prev.map(n => 
        n.id === notification.id ? { ...n, read: true } : n
      ))
    }
    if (notification.link) {
      navigate(notification.link)
    }
  }

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    setToast({ visible: true, message: 'Todas las notificaciones marcadas como leídas' })
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="min-h-screen bg-[#FAF7EF] pt-20 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-[#1A1C14]">Notificaciones</h1>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="text-sm text-[#2D4A3E] hover:underline cursor-pointer"
            >
              Marcar todas como leídas
            </button>
          )}
        </div>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              filter === 'all' 
                ? 'bg-[#2D4A3E] text-white' 
                : 'bg-white text-[#5C6355] hover:bg-[#F2EDE1]'
            }`}
          >
            Todas ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              filter === 'unread' 
                ? 'bg-[#2D4A3E] text-white' 
                : 'bg-white text-[#5C6355] hover:bg-[#F2EDE1]'
            }`}
          >
            No leídas ({unreadCount})
          </button>
        </div>

        {filteredNotifications.length > 0 ? (
          <div className="space-y-2">
            {filteredNotifications.map(notification => {
              const IconComponent = NOTIFICATION_ICONS[notification.type]
              const meta = getNotificationMeta(notification.type)
              return (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-4 rounded-xl cursor-pointer transition-colors ${
                    notification.read 
                      ? 'bg-white hover:bg-[#F2EDE1]' 
                      : 'bg-[#F2EDE1]/50 hover:bg-[#F2EDE1]'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {!notification.read && (
                      <span className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                    )}
                    <div className={`p-2 rounded-full ${meta.color}`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-[#1A1C14]">{notification.title}</h3>
                      <p className="text-sm text-[#5C6355] line-clamp-2 mt-1">{notification.message}</p>
                      <p className="text-xs text-[#5C6355] mt-2">{getRelativeTime(notification.createdAt)}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <EmptyState
            icon={filter === 'unread' ? CheckCircle : Bell}
            title={filter === 'unread' ? 'Todo al día' : 'No tienes notificaciones'}
            description={filter === 'unread' 
              ? 'No tienes notificaciones sin leer.' 
              : 'Aquí aparecerán las actualizaciones de tus cursos y actividad.'
            }
            size="sm"
          />
        )}
      </div>

      <Toast
        visible={toast.visible}
        message={toast.message}
        onHide={() => setToast({ visible: false, message: '' })}
      />
    </div>
  )
}