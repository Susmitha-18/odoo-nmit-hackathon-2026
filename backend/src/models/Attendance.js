const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: true,
    uppercase: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  date: {
    type: String, // Format YYYY-MM-DD
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
    enum: ['PRESENT', 'ABSENT', 'HALF_DAY', 'LEAVE'],
    default: 'PRESENT'
  },
  remarks: {
    type: String,
    default: ''
  }
}, { timestamps: true });

attendanceSchema.index({ employeeId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
