const express = require('express');
const router = express.Router();
const {
  checkIn,
  checkOut,
  getMyAttendance,
  getAllAttendance,
  getAttendanceByEmployeeId,
  getTodayAttendance
} = require('../controllers/attendanceController');
const { requireAuth, requireRole } = require('../middleware/authMiddleware');

router.post('/check-in', requireAuth, checkIn);
router.post('/check-out', requireAuth, checkOut);
router.get('/status/today', requireAuth, getTodayAttendance);
router.get('/me', requireAuth, getMyAttendance);
router.get('/all', requireAuth, requireRole('ADMIN'), getAllAttendance);
router.get('/employee/:employeeId', requireAuth, getAttendanceByEmployeeId);

module.exports = router;
