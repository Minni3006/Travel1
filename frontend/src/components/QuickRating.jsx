import { useState } from 'react'
import { motion } from 'framer-motion'
import StarRating from './StarRating'
import api from '../utils/api'
import { useAuth } from '../context/AuthContext'

const QuickRating = ({ destinationId, onRatingSubmitted, existingRating = null }) => {
  const { isAuthenticated } = useAuth()
  const [rating, setRating] = useState(existingRating || 0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleRatingClick = async (selectedRating) => {
    if (!isAuthenticated) {
      setError('Please login to rate destinations')
      return
    }

    if (selectedRating === rating && existingRating) {
      // Already rated with this value
      return
    }

    setRating(selectedRating)
    setSubmitting(true)
    setError('')
    setSuccess(false)

    try {
      await api.post(`/destinations/${destinationId}/review`, {
        rating: selectedRating,
        comment: '' // Quick rating without comment
      })
      
      setSuccess(true)
      if (onRatingSubmitted) {
        onRatingSubmitted()
      }
      
      // Hide success message after 2 seconds
      setTimeout(() => setSuccess(false), 2000)
    } catch (error) {
      console.error('Error submitting rating:', error)
      setError(error.response?.data?.message || 'Failed to submit rating')
      setRating(existingRating || 0) // Revert to previous rating
    } finally {
      setSubmitting(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="text-center py-4">
        <p className="text-sm text-gray-400 mb-2">Login to rate this destination</p>
        <StarRating rating={0} readonly={true} size="md" />
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-center gap-2">
        <span className="text-sm text-gray-400">Rate:</span>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => handleRatingClick(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              disabled={submitting}
              className={`text-2xl transition-all duration-200 ${
                submitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-125'
              } ${
                star <= (hoveredRating || rating)
                  ? 'text-yellow-400'
                  : 'text-gray-600'
              }`}
            >
              ⭐
            </button>
          ))}
        </div>
        {rating > 0 && (
          <span className="text-sm text-gray-400 ml-2">
            {rating === 5 && 'Excellent!'}
            {rating === 4 && 'Very Good!'}
            {rating === 3 && 'Good'}
            {rating === 2 && 'Fair'}
            {rating === 1 && 'Poor'}
          </span>
        )}
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-xs text-red-400"
        >
          {error}
        </motion.div>
      )}

      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="text-center text-xs text-green-400"
        >
          ✓ Rating submitted!
        </motion.div>
      )}
    </div>
  )
}

export default QuickRating
