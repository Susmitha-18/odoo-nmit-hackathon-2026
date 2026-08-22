import axiosInstance from './axiosInstance';
import * as mockService from './mock/mockServices';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

export const payrollApi = {
  /**
   * GET /api/v1/payroll/all  (Admin: all payrolls)
   * Response: { success, count, payrolls: [...] }
   * Each payroll: { _id, user, employeeId, basicSalary,
   *   allowances: { hra, conveyance, special },
   *   deductions: { tax, pf },
   *   netSalary, effectiveDate }
   */
  getAll: async () => {
    if (USE_MOCK) return mockService.getAllPayroll();
    const { data } = await axiosInstance.get('/payroll/all');
    return data.payrolls || [];
  },

  /**
   * GET /api/v1/payroll/me  (Own payroll — Employee)
   */
  getMine: async () => {
    if (USE_MOCK) return mockService.getMyPayroll();
    const { data } = await axiosInstance.get('/payroll/me');
    return data.payroll;
  },

  /**
   * PATCH /api/v1/payroll/:employeeId  (Admin update)
   * Body: { basicSalary, allowances: { hra, conveyance, special }, deductions: { tax, pf } }
   * Note: :employeeId is the employeeId string like "EMP001", NOT the Mongo _id
   * Backend auto-recalculates netSalary on save
   */
  update: async (employeeId, formData) => {
    if (USE_MOCK) return mockService.updatePayroll(employeeId, formData);

    // Convert frontend's allowances/deductions array format to backend's object format
    const allowancesArr = formData.allowances || [];
    const deductionsArr = formData.deductions || [];

    // Map frontend line items to backend schema fields
    // Backend expects: { hra, conveyance, special } and { tax, pf }
    // We map by name if possible, or use positional fallback
    const allowancesObj = {
      hra: 0,
      conveyance: 0,
      special: 0,
    };
    const deductionsObj = {
      tax: 0,
      pf: 0,
    };

    allowancesArr.forEach((item) => {
      const key = item.name.toLowerCase().replace(/\s+/g, '');
      if (key.includes('hra') || key.includes('house')) allowancesObj.hra = item.amount;
      else if (key.includes('conv')) allowancesObj.conveyance = item.amount;
      else if (key.includes('spec') || key.includes('other')) allowancesObj.special = item.amount;
      else allowancesObj.special += item.amount; // accumulate extras into special
    });

    deductionsArr.forEach((item) => {
      const key = item.name.toLowerCase().replace(/\s+/g, '');
      if (key.includes('tax') || key.includes('income')) deductionsObj.tax = item.amount;
      else if (key.includes('pf') || key.includes('provident')) deductionsObj.pf = item.amount;
      else deductionsObj.tax += item.amount; // accumulate extras into tax
    });

    const { data } = await axiosInstance.patch(`/payroll/${employeeId}`, {
      basicSalary: formData.baseSalary || formData.basicSalary,
      allowances: allowancesObj,
      deductions: deductionsObj,
    });
    return data.payroll;
  },
};
