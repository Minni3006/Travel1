import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../utils/api'
import StarRating from './StarRating'

const ReviewModal = ({ isOpen, onClose, destinationId, onReviewSubmitted }) => {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (rating === 0) {
      setError('Please select a rating')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      // No need to send userId - backend gets it from auth token
      await api.post(`/destinations/${destinationId}/review`, {
        rating,
        comment
      })
      
      onReviewSubmitted()
      onClose()
      setRating(0)
      setComment('')
    } catch (error) {
      console.error('Error submitting review:', error)
      setError(error.response?.data?.message || 'Failed to submit review')
    } finally {
      setSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="card max-w-md w-full relative"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>

          <h2 className="text-2xl font-bold mb-4 neon-text">Rate Your Experience</h2>
          
          <p className="text-sm text-gray-400 mb-4 text-center">
            Share your thoughts about this destination
          </p>
          
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-300 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Star Rating */}
            <div>
              <label className="block text-sm font-medium mb-3 text-center">Select Your Rating *</label>
              <div className="flex justify-center">
                <StarRating
                  rating={rating}
                  onRatingChange={setRating}
                  size="lg"
                />
              </div>
              {rating > 0 && (
                <p className="text-center text-sm text-gray-400 mt-2">
                  {rating === 5 && '⭐ Excellent - Outstanding experience!'}
                  {rating === 4 && '⭐ Very Good - Great experience!'}
                  {rating === 3 && '⭐ Good - Satisfactory experience'}
                  {rating === 2 && '⭐ Fair - Could be better'}
                  {rating === 1 && '⭐ Poor - Needs improvement'}
                </p>
              )}
            </div>

            {/* Comment */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Your Review (Optional)
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows="4"
                className="w-full px-4 py-3 rounded-lg glass border border-white/20 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 text-white resize-none"
                placeholder="Share your experience..."
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary flex-1"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary flex-1"
                disabled={submitting || rating === 0}
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default ReviewModal
