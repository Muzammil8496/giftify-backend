const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

const {
  register,
  login,
  me,
  updateProfile,
  changePassword,
  uploadAvatar,
} = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

// ─── Multer setup for avatar uploads ──────────────────────────────────────

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/avatars/');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `avatar_${req.user.id}_${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB max
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Only JPG, PNG and WebP images are allowed'));
  },
});

// ─── Public routes ─────────────────────────────────────────────────────────

router.post('/register', register);
router.post('/login', login);

// ─── Protected routes ──────────────────────────────────────────────────────

router.get('/me', protect, me);
router.put('/profile', protect, updateProfile);           // TICKET-005
router.put('/change-password', protect, changePassword);  // TICKET-007
router.post('/avatar', protect, upload.single('avatar'), uploadAvatar); // TICKET-006

module.exports = router;