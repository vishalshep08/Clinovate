import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

// Route imports
import authRoutes from "./src/routes/auth.js";
import adminRoutes from "./src/routes/admin.js";
import adminSopRoutes from "./src/routes/adminSopRoutes.js";
import adminTaskRoutes from "./src/routes/adminTaskRoutes.js";
import studentTaskRoutes from "./src/routes/studentTaskRoutes.js";
import studentRoutes from "./src/routes/students.js";

dotenv.config();

// Fix variable name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

// Default route
app.get("/", (req, res) => {
  res.send("🚀 Clinovate Backend is running locally!");
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin/sops", adminSopRoutes);
app.use("/api/admin/tasks", adminTaskRoutes);
app.use("/api/student/tasks", studentTaskRoutes);
app.use("/api/students", studentRoutes);

// Log DB connection string (optional for debugging)
console.log("Connected DB:", process.env.DATABASE_URL);

// Optional static folder
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at: http://localhost:${PORT}`);
});
