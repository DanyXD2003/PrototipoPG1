import { useState } from 'react'
import { Search, MoreVertical, CheckCircle, Clock, XCircle } from 'lucide-react'
import { adminOrgs } from '../../data/adminData'
import type { AdminOrg, OrgAdminStatus } from '../../types'

const statusConfig: Record<OrgAdminStatus, { label: string; className: string; icon: typeof CheckCircle }> = {
  verified: { label: 'Verificada', className: 'bg-green-100 text-green-700', icon: CheckCircle },
  pending: { label: 'Pendiente', className: 'bg-amber-100 text-amber-700', icon: Clock },
  suspended: { label: 'Suspendida', className: 'bg-red-100 text-red-700', icon: XCircle },
}

export default function AdminOrgsPage() {
  const [orgs, setOrgs] = useState<AdminOrg[]>(adminOrgs)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | OrgAdminStatus>('all')
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const [verifyModal, setVerifyModal] = useState<string | null>(null)
  const [rejectModal, setRejectModal] = useState<string | null>(null)
  const [suspendModal, setSuspendModal] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState('')

  const filtered = orgs.filter(o => {
    const matchesSearch = o.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getOrgName = (id: string) => orgs.find(o => o.id === id)?.name ?? ''

  const handleVerify = (id: string) => {
    setOrgs(prev => prev.map(o => o.id === id ? { ...o, status: 'verified' } : o))
    setVerifyModal(null)
  }

  const handleReject = (id: string) => {
    setOrgs(prev => prev.map(o => o.id === id ? { ...o, status: 'suspended' } : o))
    setRejectModal(null)
    setRejectReason('')
  }

  const handleSuspend = (id: string) => {
    setOrgs(prev => prev.map(o => o.id === id ? { ...o, status: 'suspended' } : o))
    setSuspendModal(null)
  }

  const handleReactivate = (id: string) => {
    setOrgs(prev => prev.map(o => o.id === id ? { ...o, status: 'verified' } : o))
    setOpenMenuId(null)
  }

  return (
    <div className="max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-[#1A1C14]">Organizaciones ({orgs.length})</h1>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5C6355]" />
            <input
              type="text"
              placeholder="Buscar..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-[#E8E0D0] rounded-lg text-sm w-64 focus:outline-none focus:border-[#2D4A3E]"
            />
          </div>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as typeof statusFilter)}
            className="px-4 py-2 border border-[#E8E0D0] rounded-lg text-sm focus:outline-none focus:border-[#2D4A3E]"
          >
            <option value="all">Todas</option>
            <option value="verified">Verificadas</option>
            <option value="pending">Pendientes</option>
            <option value="suspended">Suspendidas</option>
          </select>
        </div>
      </div>

      <div className="bg-white border border-[#E8E0D0] rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#E8E0D0]">
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#5C6355] uppercase">Nombre</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#5C6355] uppercase">Industria</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#5C6355] uppercase">Estado</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#5C6355] uppercase">Cursos</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#5C6355] uppercase">Estudiantes</th>
              <th className="w-12 px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(org => {
              const status = statusConfig[org.status]
              const StatusIcon = status.icon
              return (
                <tr key={org.id} className="border-b border-[#E8E0D0] hover:bg-[#F2EDE1]">
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-[#1A1C14]">{org.name}</p>
                      <p className="text-xs text-[#5C6355]">{org.contactEmail}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#1A1C14]">{org.industry}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${status.className}`}>
                      <StatusIcon className="w-3 h-3" />
                      {status.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#5C6355]">{org.courseCount}</td>
                  <td className="px-4 py-3 text-sm text-[#5C6355]">{org.studentCount.toLocaleString()}</td>
                  <td className="px-4 py-3"><div className="relative">
                    <button
                      onClick={() => setOpenMenuId(openMenuId === org.id ? null : org.id)}
                      className="p-1 hover:bg-[#F2EDE1] rounded cursor-pointer"
                    >
                      <MoreVertical className="w-4 h-4 text-[#5C6355]" />
                    </button>
                    {openMenuId === org.id && (
                      <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-[#E8E0D0] rounded-lg shadow-lg z-10">
                        {org.status === 'pending' && (
                          <>
                            <button
                              onClick={() => { setVerifyModal(org.id); setOpenMenuId(null) }}
                              className="w-full text-left px-4 py-2 text-sm text-[#2D4A3E] hover:bg-[#F2EDE1] cursor-pointer"
                            >
                              Verificar
                            </button>
                            <button
                              onClick={() => { setRejectModal(org.id); setOpenMenuId(null) }}
                              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
                            >
                              Rechazar
                            </button>
                          </>
                        )}
                        {org.status === 'verified' && (
                          <button
                            onClick={() => { setSuspendModal(org.id); setOpenMenuId(null) }}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
                          >
                            Suspender
                          </button>
                        )}
                        {org.status === 'suspended' && (
                          <button
                            onClick={() => handleReactivate(org.id)}
                            className="w-full text-left px-4 py-2 text-sm text-[#2D4A3E] hover:bg-[#F2EDE1] cursor-pointer"
                          >
                            Reactivar
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {verifyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-[#1A1C14] mb-2">
              ¿Verificar a {getOrgName(verifyModal)}?
            </h3>
            <p className="text-sm text-[#5C6355] mb-6">
              La organización podrá publicar cursos y aparecerá con el badge de verificada.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setVerifyModal(null)}
                className="px-4 py-2 text-sm text-[#5C6355] hover:bg-[#F2EDE1] rounded-lg cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleVerify(verifyModal)}
                className="px-4 py-2 text-sm text-white bg-[#2D4A3E] hover:bg-[#2D4A3E]/90 rounded-lg cursor-pointer"
              >
                Verificar
              </button>
            </div>
          </div>
        </div>
      )}

      {rejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-[#1A1C14] mb-2">
              ¿Rechazar a {getOrgName(rejectModal)}?
            </h3>
            <p className="text-sm text-[#5C6355] mb-4">Motivo (opcional)</p>
            <textarea
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              className="w-full border border-[#E8E0D0] rounded-lg p-3 text-sm mb-6 focus:outline-none focus:border-[#2D4A3E]"
              rows={3}
              placeholder="Describe el motivo del rechazo..."
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => { setRejectModal(null); setRejectReason('') }}
                className="px-4 py-2 text-sm text-[#5C6355] hover:bg-[#F2EDE1] rounded-lg cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleReject(rejectModal)}
                className="px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-700 rounded-lg cursor-pointer"
              >
                Rechazar
              </button>
            </div>
          </div>
        </div>
      )}

      {suspendModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-[#1A1C14] mb-2">
              ¿Suspender a {getOrgName(suspendModal)}?
            </h3>
            <p className="text-sm text-[#5C6355] mb-4">Motivo (opcional)</p>
            <textarea
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              className="w-full border border-[#E8E0D0] rounded-lg p-3 text-sm mb-6 focus:outline-none focus:border-[#2D4A3E]"
              rows={3}
              placeholder="Describe el motivo de la suspensión..."
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => { setSuspendModal(null); setRejectReason('') }}
                className="px-4 py-2 text-sm text-[#5C6355] hover:bg-[#F2EDE1] rounded-lg cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleSuspend(suspendModal)}
                className="px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-700 rounded-lg cursor-pointer"
              >
                Suspender
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}