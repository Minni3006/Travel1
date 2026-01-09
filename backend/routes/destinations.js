import express from 'express';
import Destination from '../models/Destination.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/destinations
// @desc    Get all destinations with filters
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { search, country, category, minPrice, maxPrice, minRating } = req.query;
    
    // Start with available destinations only
    let query = { available: { $ne: false } };
    let andConditions = [];

    // Search filter
    if (search) {
      andConditions.push({
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { location: { $regex: search, $options: 'i' } },
          { country: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ]
      });
    }

    // Country filter
    if (country && country !== 'all') {
      query.country = country;
    }

    // Category filter
    if (category && category !== 'all') {
      query.category = category;
    }

    // Price filters
    if (minPrice) {
      query.price = { ...query.price, $gte: Number(minPrice) };
    }
    if (maxPrice) {
      query.price = { ...query.price, $lte: Number(maxPrice) };
    }

    // Rating filter - check both rating and averageRating
    if (minRating && minRating !== 'all') {
      const ratingValue = Number(minRating);
      andConditions.push({
        $or: [
          { rating: { $gte: ratingValue } },
          { averageRating: { $gte: ratingValue } }
        ]
      });
    }

    // Combine all AND conditions
    if (andConditions.length > 0) {
      query.$and = andConditions;
    }

    console.log('🔍 Query:', JSON.stringify(query, null, 2));
    const destinations = await Destination.find(query).sort({ createdAt: -1 });
    console.log('✅ Destinations count:', destinations.length);
    
    res.status(200).json(destinations);
  } catch (error) {
    console.error('❌ Error fetching destinations:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/destinations/meta
// @desc    Get metadata for filters (unique countries, categories, ratings)
// @access  Public
router.get('/meta', async (req, res) => {
  try {
    const destinations = await Destination.find({ available: { $ne: false } });
    
    // Get unique countries
    const countries = [...new Set(destinations.map(d => d.country).filter(Boolean))].sort();
    
    // Get unique categories
    const categories = [...new Set(destinations.map(d => d.category).filter(Boolean))].sort();
    
    // Ratings array
    const ratings = [1, 2, 3, 4, 5];
    
    res.json({
      countries,
      categories,
      ratings
    });
  } catch (error) {
    console.error('Error fetching destination metadata:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/destinations/:id
// @desc    Get single destination
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id)
      .populate('reviews.user', 'name');
    if (!destination) {
      return res.status(404).json({ message: 'Destination not found' });
    }
    res.json(destination);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/destinations/:id/review
// @desc    Add a review to a destination (only for users with completed bookings)
// @access  Private
router.post('/:id/review', authenticate, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const destinationId = req.params.id;
    const userId = req.user.userId; // Get userId from authenticated user
    
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const destination = await Destination.findById(destinationId);
    if (!destination) {
      return res.status(404).json({ message: 'Destination not found' });
    }

    // Check if user has a completed booking for this destination
    const Booking = (await import('../models/Booking.js')).default;
    const completedBooking = await Booking.findOne({
      user: userId,
      destination: destinationId,
      status: 'completed'
    });

    if (!completedBooking) {
      return res.status(403).json({ 
        message: 'You can only review destinations after completing a booking' 
      });
    }

    // Check if user already reviewed
    const existingReviewIndex = destination.reviews.findIndex(
      review => review.user.toString() === userId
    );
    
    if (existingReviewIndex !== -1) {
      // Update existing review
      destination.reviews[existingReviewIndex].rating = rating;
      destination.reviews[existingReviewIndex].comment = comment || '';
      destination.reviews[existingReviewIndex].date = new Date();
    } else {
      // Add new review
      destination.reviews.push({
        user: userId,
        rating,
        comment: comment || '',
        date: new Date()
      });
    }

    // Calculate average rating
    const totalRating = destination.reviews.reduce((sum, review) => sum + review.rating, 0);
    destination.averageRating = totalRating / destination.reviews.length;
    destination.rating = destination.averageRating; // Keep backward compatibility

    await destination.save();
    
    const updatedDestination = await Destination.findById(destinationId)
      .populate('reviews.user', 'name');

    res.status(201).json(updatedDestination);
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
