const express = require('express');
const router = express.Router();
const {
  createLeaveRequest,
  getMyLeaves,
  getLeaves,
  approveLeave,
  rejectLeave
} = require('../controllers/leaveController');
const { requireAuth, requireRole } = require('../middleware/authMiddleware');

router.post('/', requireAuth, createLeaveRequest);
router.get('/me', requireAuth, getMyLeaves);
router.get('/', requireAuth, getLeaves);
router.put('/:id/approve', requireAuth, requireRole('ADMIN'), approveLeave);
router.put('/:id/reject', requireAuth, requireRole('ADMIN'), rejectLeave);

module.exports = router;
