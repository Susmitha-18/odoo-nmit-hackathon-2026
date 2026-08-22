const express = require('express');
const router = express.Router();
const {
  getMyProfile,
  updateMyProfile,
  getAllEmployees,
  getEmployeeById,
  updateEmployeeByAdmin
} = require('../controllers/employeeController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

// Logged-in employee routes
router.get('/me', authMiddleware, getMyProfile);
router.patch('/me', authMiddleware, updateMyProfile);

// Admin-only routes
router.get('/', authMiddleware, adminMiddleware, getAllEmployees);
router.get('/:id', authMiddleware, adminMiddleware, getEmployeeById);
router.patch('/:id', authMiddleware, adminMiddleware, updateEmployeeByAdmin);

module.exports = router;
