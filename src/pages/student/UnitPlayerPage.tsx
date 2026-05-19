import { useState } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import { PlayCircle, Pause, Volume2, VolumeX, SkipBack, SkipForward } from 'lucide-react'

export default function UnitPlayerPage() {
  const { unidadId } = useParams()
  const location = useLocation()
  const { course: _course } = location.state || {}

  const unitIndex = parseInt(unidadId || '1') - 1
  const unitTypes = ['video', 'material', 'ejercicio'] as const
  const type = unitTypes[unitIndex % 3]

  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [progress] = useState(0)
  const [code, setCode] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handlePlayPause = () => setIsPlaying(!isPlaying)
  const handleMute = () => setIsMuted(!isMuted)
  const handleSubmit = () => setSubmitted(true)

  const renderContent = () => {
    if (type === 'video') {
      return (
        <div className="h-full flex flex-col">
          <div className="flex-1 bg-[#1A1C14] flex items-center justify-center relative">
            <button
              onClick={handlePlayPause}
              className="cursor-pointer hover:opacity-80 transition-opacity"
            >
              <PlayCircle className={`w-24 h-24 ${isPlaying ? 'text-white' : 'text-[#C9A84C]'}`} />
            </button>

            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80">
              <div className="mb-3">
                <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#C9A84C] transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-white">
                <div className="flex items-center gap-3">
                  <button onClick={() => {}} className="cursor-pointer hover:opacity-80">
                    <SkipBack className="w-5 h-5" />
                  </button>
                  <button onClick={handlePlayPause} className="cursor-pointer hover:opacity-80">
                    {isPlaying ? (
                      <Pause className="w-8 h-8" />
                    ) : (
                      <PlayCircle className="w-8 h-8" />
                    )}
                  </button>
                  <button onClick={() => {}} className="cursor-pointer hover:opacity-80">
                    <SkipForward className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <button onClick={handleMute} className="cursor-pointer hover:opacity-80">
                    {isMuted ? (
                      <VolumeX className="w-5 h-5" />
                    ) : (
                      <Volume2 className="w-5 h-5" />
                    )}
                  </button>
                  <span className="text-sm">4:32 / 12:00</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 bg-white">
            <h2 className="text-xl font-semibold text-[#1A1C14]">
              {type === 'video' ? `Unidad ${unidadId}: Introducción al tema` : ''}
            </h2>
            <p className="text-[#5C6355] mt-2">
              En esta unidad aprenderás los conceptos fundamentales que necesitas dominar
              antes de avanzar al siguiente nivel.
            </p>
          </div>
        </div>
      )
    }

    if (type === 'material') {
      return (
        <div className="h-full overflow-y-auto bg-white p-8">
          <h2 className="text-2xl font-bold text-[#1A1C14] mb-6">
            Material de lectura
          </h2>

          <div className="prose prose-lg max-w-none text-[#1A1C14]">
            <p>
              Los patrones de diseño son soluciones probadas a problemas comunes en el desarrollo
              de software. En el contexto de arquitecturas modernas, entender estos patrones es
              fundamental para construir sistemas escalables y mantenibles.
            </p>

            <p>
              El patrón de arquitectura de microservicios propone dividir una aplicación en
              servicios pequeños e independientes que se comunican a través de APIs bien
              definidas. Cada servicio es responsable de una funcionalidad específica y puede
              ser desarrollado, desplegado y escalado de forma independiente.
            </p>

            <p>
              Entre los beneficios de esta arquitectura encontramos: escalabilidad independiente
              por servicio, tecnologías heterogéneas, desarrollo más rápido por equipos pequeños,
              y mayor resiliencia ante fallos. Sin embargo, también presenta desafíos como la
              gestión de datos distribuidos y la complejidad operacional.
            </p>

            <h3 className="text-lg font-semibold mt-6 mb-3">Recursos adjuntos:</h3>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-2 px-3 py-2 bg-[#F2EDE1] rounded-lg text-sm cursor-pointer hover:bg-[#E8E0D0]">
                📎 openapi-spec.yaml
              </span>
              <span className="inline-flex items-center gap-2 px-3 py-2 bg-[#F2EDE1] rounded-lg text-sm cursor-pointer hover:bg-[#E8E0D0]">
                📎 ejemplos.zip
              </span>
            </div>
          </div>
        </div>
      )
    }

    if (type === 'ejercicio') {
      return (
        <div className="h-full overflow-y-auto bg-white p-8">
          <h2 className="text-2xl font-bold text-[#1A1C14] mb-6">
            Ejercicio práctico
          </h2>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-[#1A1C14] mb-2">Enunciado:</h3>
            <p className="text-[#5C6355]">
              Crea un endpoint GET /usuarios que retorne una lista de usuarios en formato JSON.
              El endpoint debe responder con código 200 OK y retornar un array de objetos con
              las propiedades: id, nombre, email.
            </p>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-[#1A1C14] mb-2">Tu solución:</h3>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="// Escribe tu código aquí"
              className="w-full h-64 bg-[#1E1E1E] text-green-400 font-mono p-4 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
            />
          </div>

          {submitted ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-700 font-medium">
                ✓ Solución enviada — continúa con la siguiente unidad
              </p>
            </div>
          ) : (
            <button
              onClick={handleSubmit}
              className="bg-[#C9A84C] text-[#1A1C14] px-6 py-3 rounded-lg font-medium hover:bg-[#B8970A] transition-colors cursor-pointer"
            >
              Enviar solución
            </button>
          )}
        </div>
      )
    }

    return null
  }

  return (
    <div className="h-full">
      {renderContent()}
    </div>
  )
}