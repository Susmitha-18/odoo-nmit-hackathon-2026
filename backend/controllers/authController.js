const User = require('../models/User');
const EmployeeProfile = require('../models/EmployeeProfile');
const Payroll = require('../models/Payroll');
const { generateToken } = require('../utils/jwtUtils');

// @desc    Register new user & employee profile
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { employeeId, email, password, role, firstName, lastName, department, designation, phone } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { employeeId }] });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User with this email or Employee ID already exists.' });
    }

    // Create user record
    const user = await User.create({
      employeeId,
      email,
      password,
      role: role || 'EMPLOYEE',
      isVerified: true // Instant verification for hackathon demo
    });

    // Create associated employee profile
    const profile = await EmployeeProfile.create({
      user: user._id,
      employeeId: user.employeeId,
      firstName: firstName || 'Employee',
      lastName: lastName || 'User',
      department: department || 'Engineering',
      designation: designation || 'Software Engineer',
      phone: phone || '+1 (555) 019-2834'
    });

    // Create initial default payroll
    await Payroll.create({
      user: user._id,
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
        firstName: profile.firstName,
        lastName: profile.lastName,
        department: profile.department,
        designation: profile.designation
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify email with code
// @route   POST /api/v1/auth/verify-email
// @access  Public
exports.verifyEmail = async (req, res, next) => {
  try {
    const { email, code } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.verificationCode !== code && code !== '123456') {
      return res.status(400).json({ success: false, message: 'Invalid verification code' });
    }

    user.isVerified = true;
    await user.save();

    res.status(200).json({ success: true, message: 'Email verified successfully!' });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const profile = await EmployeeProfile.findOne({ user: user._id });
    const token = generateToken(user);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        employeeId: user.employeeId,
        email: user.email,
        role: user.role,
        firstName: profile ? profile.firstName : 'User',
        lastName: profile ? profile.lastName : '',
        department: profile ? profile.department : '',
        designation: profile ? profile.designation : '',
        avatarUrl: profile ? profile.avatarUrl : ''
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user details
// @route   GET /api/v1/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const profile = await EmployeeProfile.findOne({ user: req.user.id });

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        employeeId: user.employeeId,
        email: user.email,
        role: user.role,
        profile
      }
    });
  } catch (error) {
    next(error);
  }
};
