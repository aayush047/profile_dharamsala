import express from "express";
import multer from "multer";
import UserProfile from "../models/UserProfile.js";

const router = express.Router();

// ✅ File upload setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

// ✅ CREATE or UPDATE profile
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { ownerId, name, email, phone, address } = req.body;
    if (!ownerId) return res.status(400).json({ message: "ownerId is required" });

    let profile = await UserProfile.findOne({ ownerId });
   const imagePath = req.file ? req.file.filename : profile?.image || "";


    if (profile) {
      profile.name = name;
      profile.email = email;
      profile.phone = phone;
      profile.address = address;
      profile.image = imagePath;
      await profile.save();
      return res.status(200).json({ message: "Profile updated", profile });
    }

    const newProfile = new UserProfile({
      ownerId,
      name,
      email,
      phone,
      address,
      image: imagePath,
    });
    await newProfile.save();
    res.status(201).json({ message: "Profile created", newProfile });

  } catch (err) {
    console.error("Error saving/updating profile:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ✅ GET profile by ownerId
router.get("/:ownerId", async (req, res) => {
  try {
    const profile = await UserProfile.findOne({ ownerId: req.params.ownerId });
    if (!profile) return res.status(404).json({ message: "Profile not found" });
    res.status(200).json(profile);
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
