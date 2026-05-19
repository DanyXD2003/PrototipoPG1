import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BadgeCheck, Search } from 'lucide-react'
import { organizations } from '../../data/organizations'
import EmptyState from '../../components/ui/EmptyState'

export default function OrgCatalogPage() {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredOrgs = organizations.filter(org =>
    org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    org.industry.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="bg-[#FAF7EF] min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#1A1C14] mb-2">Organizaciones</h1>
            <p className="text-[#5C6355]">
              Explora las empresas, universidades e instituciones que ofrecen cursos en Nexora
            </p>
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#5C6355]" />
            <input
              type="text"
              placeholder="Buscar organización..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#E8E0D0] bg-white text-[#1A1C14] placeholder-[#5C6355] focus:outline-none focus:border-[#2D4A3E] cursor-text"
            />
          </div>
        </div>

        {filteredOrgs.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrgs.map((org) => (
            <Link
              key={org.id}
              to={`/org/${org.slug}`}
              className="block p-6 bg-[#F2EDE1] border border-[#E8E0D0] rounded-2xl hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
            >
              <div className="flex items-start gap-4 mb-4">
                <img
                  src={org.logo}
                  alt={org.name}
                  className="w-14 h-14 rounded-xl"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-[#1A1C14] truncate">{org.name}</h3>
                    {org.verified && (
                      <BadgeCheck className="w-5 h-5 text-[#2D4A3E]" />
                    )}
                  </div>
                  <p className="text-sm text-[#5C6355]">{org.industry}</p>
                </div>
              </div>

              <p className="text-sm text-[#5C6355] line-clamp-2 mb-4">
                {org.description}
              </p>

              <div className="flex items-center gap-4 text-sm text-[#5C6355]">
                <span>{org.courseCount} cursos</span>
                <span>•</span>
                <span>{org.studentCount.toLocaleString()} estudiantes</span>
                <span>•</span>
                <span className="text-[#C9A84C] font-medium">{org.rating.toFixed(1)} ★</span>
              </div>
            </Link>
          ))}
        </div>
        ) : (
          <EmptyState 
            icon={Search}
            title="Sin resultados"
            description={`No encontramos organizaciones para "${searchQuery}"`}
          />
        )}
      </div>
    </div>
  )
}