const Attendance = require('../models/Attendance');

// Helper to get formatted YYYY-MM-DD
const getTodayDateString = () => {
  const d = new Date();
  return d.toISOString().split('T')[0];
};

// @desc    Clock-in for today
// @route   POST /api/v1/attendance/check-in
// @access  Private (Employee / Admin)
exports.checkIn = async (req, res, next) => {
  try {
    const today = getTodayDateString();
    
    // Check if already checked in today
    let record = await Attendance.findOne({ user: req.user.id, date: today });

    if (record) {
      if (!record.checkOut) {
        return res.status(400).json({
          success: false,
          message: 'You are already checked in for today and have not checked out yet.',
          attendance: record
        });
      } else {
        return res.status(400).json({
          success: false,
          message: 'You have already completed attendance for today.',
          attendance: record
        });
      }
    }

    record = await Attendance.create({
      user: req.user.id,
      employeeId: req.user.employeeId,
      date: today,
      checkIn: new Date(),
      status: 'Present',
      remarks: 'Clocked in successfully'
    });

    res.status(201).json({
      success: true,
      message: 'Check-in successful!',
      attendance: record
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Clock-out for today
// @route   POST /api/v1/attendance/check-out
// @access  Private (Employee / Admin)
exports.checkOut = async (req, res, next) => {
  try {
    const today = getTodayDateString();
    const record = await Attendance.findOne({ user: req.user.id, date: today });

    if (!record) {
      return res.status(400).json({ success: false, message: 'No check-in record found for today. Please clock in first.' });
    }

    if (record.checkOut) {
      return res.status(400).json({ success: false, message: 'You have already clocked out for today.' });
    }

    const checkOutTime = new Date();
    const diffMs = checkOutTime - new Date(record.checkIn);
    const workHours = parseFloat((diffMs / (1000 * 60 * 60)).toFixed(2));

    let status = 'Present';
    if (workHours < 4) {
      status = 'Half-day';
    } else if (workHours >= 7) {
      status = 'Present';
    }

    record.checkOut = checkOutTime;
    record.workHours = workHours;
    record.status = status;
    record.remarks = `Clocked out. Work hours: ${workHours} hrs`;
    await record.save();

    res.status(200).json({
      success: true,
      message: 'Check-out successful!',
      attendance: record
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get today's check-in/out status for current user
// @route   GET /api/v1/attendance/status/today
// @access  Private (Employee / Admin)
exports.getTodayStatus = async (req, res, next) => {
  try {
    const today = getTodayDateString();
    const record = await Attendance.findOne({ user: req.user.id, date: today });
    res.status(200).json({
      success: true,
      isCheckedIn: !!record,
      isCheckedOut: record ? !!record.checkOut : false,
      attendance: record || null
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged-in employee's attendance logs
// @route   GET /api/v1/attendance/me
// @access  Private (Employee / Admin)
exports.getMyAttendance = async (req, res, next) => {
  try {
    const records = await Attendance.find({ user: req.user.id }).sort({ date: -1 });
    res.status(200).json({
      success: true,
      count: records.length,
      attendance: records
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all employees attendance (Admin only)
// @route   GET /api/v1/attendance/all
// @access  Private (Admin only)
exports.getAllAttendance = async (req, res, next) => {
  try {
    const { date, employeeId, status } = req.query;
    const filter = {};

    if (date) filter.date = date;
    if (employeeId) filter.employeeId = employeeId.toUpperCase();
    if (status) filter.status = status;

    const records = await Attendance.find(filter)
      .populate('user', 'email role')
      .sort({ date: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: records.length,
      attendance: records
    });
  } catch (error) {
    next(error);
  }
};
