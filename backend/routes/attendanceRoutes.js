const express = require('express');
const router = express.Router();
const {
  checkIn,
  checkOut,
  getTodayStatus,
  getMyAttendance,
  getAllAttendance
} = require('../controllers/attendanceController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

// Employee attendance routes
router.post('/check-in', authMiddleware, checkIn);
router.post('/check-out', authMiddleware, checkOut);
router.get('/status/today', authMiddleware, getTodayStatus);
router.get('/me', authMiddleware, getMyAttendance);

// Admin-only route
router.get('/all', authMiddleware, adminMiddleware, getAllAttendance);

module.exports = router;
