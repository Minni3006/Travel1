import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Destination from './models/Destination.js';
import User from './models/User.js';

dotenv.config();

const destinations = [
  {
    name: 'Paris',
    location: 'Paris, France',
    country: 'France',
    description: 'Experience the City of Light with its iconic Eiffel Tower, world-class museums, charming cafes, and romantic atmosphere. Discover the Louvre, Notre-Dame, and stroll along the Seine River.',
    price: 450,
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80'
    ],
    rating: 4.8,
    duration: '5 days',
    category: 'Romantic',
    best_time_to_visit: 'April to June, September to October',
    activities: ['Visit Eiffel Tower', 'Louvre Museum', 'Seine River Cruise', 'Notre-Dame Cathedral', 'Montmartre District'],
    available: true
  },
  {
    name: 'Bali',
    location: 'Bali, Indonesia',
    country: 'Indonesia',
    description: 'Tropical paradise with stunning beaches, ancient temples, lush rice terraces, and vibrant culture. Perfect for relaxation, adventure, and spiritual experiences.',
    price: 350,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80'
    ],
    rating: 4.9,
    duration: '7 days',
    category: 'Beach',
    best_time_to_visit: 'April to October (Dry season)',
    activities: ['Beach hopping', 'Temple visits', 'Rice terrace tours', 'Water sports', 'Spa & wellness'],
    available: true
  },
  {
    name: 'Dubai',
    location: 'Dubai, UAE',
    country: 'United Arab Emirates',
    description: 'Ultra-modern city with world-record architecture, luxury shopping, desert adventures, and stunning skyline. Experience the perfect blend of tradition and innovation.',
    price: 650,
    image: 'https://images.unsplash.com/photo-1504274066651-8d31a536b11a?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1504274066651-8d31a536b11a?auto=format&fit=crop&w=1200&q=80'
    ],
    rating: 4.7,
    duration: '5 days',
    category: 'Luxury',
    best_time_to_visit: 'November to March (Cooler months)',
    activities: ['Burj Khalifa visit', 'Desert safari', 'Dubai Mall', 'Palm Jumeirah', 'Gold Souk'],
    available: true
  },
  {
    name: 'New York',
    location: 'New York, USA',
    country: 'United States',
    description: 'The city that never sleeps! Explore Times Square, Central Park, Statue of Liberty, Broadway shows, world-class dining, and iconic landmarks.',
    price: 550,
    image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80'
    ],
    rating: 4.6,
    duration: '6 days',
    category: 'City',
    best_time_to_visit: 'April to June, September to November',
    activities: ['Statue of Liberty', 'Central Park', 'Times Square', 'Broadway shows', 'Brooklyn Bridge'],
    available: true
  },
  {
    name: 'Tokyo',
    location: 'Tokyo, Japan',
    country: 'Japan',
    description: 'Futuristic metropolis blending ancient traditions with cutting-edge technology. Experience cherry blossoms, sushi, temples, and the vibrant Shibuya district.',
    price: 600,
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80'
    ],
    rating: 4.9,
    duration: '7 days',
    category: 'City',
    best_time_to_visit: 'March to May (Cherry blossoms), September to November',
    activities: ['Shibuya Crossing', 'Senso-ji Temple', 'Tsukiji Fish Market', 'Cherry blossom viewing', 'Sushi experience'],
    available: true
  },
  {
    name: 'Maldives',
    location: 'Maldives',
    country: 'Maldives',
    description: 'Pristine tropical paradise with crystal-clear waters, overwater bungalows, world-class diving, and ultimate relaxation. Perfect for honeymooners and luxury seekers.',
    price: 1200,
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80'
    ],
    rating: 5.0,
    duration: '7 days',
    category: 'Beach',
    best_time_to_visit: 'November to April (Dry season)',
    activities: ['Snorkeling', 'Diving', 'Spa treatments', 'Sunset cruises', 'Water sports'],
    available: true
  },
  {
    name: 'Rome',
    location: 'Rome, Italy',
    country: 'Italy',
    description: 'Eternal City with ancient history, stunning architecture, world-famous cuisine, and iconic landmarks like the Colosseum and Vatican City.',
    price: 500,
    image: 'https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=1200&q=80'
    ],
    rating: 4.8,
    duration: '5 days',
    category: 'Cultural',
    best_time_to_visit: 'April to June, September to October',
    activities: ['Colosseum tour', 'Vatican City', 'Trevi Fountain', 'Roman Forum', 'Italian cuisine tours'],
    available: true
  },
  {
    name: 'Santorini',
    location: 'Santorini, Greece',
    country: 'Greece',
    description: 'Stunning Greek island with white-washed buildings, blue domes, breathtaking sunsets, volcanic beaches, and world-class wineries.',
    price: 550,
    image: 'https://images.unsplash.com/photo-1505731132164-cca7d1fb49b8?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1505731132164-cca7d1fb49b8?auto=format&fit=crop&w=1200&q=80'
    ],
    rating: 4.9,
    duration: '5 days',
    category: 'Beach',
    best_time_to_visit: 'May to September',
    activities: ['Sunset viewing', 'Wine tasting', 'Beach hopping', 'Volcano tour', 'Oia village exploration'],
    available: true
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/voyago');
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Destination.deleteMany({});
    console.log('✅ Cleared destinations');

    // Insert destinations
    await Destination.insertMany(destinations);
    console.log(`✅ Seeded ${destinations.length} destinations`);

    // Create admin user
    const adminExists = await User.findOne({ email: 'admin@voyago.com' });
    if (!adminExists) {
      await User.create({
        name: 'Admin User',
        email: 'admin@voyago.com',
        password: 'admin123',
        role: 'admin'
      });
      console.log('✅ Created admin user (admin@voyago.com / admin123)');
    } else {
      console.log('ℹ️  Admin user already exists');
    }

    console.log('🎉 Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
