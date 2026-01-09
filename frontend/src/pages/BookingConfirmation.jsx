import { useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

const BookingConfirmation = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  const booking = location.state?.booking
  const destination = location.state?.destination

  useEffect(() => {
    // Redirect if no booking data
    if (!booking || !destination) {
      navigate('/dashboard')
    }
  }, [booking, destination, navigate])

  if (!booking || !destination) {
    return null
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const days = Math.ceil(
    (new Date(booking.endDate) - new Date(booking.startDate)) / (1000 * 60 * 60 * 24)
  )

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl w-full"
      >
        <div className="card text-center">
          {/* Success Animation */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="mb-6"
          >
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
              <motion.svg
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="w-12 h-12 text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <motion.path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </motion.svg>
            </div>
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4 neon-text">
            Booking Confirmed! 🎉
          </h1>
          <p className="text-gray-400 text-lg mb-8">
            Your booking has been successfully created
          </p>

          {/* Booking Details */}
          <div className="glass rounded-xl p-6 mb-6 text-left">
            <div className="mb-4 pb-4 border-b border-white/10">
              <h3 className="text-sm text-gray-400 mb-1">Booking ID</h3>
              <p className="text-xl font-bold text-cyan-400">{booking._id.slice(-8).toUpperCase()}</p>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm text-gray-400 mb-1">Destination</h3>
                <p className="text-lg font-semibold">{destination.name}</p>
                <p className="text-gray-400">📍 {destination.location}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm text-gray-400 mb-1">Check-in</h3>
                  <p className="font-semibold">{formatDate(booking.startDate)}</p>
                </div>
                <div>
                  <h3 className="text-sm text-gray-400 mb-1">Check-out</h3>
                  <p className="font-semibold">{formatDate(booking.endDate)}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm text-gray-400 mb-1">Travelers</h3>
                  <p className="font-semibold">{booking.travelers || booking.guests}</p>
                </div>
                <div>
                  <h3 className="text-sm text-gray-400 mb-1">Duration</h3>
                  <p className="font-semibold">{days} {days === 1 ? 'day' : 'days'}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total Amount</span>
                  <span className="text-3xl font-bold text-cyan-400">
                    ${booking.totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                  booking.status === 'confirmed'
                    ? 'bg-green-500/20 text-green-300 border-green-500/50'
                    : booking.status === 'pending'
                    ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50'
                    : 'bg-gray-500/20 text-gray-300 border-gray-500/50'
                }`}>
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/dashboard" className="btn-primary flex-1">
              View My Bookings
            </Link>
            <Link to="/destinations" className="btn-secondary flex-1">
              Explore More
            </Link>
          </div>

          <p className="text-sm text-gray-400 mt-6">
            A confirmation email has been sent to {user?.email || 'your email'}
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default BookingConfirmation
