const mongoose = require('mongoose');

const payrollSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  employeeId: {
    type: String,
    required: true,
    uppercase: true
  },
  basicSalary: {
    type: Number,
    required: true,
    default: 50000
  },
  allowances: {
    hra: { type: Number, default: 15000 },
    conveyance: { type: Number, default: 5000 },
    special: { type: Number, default: 10000 }
  },
  deductions: {
    tax: { type: Number, default: 5000 },
    pf: { type: Number, default: 3000 }
  },
  netSalary: {
    type: Number,
    required: true,
    default: 72000
  },
  currency: {
    type: String,
    default: 'INR'
  },
  effectiveDate: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Pre-save middleware to automatically calculate net salary
payrollSchema.pre('save', function(next) {
  const totalAllowances = (this.allowances.hra || 0) + (this.allowances.conveyance || 0) + (this.allowances.special || 0);
  const totalDeductions = (this.deductions.tax || 0) + (this.deductions.pf || 0);
  this.netSalary = this.basicSalary + totalAllowances - totalDeductions;
  next();
});

module.exports = mongoose.model('Payroll', payrollSchema);
