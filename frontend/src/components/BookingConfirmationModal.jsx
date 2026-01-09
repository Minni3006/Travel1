import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const BookingConfirmationModal = ({ isOpen, onClose, booking, destination }) => {
  const navigate = useNavigate()

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
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>

          {/* Success Icon */}
          <div className="text-center mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center"
            >
              <svg
                className="w-12 h-12 text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </motion.div>
            <h2 className="text-3xl font-bold mb-2 neon-text">
              Your booking has been created!
            </h2>
          </div>

          {/* Booking Details */}
          <div className="space-y-4 mb-6">
            <div className="glass rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-400">Status:</span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-500/20 text-yellow-300 border border-yellow-500/50">
                  Pending approval
                </span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-400">Payment Method:</span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-300 border border-green-500/50">
                  Pay at Check-in
                </span>
              </div>
              <div className="mt-3 p-3 rounded-lg bg-green-500/10 border border-green-500/30">
                <p className="text-sm text-green-300 text-center">
                  ✓ No advance payment required
                </p>
              </div>
              {destination && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Destination:</span>
                  <span className="font-semibold">{destination.name}</span>
                </div>
              )}
              {booking && (
                <div className="flex justify-between items-center mt-2">
                  <span className="text-gray-400">Total:</span>
                  <span className="text-xl font-bold text-cyan-400">
                    ${booking.totalPrice?.toFixed(2) || '0.00'}
                  </span>
                </div>
              )}
            </div>

            <p className="text-gray-300 text-sm text-center">
              A confirmation message will be sent once your booking is approved.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={() => {
                navigate('/dashboard')
                onClose()
              }}
              className="btn-primary flex-1"
            >
              Go to My Bookings
            </button>
            <button
              onClick={onClose}
              className="btn-secondary flex-1"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default BookingConfirmationModal
