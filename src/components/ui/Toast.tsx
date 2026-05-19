import { useEffect, useState } from 'react'
import { CheckCircle, Info } from 'lucide-react'

interface ToastProps {
  message: string
  type?: 'success' | 'info'
  visible: boolean
  onHide: () => void
  duration?: number
}

export default function Toast({ message, type = 'success', visible, onHide, duration = 2000 }: ToastProps) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (visible) {
      setShow(true)
      const timer = setTimeout(() => {
        setShow(false)
        setTimeout(onHide, 300)
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [visible, duration, onHide])

  if (!visible && !show) return null

  return (
    <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
      show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
    }`}>
      <div className="bg-[#1A1C14] text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3">
        {type === 'success' ? (
          <CheckCircle className="w-5 h-5 text-green-400" />
        ) : (
          <Info className="w-5 h-5 text-blue-400" />
        )}
        <span className="text-sm">{message}</span>
      </div>
    </div>
  )
}