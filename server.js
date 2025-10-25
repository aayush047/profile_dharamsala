// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import profileRoutes from "./routes/profileRoutes.js";

dotenv.config();
const app = express();

// ✅ __dirname setup (ESM support ke liye)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

// ✅ Serve uploaded images (absolute path)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ API routes
app.use("/api/profile", profileRoutes);

// ✅ MongoDB connection
const MONGO_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_CLUSTER}/${process.env.MONGO_DB}?retryWrites=true&w=majority`;

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Default route
app.get("/", (req, res) => {
  res.send("🚀 Server is running successfully!");
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🌐 Server running on port ${PORT}`));
