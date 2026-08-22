const express = require('express');
const router = express.Router();
const {
  getMyPayroll,
  getPayrolls,
  updatePayroll
} = require('../controllers/payrollController');
const { requireAuth, requireRole } = require('../middleware/authMiddleware');

router.get('/me', requireAuth, getMyPayroll);
router.get('/', requireAuth, getPayrolls);
router.put('/:employeeId', requireAuth, requireRole('ADMIN'), updatePayroll);

module.exports = router;
