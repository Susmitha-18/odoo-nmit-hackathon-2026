const express = require('express');
const router = express.Router();
const { getEmployees, getEmployeeById, updateEmployee, getMyProfile, updateMyProfile } = require('../controllers/employeeController');
const { requireAuth } = require('../middleware/authMiddleware');

router.get('/', requireAuth, getEmployees);
router.get('/me', requireAuth, getMyProfile);
router.patch('/me', requireAuth, updateMyProfile);
router.get('/:id', requireAuth, getEmployeeById);
router.put('/:id', requireAuth, updateEmployee);

module.exports = router;
