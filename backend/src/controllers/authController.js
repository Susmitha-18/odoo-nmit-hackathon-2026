const User = require('../models/User');
const Employee = require('../models/Employee');
const Payroll = require('../models/Payroll');
const { generateToken } = require('../utils/jwtUtils');

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { employeeId, email, password, role, fullName, department, designation, phone } = req.body;

    if (!employeeId || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide employeeId, email, and password' });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { employeeId: employeeId.toUpperCase() }] });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User with this email or employeeId already exists' });
    }

    const user = await User.create({
      employeeId: employeeId.toUpperCase(),
      email,
      password,
      role: role || 'EMPLOYEE',
      emailVerified: true
    });

    const employee = await Employee.create({
      userId: user._id,
      employeeId: user.employeeId,
      fullName: fullName || 'New Employee',
      email: user.email,
      department: department || 'Engineering',
      designation: designation || 'Software Engineer',
      phone: phone || '+1 (555) 019-2834'
    });

    await Payroll.create({
      userId: user._id,
      employeeId: user.employeeId,
      basicSalary: 60000,
      allowances: { hra: 18000, conveyance: 5000, special: 12000 },
      deductions: { tax: 6000, pf: 4000 }
    });

    const token = generateToken(user);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        employeeId: user.employeeId,
        email: user.email,
        role: user.role,
        fullName: employee.fullName,
        department: employee.department,
        designation: employee.designation
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const employee = await Employee.findOne({ userId: user._id });
    const token = generateToken(user);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        employeeId: user.employeeId,
        email: user.email,
        role: user.role,
        fullName: employee ? employee.fullName : 'User',
        department: employee ? employee.department : '',
        designation: employee ? employee.designation : '',
        profilePicture: employee ? employee.profilePicture : ''
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user session
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Session expired' });
    }
    const employee = await Employee.findOne({ userId: req.user.id });

    res.status(200).json({
      success: true,
      user: {
        id:            user._id,
        employeeId:    user.employeeId,
        email:         user.email,
        role:          user.role,
        fullName:      employee?.fullName || user.email,
        department:    employee?.department || '',
        designation:   employee?.designation || '',
        profilePicture: employee?.profilePicture || '',
        employee:      employee || null,
      }
    });
  } catch (error) {
    next(error);
  }
};
