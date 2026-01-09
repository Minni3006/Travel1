import { useState } from 'react'

const StarRating = ({ rating, onRatingChange, readonly = false, size = 'md' }) => {
  const [hoveredRating, setHoveredRating] = useState(0)

  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-3xl',
    lg: 'text-4xl'
  }

  return (
    <div className="flex gap-1 items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => !readonly && onRatingChange && onRatingChange(star)}
          onMouseEnter={() => !readonly && setHoveredRating(star)}
          onMouseLeave={() => !readonly && setHoveredRating(0)}
          disabled={readonly}
          className={`${sizeClasses[size]} transition-transform hover:scale-110 ${
            readonly ? 'cursor-default' : 'cursor-pointer'
          }`}
        >
          <span
            className={
              star <= (hoveredRating || rating)
                ? 'text-yellow-400'
                : 'text-gray-600'
            }
          >
            ⭐
          </span>
        </button>
      ))}
      {!readonly && rating > 0 && (
        <span className="ml-2 text-sm text-gray-400">
          {rating === 5 && 'Excellent!'}
          {rating === 4 && 'Very Good!'}
          {rating === 3 && 'Good'}
          {rating === 2 && 'Fair'}
          {rating === 1 && 'Poor'}
        </span>
      )}
    </div>
  )
}

export default StarRating
