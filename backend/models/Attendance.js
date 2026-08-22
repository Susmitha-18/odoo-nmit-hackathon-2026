const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  employeeId: {
    type: String,
    required: true,
    uppercase: true,
    index: true
  },
  date: {
    type: String, // Format: YYYY-MM-DD for reliable date grouping
    required: true,
    index: true
  },
  checkIn: {
    type: Date,
    required: true
  },
  checkOut: {
    type: Date
  },
  workHours: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['Present', 'Absent', 'Half-day', 'Leave'],
    default: 'Present'
  },
  remarks: {
    type: String,
    default: 'On time'
  }
}, { timestamps: true });

attendanceSchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
