const EmployeeProfile = require('../models/EmployeeProfile');
const User = require('../models/User');

// @desc    Get logged-in user profile
// @route   GET /api/v1/employees/me
// @access  Private (Employee / Admin)
exports.getMyProfile = async (req, res, next) => {
  try {
    const profile = await EmployeeProfile.findOne({ user: req.user.id }).populate('user', 'email role isVerified');
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }
    res.status(200).json({ success: true, profile });
  } catch (error) {
    next(error);
  }
};

// @desc    Update restricted logged-in user profile fields (phone, address, avatarUrl)
// @route   PATCH /api/v1/employees/me
// @access  Private (Employee / Admin)
exports.updateMyProfile = async (req, res, next) => {
  try {
    const { phone, address, avatarUrl } = req.body;

    // Enforce restricted fields only for employee self-service
    const updateData = {};
    if (phone !== undefined) updateData.phone = phone;
    if (address !== undefined) updateData.address = address;
    if (avatarUrl !== undefined) updateData.avatarUrl = avatarUrl;

    const profile = await EmployeeProfile.findOneAndUpdate(
      { user: req.user.id },
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate('user', 'email role');

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      profile
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all employees list
// @route   GET /api/v1/employees
// @access  Private (Admin only)
exports.getAllEmployees = async (req, res, next) => {
  try {
    const employees = await EmployeeProfile.find().populate('user', 'email role isVerified createdAt');
    res.status(200).json({
      success: true,
      count: employees.length,
      employees
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get specific employee profile by ID
// @route   GET /api/v1/employees/:id
// @access  Private (Admin only)
exports.getEmployeeById = async (req, res, next) => {
  try {
    const profile = await EmployeeProfile.findById(req.params.id).populate('user', 'email role isVerified');
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Employee profile not found' });
    }
    res.status(200).json({ success: true, profile });
  } catch (error) {
    next(error);
  }
};

// @desc    Update any employee details as Admin
// @route   PATCH /api/v1/employees/:id
// @access  Private (Admin only)
exports.updateEmployeeByAdmin = async (req, res, next) => {
  try {
    const { firstName, lastName, department, designation, phone, address, avatarUrl, joiningDate } = req.body;

    const profile = await EmployeeProfile.findByIdAndUpdate(
      req.params.id,
      { $set: { firstName, lastName, department, designation, phone, address, avatarUrl, joiningDate } },
      { new: true, runValidators: true }
    ).populate('user', 'email role');

    if (!profile) {
      return res.status(404).json({ success: false, message: 'Employee profile not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Employee updated successfully by Admin',
      profile
    });
  } catch (error) {
    next(error);
  }
};
