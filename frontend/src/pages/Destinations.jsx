import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import api from '../utils/api'
import { motion } from 'framer-motion'
import DestinationCard from '../components/DestinationCard'
import CustomDropdown from '../components/CustomDropdown'

const Destinations = () => {
  const [destinations, setDestinations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchParams, setSearchParams] = useSearchParams()
  
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    country: searchParams.get('country') || 'all',
    category: searchParams.get('category') || 'all',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    minRating: searchParams.get('minRating') || 'all'
  })

  const [meta, setMeta] = useState({
    countries: [],
    categories: [],
    ratings: [1, 2, 3, 4, 5]
  })

  useEffect(() => {
    fetchMeta()
  }, [])

  useEffect(() => {
    fetchDestinations()
  }, [filters])

  const fetchMeta = async () => {
    try {
      const response = await api.get('/destinations/meta')
      setMeta(response.data)
    } catch (error) {
      console.error('Error fetching metadata:', error)
    }
  }

  const fetchDestinations = async () => {
    setLoading(true)
    setError('')
    try {
      const params = new URLSearchParams()
      
      if (filters.search) params.append('search', filters.search)
      if (filters.country && filters.country !== 'all') params.append('country', filters.country)
      if (filters.category && filters.category !== 'all') params.append('category', filters.category)
      if (filters.minPrice) params.append('minPrice', filters.minPrice)
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice)
      if (filters.minRating && filters.minRating !== 'all') params.append('minRating', filters.minRating)

      console.log('📡 Fetching destinations from:', `/destinations?${params.toString()}`)
      const response = await api.get(`/destinations?${params.toString()}`)
      console.log('✅ Fetched destinations:', response.data)
      console.log('📊 Destinations count:', response.data?.length || 0)
      
      if (response.data && Array.isArray(response.data)) {
        setDestinations(response.data)
      } else {
        console.warn('⚠️ Response data is not an array:', response.data)
        setDestinations([])
      }
      
      // Update URL
      setSearchParams(params)
    } catch (error) {
      console.error('❌ Error fetching destinations:', error)
      console.error('Error details:', error.response?.data || error.message)
      setError(`Failed to load destinations: ${error.response?.data?.message || error.message}`)
      setDestinations([])
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    const cleared = {
      search: '',
      country: 'all',
      category: 'all',
      minPrice: '',
      maxPrice: '',
      minRating: 'all'
    }
    setFilters(cleared)
    setSearchParams({})
  }

  const getActiveFiltersCount = () => {
    let count = 0
    const activeFilters = []
    
    if (filters.country && filters.country !== 'all') {
      count++
      activeFilters.push('Country')
    }
    if (filters.category && filters.category !== 'all') {
      count++
      activeFilters.push('Category')
    }
    if (filters.minRating && filters.minRating !== 'all') {
      count++
      activeFilters.push('Rating')
    }
    if (filters.minPrice || filters.maxPrice) {
      count++
      activeFilters.push('Price Range')
    }
    if (filters.search) {
      count++
      activeFilters.push('Search')
    }
    
    return { count, activeFilters }
  }

  const { count: activeFiltersCount, activeFilters } = getActiveFiltersCount()

  const countryOptions = [
    { value: 'all', label: 'All Countries' },
    ...meta.countries.map(country => ({ value: country, label: country }))
  ]

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    ...meta.categories.map(category => ({ value: category, label: category }))
  ]

  const ratingOptions = [
    { value: 'all', label: 'Any Rating' },
    ...meta.ratings.map(rating => ({ value: rating.toString(), label: `${rating}+` }))
  ]

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-5xl md:text-6xl font-bold mb-4 neon-text">
          Explore Destinations
        </h1>
        <p className="text-gray-400 text-lg">
          Discover amazing places around the world
        </p>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-6 mb-8 relative"
      >
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <input
            type="text"
            placeholder="Search destinations..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="flex-1 px-4 py-3 rounded-lg glass border border-white/20 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 text-white placeholder-gray-400"
          />
          <button
            onClick={clearFilters}
            className="btn-secondary px-6"
            disabled={activeFiltersCount === 0}
          >
            Clear Filters
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 pt-4 border-t border-white/10">
          <CustomDropdown
            label="Country"
            value={filters.country}
            onChange={(value) => handleFilterChange('country', value)}
            options={countryOptions}
            placeholder="All Countries"
          />

          <CustomDropdown
            label="Category"
            value={filters.category}
            onChange={(value) => handleFilterChange('category', value)}
            options={categoryOptions}
            placeholder="All Categories"
          />

          <CustomDropdown
            label="Rating"
            value={filters.minRating}
            onChange={(value) => handleFilterChange('minRating', value)}
            options={ratingOptions}
            placeholder="Any Rating"
          />

          <div>
            <label className="block text-sm font-medium mb-2">Min Price</label>
            <input
              type="number"
              placeholder="Min"
              value={filters.minPrice}
              onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              className="w-full px-4 py-2 rounded-lg glass border border-white/20 focus:border-cyan-400 focus:outline-none text-white"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Max Price</label>
            <input
              type="number"
              placeholder="Max"
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              className="w-full px-4 py-2 rounded-lg glass border border-white/20 focus:border-cyan-400 focus:outline-none text-white"
              min="0"
            />
          </div>
        </div>
      </motion.div>

      {/* Results Summary */}
      {!loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        >
          <div>
            <h2 className="text-2xl font-bold mb-2">
              Showing {destinations.length} {destinations.length === 1 ? 'destination' : 'destinations'}
            </h2>
            {activeFiltersCount > 0 && (
              <p className="text-gray-400 text-sm">
                Filters applied: {activeFilters.join(', ')}
              </p>
            )}
          </div>
        </motion.div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400"></div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">😕</div>
          <p className="text-red-400 text-xl mb-4">{error}</p>
          <button onClick={fetchDestinations} className="btn-primary">
            Try Again
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && destinations.length === 0 && (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🌍</div>
          <h2 className="text-2xl font-bold mb-4">No destinations found</h2>
          <p className="text-gray-400 mb-8">
            Try adjusting your filters or search terms
          </p>
          <button onClick={clearFilters} className="btn-primary">
            Clear All Filters
          </button>
        </div>
      )}

      {/* Destinations Grid */}
      {!loading && !error && destinations.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((destination, index) => (
            <motion.div
              key={destination._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <DestinationCard destination={destination} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Destinations
