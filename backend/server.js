import cors from "cors";

// Dynamic CORS
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://travel1-delta.vercel.app",
  "https://travel1-611qsfw12-madhulikas-projects-f211d661.vercel.app",
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS blocked: " + origin));
      }
    },
    credentials: true,
  })
);
