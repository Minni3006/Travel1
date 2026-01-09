import express from 'express';
import { body, validationResult } from 'express-validator';
import { authenticate, isAdmin } from '../middleware/auth.js';
import Destination from '../models/Destination.js';
import Booking from '../models/Booking.js';

const router = express.Router();

// Apply auth middleware to all admin routes
router.use(authenticate);
router.use(isAdmin);

// @route   POST /api/admin/destinations
// @desc    Create a new destination
// @access  Private/Admin
router.post('/destinations', [
  body('name').notEmpty().withMessage('Name is required'),
  body('location').notEmpty().withMessage('Location is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('images').isArray({ min: 1 }).withMessage('At least one image is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Ensure images array has at least one image
    const images = req.body.images && req.body.images.length > 0 
      ? req.body.images 
      : (req.body.image ? [req.body.image] : []);
    
    if (images.length === 0) {
      return res.status(400).json({ message: 'At least one image is required' });
    }

    const destinationData = {
      ...req.body,
      images: images,
      image: images[0] // Keep for backward compatibility
    };

    const destination = await Destination.create(destinationData);
    res.status(201).json(destination);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/admin/destinations/:id
// @desc    Update a destination
// @access  Private/Admin
router.put('/destinations/:id', async (req, res) => {
  try {
    // Ensure images array is properly set
    let images = req.body.images;
    if (!images || !Array.isArray(images) || images.length === 0) {
      // Fallback to single image if provided
      if (req.body.image) {
        images = [req.body.image];
      } else {
        // Keep existing images if no new ones provided
        const existing = await Destination.findById(req.params.id);
        images = existing?.images || [];
      }
    }

    const updateData = {
      ...req.body,
      images: images,
      image: images[0] // Keep for backward compatibility
    };

    const destination = await Destination.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!destination) {
      return res.status(404).json({ message: 'Destination not found' });
    }

    res.json(destination);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/admin/destinations/:id
// @desc    Delete a destination
// @access  Private/Admin
router.delete('/destinations/:id', async (req, res) => {
  try {
    const destination = await Destination.findByIdAndDelete(req.params.id);

    if (!destination) {
      return res.status(404).json({ message: 'Destination not found' });
    }

    res.json({ message: 'Destination deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/bookings
// @desc    Get all bookings
// @access  Private/Admin
router.get('/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email')
      .populate('destination')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/admin/bookings/:id/status
// @desc    Update booking status (confirm/complete/cancel)
// @access  Private/Admin
router.put('/bookings/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.status = status;
    
    // Auto-update payment status when completed
    if (status === 'completed') {
      booking.paymentStatus = 'paid';
    }

    await booking.save();
    
    await booking.populate('user', 'name email');
    await booking.populate('destination');

    res.json(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

