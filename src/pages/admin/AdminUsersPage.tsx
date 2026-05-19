import { useState } from 'react'
import { Search, MoreVertical } from 'lucide-react'
import { adminUsers } from '../../data/adminData'
import type { AdminUser, UserRole } from '../../types'

function getRelativeTime(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffTime = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'hoy'
  if (diffDays === 1) return 'hace 1 día'
  if (diffDays < 30) return `hace ${diffDays} días`
  if (diffDays < 365) return `hace ${Math.floor(diffDays / 30)} meses`
  return `hace ${Math.floor(diffDays / 365)} años`
}

const roleLabels: Record<string, string> = {
  student: 'Estudiante',
  organization: 'Organización',
  instructor: 'Instructor',
  admin: 'Admin',
}

const roleBadgeColors: Record<string, string> = {
  student: 'bg-blue-100 text-blue-700',
  organization: 'bg-[#F2EDE1] text-[#2D4A3E]',
  instructor: 'bg-purple-100 text-purple-700',
  admin: 'bg-[#1A1C14] text-white',
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>(adminUsers)
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState<'all' | UserRole | 'admin'>('all')
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const [confirmModal, setConfirmModal] = useState<{ userId: string; action: 'suspend' | 'reactivate' } | null>(null)

  const filtered = users.filter(u => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = roleFilter === 'all' || u.role === roleFilter
    return matchesSearch && matchesRole
  })

  const handleAction = () => {
    if (!confirmModal) return
    const { userId, action } = confirmModal
    const newStatus = action === 'suspend' ? 'suspended' : 'active'
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: newStatus } : u))
    setConfirmModal(null)
  }

  const getUserName = (id: string) => users.find(u => u.id === id)?.name ?? ''

  return (
    <div className="max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-[#1A1C14]">Usuarios ({users.length})</h1>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5C6355]" />
            <input
              type="text"
              placeholder="Buscar usuario..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-[#E8E0D0] rounded-lg text-sm w-64 focus:outline-none focus:border-[#2D4A3E]"
            />
          </div>
          <select
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value as typeof roleFilter)}
            className="px-4 py-2 border border-[#E8E0D0] rounded-lg text-sm focus:outline-none focus:border-[#2D4A3E]"
          >
            <option value="all">Todos los roles</option>
            <option value="student">Estudiante</option>
            <option value="organization">Organización</option>
            <option value="instructor">Instructor</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>

      <div className="bg-white border border-[#E8E0D0] rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#E8E0D0]">
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#5C6355] uppercase">Nombre</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#5C6355] uppercase">Rol</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#5C6355] uppercase">Estado</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#5C6355] uppercase">Registrado</th>
              <th className="w-12 px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(user => (
              <tr key={user.id} className="border-b border-[#E8E0D0] hover:bg-[#F2EDE1]">
                <td className="px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-[#1A1C14]">{user.name}</p>
                    <p className="text-xs text-[#5C6355]">{user.email}</p>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-md text-xs font-medium ${roleBadgeColors[user.role]}`}>
                    {roleLabels[user.role]}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-sm ${user.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                    {user.status === 'active' ? '● Activo' : '○ Suspendido'}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-[#5C6355]">{getRelativeTime(user.registeredAt)}</td>
                <td className="px-4 py-3"><div className="relative">
                  <button
                    onClick={() => setOpenMenuId(openMenuId === user.id ? null : user.id)}
                    className="p-1 hover:bg-[#F2EDE1] rounded cursor-pointer"
                  >
                    <MoreVertical className="w-4 h-4 text-[#5C6355]" />
                  </button>
                  {openMenuId === user.id && (
                    <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-[#E8E0D0] rounded-lg shadow-lg z-10">
                      {user.status === 'active' ? (
                        <button
                          onClick={() => { setConfirmModal({ userId: user.id, action: 'suspend' }); setOpenMenuId(null) }}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
                        >
                          Suspender
                        </button>
                      ) : (
                        <button
                          onClick={() => { setConfirmModal({ userId: user.id, action: 'reactivate' }); setOpenMenuId(null) }}
                          className="w-full text-left px-4 py-2 text-sm text-[#2D4A3E] hover:bg-[#F2EDE1] cursor-pointer"
                        >
                          Reactivar
                        </button>
                      )}
                      {user.role === 'student' && (
                        <button
                          onClick={() => setOpenMenuId(null)}
                          className="w-full text-left px-4 py-2 text-sm text-[#5C6355] hover:bg-[#F2EDE1] cursor-pointer"
                        >
                          Ver perfil
                        </button>
                      )}
                    </div>
                  )}
                </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {confirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-[#1A1C14] mb-2">
              {confirmModal.action === 'suspend'
                ? `¿Suspender a ${getUserName(confirmModal.userId)}?`
                : `¿Reactivar a ${getUserName(confirmModal.userId)}?`
              }
            </h3>
            <p className="text-sm text-[#5C6355] mb-6">
              {confirmModal.action === 'suspend'
                ? 'Esta acción impedirá que el usuario inicie sesión.'
                : 'El usuario podrá volver a iniciar sesión.'
              }
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setConfirmModal(null)}
                className="px-4 py-2 text-sm text-[#5C6355] hover:bg-[#F2EDE1] rounded-lg cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleAction}
                className={`px-4 py-2 text-sm text-white rounded-lg cursor-pointer ${
                  confirmModal.action === 'suspend' ? 'bg-red-600 hover:bg-red-700' : 'bg-[#2D4A3E] hover:bg-[#2D4A3E]/90'
                }`}
              >
                {confirmModal.action === 'suspend' ? 'Confirmar suspensión' : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}