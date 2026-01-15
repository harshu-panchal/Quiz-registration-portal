const express = require('express');
const {
    register,
    login,
    adminLogin,
    getMe,
    updateProfile,
    updatePassword,
    logout,
    updateProfilePhoto
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

// Configure Multer for local storage
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir)
    },
    filename: function (req, file, cb) {
        cb(null, `admin-${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({ storage: storage })

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/admin/login', adminLogin);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/updatepassword', protect, updatePassword);
router.post('/logout', protect, logout);
router.post('/profile/photo', protect, upload.single('photo'), updateProfilePhoto);

module.exports = router;
