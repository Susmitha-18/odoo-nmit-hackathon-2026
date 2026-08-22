const Payroll = require('../models/Payroll');
const EmployeeProfile = require('../models/EmployeeProfile');

// @desc    Get logged in employee's payroll info
// @route   GET /api/v1/payroll/me
// @access  Private (Employee / Admin)
exports.getMyPayroll = async (req, res, next) => {
  try {
    let payroll = await Payroll.findOne({ user: req.user.id });

    if (!payroll) {
      // Create default payroll if none exists
      payroll = await Payroll.create({
        user: req.user.id,
        employeeId: req.user.employeeId,
        basicSalary: 60000,
        allowances: { hra: 18000, conveyance: 5000, special: 12000 },
        deductions: { tax: 6000, pf: 4000 }
      });
    }

    res.status(200).json({
      success: true,
      payroll
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all payroll structures across employees (Admin only)
// @route   GET /api/v1/payroll/all
// @access  Private (Admin only)
exports.getAllPayrolls = async (req, res, next) => {
  try {
    const payrolls = await Payroll.find().populate('user', 'email role');
    res.status(200).json({
      success: true,
      count: payrolls.length,
      payrolls
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update employee salary structure (Admin only)
// @route   PATCH /api/v1/payroll/:employeeId
// @access  Private (Admin only)
exports.updateEmployeePayroll = async (req, res, next) => {
  try {
    const { basicSalary, allowances, deductions } = req.body;
    const targetEmployeeId = req.params.employeeId.toUpperCase();

    let payroll = await Payroll.findOne({ employeeId: targetEmployeeId });

    if (!payroll) {
      return res.status(404).json({ success: false, message: `Payroll record for employee ID ${targetEmployeeId} not found` });
    }

    if (basicSalary !== undefined) payroll.basicSalary = basicSalary;
    if (allowances) {
      if (allowances.hra !== undefined) payroll.allowances.hra = allowances.hra;
      if (allowances.conveyance !== undefined) payroll.allowances.conveyance = allowances.conveyance;
      if (allowances.special !== undefined) payroll.allowances.special = allowances.special;
    }
    if (deductions) {
      if (deductions.tax !== undefined) payroll.deductions.tax = deductions.tax;
      if (deductions.pf !== undefined) payroll.deductions.pf = deductions.pf;
    }

    payroll.effectiveDate = new Date();
    await payroll.save(); // Triggers netSalary pre-save recalculation

    res.status(200).json({
      success: true,
      message: 'Salary structure updated successfully by Admin',
      payroll
    });
  } catch (error) {
    next(error);
  }
};
