const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
  applicant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  employeeId: {
    type: String,
    required: true,
    uppercase: true
  },
  leaveType: {
    type: String,
    enum: ['Paid', 'Sick', 'Unpaid'],
    required: [true, 'Leave type is required']
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required']
  },
  totalDays: {
    type: Number,
    required: true
  },
  reason: {
    type: String,
    required: [true, 'Reason for leave is required'],
    trim: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending',
    index: true
  },
  adminComment: {
    type: String,
    default: ''
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedAt: {
    type: Date
  }
}, { timestamps: true });

module.exports = mongoose.model('Leave', leaveSchema);
