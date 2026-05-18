import { Link } from 'react-router-dom'
import { Star, Users, Clock } from 'lucide-react'
import type { Course } from '../../types'
import Badge from '../ui/Badge'
import RatingStars from '../ui/RatingStars'

interface CourseCardProps {
  course: Course
  variant?: 'default' | 'compact'
}

export default function CourseCard({ course, variant = 'default' }: CourseCardProps) {
  const isCompact = variant === 'compact'

  if (isCompact) {
    return (
      <Link
        to={`/cursos/${course.slug}`}
        className="flex gap-4 p-4 bg-[#F2EDE1] border border-[#E8E0D0] rounded-xl hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
      >
        <img
          src={course.coverImage}
          alt={course.title}
          className="w-24 h-16 object-cover rounded-lg"
        />
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-[#1A1C14] text-sm line-clamp-1">
            {course.title}
          </h4>
          <p className="text-[#5C6355] text-xs mt-1">{course.organization.name}</p>
          <RatingStars rating={course.rating} size="sm" />
        </div>
      </Link>
    )
  }

  return (
    <Link
      to={`/cursos/${course.slug}`}
      className="group block bg-[#F2EDE1] border border-[#E8E0D0] rounded-2xl overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
    >
      <div className="relative aspect-video overflow-hidden">
        <img
          src={course.coverImage}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge label={course.level} variant="level" />
          {course.featured && (
            <Badge label="Destacado" variant="featured" />
          )}
        </div>
      </div>

      <div className="p-5 space-y-3">
        <div className="flex items-center gap-2">
          <img
            src={course.organization.logo}
            alt={course.organization.name}
            className="w-6 h-6 rounded-full"
          />
          <span className="text-sm text-[#5C6355]">
            {course.organization.name}
          </span>
        </div>

        <h3 className="font-semibold text-[#1A1C14] line-clamp-2">
          {course.title}
        </h3>

        <p className="text-sm text-[#5C6355] line-clamp-2">
          {course.shortDescription}
        </p>

        <div className="flex items-center gap-4 text-sm text-[#5C6355]">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-[#C9A84C] text-[#C9A84C]" />
            <span>{course.rating.toFixed(1)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{course.duration}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-[#E8E0D0]">
          <div className="flex items-center gap-1 text-sm text-[#5C6355]">
            <Users className="w-4 h-4" />
            <span>{course.enrolledCount.toLocaleString()} inscritos</span>
          </div>
          <span className="font-semibold text-[#1A1C14]">
            {course.price === 0 ? (
              <span className="text-[#2E7D32]">Gratuito</span>
            ) : (
              `${course.currency === 'USD' ? '$' : ''}${course.price} ${course.currency}`
            )}
          </span>
        </div>
      </div>
    </Link>
  )
}