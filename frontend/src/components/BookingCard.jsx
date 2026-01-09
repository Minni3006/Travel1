import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getMainImage, handleImageError } from '../utils/imageUtils'
import ReviewModal from './ReviewModal'
import { useState, useEffect } from 'react'
import api from '../utils/api'
import { useAuth } from '../context/AuthContext'

const BookingCard = ({ booking, onCancel, onUpdate, canReview = false }) => {
  const { user } = useAuth()
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [cancelling, setCancelling] = useState(false)
  const [hasReviewed, setHasReviewed] = useState(false)
  const [userReview, setUserReview] = useState(null)

  // Check if user has already reviewed this destination
  useEffect(() => {
    const checkUserReview = async () => {
      if (booking.status === 'completed' && booking.destination?._id && user?.id) {
        try {
          const response = await api.get(`/destinations/${booking.destination._id}`)
          const destination = response.data
          if (destination.reviews && Array.isArray(destination.reviews)) {
            const review = destination.reviews.find(
              r => r.user?._id === user.id || r.user?.toString() === user.id
            )
            if (review) {
              setHasReviewed(true)
              setUserReview(review)
            }
          }
        } catch (error) {
          console.error('Error checking user review:', error)
        }
      }
    }
    checkUserReview()
  }, [booking, user])

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50'
      case 'confirmed':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/50'
      case 'completed':
        return 'bg-green-500/20 text-green-300 border-green-500/50'
      case 'cancelled':
        return 'bg-red-500/20 text-red-300 border-red-500/50'
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/50'
    }
  }

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return
    }
    setCancelling(true)
    try {
      await onCancel(booking._id)
    } finally {
      setCancelling(false)
    }
  }

  const handleReviewSubmitted = () => {
    // Refresh review status
    setHasReviewed(false)
    setUserReview(null)
    if (onUpdate) {
      onUpdate()
    }
    // Re-check after a short delay to allow backend to update
    setTimeout(() => {
      const checkUserReview = async () => {
        if (booking.status === 'completed' && booking.destination?._id && user?.id) {
          try {
            const response = await api.get(`/destinations/${booking.destination._id}`)
            const destination = response.data
            if (destination.reviews && Array.isArray(destination.reviews)) {
              const review = destination.reviews.find(
                r => r.user?._id === user.id || r.user?.toString() === user.id
              )
              if (review) {
                setHasReviewed(true)
                setUserReview(review)
              }
            }
          } catch (error) {
            console.error('Error checking user review:', error)
          }
        }
      }
      checkUserReview()
    }, 500)
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card overflow-hidden"
      >
        {/* Image */}
        <div className="relative h-48 overflow-hidden rounded-xl mb-4">
          <img
            src={getMainImage(booking.destination)}
            alt={booking.destination?.name}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={handleImageError}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute top-4 right-4 glass px-3 py-1.5 rounded-full text-sm font-bold">
            ⭐ {booking.destination?.rating?.toFixed(1) || booking.destination?.averageRating?.toFixed(1) || '4.5'}
          </div>
        </div>

        {/* Content */}
        <div className="px-2">
          <h3 className="text-xl font-bold mb-2">{booking.destination?.name}</h3>
          <p className="text-gray-400 text-sm mb-4 flex items-center gap-1">
            <span>📍</span> {booking.destination?.location}
          </p>

          {/* Booking Details */}
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Check-in:</span>
              <span className="font-semibold">{formatDate(booking.startDate)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Check-out:</span>
              <span className="font-semibold">{formatDate(booking.endDate)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Travelers:</span>
              <span className="font-semibold">{booking.travelers || booking.guests}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Total:</span>
              <span className="font-bold text-cyan-400">
                ${booking.totalPrice?.toFixed(2) || '0.00'}
              </span>
            </div>
          </div>

          {/* Payment Status */}
          <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/30">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Payment:</span>
              <span className="text-xs font-semibold text-green-300">
                {booking.paymentMethod || 'Pay at Check-in'}
              </span>
            </div>
            <p className="text-xs text-green-400 mt-1">
              ✓ No advance required
            </p>
          </div>

          {/* Status and Actions */}
          <div className="space-y-3 pt-4 border-t border-white/10">
            <div className="flex items-center justify-between">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                  booking.status
                )}`}
              >
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              </span>
              
              {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                <button
                  onClick={handleCancel}
                  disabled={cancelling}
                  className="text-xs text-red-400 hover:text-red-300 disabled:opacity-50"
                >
                  {cancelling ? '...' : 'Cancel'}
                </button>
              )}
            </div>

            {/* Rating Button - Prominent for Completed Bookings */}
            {booking.status === 'completed' && canReview && (
              <div className="space-y-2">
                {hasReviewed && userReview && (
                  <div className="p-2 rounded-lg bg-green-500/10 border border-green-500/30 text-center">
                    <p className="text-xs text-green-300">
                      ✓ You rated this {userReview.rating}⭐
                    </p>
                  </div>
                )}
                <button
                  onClick={() => setShowReviewModal(true)}
                  className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-2 border-purple-500/50 text-purple-300 hover:from-purple-500/30 hover:to-pink-500/30 hover:border-purple-400 transition-all duration-300 font-semibold flex items-center justify-center gap-2"
                >
                  <span className="text-lg">⭐</span>
                  <span>{hasReviewed ? 'Update Your Rating' : 'Rate Your Experience'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Review Modal */}
      {showReviewModal && (
        <ReviewModal
          isOpen={showReviewModal}
          onClose={() => setShowReviewModal(false)}
          destinationId={booking.destination?._id}
          onReviewSubmitted={handleReviewSubmitted}
        />
      )}
    </>
  )
}

export default BookingCard
