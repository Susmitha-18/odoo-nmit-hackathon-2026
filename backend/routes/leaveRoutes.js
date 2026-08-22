const express = require('express');
const router = express.Router();
const {
  applyLeave,
  getMyLeaves,
  getAllLeaves,
  handleLeaveDecision
} = require('../controllers/leaveController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

// Employee leave routes
router.post('/', authMiddleware, applyLeave);
router.get('/me', authMiddleware, getMyLeaves);

// Admin-only routes
router.get('/all', authMiddleware, adminMiddleware, getAllLeaves);
router.patch('/:id/decision', authMiddleware, adminMiddleware, handleLeaveDecision);

module.exports = router;
