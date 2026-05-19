import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Bookmark, MoreVertical } from 'lucide-react'
import { savedCandidatesMock } from '../../data/talentData'
import type { SavedCandidate } from '../../types'

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const day = date.getDate()
  const month = date.toLocaleString('es-GT', { month: 'short' })
  const year = date.getFullYear()
  return `${day} ${month} ${year}`
}

function getStatusBadge(status: SavedCandidate['status']) {
  switch (status) {
    case 'to_contact':
      return { label: 'Por contactar', className: 'bg-blue-100 text-blue-700' }
    case 'in_process':
      return { label: 'En proceso', className: 'bg-yellow-100 text-yellow-700' }
    case 'discarded':
      return { label: 'Descartado', className: 'bg-gray-100 text-gray-700' }
  }
}

export default function SavedCandidatesPage() {
  const navigate = useNavigate()
  const [candidates, setCandidates] = useState<SavedCandidate[]>(savedCandidatesMock)
  const [statusFilter, setStatusFilter] = useState<'all' | SavedCandidate['status']>('all')
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

  const filteredCandidates = statusFilter === 'all'
    ? candidates
    : candidates.filter(c => c.status === statusFilter)

  const statusCounts = {
    all: candidates.length,
    to_contact: candidates.filter(c => c.status === 'to_contact').length,
    in_process: candidates.filter(c => c.status === 'in_process').length,
    discarded: candidates.filter(c => c.status === 'discarded').length,
  }

  const handleStatusChange = (candidateId: string, newStatus: SavedCandidate['status']) => {
    setCandidates(prev => prev.map(c => c.id === candidateId ? { ...c, status: newStatus } : c))
    setOpenMenuId(null)
  }

  const handleDelete = (candidateId: string) => {
    setCandidates(prev => prev.filter(c => c.id !== candidateId))
    setOpenMenuId(null)
  }

  if (candidates.length === 0) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-[#1A1C14] mb-6">Candidatos guardados</h1>
        <div className="text-center py-12">
          <Bookmark className="w-12 h-12 mx-auto text-[#5C6355] mb-4" />
          <p className="text-[#1A1C14] font-medium mb-2">Aún no has guardado candidatos</p>
          <Link
            to="/talent/buscar"
            className="text-sm text-[#2D4A3E] hover:text-[#4A7C59] transition-colors cursor-pointer"
          >
            Buscar talento
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#1A1C14] mb-6">Candidatos guardados ({candidates.length})</h1>

      <div className="flex gap-2 mb-6">
        {[
          { key: 'all' as const, label: 'Todos' },
          { key: 'to_contact' as const, label: 'Por contactar' },
          { key: 'in_process' as const, label: 'En proceso' },
          { key: 'discarded' as const, label: 'Descartados' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setStatusFilter(tab.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              statusFilter === tab.key
                ? 'bg-[#2D4A3E] text-white'
                : 'bg-[#F2EDE1] text-[#5C6355] hover:bg-[#E8E0D0]'
            }`}
          >
            {tab.label} ({statusCounts[tab.key]})
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm text-[#5C6355] border-b border-[#E8E0D0]">
              <th className="pb-3 font-medium">Candidato</th>
              <th className="pb-3 font-medium">Guardado</th>
              <th className="pb-3 font-medium">Cursos</th>
              <th className="pb-3 font-medium">Estado</th>
              <th className="pb-3 font-medium w-10"></th>
            </tr>
          </thead>
          <tbody>
            {filteredCandidates.map(candidate => {
              const badge = getStatusBadge(candidate.status)
              return (
                <tr key={candidate.id} className="border-b border-[#E8E0D0] hover:bg-[#FAF7EF]">
                  <td className="py-4">
                    <button
                      onClick={() => navigate(`/talent/candidato/${candidate.candidate.username}`)}
                      className="flex items-center gap-3 cursor-pointer hover:text-[#2D4A3E]"
                    >
                      <div className="w-8 h-8 rounded-full bg-[#2D4A3E] flex items-center justify-center shrink-0">
                        <span className="text-white font-semibold text-sm">
                          {candidate.candidate.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-[#1A1C14]">{candidate.candidate.name}</div>
                        <div className="text-sm text-[#5C6355]">{candidate.candidate.title}</div>
                      </div>
                    </button>
                  </td>
                  <td className="py-4 text-sm text-[#5C6355]">
                    {formatDate(candidate.savedAt)}
                  </td>
                  <td className="py-4 text-sm text-[#5C6355]">
                    {candidate.candidate.completedCourses.length} completados
                  </td>
                  <td className="py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.className}`}>
                      {badge.label}
                    </span>
                  </td>
                  <td className="py-4 relative">
                    <button
                      onClick={() => setOpenMenuId(openMenuId === candidate.id ? null : candidate.id)}
                      className="p-1 text-[#5C6355] hover:text-[#2D4A3E] cursor-pointer"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>
                    
                    {openMenuId === candidate.id && (
                      <div className="absolute right-0 top-8 bg-white border border-[#E8E0D0] rounded-lg shadow-lg py-1 z-10 min-w-[160px]">
                        <button
                          onClick={() => navigate(`/talent/candidato/${candidate.candidate.username}`)}
                          className="w-full px-4 py-2 text-left text-sm text-[#1A1C14] hover:bg-[#F2EDE1] cursor-pointer"
                        >
                          Ver perfil
                        </button>
                        <div className="px-4 py-1 text-xs text-[#5C6355]">Cambiar estado</div>
                        {(['to_contact', 'in_process', 'discarded'] as const).map(status => (
                          <button
                            key={status}
                            onClick={() => handleStatusChange(candidate.id, status)}
                            className={`w-full px-4 py-2 text-left text-sm hover:bg-[#F2EDE1] cursor-pointer ${
                              candidate.status === status ? 'text-[#2D4A3E] font-medium' : 'text-[#5C6355]'
                            }`}
                          >
                            {status === 'to_contact' ? 'Por contactar' : status === 'in_process' ? 'En proceso' : 'Descartado'}
                          </button>
                        ))}
                        <hr className="my-1 border-[#E8E0D0]" />
                        <button
                          onClick={() => handleDelete(candidate.id)}
                          className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 cursor-pointer"
                        >
                          Eliminar de guardados
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}