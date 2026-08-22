const express = require('express');
const router = express.Router();
const { register, verifyEmail, login, getMe } = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/register', register);
router.post('/verify-email', verifyEmail);
router.post('/login', login);
router.get('/me', authMiddleware, getMe);

module.exports = router;
