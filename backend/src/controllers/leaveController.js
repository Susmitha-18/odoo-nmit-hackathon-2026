const LeaveRequest = require('../models/LeaveRequest');
const Attendance = require('../models/Attendance');

// @desc    Apply for leave (Starts PENDING)
// @route   POST /api/leaves
// @access  Private (Employee / Admin)
exports.createLeaveRequest = async (req, res, next) => {
  try {
    const { leaveType, startDate, endDate, remarks } = req.body;

    if (!leaveType || !startDate || !endDate || !remarks) {
      return res.status(400).json({ success: false, message: 'Please provide leaveType, startDate, endDate, and remarks' });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ success: false, message: 'Invalid date format' });
    }

    if (end < start) {
      return res.status(400).json({ success: false, message: 'endDate cannot be earlier than startDate' });
    }

    const diffTime = Math.abs(end - start);
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    // Check for overlapping pending/approved leave requests
    const overlapping = await LeaveRequest.findOne({
      employeeId: req.user.employeeId,
      status: { $in: ['PENDING', 'APPROVED'] },
      $or: [
        { startDate: { $lte: end }, endDate: { $gte: start } }
      ]
    });

    if (overlapping) {
      return res.status(400).json({ success: false, message: 'You already have an active or pending leave request for this date range' });
    }

    const leave = await LeaveRequest.create({
      employeeId: req.user.employeeId,
      userId: req.user.id,
      leaveType: leaveType.toUpperCase(),
      startDate: start,
      endDate: end,
      totalDays,
      remarks,
      status: 'PENDING'
    });

    res.status(201).json({
      success: true,
      message: 'Leave application submitted successfully',
      leave
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user's leave requests
// @route   GET /api/leaves/me
// @access  Private (Employee / Admin)
exports.getMyLeaves = async (req, res, next) => {
  try {
    const leaves = await LeaveRequest.find({ employeeId: req.user.employeeId }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: leaves.length,
      leaves
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get leave requests (Admin returns all; Employee returns own)
// @route   GET /api/leaves
// @access  Private
exports.getLeaves = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = {};

    if (req.user.role !== 'ADMIN') {
      filter.employeeId = req.user.employeeId;
    }

    if (status) {
      filter.status = status.toUpperCase();
    }

    const leaves = await LeaveRequest.find(filter)
      .populate('userId', 'email role')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: leaves.length,
      leaves
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve leave request (Admin only)
// @route   PUT /api/leaves/:id/approve
// @access  Private (Admin only)
exports.approveLeave = async (req, res, next) => {
  try {
    const { adminComment } = req.body;
    const leave = await LeaveRequest.findById(req.params.id);

    if (!leave) {
      return res.status(404).json({ success: false, message: 'Leave request not found' });
    }

    leave.status = 'APPROVED';
    leave.adminComment = adminComment || 'Approved by Admin/HR';
    leave.reviewedBy = req.user.id;
    leave.reviewedAt = new Date();
    await leave.save();

    // Dynamically flag attendance records for approved days
    const currentDate = new Date(leave.startDate);
    const lastDate = new Date(leave.endDate);

    while (currentDate <= lastDate) {
      const dateStr = currentDate.toISOString().split('T')[0];
      await Attendance.findOneAndUpdate(
        { employeeId: leave.employeeId, date: dateStr },
        {
          $set: {
            employeeId: leave.employeeId,
            userId: leave.userId,
            date: dateStr,
            checkIn: currentDate,
            checkOut: currentDate,
            workHours: 8,
            status: 'LEAVE',
            remarks: `Approved ${leave.leaveType} Leave`
          }
        },
        { upsert: true, new: true }
      );
      currentDate.setDate(currentDate.getDate() + 1);
    }

    res.status(200).json({
      success: true,
      message: 'Leave request approved successfully',
      leave
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reject leave request (Admin only)
// @route   PUT /api/leaves/:id/reject
// @access  Private (Admin only)
exports.rejectLeave = async (req, res, next) => {
  try {
    const { adminComment } = req.body;
    const leave = await LeaveRequest.findById(req.params.id);

    if (!leave) {
      return res.status(404).json({ success: false, message: 'Leave request not found' });
    }

    leave.status = 'REJECTED';
    leave.adminComment = adminComment || 'Rejected by Admin/HR';
    leave.reviewedBy = req.user.id;
    leave.reviewedAt = new Date();
    await leave.save();

    res.status(200).json({
      success: true,
      message: 'Leave request rejected',
      leave
    });
  } catch (error) {
    next(error);
  }
};
