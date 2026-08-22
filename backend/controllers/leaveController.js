const Leave = require('../models/Leave');
const Attendance = require('../models/Attendance');

// @desc    Apply for leave
// @route   POST /api/v1/leaves
// @access  Private (Employee / Admin)
exports.applyLeave = async (req, res, next) => {
  try {
    const { leaveType, startDate, endDate, reason } = req.body;

    if (!leaveType || !startDate || !endDate || !reason) {
      return res.status(400).json({ success: false, message: 'Please provide leave type, start date, end date, and reason.' });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end < start) {
      return res.status(400).json({ success: false, message: 'End date must be greater than or equal to start date.' });
    }

    const diffTime = Math.abs(end - start);
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    const leave = await Leave.create({
      applicant: req.user.id,
      employeeId: req.user.employeeId,
      leaveType,
      startDate: start,
      endDate: end,
      totalDays,
      reason,
      status: 'Pending'
    });

    res.status(201).json({
      success: true,
      message: 'Leave application submitted successfully!',
      leave
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user's leave requests
// @route   GET /api/v1/leaves/me
// @access  Private (Employee / Admin)
exports.getMyLeaves = async (req, res, next) => {
  try {
    const leaves = await Leave.find({ applicant: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: leaves.length,
      leaves
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all leave requests across system
// @route   GET /api/v1/leaves/all
// @access  Private (Admin only)
exports.getAllLeaves = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const leaves = await Leave.find(filter)
      .populate('applicant', 'email role')
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

// @desc    Approve or Reject leave request (Admin decision)
// @route   PATCH /api/v1/leaves/:id/decision
// @access  Private (Admin only)
exports.handleLeaveDecision = async (req, res, next) => {
  try {
    const { status, adminComment } = req.body;

    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Decision status must be either Approved or Rejected' });
    }

    const leave = await Leave.findById(req.params.id);
    if (!leave) {
      return res.status(404).json({ success: false, message: 'Leave request not found' });
    }

    leave.status = status;
    leave.adminComment = adminComment || (status === 'Approved' ? 'Leave approved by HR' : 'Leave rejected');
    leave.reviewedBy = req.user.id;
    leave.reviewedAt = new Date();

    await leave.save();

    // If approved, dynamically log/flag attendance records for the dates
    if (status === 'Approved') {
      const currentDate = new Date(leave.startDate);
      const lastDate = new Date(leave.endDate);

      while (currentDate <= lastDate) {
        const dateStr = currentDate.toISOString().split('T')[0];
        await Attendance.findOneAndUpdate(
          { user: leave.applicant, date: dateStr },
          {
            $set: {
              user: leave.applicant,
              employeeId: leave.employeeId,
              date: dateStr,
              checkIn: currentDate,
              checkOut: currentDate,
              workHours: 8,
              status: 'Leave',
              remarks: `Approved Leave (${leave.leaveType})`
            }
          },
          { upsert: true, new: true }
        );
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }

    res.status(200).json({
      success: true,
      message: `Leave application successfully ${status.toLowerCase()}!`,
      leave
    });
  } catch (error) {
    next(error);
  }
};
