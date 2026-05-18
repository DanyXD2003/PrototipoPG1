import { Star } from 'lucide-react'

interface RatingStarsProps {
  rating: number
  reviewCount?: number
  size?: 'sm' | 'md'
}

export default function RatingStars({ rating, reviewCount, size = 'sm' }: RatingStarsProps) {
  const starSize = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'
  const textSize = size === 'sm' ? 'text-sm' : 'text-base'

  const renderStars = () => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(
          <Star key={i} className={`${starSize} fill-[#C9A84C] text-[#C9A84C]`} />
        )
      } else if (i - 0.5 <= rating) {
        stars.push(
          <Star
            key={i}
            className={`${starSize} fill-[#C9A84C]/50 text-[#C9A84C]`}
            style={{ clipPath: 'inset(0 0 0 50%)' }}
          />
        )
      } else {
        stars.push(
          <Star key={i} className={`${starSize} text-[#E8E0D0]`} />
        )
      }
    }
    return stars
  }

  return (
    <div className="flex items-center gap-1">
      <div className="flex">{renderStars()}</div>
      <span className={`${textSize} text-[#5C6355]`}>
        {rating.toFixed(1)}
        {reviewCount !== undefined && ` (${reviewCount} reseñas)`}
      </span>
    </div>
  )
}