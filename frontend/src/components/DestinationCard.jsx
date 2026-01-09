import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getMainImage, handleImageError } from '../utils/imageUtils'

const DestinationCard = ({ destination }) => {
  // ALWAYS use images[0] - never destination.image
  const mainImage = destination?.images?.[0] || getMainImage(destination)
  const displayRating = destination.averageRating || destination.rating || 0

  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -5 }}
      whileTap={{ scale: 0.98 }}
      className="card overflow-visible group cursor-pointer shadow-xl border border-white/10 hover:border-cyan-400/50 transition-all duration-300 rounded-2xl"
    >
      <Link to={`/destinations/${destination._id}`}>
        <div className="relative h-56 rounded-xl mb-4 overflow-hidden">
          <img
            src={mainImage}
            alt={destination.name}
            className="w-full h-48 object-cover rounded-xl group-hover:scale-110 transition-transform duration-700"
            loading="lazy"
            onError={handleImageError}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Rating Badge */}
          <div className="absolute top-4 right-4 glass px-3 py-1.5 rounded-full text-sm font-bold flex items-center gap-1 z-10">
            ⭐ {displayRating.toFixed(1)}
          </div>
        </div>
        
        <div className="px-2">
          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-3">
            {destination.country && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/50">
                {destination.country}
              </span>
            )}
            {destination.category && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/50">
                {destination.category}
              </span>
            )}
            {displayRating > 0 && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-500/20 text-yellow-300 border border-yellow-500/50 flex items-center gap-1">
                ⭐ {displayRating.toFixed(1)}
              </span>
            )}
          </div>

          <h3 className="text-xl font-bold mb-2 group-hover:text-cyan-400 transition-colors">
            {destination.name}
          </h3>
          <p className="text-gray-400 text-sm mb-2 flex items-center gap-1">
            <span>📍</span> {destination.location}
          </p>
          <p className="text-gray-300 text-sm mb-4 line-clamp-2 min-h-[2.5rem]">
            {destination.description}
          </p>
          <div className="flex items-center justify-between pt-2 border-t border-white/10">
            <div>
              <span className="text-2xl font-bold text-cyan-400">
                ${destination.price}
              </span>
              <span className="text-gray-400 text-sm"> /day</span>
            </div>
            <span className="btn-primary text-sm px-4 py-2">
              Explore →
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default DestinationCard
