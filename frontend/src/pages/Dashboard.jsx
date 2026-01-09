import { useEffect, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import api from '../utils/api'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import BookingCard from '../components/BookingCard'

const Dashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState(
    location.state?.message || ''
  )
  const [cancellingId, setCancellingId] = useState(null)

  useEffect(() => {
    if (message) {
      setTimeout(() => setMessage(''), 5000)
    }
  }, [message])

  useEffect(() => {
    if (user) {
      fetchBookings()
    }
  }, [user])

  const fetchBookings = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await api.get(`/bookings/user/${user.id}`)
      setBookings(response.data)
    } catch (error) {
      console.error('Error fetching bookings:', error)
      setError('Failed to load bookings. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async (bookingId) => {
    setCancellingId(bookingId)
    try {
      await api.put(`/bookings/${bookingId}/cancel`)
      await fetchBookings()
      setMessage('Booking cancelled successfully')
    } catch (error) {
      console.error('Error cancelling booking:', error)
      alert('Failed to cancel booking. Please try again.')
    } finally {
      setCancellingId(null)
    }
  }

  const handleUpdate = () => {
    fetchBookings()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-2 neon-text">
              My Dashboard
            </h1>
            <p className="text-gray-400">
              Welcome back, {user?.name}! Manage your bookings here.
            </p>
          </div>
          <Link to="/destinations" className="btn-primary">
            Explore More
          </Link>
        </div>

        {/* User Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card mb-8"
        >
          <h2 className="text-2xl font-bold mb-4">Profile Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-400 mb-1">Name</p>
              <p className="font-semibold">{user?.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Email</p>
              <p className="font-semibold">{user?.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Role</p>
              <p className="font-semibold capitalize">{user?.role || 'User'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Total Bookings</p>
              <p className="font-semibold">{bookings.length}</p>
            </div>
          </div>
        </motion.div>

        {/* Messages */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-lg bg-green-500/20 border border-green-500/50 text-green-300"
          >
            {message}
          </motion.div>
        )}

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/20 border border-red-500/50 text-red-300">
            {error}
            <button onClick={fetchBookings} className="ml-4 text-sm underline">
              Retry
            </button>
          </div>
        )}

        {/* Bookings Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">My Bookings</h2>
        </div>

        {bookings.length === 0 ? (
          <div className="card text-center py-20">
            <div className="text-6xl mb-4">✈️</div>
            <h2 className="text-2xl font-bold mb-4">No Bookings Yet</h2>
            <p className="text-gray-400 mb-8">
              Start exploring amazing destinations and book your next adventure!
            </p>
            <Link to="/destinations" className="btn-primary">
              Browse Destinations
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((booking, index) => (
              <BookingCard
                key={booking._id}
                booking={booking}
                onCancel={handleCancel}
                onUpdate={handleUpdate}
                canReview={booking.status === 'completed'}
              />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default Dashboard
