import { Circle, PlayCircle, CheckCircle, XCircle, Clock, Lock } from 'lucide-react'
import type { BlockStatus } from '../../types'

interface BlockStatusIconProps {
  status: BlockStatus
  size?: number
}

export default function BlockStatusIcon({ status, size = 20 }: BlockStatusIconProps) {
  switch (status) {
    case 'not_started':
      return <Circle className="text-[#E8E0D0]" style={{ width: size, height: size }} />
    case 'active':
      return <PlayCircle className="text-[#C9A84C]" style={{ width: size, height: size }} />
    case 'completed':
      return <CheckCircle className="text-[#2D4A3E]" style={{ width: size, height: size }} />
    case 'failed':
      return <XCircle className="text-red-500" style={{ width: size, height: size }} />
    case 'expired':
      return <Clock className="text-[#5C6355]" style={{ width: size, height: size }} />
    case 'locked':
      return <Lock className="text-[#E8E0D0]" style={{ width: size, height: size }} />
    default:
      return <Circle className="text-[#E8E0D0]" style={{ width: size, height: size }} />
  }
}