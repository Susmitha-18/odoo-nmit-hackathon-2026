import React, { useEffect, useState } from 'react';
import { getMyPayrollAPI } from '../../api/payroll.api';
import { CreditCard, Calendar, ShieldCheck, HelpCircle } from 'lucide-react';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';

const EmployeePayroll = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [payroll, setPayroll] = useState(null);

  const fetchPayroll = async () => {
    try {
      setError('');
      const res = await getMyPayrollAPI();
      if (res.success) {
        setPayroll(res.payroll);
      }
    } catch (err) {
      console.error(err);
      setError('Unable to load personal payroll details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayroll();
  }, []);

  if (loading) return <LoadingState message="Fetching salary statement..." />;
  if (error) return <ErrorState message={error} onRetry={fetchPayroll} />;

  const allowances = payroll?.allowances || {};
  const deductions = payroll?.deductions || {};

  const totalAllowances = (allowances.hra || 0) + (allowances.conveyance || 0) + (allowances.special || 0);
  const totalDeductions = (deductions.tax || 0) + (deductions.pf || 0);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">
          My Payroll Structure
        </h1>
        <p className="text-xs font-medium text-slate-500">
          Review monthly salary scale, pre-authorized allowances, and deductions.
        </p>
      </div>

      {payroll ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main Statement Card */}
          <div className="lg:col-span-2 rounded-2xl border border-slate-205 bg-white p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="rounded-lg bg-indigo-50 p-2.5 text-indigo-650">
                  <CreditCard size={20} />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Salary Statement</h2>
                  <p className="text-[10px] text-slate-400 font-medium">Verified by HR Administration</p>
                </div>
              </div>
              <div className="flex items-center space-x-1.5 text-slate-400 text-xs font-semibold">
                <Calendar size={14} />
                <span>Effective: {new Date(payroll.effectiveDate || payroll.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Salary Grid */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {/* Allowances */}
              <div className="rounded-xl border border-slate-150 p-4 space-y-3.5 bg-slate-50/20">
                <h3 className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider border-b border-slate-100 pb-1.5">
                  Allowances (+)
                </h3>
                <div className="space-y-2 text-xs font-medium text-slate-600">
                  <div className="flex justify-between">
                    <span>House Rent Allowance (HRA)</span>
                    <span className="font-bold text-slate-700">₹{(allowances.hra || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Conveyance Allowance</span>
                    <span className="font-bold text-slate-700">₹{(allowances.conveyance || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Special Allowance</span>
                    <span className="font-bold text-slate-700">₹{(allowances.special || 0).toLocaleString()}</span>
                  </div>
                  <div className="border-t border-slate-100 pt-2 flex justify-between font-bold text-slate-800">
                    <span>Total Allowances</span>
                    <span className="text-emerald-650">₹{totalAllowances.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Deductions */}
              <div className="rounded-xl border border-slate-150 p-4 space-y-3.5 bg-slate-50/20">
                <h3 className="text-[10px] font-bold text-rose-600 uppercase tracking-wider border-b border-slate-100 pb-1.5">
                  Deductions (-)
                </h3>
                <div className="space-y-2 text-xs font-medium text-slate-600">
                  <div className="flex justify-between">
                    <span>Income Tax (TDS)</span>
                    <span className="font-bold text-slate-700">₹{(deductions.tax || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Provident Fund (PF)</span>
                    <span className="font-bold text-slate-700">₹{(deductions.pf || 0).toLocaleString()}</span>
                  </div>
                  <div className="border-t border-slate-100 pt-2 flex justify-between font-bold text-slate-800">
                    <span>Total Deductions</span>
                    <span className="text-rose-650">₹{totalDeductions.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Basic Salary */}
              <div className="md:col-span-2 border border-slate-150 rounded-xl p-4 flex justify-between items-center text-xs font-bold text-slate-650">
                <span>Basic Compensation Scale</span>
                <span className="text-slate-800 text-sm font-extrabold">₹{(payroll.basicSalary || 0).toLocaleString()}</span>
              </div>

              {/* Net Take-Home Salary */}
              <div className="md:col-span-2 bg-indigo-50 border border-indigo-150 rounded-xl p-4.5 flex justify-between items-center shadow-inner">
                <div>
                  <span className="text-xs font-bold text-indigo-900 uppercase">Net Take-Home Salary</span>
                  <p className="text-[10px] text-indigo-600 font-semibold mt-0.5">Calculated Net = Basic + Allowances - Deductions</p>
                </div>
                <span className="text-2xl font-black text-indigo-700">₹{(payroll.netSalary || 0).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Guidelines info */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-800 tracking-wider uppercase border-b border-slate-100 pb-2">
              Payroll Notes
            </h3>
            <div className="space-y-3.5">
              <div className="flex items-start space-x-2 text-xs">
                <ShieldCheck className="h-4.5 w-4.5 text-indigo-600 shrink-0 mt-0.5" />
                <p className="text-slate-500 font-medium">
                  This payroll is <span className="font-bold text-slate-700">read-only</span>. To request an adjustment or report a discrepancy, please contact Human Resources.
                </p>
              </div>
              <div className="flex items-start space-x-2 text-xs">
                <HelpCircle className="h-4.5 w-4.5 text-slate-400 shrink-0 mt-0.5" />
                <p className="text-slate-500 font-medium">
                  Calculations are audited automatically based on standard tax deductions and Provident Fund parameters.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <p className="text-slate-400 text-sm font-semibold">No payroll structures configured yet.</p>
        </div>
      )}
    </div>
  );
};

export default EmployeePayroll;
