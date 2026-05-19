import { useState } from 'react'
import { X, Download } from 'lucide-react'

const mockCertificates = [
  {
    id: 'cert-1',
    courseTitle: 'Introducción a la Arquitectura de Microservicios',
    orgName: 'TechCorp Latam',
    finalGrade: 88,
    completedAt: '14 enero 2025',
  },
  {
    id: 'cert-2',
    courseTitle: 'Python para Análisis de Datos',
    orgName: 'Universidad de la Innovación',
    finalGrade: 92,
    completedAt: '20 febrero 2025',
  },
]

export default function MyCertificatesPage() {
  const [selectedCert, setSelectedCert] = useState<typeof mockCertificates[0] | null>(null)

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-[#1A1C14] mb-6">
        Mis certificados ({mockCertificates.length})
      </h1>

      <div className="grid gap-6 md:grid-cols-2">
        {mockCertificates.map(cert => (
          <div
            key={cert.id}
            className="bg-gradient-to-br from-[#2D4A3E] to-[#1A3A2E] rounded-xl p-6 border border-[#C9A84C]/50 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setSelectedCert(cert)}
          >
            <div className="text-white text-xl font-bold mb-4">Nexora.</div>
            <div className="text-[#C9A84C] text-sm mb-2">Certificado de finalización</div>
            <div className="text-white text-lg font-semibold mb-1 truncate">
              {cert.courseTitle}
            </div>
            <div className="text-white/70 text-sm mb-4">
              {cert.orgName}
            </div>
            <div className="text-white/70 text-sm">
              Nota final: {cert.finalGrade} · {cert.completedAt}
            </div>
            <div className="mt-4 text-[#C9A84C] text-sm font-medium">
              Ver certificado →
            </div>
          </div>
        ))}
      </div>

      {selectedCert && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-[#E8E0D0]">
              <div />
              <button
                onClick={() => setSelectedCert(null)}
                className="p-2 hover:bg-[#F2EDE1] rounded-lg cursor-pointer transition-colors"
              >
                <X className="w-5 h-5 text-[#5C6355]" />
              </button>
            </div>

            <div className="p-8">
              <div className="bg-gradient-to-br from-[#2D4A3E] to-[#1A3A2E] rounded-xl p-8 border border-[#C9A84C]/50 text-center">
                <div className="text-white text-2xl font-bold mb-2">Nexora.</div>
                <div className="text-[#C9A84C] text-lg mb-6">CERTIFICADO DE FINALIZACIÓN</div>
                <div className="text-white/70 mb-2">Otorgado a:</div>
                <div className="text-white text-xl font-semibold mb-6">María García</div>
                <div className="text-white/70 mb-2">Por completar satisfactoriamente:</div>
                <div className="text-white text-lg font-semibold mb-6">{selectedCert.courseTitle}</div>
                <div className="text-white/70 mb-2">Nota final: {selectedCert.finalGrade}/100</div>
                <div className="text-white/70 mb-6">
                  {selectedCert.completedAt} — {selectedCert.orgName}
                </div>
                <div className="text-[#C9A84C] text-4xl">✦</div>
              </div>

              <button className="mt-6 w-full flex items-center justify-center gap-2 bg-[#2D4A3E] text-white py-3 rounded-lg font-medium hover:bg-[#4A7C59] transition-colors cursor-pointer">
                <Download className="w-4 h-4" />
                Descargar certificado
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}