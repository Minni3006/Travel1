# 🚀 Voyago - Futuristic Travel Booking Platform

A modern, full-stack travel booking platform built with React, Node.js, Express, and MongoDB. Features a futuristic UI with glassmorphism effects, smooth animations, and a complete booking system.

## ✨ Features

- **User Authentication**: Secure JWT-based authentication with role-based access
- **Destination Management**: Browse and search through amazing travel destinations
- **Booking System**: Complete booking flow with date selection and guest management
- **Admin Panel**: Full CRUD operations for destinations and booking management
- **Modern UI**: Futuristic design with neon gradients, glassmorphism, and smooth animations
- **Responsive Design**: Works seamlessly on all devices

## 🛠️ Tech Stack

### Frontend
- React 18
- Vite
- TailwindCSS
- Framer Motion
- React Router
- Axios

### Backend
- Node.js
- Express
- MongoDB (Mongoose)
- JWT Authentication
- Bcrypt for password hashing
- Express Validator

## 📁 Project Structure

```
voyago/
├── frontend/          # React + Vite frontend
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── context/      # React context (Auth)
│   │   └── ...
│   └── ...
├── backend/           # Node.js + Express backend
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── middleware/      # Auth middleware
│   └── ...
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd voyago
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Set up Environment Variables**

   **Backend** (`backend/.env`):
   ```env
   MONGODB_URI=mongodb://localhost:27017/voyago
   JWT_SECRET=your_super_secret_jwt_key
   PORT=5000
   NODE_ENV=development
   ```

   **Frontend** (`frontend/.env`):
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

5. **Seed the Database** (Optional)
   ```bash
   cd backend
   npm run seed
   # Or: node seed.js
   ```
   
   This creates:
   - Sample destinations
   - Admin user: `admin@voyago.com` / `admin123`

6. **Start the Development Servers**

   **Backend** (Terminal 1):
   ```bash
   cd backend
   npm run dev
   # Server runs on http://localhost:5000
   ```

   **Frontend** (Terminal 2):
   ```bash
   cd frontend
   npm run dev
   # App runs on http://localhost:3000
   ```

7. **Open your browser**
   Navigate to `http://localhost:3000`

## 📚 API Documentation

### Authentication

- `POST /api/auth/register` - Register a new user
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```

- `POST /api/auth/login` - Login user
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```

### Destinations

- `GET /api/destinations` - Get all destinations
- `GET /api/destinations/:id` - Get single destination

### Bookings

- `POST /api/bookings` - Create a booking (Protected)
  ```json
  {
    "destinationId": "destination_id",
    "startDate": "2024-01-15",
    "endDate": "2024-01-20",
    "guests": 2
  }
  ```

- `GET /api/bookings/user/:id` - Get user bookings (Protected)

### Admin Routes (Protected + Admin Only)

- `POST /api/admin/destinations` - Create destination
- `PUT /api/admin/destinations/:id` - Update destination
- `DELETE /api/admin/destinations/:id` - Delete destination
- `GET /api/admin/bookings` - Get all bookings

## 🌐 Deployment

### Frontend Deployment (Vercel)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   cd frontend
   vercel
   ```

3. **Set Environment Variables**
   - In Vercel dashboard, add `VITE_API_URL` pointing to your backend URL

4. **Build Settings**
   - Build Command: `npm run build`
   - Output Directory: `dist`

### Backend Deployment (Render)

1. **Create a new Web Service** on Render
2. **Connect your repository**
3. **Configure:**
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment: `Node`

4. **Set Environment Variables:**
   - `MONGODB_URI` - Your MongoDB Atlas connection string
   - `JWT_SECRET` - A secure random string
   - `PORT` - Render sets this automatically
   - `NODE_ENV` - `production`

### MongoDB Atlas Setup

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Create a database user
4. Whitelist your IP (or use `0.0.0.0/0` for all IPs)
5. Get your connection string
6. Update `MONGODB_URI` in your backend `.env`

## 🎨 Customization

### Styling

The app uses TailwindCSS with custom utilities defined in `frontend/src/index.css`:

- `.glass` - Glassmorphism effect
- `.neon-text` - Neon gradient text
- `.btn-primary` - Primary button style
- `.card` - Card component style

### Adding New Destinations

1. Login as admin (`admin@voyago.com` / `admin123`)
2. Navigate to Admin Dashboard
3. Click "Add Destination"
4. Fill in the form and submit

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Protected routes (user and admin)
- Input validation with express-validator
- CORS enabled for frontend-backend communication

## 📝 Default Admin Credentials

- **Email**: `admin@voyago.com`
- **Password**: `admin123`

⚠️ **Change these in production!**

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running locally, or
- Check your MongoDB Atlas connection string
- Verify network access in MongoDB Atlas

### CORS Errors
- Ensure backend CORS is configured correctly
- Check that frontend API URL matches backend URL

### Authentication Issues
- Clear browser localStorage
- Check JWT_SECRET is set correctly
- Verify token expiration

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📧 Support

For support, email support@voyago.com or create an issue in the repository.

---

Built with ❤️ using React, Node.js, and MongoDB
