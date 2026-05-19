import { useState, useEffect } from 'react'
import { Clock, AlertCircle } from 'lucide-react'

interface CountdownTimerProps {
  expiresAt: string
  size?: 'sm' | 'md' | 'lg'
}

export default function CountdownTimer({ expiresAt, size = 'md' }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number } | null>(null)
  const [isExpired, setIsExpired] = useState(false)

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date().getTime()
      const expiry = new Date(expiresAt).getTime()
      const diff = expiry - now

      if (diff <= 0) {
        setIsExpired(true)
        return null
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

      return { days, hours, minutes }
    }

    setTimeLeft(calculateTime())
    const interval = setInterval(() => {
      setTimeLeft(calculateTime())
    }, 60000)

    return () => clearInterval(interval)
  }, [expiresAt])

  if (isExpired || !timeLeft) {
    return (
      <div className="flex items-center gap-1.5 text-red-700 bg-red-50 px-2 py-1 rounded-lg">
        <AlertCircle className="w-4 h-4" />
        <span className="text-sm font-medium">Tiempo agotado</span>
      </div>
    )
  }

  const totalDays = timeLeft.days

  let textColor = 'text-[#2D4A3E]'
  let bgColor = 'bg-[#F2EDE1]'
  let Icon = Clock

  if (totalDays < 1) {
    textColor = 'text-red-700'
    bgColor = 'bg-red-50'
    Icon = AlertCircle
  } else if (totalDays < 3) {
    textColor = 'text-amber-700'
    bgColor = 'bg-amber-50'
  }

  if (size === 'sm') {
    return (
      <span className={`flex items-center gap-1 ${textColor}`}>
        <Icon className="w-3.5 h-3.5" />
        {timeLeft.days}d {timeLeft.hours}h
      </span>
    )
  }

  if (size === 'lg') {
    return (
      <div className={`flex items-center gap-2 ${textColor}`}>
        <Icon className="w-5 h-5" />
        <div className="flex items-center gap-3">
          <div className="text-center">
            <div className="text-2xl font-bold">{timeLeft.days}</div>
            <div className="text-xs opacity-70">días</div>
          </div>
          <span className="text-xl font-bold">·</span>
          <div className="text-center">
            <div className="text-2xl font-bold">{timeLeft.hours}</div>
            <div className="text-xs opacity-70">horas</div>
          </div>
          <span className="text-xl font-bold">·</span>
          <div className="text-center">
            <div className="text-2xl font-bold">{timeLeft.minutes}</div>
            <div className="text-xs opacity-70">minutos</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`flex items-center gap-2 ${textColor} ${bgColor} px-3 py-2 rounded-lg`}>
      <Icon className="w-4 h-4" />
      <span className="text-sm font-medium">
        {timeLeft.days} días, {timeLeft.hours} horas restantes
      </span>
    </div>
  )
}