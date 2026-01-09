import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import destinationRoutes from "./routes/destinations.js";
import bookingRoutes from "./routes/bookings.js";
import adminRoutes from "./routes/admin.js";

dotenv.config();

const app = express();

// -----------------------------------------------
// 🔥 UNIVERSAL CORS FIX FOR RENDER + VERCEL
// -----------------------------------------------
app.use(
  cors({
    origin: (origin, callback) => {
      console.log("🔎 Incoming request from:", origin);

      // Allow no-origin (mobile apps, curl, postman)
      if (!origin) return callback(null, true);

      // Allow any Vercel deployment automatically
      if (origin.includes(".vercel.app")) return callback(null, true);

      // Allow localhost (dev)
      if (origin.includes("localhost")) return callback(null, true);

      return callback(new Error("❌ CORS blocked: " + origin), false);
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

// Health Route
app.get("/api/health", (req, res) => {
  res.json({ status: "UP" });
});

// -----------------------------------------------
// 🔥 CONNECT TO MONGO ATLAS
// -----------------------------------------------
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

// -----------------------------------------------
// START SERVER
// -----------------------------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
