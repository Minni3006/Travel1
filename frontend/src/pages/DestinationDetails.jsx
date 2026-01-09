import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import api from '../utils/api'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { getAllImages, handleImageError, optimizeImageUrl } from '../utils/imageUtils'
import ReviewModal from '../components/ReviewModal'
import ReviewsList from '../components/ReviewsList'
import QuickRating from '../components/QuickRating'

const DestinationDetails = () => {
  const { id } = useParams()
  const { isAuthenticated, user } = useAuth()
  const navigate = useNavigate()
  const [destination, setDestination] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [userBookings, setUserBookings] = useState([])

  useEffect(() => {
    fetchDestination()
    if (isAuthenticated && user) {
      fetchUserBookings()
    }
  }, [id, isAuthenticated, user])

  const fetchUserBookings = async () => {
    try {
      const response = await api.get(`/bookings/user/${user.id}`)
      setUserBookings(response.data || [])
    } catch (error) {
      console.error('Error fetching user bookings:', error)
    }
  }

  const hasCompletedBooking = () => {
    return userBookings.some(
      booking => 
        booking.destination?._id === id && 
        booking.status === 'completed'
    )
  }

  const handleReviewSubmitted = () => {
    fetchDestination()
    fetchUserBookings()
  }

  const fetchDestination = async () => {
    setLoading(true)
    setError('')
    try {
      console.log('📡 Fetching destination:', id)
      const response = await api.get(`/destinations/${id}`)
      console.log('✅ Fetched destination:', response.data)
      if (response.data) {
        setDestination(response.data)
      } else {
        setError('Destination not found')
      }
    } catch (error) {
      console.error('❌ Error fetching destination:', error)
      console.error('Error details:', error.response?.data || error.message)
      setError(`Failed to load destination: ${error.response?.data?.message || error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleBookNow = () => {
    if (isAuthenticated) {
      navigate(`/booking/${id}`)
    } else {
      navigate('/login', { state: { from: `/destinations/${id}` } })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400"></div>
      </div>
    )
  }

  if (error || !destination) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">😕</div>
        <h2 className="text-2xl font-bold mb-4">{error || 'Destination not found'}</h2>
        <Link to="/destinations" className="btn-primary">
          Back to Destinations
        </Link>
      </div>
    )
  }

  // ALWAYS use images array - never destination.image
  const images = destination?.images && destination.images.length > 0 
    ? destination.images 
    : getAllImages(destination)

  // Get reviews from destination
  const reviews = destination.reviews || []

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header Image/Gallery */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="relative h-96 md:h-[500px] rounded-2xl mb-4 overflow-hidden">
          <img
            src={optimizeImageUrl(images[selectedImageIndex] || images[0], { width: 1200, quality: 85 })}
            alt={destination.name}
            className="w-full h-full object-cover rounded-2xl"
            loading="eager"
            onError={handleImageError}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          {/* Image Gallery Thumbnails */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImageIndex === index
                      ? 'border-cyan-400 scale-110'
                      : 'border-white/30 hover:border-white/60'
                  }`}
                >
                  <img
                    src={optimizeImageUrl(img, { width: 200, quality: 75 })}
                    alt={`${destination.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={handleImageError}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Image Navigation */}
        {images.length > 1 && (
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setSelectedImageIndex((prev) => 
                prev > 0 ? prev - 1 : images.length - 1
              )}
              className="btn-secondary"
            >
              ← Previous
            </button>
            <span className="text-gray-400 self-center">
              {selectedImageIndex + 1} / {images.length}
            </span>
            <button
              onClick={() => setSelectedImageIndex((prev) => 
                prev < images.length - 1 ? prev + 1 : 0
              )}
              className="btn-secondary"
            >
              Next →
            </button>
          </div>
        )}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Title and Rating */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold neon-text mb-2">
                  {destination.name}
                </h1>
                <p className="text-xl text-gray-300 flex items-center gap-2">
                  <span>📍</span> {destination.location}
                  {destination.country && (
                    <span className="text-gray-500">• {destination.country}</span>
                  )}
                </p>
              </div>
              <div className="glass px-4 py-2 rounded-full text-center">
                <div className="text-2xl font-bold">
                  ⭐ {(destination.averageRating || destination.rating || 4.5).toFixed(1)}
                </div>
                <div className="text-xs text-gray-400">Rating</div>
              </div>
            </div>
          </motion.div>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card"
          >
            <h2 className="text-2xl font-bold mb-4">About This Destination</h2>
            <p className="text-gray-300 leading-relaxed text-lg">
              {destination.description}
            </p>
          </motion.div>

          {/* Activities */}
          {destination.activities && destination.activities.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="card"
            >
              <h2 className="text-2xl font-bold mb-4">Popular Activities</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {destination.activities.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 glass px-4 py-3 rounded-lg"
                  >
                    <span className="text-cyan-400 text-xl">✓</span>
                    <span className="text-gray-300">{activity}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Best Time to Visit */}
          {destination.best_time_to_visit && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="card"
            >
              <h2 className="text-2xl font-bold mb-4">Best Time to Visit</h2>
              <div className="flex items-center gap-3">
                <span className="text-4xl">📅</span>
                <p className="text-gray-300 text-lg">{destination.best_time_to_visit}</p>
              </div>
            </motion.div>
          )}

              {/* Reviews */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="card"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">
                    Traveler Reviews
                    {reviews.length > 0 && (
                      <span className="text-lg text-gray-400 ml-2">
                        ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
                      </span>
                    )}
                  </h2>
                </div>
                
                {/* Quick Rating Option */}
                {isAuthenticated && hasCompletedBooking() && (
                  <div className="mb-6 p-4 rounded-lg glass border border-purple-500/30">
                    <h3 className="text-lg font-semibold mb-3 text-center">Quick Rating</h3>
                    <QuickRating 
                      destinationId={id} 
                      onRatingSubmitted={handleReviewSubmitted}
                      existingRating={
                        reviews.find(r => 
                          r.user?._id === user?.id || r.user?.toString() === user?.id
                        )?.rating
                      }
                    />
                    <p className="text-xs text-gray-400 text-center mt-3">
                      Click stars to rate instantly, or{' '}
                      <button
                        onClick={() => setShowReviewModal(true)}
                        className="text-purple-400 hover:text-purple-300 underline"
                      >
                        write a detailed review
                      </button>
                    </p>
                  </div>
                )}
                
                <ReviewsList reviews={reviews} />
              </motion.div>
        </div>

        {/* Booking Sidebar */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="card sticky top-24"
          >
            <div className="mb-6">
              <div className="text-center mb-4">
                <span className="text-4xl font-bold text-cyan-400">
                  ${destination.price}
                </span>
                <span className="text-gray-400"> /day</span>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Duration:</span>
                  <span className="font-semibold">{destination.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Category:</span>
                  <span className="font-semibold">{destination.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Rating:</span>
                  <span className="font-semibold">
                    ⭐ {(destination.averageRating || destination.rating || 4.5).toFixed(1)}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handleBookNow}
              className="btn-primary w-full text-lg py-4 mb-4"
            >
              {isAuthenticated ? 'Book Now' : 'Login to Book'}
            </button>
            
            {isAuthenticated && hasCompletedBooking() && (
              <button
                onClick={() => setShowReviewModal(true)}
                className="btn-secondary w-full text-lg py-4 mb-4"
              >
                ⭐ Rate Your Experience
              </button>
            )}

            <div className="text-center text-sm text-gray-400">
              <p>✓ Instant confirmation</p>
              <p>✓ Free cancellation</p>
              <p>✓ Best price guarantee</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Review Modal */}
      <ReviewModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        destinationId={id}
        onReviewSubmitted={handleReviewSubmitted}
      />
    </div>
  )
}

export default DestinationDetails
