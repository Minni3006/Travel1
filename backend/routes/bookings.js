import express from 'express';
import { body, validationResult } from 'express-validator';
import { authenticate } from '../middleware/auth.js';
import Booking from '../models/Booking.js';
import Destination from '../models/Destination.js';

const router = express.Router();

// @route   POST /api/bookings
// @desc    Create a new booking
// @access  Private
router.post('/', authenticate, [
  body('destinationId').notEmpty().withMessage('Destination is required'),
  body('startDate').notEmpty().withMessage('Start date is required'),
  body('endDate').notEmpty().withMessage('End date is required'),
  body('travelers').isInt({ min: 1 }).withMessage('Travelers must be at least 1')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { destinationId, startDate, endDate, travelers, notes } = req.body;

    const destination = await Destination.findById(destinationId);
    if (!destination) {
      return res.status(404).json({ message: 'Destination not found' });
    }

    const days = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
    if (days <= 0) {
      return res.status(400).json({ message: 'End date must be after start date' });
    }

    const totalPrice = destination.price * days * travelers;

    const booking = await Booking.create({
      user: req.user.userId,
      destination: destinationId,
      startDate,
      endDate,
      travelers,
      guests: travelers, // Keep for backward compatibility
      notes: notes || '',
      totalPrice,
      paymentStatus: 'unpaid',
      paymentMethod: 'Pay at Check-in',
      status: 'pending'
    });

    await booking.populate('destination');
    await booking.populate('user', 'name email');

    console.log('✅ Booking created:', booking._id);
    res.status(201).json(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/bookings/:id
// @desc    Get single booking
// @access  Private
router.get('/:id', authenticate, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('destination')
      .populate('user', 'name email');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user owns booking or is admin
    if (booking.user._id.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/bookings/:id/cancel
// @desc    Cancel a booking
// @access  Private
router.put('/:id/cancel', authenticate, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user owns booking or is admin
    if (booking.user.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    booking.status = 'cancelled';
    await booking.save();

    await booking.populate('destination');

    res.json(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/bookings/:id/status
// @desc    Update booking status (for admin)
// @access  Private/Admin
router.put('/:id/status', authenticate, async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    booking.status = status;
    
    // Auto-update payment status when completed
    if (status === 'completed') {
      booking.paymentStatus = 'paid';
    }

    await booking.save();
    await booking.populate('destination');
    await booking.populate('user', 'name email');

    res.json(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/bookings/:id/payment
// @desc    Update payment status
// @access  Private/Admin
router.put('/:id/payment', authenticate, async (req, res) => {
  try {
    const { paymentStatus, paymentMethod } = req.body;
    
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user is admin or owns booking
    if (booking.user.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (paymentStatus) {
      booking.paymentStatus = paymentStatus;
    }
    if (paymentMethod) {
      booking.paymentMethod = paymentMethod;
    }

    await booking.save();
    await booking.populate('destination');
    await booking.populate('user', 'name email');

    res.json(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/bookings/user/:id
// @desc    Get user bookings
// @access  Private
router.get('/user/:id', authenticate, async (req, res) => {
  try {
    if (req.user.userId !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const bookings = await Booking.find({ user: req.params.id })
      .populate('destination')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

