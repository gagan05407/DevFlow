const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe, resetPasswordDirect, googleLogin, deleteAccount } = require('../controllers/authController');
const { registerValidation, loginValidation, validate } = require('../middleware/authValidation');
const { protect } = require('../middleware/authMiddleware');

// Public Auth routes
router.post('/register', registerValidation, validate, registerUser);
router.post('/login', loginValidation, validate, loginUser);
router.post('/reset-password-direct', resetPasswordDirect);
router.post('/google', googleLogin);

// Protected Auth routes
router.get('/me', protect, getMe);
router.delete('/delete-account', protect, deleteAccount);

module.exports = router;
