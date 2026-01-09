import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  destination: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Destination',
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  travelers: {
    type: Number,
    required: true,
    min: 1,
    max: 20
  },
  guests: {
    type: Number,
    required: true,
    min: 1,
    max: 20
  },
  notes: {
    type: String,
    default: ''
  },
  totalPrice: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['unpaid', 'paid'],
    default: 'unpaid'
  },
  paymentMethod: {
    type: String,
    default: 'Pay at Check-in'
  }
}, {
  timestamps: true
});

export default mongoose.model('Booking', bookingSchema);

