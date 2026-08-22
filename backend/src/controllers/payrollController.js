const Payroll = require('../models/Payroll');

// @desc    Get logged in user's payroll
// @route   GET /api/payroll/me
// @access  Private (Employee / Admin)
exports.getMyPayroll = async (req, res, next) => {
  try {
    let payroll = await Payroll.findOne({ employeeId: req.user.employeeId });

    if (!payroll) {
      payroll = await Payroll.create({
        userId: req.user.id,
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

// @desc    Get all payrolls (Admin returns all; Employee returns own)
// @route   GET /api/payroll
// @access  Private
exports.getPayrolls = async (req, res, next) => {
  try {
    if (req.user.role === 'ADMIN') {
      const payrolls = await Payroll.find().populate('userId', 'email role');
      return res.status(200).json({ success: true, count: payrolls.length, payrolls });
    }

    const payroll = await Payroll.findOne({ employeeId: req.user.employeeId });
    return res.status(200).json({ success: true, count: 1, payrolls: [payroll] });
  } catch (error) {
    next(error);
  }
};

// @desc    Update employee salary structure (Admin only)
// @route   PUT /api/payroll/:employeeId
// @access  Private (Admin only)
exports.updatePayroll = async (req, res, next) => {
  try {
    const targetEmpId = req.params.employeeId.toUpperCase();
    const { basicSalary, allowances, deductions } = req.body;

    let payroll = await Payroll.findOne({ employeeId: targetEmpId });

    if (!payroll) {
      return res.status(404).json({ success: false, message: `Payroll record for employee ${targetEmpId} not found` });
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

    payroll.effectiveFrom = new Date();
    await payroll.save(); // Triggers netSalary recalculation

    res.status(200).json({
      success: true,
      message: 'Salary structure updated successfully',
      payroll
    });
  } catch (error) {
    next(error);
  }
};
