import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import SearchBar from '../components/SearchBar'
import { useEffect, useState } from 'react'
import api from '../utils/api'
import DestinationCard from '../components/DestinationCard'

const Home = () => {
  const [destinations, setDestinations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchDestinations()
  }, [])

  const fetchDestinations = async () => {
    setLoading(true)
    setError('')
    try {
      console.log('📡 Home: Fetching destinations')
      const response = await api.get('/destinations')
      console.log('✅ Home: Fetched destinations:', response.data?.length || 0)
      if (response.data && Array.isArray(response.data)) {
        setDestinations(response.data.slice(0, 6))
      } else {
        console.warn('⚠️ Home: Response data is not an array')
        setDestinations([])
      }
    } catch (error) {
      console.error('❌ Home: Error fetching destinations:', error)
      setError('Failed to load destinations. Please try again later.')
      setDestinations([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-purple-500/20 to-pink-500/20 blur-3xl"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl md:text-8xl font-bold mb-6 neon-text">
              Voyago
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Embark on extraordinary journeys. Discover the world with
              cutting-edge travel technology.
            </p>
            <div className="mb-12">
              <SearchBar />
            </div>
            <div className="flex gap-4 justify-center">
              <Link to="/destinations" className="btn-primary text-lg px-8 py-4">
                Explore Destinations
              </Link>
              <Link to="/register" className="btn-secondary text-lg px-8 py-4">
                Get Started
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 neon-text">
            Featured Destinations
          </h2>
          <p className="text-gray-400 text-lg">
            Handpicked experiences for the modern traveler
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400"></div>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-400 text-xl mb-4">{error}</p>
            <button onClick={fetchDestinations} className="btn-primary">
              Try Again
            </button>
          </div>
        ) : destinations.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🌍</div>
            <p className="text-gray-400 text-xl mb-4">
              No destinations available at the moment.
            </p>
            <p className="text-gray-500 text-sm">
              Please check back later or contact support.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {destinations.map((destination, index) => (
              <motion.div
                key={destination._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <DestinationCard destination={destination} />
              </motion.div>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link to="/destinations" className="btn-primary">
            View All Destinations
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="card text-center"
          >
            <div className="text-4xl mb-4">🚀</div>
            <h3 className="text-xl font-bold mb-2">Instant Booking</h3>
            <p className="text-gray-400">
              Book your dream destination in seconds with our streamlined
              platform
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="card text-center"
          >
            <div className="text-4xl mb-4">✨</div>
            <h3 className="text-xl font-bold mb-2">Best Prices</h3>
            <p className="text-gray-400">
              Competitive pricing with exclusive deals and discounts
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="card text-center"
          >
            <div className="text-4xl mb-4">🛡️</div>
            <h3 className="text-xl font-bold mb-2">Secure & Safe</h3>
            <p className="text-gray-400">
              Your data and payments are protected with enterprise-grade
              security
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Home

