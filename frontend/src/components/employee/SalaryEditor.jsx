import React, { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import { updateEmployeePayrollAPI } from '../../api/payroll.api';
import { CreditCard, Save } from 'lucide-react';

const SalaryEditor = ({ employeeId, initialPayroll, onUpdateSuccess }) => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const [basicSalary, setBasicSalary] = useState(50000);
  const [hra, setHra] = useState(15000);
  const [conveyance, setConveyance] = useState(5000);
  const [special, setSpecial] = useState(10000);
  const [tax, setTax] = useState(5000);
  const [pf, setPf] = useState(3000);

  // Sync initial payroll values
  useEffect(() => {
    if (initialPayroll) {
      setBasicSalary(initialPayroll.basicSalary ?? 0);
      setHra(initialPayroll.allowances?.hra ?? 0);
      setConveyance(initialPayroll.allowances?.conveyance ?? 0);
      setSpecial(initialPayroll.allowances?.special ?? 0);
      setTax(initialPayroll.deductions?.tax ?? 0);
      setPf(initialPayroll.deductions?.pf ?? 0);
    }
  }, [initialPayroll]);

  // Calculate Net Salary in real-time
  const allowancesTotal = Number(hra) + Number(conveyance) + Number(special);
  const deductionsTotal = Number(tax) + Number(pf);
  const netSalary = Number(basicSalary) + allowancesTotal - deductionsTotal;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validations
    if (
      basicSalary < 0 ||
      hra < 0 ||
      conveyance < 0 ||
      special < 0 ||
      tax < 0 ||
      pf < 0
    ) {
      showToast('Salary fields cannot be negative values.', 'error');
      return;
    }

    if (netSalary < 0) {
      showToast('Calculated Net Salary cannot be negative.', 'error');
      return;
    }

    setLoading(true);
    try {
      const data = await updateEmployeePayrollAPI(employeeId, {
        basicSalary,
        allowances: { hra, conveyance, special },
        deductions: { tax, pf },
      });

      if (data.success) {
        showToast('Salary structure updated successfully!', 'success');
        if (onUpdateSuccess) {
          onUpdateSuccess(data.payroll);
        }
      } else {
        showToast(data.message || 'Failed to update salary.', 'error');
      }
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Failed to update salary structure.';
      showToast(errMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
      <div className="flex items-center space-x-3 border-b border-slate-100 pb-3">
        <div className="rounded-lg bg-indigo-50 p-2 text-indigo-650">
          <CreditCard size={20} />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-800 tracking-wider uppercase">
            Salary Editor
          </h3>
          <p className="text-[10px] text-slate-400 font-medium">
            Modify basic scale, allowances, and deductions for employee {employeeId}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Basic Salary */}
        <div className="col-span-2 space-y-1">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
            Basic Salary (₹)
          </label>
          <input
            type="number"
            value={basicSalary}
            onChange={(e) => setBasicSalary(Math.max(0, parseInt(e.target.value) || 0))}
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-550 transition-colors"
            required
          />
        </div>

        {/* Allowances Column */}
        <div className="rounded-xl border border-slate-150 p-4 space-y-3.5 bg-slate-50/20">
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-1.5">
            Allowances (+)
          </h4>
          <div className="space-y-1">
            <label className="text-[10px] font-semibold text-slate-550">HRA</label>
            <input
              type="number"
              value={hra}
              onChange={(e) => setHra(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-semibold text-slate-550">Conveyance</label>
            <input
              type="number"
              value={conveyance}
              onChange={(e) => setConveyance(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-semibold text-slate-550">Special Allowance</label>
            <input
              type="number"
              value={special}
              onChange={(e) => setSpecial(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
          </div>
        </div>

        {/* Deductions Column */}
        <div className="rounded-xl border border-slate-150 p-4 space-y-3.5 bg-slate-50/20">
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-1.5">
            Deductions (-)
          </h4>
          <div className="space-y-1">
            <label className="text-[10px] font-semibold text-slate-550">Professional Tax</label>
            <input
              type="number"
              value={tax}
              onChange={(e) => setTax(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-semibold text-slate-550">Provident Fund (PF)</label>
            <input
              type="number"
              value={pf}
              onChange={(e) => setPf(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
          </div>
        </div>

        {/* Calculated summary */}
        <div className="col-span-2 bg-indigo-50 border border-indigo-150 rounded-xl p-4.5 flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0 shadow-inner">
          <div>
            <p className="text-[10px] font-bold text-indigo-900 uppercase tracking-wider">Calculated Net Salary</p>
            <p className="text-xs text-indigo-600 font-medium mt-0.5">
              Basic + HRA + Conveyance + Special - Tax - PF
            </p>
          </div>
          <span className="text-2xl font-black text-indigo-700">₹{netSalary.toLocaleString()}</span>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full inline-flex items-center justify-center space-x-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 py-3 text-xs font-semibold text-white shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        {loading ? (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white"></div>
        ) : (
          <Save size={16} />
        )}
        <span>Update Salary Structure</span>
      </button>
    </form>
  );
};

export default SalaryEditor;
