import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../utils/api'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { getMainImage, handleImageError } from '../utils/imageUtils'
import BookingConfirmationModal from '../components/BookingConfirmationModal'

const Booking = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [destination, setDestination] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [createdBooking, setCreatedBooking] = useState(null)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    travelers: 1,
    startDate: '',
    endDate: '',
    notes: '',
    paymentMethod: 'Pay at Check-in'
  })
  const [totalPrice, setTotalPrice] = useState(0)
  const [days, setDays] = useState(0)

  useEffect(() => {
    fetchDestination()
  }, [id])

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || ''
      }))
    }
  }, [user])

  useEffect(() => {
    if (destination && formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate)
      const end = new Date(formData.endDate)
      const calculatedDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24))
      
      if (calculatedDays > 0) {
        setDays(calculatedDays)
        setTotalPrice(destination.price * calculatedDays * formData.travelers)
      } else {
        setDays(0)
        setTotalPrice(0)
      }
    } else {
      setDays(0)
      setTotalPrice(0)
    }
  }, [formData, destination])

  const fetchDestination = async () => {
    setLoading(true)
    setError('')
    try {
      console.log('📡 Fetching destination for booking:', id)
      const response = await api.get(`/destinations/${id}`)
      console.log('✅ Destination loaded:', response.data)
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleTravelersChange = (delta) => {
    setFormData(prev => ({
      ...prev,
      travelers: Math.max(1, Math.min(20, prev.travelers + delta))
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Validation
    if (!formData.name || !formData.email) {
      setError('Please fill in your name and email')
      return
    }

    if (!formData.startDate || !formData.endDate) {
      setError('Please select both start and end dates')
      return
    }

    const start = new Date(formData.startDate)
    const end = new Date(formData.endDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (start < today) {
      setError('Start date cannot be in the past')
      return
    }

    if (end <= start) {
      setError('End date must be after start date')
      return
    }

    if (formData.travelers < 1 || formData.travelers > 20) {
      setError('Number of travelers must be between 1 and 20')
      return
    }

    setSubmitting(true)

    try {
      const response = await api.post('/bookings', {
        destinationId: id,
        startDate: formData.startDate,
        endDate: formData.endDate,
        travelers: parseInt(formData.travelers),
        notes: formData.notes,
        paymentMethod: formData.paymentMethod
      })

      setCreatedBooking(response.data)
      setShowConfirmation(true)
    } catch (error) {
      setError(
        error.response?.data?.message || 
        error.response?.data?.errors?.[0]?.msg ||
        'Failed to create booking. Please try again.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400"></div>
      </div>
    )
  }

  if (error && !destination) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">😕</div>
        <h2 className="text-2xl font-bold mb-4">{error}</h2>
        <button onClick={() => navigate('/destinations')} className="btn-primary">
          Back to Destinations
        </button>
      </div>
    )
  }

  if (!destination) {
    return null
  }

  const minDate = new Date().toISOString().split('T')[0]
  const maxDate = new Date()
  maxDate.setFullYear(maxDate.getFullYear() + 1)
  const maxDateStr = maxDate.toISOString().split('T')[0]

  return (
    <>
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-5xl mx-auto"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-8 neon-text text-center">
            Complete Your Booking
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Destination Summary */}
            <div className="lg:col-span-1">
              <div className="card sticky top-24">
                <img
                  src={getMainImage(destination)}
                  alt={destination.name}
                  className="w-full h-48 object-cover rounded-xl mb-4"
                  loading="lazy"
                  onError={handleImageError}
                />
                <h2 className="text-2xl font-bold mb-2">{destination.name}</h2>
                <p className="text-gray-400 mb-4">📍 {destination.location}</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Price per day:</span>
                    <span className="font-semibold">${destination.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Rating:</span>
                    <span className="font-semibold">⭐ {destination.rating?.toFixed(1) || destination.averageRating?.toFixed(1) || '4.5'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Duration:</span>
                    <span className="font-semibold">{destination.duration}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Form */}
            <div className="lg:col-span-2">
              <div className="card">
                <h3 className="text-2xl font-bold mb-6">Booking Details</h3>

                {error && (
                  <div className="mb-6 p-4 rounded-lg bg-red-500/20 border border-red-500/50 text-red-300 text-sm">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-lg glass border border-white/20 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 text-white"
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-lg glass border border-white/20 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 text-white"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Check-in Date *
                      </label>
                      <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        min={minDate}
                        max={maxDateStr}
                        required
                        className="w-full px-4 py-3 rounded-lg glass border border-white/20 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Check-out Date *
                      </label>
                      <input
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleChange}
                        min={formData.startDate || minDate}
                        max={maxDateStr}
                        required
                        className="w-full px-4 py-3 rounded-lg glass border border-white/20 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 text-white"
                      />
                    </div>
                  </div>

                  {/* Travelers with Increment/Decrement */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Number of Travelers *
                    </label>
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        onClick={() => handleTravelersChange(-1)}
                        disabled={formData.travelers <= 1}
                        className="w-12 h-12 rounded-lg glass border border-white/20 hover:border-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-xl font-bold transition-colors"
                      >
                        −
                      </button>
                      <input
                        type="number"
                        name="travelers"
                        value={formData.travelers}
                        onChange={(e) => {
                          const value = parseInt(e.target.value) || 1
                          setFormData(prev => ({
                            ...prev,
                            travelers: Math.max(1, Math.min(20, value))
                          }))
                        }}
                        min="1"
                        max="20"
                        required
                        className="flex-1 px-4 py-3 rounded-lg glass border border-white/20 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 text-white text-center text-xl font-semibold"
                      />
                      <button
                        type="button"
                        onClick={() => handleTravelersChange(1)}
                        disabled={formData.travelers >= 20}
                        className="w-12 h-12 rounded-lg glass border border-white/20 hover:border-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-xl font-bold transition-colors"
                      >
                        +
                      </button>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">Between 1 and 20 travelers</p>
                  </div>

                  {/* Payment Method */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Payment Method
                    </label>
                    <select
                      name="paymentMethod"
                      value={formData.paymentMethod}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg glass border border-white/20 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 text-white"
                    >
                      <option value="Pay at Check-in">Pay at Check-in</option>
                      <option value="Credit Card">Credit Card</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                    </select>
                    <p className="text-xs text-gray-400 mt-2">
                      💳 No advance payment required. Pay when you arrive.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Special Notes (Optional)
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      rows="4"
                      className="w-full px-4 py-3 rounded-lg glass border border-white/20 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 text-white resize-none"
                      placeholder="Any special requests or notes..."
                    />
                  </div>

                  {totalPrice > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="glass rounded-xl p-6 border-2 border-cyan-400/50"
                    >
                      <h4 className="text-lg font-bold mb-4">Booking Summary</h4>
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Price per day:</span>
                          <span>${destination.price}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Number of days:</span>
                          <span>{days} {days === 1 ? 'day' : 'days'}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Number of travelers:</span>
                          <span>{formData.travelers}</span>
                        </div>
                        <div className="border-t border-white/10 pt-2 mt-2">
                          <div className="flex justify-between text-lg font-bold">
                            <span>Total Amount:</span>
                            <span className="text-cyan-400 text-2xl">
                              ${totalPrice.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting || totalPrice === 0}
                    className="btn-primary w-full py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Processing...' : `Confirm Booking - $${totalPrice.toFixed(2)}`}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Confirmation Modal */}
      <BookingConfirmationModal
        isOpen={showConfirmation}
        onClose={() => {
          setShowConfirmation(false)
          navigate('/dashboard')
        }}
        booking={createdBooking}
        destination={destination}
      />
    </>
  )
}

export default Booking
