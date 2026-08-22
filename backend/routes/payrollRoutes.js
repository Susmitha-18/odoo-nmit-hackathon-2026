const express = require('express');
const router = express.Router();
const {
  getMyPayroll,
  getAllPayrolls,
  updateEmployeePayroll
} = require('../controllers/payrollController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

// Employee payroll route
router.get('/me', authMiddleware, getMyPayroll);

// Admin-only routes
router.get('/all', authMiddleware, adminMiddleware, getAllPayrolls);
router.patch('/:employeeId', authMiddleware, adminMiddleware, updateEmployeePayroll);

module.exports = router;
