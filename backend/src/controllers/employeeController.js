const Employee = require('../models/Employee');
const User = require('../models/User');

// @desc    Get employees (Admin returns all; Employee returns self)
// @route   GET /api/employees
// @access  Private
exports.getEmployees = async (req, res, next) => {
  try {
    if (req.user.role === 'ADMIN') {
      const employees = await Employee.find().populate('userId', 'email role emailVerified createdAt');
      return res.status(200).json({ success: true, count: employees.length, employees });
    }

    // Employee views self
    const employee = await Employee.findOne({ userId: req.user.id }).populate('userId', 'email role');
    return res.status(200).json({ success: true, count: 1, employees: [employee] });
  } catch (error) {
    next(error);
  }
};

// @desc    Get specific employee by ID or employeeId
// @route   GET /api/employees/:id
// @access  Private
exports.getEmployeeById = async (req, res, next) => {
  try {
    const targetId = req.params.id;

    let employee = await Employee.findOne({
      $or: [{ _id: targetId.match(/^[0-9a-fA-F]{24}$/) ? targetId : null }, { employeeId: targetId.toUpperCase() }]
    }).populate('userId', 'email role emailVerified');

    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    // Security check: Employee can only view own profile
    if (req.user.role !== 'ADMIN' && employee.userId._id.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Forbidden: You can only view your own profile' });
    }

    res.status(200).json({ success: true, employee });
  } catch (error) {
    next(error);
  }
};

// @desc    Update employee profile (Restricted fields for EMPLOYEE, full edit for ADMIN)
// @route   PUT /api/employees/:id
// @access  Private
exports.updateEmployee = async (req, res, next) => {
  try {
    const targetId = req.params.id;

    let employee = await Employee.findOne({
      $or: [{ _id: targetId.match(/^[0-9a-fA-F]{24}$/) ? targetId : null }, { employeeId: targetId.toUpperCase() }]
    });

    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    const isSelf = employee.userId.toString() === req.user.id;
    const isAdmin = req.user.role === 'ADMIN';

    if (!isSelf && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Forbidden: Cannot update another employee\'s profile' });
    }

    let updateData = {};
    if (isAdmin) {
      // Admin can update all fields
      const { fullName, department, designation, phone, address, profilePicture, joiningDate } = req.body;
      if (fullName !== undefined) updateData.fullName = fullName;
      if (department !== undefined) updateData.department = department;
      if (designation !== undefined) updateData.designation = designation;
      if (phone !== undefined) updateData.phone = phone;
      if (address !== undefined) updateData.address = address;
      if (profilePicture !== undefined) updateData.profilePicture = profilePicture;
      if (joiningDate !== undefined) updateData.joiningDate = joiningDate;
    } else {
      // Employee self-service restricted edit
      const { phone, address, profilePicture } = req.body;
      if (phone !== undefined) updateData.phone = phone;
      if (address !== undefined) updateData.address = address;
      if (profilePicture !== undefined) updateData.profilePicture = profilePicture;
    }

    const updatedEmployee = await Employee.findByIdAndUpdate(
      employee._id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate('userId', 'email role');

    res.status(200).json({
      success: true,
      message: 'Employee profile updated successfully',
      employee: updatedEmployee
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged-in employee profile
// @route   GET /api/employees/me
// @access  Private
exports.getMyProfile = async (req, res, next) => {
  try {
    const employee = await Employee.findOne({ userId: req.user.id }).populate('userId', 'email role emailVerified');
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee profile not found' });
    }
    res.status(200).json({ success: true, profile: employee });
  } catch (error) {
    next(error);
  }
};

// @desc    Update current logged-in employee profile (Restricted fields)
// @route   PATCH /api/employees/me
// @access  Private
exports.updateMyProfile = async (req, res, next) => {
  try {
    const employee = await Employee.findOne({ userId: req.user.id });
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee profile not found' });
    }

    const { phone, address, profilePicture } = req.body;
    let updateData = {};
    if (phone !== undefined) updateData.phone = phone;
    if (address !== undefined) updateData.address = address;
    if (profilePicture !== undefined) updateData.profilePicture = profilePicture;

    const updatedEmployee = await Employee.findByIdAndUpdate(
      employee._id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate('userId', 'email role');

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      profile: updatedEmployee
    });
  } catch (error) {
    next(error);
  }
};
