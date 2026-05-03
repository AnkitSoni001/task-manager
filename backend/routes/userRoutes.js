import express from "express";
import multer from "multer";
import path from "path";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import {
  getMyProfile,
  updateProfile,
  uploadAvatar,
  heartbeat,
  changePassword,
  getTeamMembers,
  getAllUsers,
  getUserById,
} from "../controllers/userController.js";

const router = express.Router();

// Multer config for avatar uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `avatar-${req.user._id}-${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|gif/;
    const extOk = allowed.test(path.extname(file.originalname).toLowerCase());
    const mimeOk = allowed.test(file.mimetype);
    if (extOk && mimeOk) {
      cb(null, true);
    } else {
      cb(new Error("Only image files (jpg, png, webp, gif) are allowed"));
    }
  },
});

// Routes
router.get("/profile", protect, getMyProfile);
router.put("/profile", protect, updateProfile);
router.put("/avatar", protect, upload.single("avatar"), uploadAvatar);
router.put("/password", protect, changePassword);
router.post("/heartbeat", protect, heartbeat);
router.get("/team", protect, getTeamMembers);
router.get("/all", protect, adminOnly, getAllUsers);
router.get("/:id", protect, getUserById);

export default router;
