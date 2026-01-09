# ⚡ Quick Start Guide - Voyago

Get Voyago up and running in 5 minutes!

## 🚀 Quick Setup

### 1. Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### 2. Set Up Environment Variables

**Backend** - Create `backend/.env`:
```env
MONGODB_URI=mongodb://localhost:27017/voyago
JWT_SECRET=your_secret_key_here
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

**Frontend** - Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Start MongoDB

**Option A: Local MongoDB**
```bash
# Make sure MongoDB is running
mongod
```

**Option B: MongoDB Atlas (Cloud)**
- Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Create a free cluster
- Get your connection string
- Update `MONGODB_URI` in `backend/.env`

### 4. Seed Database (Optional)

```bash
cd backend
node seed.js
```

This creates:
- 8 sample destinations
- Admin user: `admin@voyago.com` / `admin123`

### 5. Start Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Server runs on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# App runs on http://localhost:3000
```

### 6. Open Browser

Navigate to: **http://localhost:3000**

## 🎯 Test Credentials

**Admin Account:**
- Email: `admin@voyago.com`
- Password: `admin123`

**Regular User:**
- Create your own account via Register page

## ✅ Verify Installation

1. ✅ Home page loads with featured destinations
2. ✅ Can browse destinations
3. ✅ Can register new account
4. ✅ Can login
5. ✅ Can view destination details
6. ✅ Can create booking (when logged in)
7. ✅ Admin can access admin panel

## 🐛 Common Issues

**MongoDB Connection Error:**
- Check MongoDB is running
- Verify `MONGODB_URI` in `.env`
- For Atlas: Check IP whitelist

**Port Already in Use:**
- Change `PORT` in `backend/.env`
- Update `VITE_API_URL` in `frontend/.env`

**CORS Errors:**
- Check `FRONTEND_URL` in backend `.env`
- Ensure frontend URL matches

## 📚 Next Steps

- Read [README.md](./README.md) for full documentation
- Check [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment
- Customize destinations via Admin Panel
- Explore the codebase!

---

**Happy Traveling! ✈️**
