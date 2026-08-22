const mongoose = require('mongoose');

const employeeProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  employeeId: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    trim: true
  },
  designation: {
    type: String,
    required: [true, 'Designation is required'],
    trim: true
  },
  joiningDate: {
    type: Date,
    default: Date.now
  },
  phone: {
    type: String,
    trim: true,
    default: '+1 (555) 019-2834'
  },
  address: {
    type: String,
    trim: true,
    default: '123 Tech Park, Innovation Way'
  },
  avatarUrl: {
    type: String,
    default: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'
  },
  documents: [{
    name: { type: String },
    url: { type: String },
    uploadedAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

module.exports = mongoose.model('EmployeeProfile', employeeProfileSchema);
