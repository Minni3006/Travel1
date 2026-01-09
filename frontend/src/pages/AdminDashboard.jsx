import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { getMainImage, handleImageError } from '../utils/imageUtils'

const AdminDashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [destinations, setDestinations] = useState([])
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('destinations')
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingDestination, setEditingDestination] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    country: '',
    description: '',
    price: '',
    image: '',
    images: '',
    rating: '',
    duration: '',
    category: 'City',
    best_time_to_visit: '',
    activities: '',
    available: true
  })
  const [updatingStatus, setUpdatingStatus] = useState(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [destRes, bookingsRes] = await Promise.all([
        api.get('/destinations'),
        api.get('/admin/bookings')
      ])
      setDestinations(destRes.data)
      setBookings(bookingsRes.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.type === 'checkbox'
          ? e.target.checked
          : e.target.type === 'number'
          ? parseFloat(e.target.value)
          : e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      // Process images array - ensure at least one image
      let imagesArray = []
      if (formData.images) {
        imagesArray = formData.images.split(',').map(img => img.trim()).filter(Boolean)
      }
      // If main image is provided and not in images array, add it as first image
      if (formData.image && !imagesArray.includes(formData.image)) {
        imagesArray.unshift(formData.image)
      }
      // Ensure at least one image
      if (imagesArray.length === 0 && formData.image) {
        imagesArray = [formData.image]
      }
      
      const submitData = {
        ...formData,
        images: imagesArray,
        activities: formData.activities ? formData.activities.split(',').map(act => act.trim()).filter(Boolean) : []
      }
      
      if (editingDestination) {
        await api.put(
          `/admin/destinations/${editingDestination._id}`,
          submitData
        )
      } else {
        await api.post('/admin/destinations', submitData)
      }
      fetchData()
      resetForm()
    } catch (error) {
      console.error('Error saving destination:', error)
      alert('Failed to save destination')
    }
  }

  const handleBookingStatus = async (bookingId, status) => {
    setUpdatingStatus(bookingId)
    try {
      await api.put(`/admin/bookings/${bookingId}/status`, { status })
      await fetchData()
    } catch (error) {
      console.error('Error updating booking status:', error)
      alert('Failed to update booking status')
    } finally {
      setUpdatingStatus(null)
    }
  }

  const handleEdit = (destination) => {
    setEditingDestination(destination)
    setFormData({
      name: destination.name,
      location: destination.location,
      country: destination.country || '',
      description: destination.description,
      price: destination.price,
      image: destination.images?.[0] || '', // For backward compatibility
      images: destination.images?.join(', ') || '',
      rating: destination.rating,
      duration: destination.duration,
      category: destination.category,
      best_time_to_visit: destination.best_time_to_visit || '',
      activities: destination.activities?.join(', ') || '',
      available: destination.available
    })
    setShowAddForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this destination?')) {
      try {
        await api.delete(`/admin/destinations/${id}`)
        fetchData()
      } catch (error) {
        console.error('Error deleting destination:', error)
        alert('Failed to delete destination')
      }
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      location: '',
      country: '',
      description: '',
      price: '',
      image: '',
      images: '',
      rating: '',
      duration: '',
      category: 'City',
      best_time_to_visit: '',
      activities: '',
      available: true
    })
    setEditingDestination(null)
    setShowAddForm(false)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
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
        <h1 className="text-4xl md:text-5xl font-bold mb-8 neon-text">
          Admin Dashboard
        </h1>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-white/10">
          <button
            onClick={() => setActiveTab('destinations')}
            className={`pb-4 px-4 font-semibold transition-colors ${
              activeTab === 'destinations'
                ? 'text-cyan-400 border-b-2 border-cyan-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Destinations ({destinations.length})
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`pb-4 px-4 font-semibold transition-colors ${
              activeTab === 'bookings'
                ? 'text-cyan-400 border-b-2 border-cyan-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Bookings ({bookings.length})
          </button>
        </div>

        {/* Destinations Tab */}
        {activeTab === 'destinations' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Manage Destinations</h2>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="btn-primary"
              >
                {showAddForm ? 'Cancel' : '+ Add Destination'}
              </button>
            </div>

            {showAddForm && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="card mb-8"
              >
                <h3 className="text-xl font-bold mb-4">
                  {editingDestination ? 'Edit Destination' : 'Add New Destination'}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 rounded-lg glass border border-white/20 focus:border-cyan-400 focus:outline-none text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Location
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 rounded-lg glass border border-white/20 focus:border-cyan-400 focus:outline-none text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Country
                      </label>
                      <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 rounded-lg glass border border-white/20 focus:border-cyan-400 focus:outline-none text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Price</label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        required
                        min="0"
                        step="0.01"
                        className="w-full px-4 py-2 rounded-lg glass border border-white/20 focus:border-cyan-400 focus:outline-none text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Rating</label>
                      <input
                        type="number"
                        name="rating"
                        value={formData.rating}
                        onChange={handleChange}
                        required
                        min="0"
                        max="5"
                        step="0.1"
                        className="w-full px-4 py-2 rounded-lg glass border border-white/20 focus:border-cyan-400 focus:outline-none text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Duration
                      </label>
                      <input
                        type="text"
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                        required
                        placeholder="e.g., 7 days"
                        className="w-full px-4 py-2 rounded-lg glass border border-white/20 focus:border-cyan-400 focus:outline-none text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Category</label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg glass border border-white/20 focus:border-cyan-400 focus:outline-none text-white"
                      >
                        <option value="Beach">Beach</option>
                        <option value="Mountain">Mountain</option>
                        <option value="City">City</option>
                        <option value="Adventure">Adventure</option>
                        <option value="Cultural">Cultural</option>
                        <option value="Nature">Nature</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Main Image URL
                      </label>
                      <input
                        type="url"
                        name="image"
                        value={formData.image}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 rounded-lg glass border border-white/20 focus:border-cyan-400 focus:outline-none text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Additional Images (comma-separated URLs)
                      </label>
                      <input
                        type="text"
                        name="images"
                        value={formData.images}
                        onChange={handleChange}
                        placeholder="https://image1.com, https://image2.com"
                        className="w-full px-4 py-2 rounded-lg glass border border-white/20 focus:border-cyan-400 focus:outline-none text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Best Time to Visit
                      </label>
                      <input
                        type="text"
                        name="best_time_to_visit"
                        value={formData.best_time_to_visit}
                        onChange={handleChange}
                        placeholder="e.g., April to June"
                        className="w-full px-4 py-2 rounded-lg glass border border-white/20 focus:border-cyan-400 focus:outline-none text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Activities (comma-separated)
                      </label>
                      <input
                        type="text"
                        name="activities"
                        value={formData.activities}
                        onChange={handleChange}
                        placeholder="Activity 1, Activity 2, Activity 3"
                        className="w-full px-4 py-2 rounded-lg glass border border-white/20 focus:border-cyan-400 focus:outline-none text-white"
                      />
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="available"
                        checked={formData.available}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      <label className="text-sm font-medium">Available</label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      required
                      rows="4"
                      className="w-full px-4 py-2 rounded-lg glass border border-white/20 focus:border-cyan-400 focus:outline-none text-white"
                    />
                  </div>
                  <div className="flex gap-4">
                    <button type="submit" className="btn-primary">
                      {editingDestination ? 'Update' : 'Create'}
                    </button>
                    {editingDestination && (
                      <button
                        type="button"
                        onClick={resetForm}
                        className="btn-secondary"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {destinations.map((destination, index) => (
                <motion.div
                  key={destination._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="card"
                >
                  <img
                    src={getMainImage(destination)}
                    alt={destination.name}
                    className="w-full h-48 object-cover rounded-xl mb-4"
                    loading="lazy"
                    onError={handleImageError}
                  />
                  <h3 className="text-xl font-bold mb-2">{destination.name}</h3>
                  <p className="text-gray-400 text-sm mb-4">
                    📍 {destination.location}
                  </p>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-2xl font-bold text-cyan-400">
                      ${destination.price}
                    </span>
                    <span className="glass px-3 py-1 rounded-full text-sm">
                      ⭐ {destination.rating}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(destination)}
                      className="btn-secondary flex-1 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(destination._id)}
                      className="px-4 py-2 rounded-lg bg-red-500/20 border border-red-500/50 text-red-300 hover:bg-red-500/30 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">All Bookings</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-4 px-4">User</th>
                    <th className="text-left py-4 px-4">Destination</th>
                    <th className="text-left py-4 px-4">Dates</th>
                    <th className="text-left py-4 px-4">Travelers</th>
                    <th className="text-left py-4 px-4">Total</th>
                    <th className="text-left py-4 px-4">Payment</th>
                    <th className="text-left py-4 px-4">Status</th>
                    <th className="text-left py-4 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr
                      key={booking._id}
                      className="border-b border-white/5 hover:bg-white/5"
                    >
                      <td className="py-4 px-4">
                        <div>
                          <div className="font-semibold">
                            {booking.user?.name || 'N/A'}
                          </div>
                          <div className="text-sm text-gray-400">
                            {booking.user?.email || 'N/A'}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        {booking.destination?.name || 'N/A'}
                      </td>
                      <td className="py-4 px-4 text-sm">
                        <div>{formatDate(booking.startDate)}</div>
                        <div className="text-gray-400">
                          to {formatDate(booking.endDate)}
                        </div>
                      </td>
                      <td className="py-4 px-4">{booking.travelers || booking.guests}</td>
                      <td className="py-4 px-4 font-semibold text-cyan-400">
                        ${booking.totalPrice.toFixed(2)}
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm">
                          <div className="font-semibold text-green-300">
                            {booking.paymentMethod || 'Pay at Check-in'}
                          </div>
                          <div className="text-xs text-gray-400">
                            {booking.paymentStatus || 'unpaid'}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                            booking.status === 'completed'
                              ? 'bg-green-500/20 text-green-300 border-green-500/50'
                              : booking.status === 'confirmed'
                              ? 'bg-blue-500/20 text-blue-300 border-blue-500/50'
                              : booking.status === 'pending'
                              ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50'
                              : booking.status === 'cancelled'
                              ? 'bg-red-500/20 text-red-300 border-red-500/50'
                              : 'bg-gray-500/20 text-gray-300 border-gray-500/50'
                          }`}
                        >
                          {booking.status.charAt(0).toUpperCase() +
                            booking.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex flex-col gap-2">
                          {booking.status === 'pending' && (
                            <button
                              onClick={() => handleBookingStatus(booking._id, 'confirmed')}
                              disabled={updatingStatus === booking._id}
                              className="px-3 py-1 text-xs rounded-lg bg-blue-500/20 border border-blue-500/50 text-blue-300 hover:bg-blue-500/30 disabled:opacity-50"
                            >
                              {updatingStatus === booking._id ? '...' : 'Confirm'}
                            </button>
                          )}
                          {booking.status === 'confirmed' && (
                            <button
                              onClick={() => handleBookingStatus(booking._id, 'completed')}
                              disabled={updatingStatus === booking._id}
                              className="px-3 py-1 text-xs rounded-lg bg-green-500/20 border border-green-500/50 text-green-300 hover:bg-green-500/30 disabled:opacity-50"
                            >
                              {updatingStatus === booking._id ? '...' : 'Mark Completed'}
                            </button>
                          )}
                          {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                            <button
                              onClick={() => handleBookingStatus(booking._id, 'cancelled')}
                              disabled={updatingStatus === booking._id}
                              className="px-3 py-1 text-xs rounded-lg bg-red-500/20 border border-red-500/50 text-red-300 hover:bg-red-500/30 disabled:opacity-50"
                            >
                              {updatingStatus === booking._id ? '...' : 'Cancel'}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default AdminDashboard
