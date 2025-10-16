import mongoose from "mongoose";

const userProfileSchema = new mongoose.Schema({
  ownerId: { type: String, required: true, unique: true },
  name: String,
  email: String,
  phone: String,
  address: String,
  image: String,
}, { timestamps: true });

export default mongoose.model("UserProfile", userProfileSchema);
