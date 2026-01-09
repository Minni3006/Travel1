/**
 * Image utility functions for handling destination images
 */

// Fallback placeholder image URL
export const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80'

/**
 * Get the main image for a destination
 * ALWAYS uses images[0] - never destination.image
 * @param {Object} destination - Destination object
 * @returns {string} Image URL
 */
export const getMainImage = (destination) => {
  if (!destination) return PLACEHOLDER_IMAGE
  
  // ALWAYS use images array first
  if (destination.images && Array.isArray(destination.images) && destination.images.length > 0) {
    return destination.images[0]
  }
  
  // Fallback to placeholder
  return PLACEHOLDER_IMAGE
}

/**
 * Get all images for a destination
 * @param {Object} destination - Destination object
 * @returns {Array<string>} Array of image URLs
 */
export const getAllImages = (destination) => {
  if (!destination) return [PLACEHOLDER_IMAGE]
  
  // Use images array
  if (destination.images && Array.isArray(destination.images) && destination.images.length > 0) {
    return destination.images
  }
  
  // Fallback to placeholder
  return [PLACEHOLDER_IMAGE]
}

/**
 * Handle image load error
 * @param {Event} event - Error event
 */
export const handleImageError = (event) => {
  const placeholder = PLACEHOLDER_IMAGE
  if (event.target.src !== placeholder) {
    event.target.src = placeholder
    event.target.onerror = null // Prevent infinite loop
  }
}

/**
 * Optimize Unsplash image URL
 * @param {string} url - Original Unsplash URL
 * @param {Object} options - Options for optimization
 * @returns {string} Optimized URL
 */
export const optimizeImageUrl = (url, options = {}) => {
  if (!url) return PLACEHOLDER_IMAGE
  
  const {
    width = 1200,
    quality = 80,
    fit = 'cover'
  } = options
  
  // If it's already an Unsplash URL with proper format, return as is
  if (url.includes('unsplash.com')) {
    // If URL already has auto=format, return as is
    if (url.includes('auto=format')) {
      return url
    }
    // Otherwise, add parameters
    const separator = url.includes('?') ? '&' : '?'
    return `${url}${separator}auto=format&fit=${fit}&w=${width}&q=${quality}`
  }
  
  return url
}
