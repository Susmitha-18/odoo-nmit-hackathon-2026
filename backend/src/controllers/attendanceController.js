const Attendance = require('../models/Attendance');

const getTodayDateString = () => {
  return new Date().toISOString().split('T')[0];
};

// @desc    Clock-in for today
// @route   POST /api/attendance/check-in
// @access  Private (Employee / Admin)
exports.checkIn = async (req, res, next) => {
  try {
    const today = getTodayDateString();

    let record = await Attendance.findOne({ employeeId: req.user.employeeId, date: today });

    if (record) {
      return res.status(400).json({
        success: false,
        message: 'Cannot check in twice on the same day',
        attendance: record
      });
    }

    record = await Attendance.create({
      employeeId: req.user.employeeId,
      userId: req.user.id,
      date: today,
      checkIn: new Date(),
      status: 'PRESENT',
      remarks: 'Clocked in successfully'
    });

    res.status(201).json({
      success: true,
      message: 'Check-in recorded successfully',
      attendance: record
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Clock-out for today
// @route   POST /api/attendance/check-out
// @access  Private (Employee / Admin)
exports.checkOut = async (req, res, next) => {
  try {
    const today = getTodayDateString();
    const record = await Attendance.findOne({ employeeId: req.user.employeeId, date: today });

    if (!record) {
      return res.status(400).json({ success: false, message: 'Cannot check out without checking in first' });
    }

    if (record.checkOut) {
      return res.status(400).json({ success: false, message: 'Already checked out for today' });
    }

    const checkOutTime = new Date();
    if (checkOutTime < new Date(record.checkIn)) {
      return res.status(400).json({ success: false, message: 'Check-out cannot be earlier than check-in' });
    }

    const diffMs = checkOutTime - new Date(record.checkIn);
    const workHours = parseFloat((diffMs / (1000 * 60 * 60)).toFixed(2));

    let status = 'PRESENT';
    if (workHours < 4) {
      status = 'HALF_DAY';
    }

    record.checkOut = checkOutTime;
    record.workHours = workHours;
    record.status = status;
    record.remarks = `Clocked out. Total hours: ${workHours}`;
    await record.save();

    res.status(200).json({
      success: true,
      message: 'Check-out recorded successfully',
      attendance: record
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in employee's attendance (supports ?from=YYYY-MM-DD&to=YYYY-MM-DD)
// @route   GET /api/attendance/me
// @access  Private (Employee / Admin)
exports.getMyAttendance = async (req, res, next) => {
  try {
    const { from, to } = req.query;
    const filter = { employeeId: req.user.employeeId };

    if (from || to) {
      filter.date = {};
      if (from) filter.date.$gte = from;
      if (to) filter.date.$lte = to;
    }

    const records = await Attendance.find(filter).sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: records.length,
      attendance: records
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all attendance (Admin only)
// @route   GET /api/attendance/all
// @access  Private (Admin only)
exports.getAllAttendance = async (req, res, next) => {
  try {
    const { date, status, from, to } = req.query;
    const filter = {};

    if (date) filter.date = date;
    if (status) filter.status = status.toUpperCase();

    if (from || to) {
      filter.date = {};
      if (from) filter.date.$gte = from;
      if (to) filter.date.$lte = to;
    }

    const records = await Attendance.find(filter)
      .populate('userId', 'email role')
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: records.length,
      attendance: records
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get attendance for specific employee by employeeId
// @route   GET /api/attendance/employee/:employeeId
// @access  Private
exports.getAttendanceByEmployeeId = async (req, res, next) => {
  try {
    const targetEmpId = req.params.employeeId.toUpperCase();

    // Non-admin can only view their own attendance
    if (req.user.role !== 'ADMIN' && req.user.employeeId !== targetEmpId) {
      return res.status(403).json({ success: false, message: 'Forbidden: Cannot view another employee\'s attendance' });
    }

    const records = await Attendance.find({ employeeId: targetEmpId }).sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: records.length,
      attendance: records
    });
  } catch (error) {
    next(error);
  }
};
