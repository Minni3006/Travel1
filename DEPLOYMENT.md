# 🚀 Deployment Guide - Voyago Travel Booking Platform

This guide will walk you through deploying both the frontend and backend of Voyago.

## 📋 Prerequisites

- GitHub account (or GitLab/Bitbucket)
- MongoDB Atlas account (free tier available)
- Vercel account (for frontend)
- Render account (for backend)

## 🌐 Part 1: MongoDB Atlas Setup

1. **Create MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for a free account

2. **Create a Cluster**
   - Click "Create Cluster"
   - Choose the free tier (M0)
   - Select a cloud provider and region
   - Click "Create Cluster"

3. **Create Database User**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Create username and password (save these!)
   - Set user privileges to "Atlas admin" or "Read and write to any database"
   - Click "Add User"

4. **Whitelist IP Address**
   - Go to "Network Access"
   - Click "Add IP Address"
   - For development: Add your current IP
   - For production: Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"

5. **Get Connection String**
   - Go to "Clusters"
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with `voyago`

   Example: `mongodb+srv://username:password@cluster.mongodb.net/voyago?retryWrites=true&w=majority`

## 🔧 Part 2: Backend Deployment (Render)

### Step 1: Prepare Backend

1. **Update package.json** (if needed)
   ```json
   {
     "scripts": {
       "start": "node server.js",
       "dev": "nodemon server.js"
     }
   }
   ```

2. **Create render.yaml** (optional, for Render Blueprint)
   ```yaml
   services:
     - type: web
       name: voyago-backend
       env: node
       buildCommand: npm install
       startCommand: npm start
       envVars:
         - key: MONGODB_URI
           sync: false
         - key: JWT_SECRET
           generateValue: true
         - key: NODE_ENV
           value: production
   ```

### Step 2: Deploy to Render

1. **Create New Web Service**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository containing Voyago

2. **Configure Service**
   - **Name**: `voyago-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Root Directory**: `backend`

3. **Set Environment Variables**
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: Generate a secure random string (use `openssl rand -base64 32`)
   - `NODE_ENV`: `production`
   - `PORT`: (Render sets this automatically, but you can use `5000`)

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Copy your service URL (e.g., `https://voyago-backend.onrender.com`)

### Step 3: Test Backend

1. Visit `https://your-backend-url.onrender.com/api/health`
2. Should return: `{"status":"OK","message":"Voyago API is running"}`

## 🎨 Part 3: Frontend Deployment (Vercel)

### Step 1: Prepare Frontend

1. **Update API Configuration**
   - Create `frontend/.env.production`:
   ```env
   VITE_API_URL=https://your-backend-url.onrender.com/api
   ```

2. **Update axios base URL** (if needed)
   - The frontend uses proxy in development
   - For production, update axios calls or use environment variable

### Step 2: Deploy to Vercel

#### Option A: Using Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   cd frontend
   vercel
   ```

4. **Follow Prompts**
   - Set up and deploy? **Yes**
   - Which scope? (Select your account)
   - Link to existing project? **No**
   - Project name: `voyago-frontend`
   - Directory: `./`
   - Override settings? **No**

5. **Set Environment Variables**
   ```bash
   vercel env add VITE_API_URL
   # Enter: https://your-backend-url.onrender.com/api
   ```

6. **Redeploy**
   ```bash
   vercel --prod
   ```

#### Option B: Using Vercel Dashboard

1. **Import Project**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New..." → "Project"
   - Import your GitHub repository

2. **Configure Project**
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

3. **Set Environment Variables**
   - Go to "Settings" → "Environment Variables"
   - Add:
     - **Name**: `VITE_API_URL`
     - **Value**: `https://your-backend-url.onrender.com/api`
     - **Environment**: Production, Preview, Development

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Your app will be live at `https://voyago-frontend.vercel.app`

### Step 3: Update CORS (if needed)

If you encounter CORS errors, update `backend/server.js`:

```javascript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-frontend-url.vercel.app'
  ],
  credentials: true
}));
```

## 🔄 Part 4: Update Frontend API Calls

If your frontend uses hardcoded API URLs, update them:

1. **Create API utility** (`frontend/src/utils/api.js`):
   ```javascript
   import axios from 'axios';
   
   const API_URL = import.meta.env.VITE_API_URL || '/api';
   
   const api = axios.create({
     baseURL: API_URL,
   });
   
   export default api;
   ```

2. **Update all axios calls** to use this utility

## ✅ Part 5: Post-Deployment Checklist

- [ ] Backend health check works
- [ ] Frontend loads correctly
- [ ] User registration works
- [ ] User login works
- [ ] Destinations load
- [ ] Booking creation works
- [ ] Admin panel accessible (admin login)
- [ ] CORS configured correctly
- [ ] Environment variables set
- [ ] MongoDB connection working
- [ ] SSL/HTTPS enabled (automatic on Vercel/Render)

## 🐛 Troubleshooting

### Backend Issues

**Problem**: MongoDB connection fails
- **Solution**: Check MongoDB Atlas IP whitelist includes Render IPs
- **Solution**: Verify connection string format
- **Solution**: Check database user permissions

**Problem**: Environment variables not working
- **Solution**: Restart service after adding env vars
- **Solution**: Check variable names match exactly

### Frontend Issues

**Problem**: API calls fail
- **Solution**: Check `VITE_API_URL` is set correctly
- **Solution**: Verify backend URL is accessible
- **Solution**: Check CORS configuration

**Problem**: Build fails
- **Solution**: Check Node.js version (Vercel uses Node 18+)
- **Solution**: Verify all dependencies in package.json
- **Solution**: Check build logs for specific errors

### General Issues

**Problem**: 404 errors on refresh (Vercel)
- **Solution**: Add `vercel.json`:
  ```json
  {
    "rewrites": [
      { "source": "/(.*)", "destination": "/index.html" }
    ]
  }
  ```

## 🔐 Security Checklist

- [ ] Change default admin password
- [ ] Use strong JWT_SECRET (32+ characters)
- [ ] Enable MongoDB Atlas IP restrictions
- [ ] Use environment variables (never commit secrets)
- [ ] Enable HTTPS (automatic on Vercel/Render)
- [ ] Review CORS settings
- [ ] Set up monitoring/logging

## 📊 Monitoring

### Render
- View logs in Render dashboard
- Set up alerts for service downtime

### Vercel
- View analytics in Vercel dashboard
- Monitor performance metrics

## 🔄 Continuous Deployment

Both Vercel and Render support automatic deployments:
- **Vercel**: Deploys on every push to main branch
- **Render**: Deploys on every push (configurable)

## 📝 Custom Domains

### Vercel
1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

### Render
1. Go to Service Settings → Custom Domains
2. Add your custom domain
3. Update DNS records

## 🎉 You're Done!

Your Voyago platform should now be live and accessible to users worldwide!

**Frontend**: `https://your-app.vercel.app`
**Backend**: `https://your-backend.onrender.com`

---

Need help? Check the main README.md or open an issue.
