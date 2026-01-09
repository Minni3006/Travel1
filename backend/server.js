import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import destinationRoutes from "./routes/destinations.js";
import bookingRoutes from "./routes/bookings.js";
import adminRoutes from "./routes/admin.js";

dotenv.config();

// Create Express App
const app = express();

// -----------------------------------------------
// ✅ FIXED: CORS FOR RENDER + VERCEL
// -----------------------------------------------
app.use(
  cors({
    origin: (origin, callback) => {
      console.log("🔎 Incoming request from:", origin);

      if (!origin) return callback(null, true);

      if (origin.includes("vercel.app")) return callback(null, true);

      if (origin.includes("localhost")) return callback(null, true);

      return callback(null, true); // allow all in Render (safe for backend-only)
    },
    credentials: true,
  })
);

// Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/destinations", destinationRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminRoutes);

// Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "UP" });
});

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.log("❌ MongoDB Error:", error);
    process.exit(1);
  }
};
connectDB();

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
