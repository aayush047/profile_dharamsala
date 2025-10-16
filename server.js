import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

import profileRoutes from "./routes/profileRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads")); // serve uploaded images

const { MONGO_USER, MONGO_PASS, MONGO_CLUSTER, MONGO_DB, PORT } = process.env;
const mongoUri = `mongodb+srv://${MONGO_USER}:${MONGO_PASS}@${MONGO_CLUSTER}/${MONGO_DB}?retryWrites=true&w=majority`;

mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected successfully"))
  .catch(err => console.error("MongoDB connection error:", err));

app.use("/api/profile", profileRoutes);

app.listen(PORT || 5000, () => console.log(`Server running on port ${PORT || 5000}`));
