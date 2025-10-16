import express from "express";
import multer from "multer";
import path from "path";
import UserProfile from "../models/UserProfile.js";


const router = express.Router();

// Multer config for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, "profile-" + Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// GET profile by ownerId
router.get("/:ownerId", async (req, res) => {
  try {
    const profile = await UserProfile.findOne({ ownerId: req.params.ownerId });
    if (!profile) return res.status(404).json({ message: "Profile not found" });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create/update profile
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { ownerId, name, email, phone, address } = req.body;
    let profile = await UserProfile.findOne({ ownerId });

    const imagePath = req.file
      ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
      : profile?.image || "";

    if (profile) {
      profile.name = name;
      profile.email = email;
      profile.phone = phone;
      profile.address = address;
      profile.image = imagePath;
      await profile.save();
    } else {
      profile = new UserProfile({
        ownerId,
        name,
        email,
        phone,
        address,
        image: imagePath,
      });
      await profile.save();
    }

    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
