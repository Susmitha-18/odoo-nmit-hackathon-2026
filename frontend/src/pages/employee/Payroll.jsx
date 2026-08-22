import React, { useState, useEffect } from 'react';
import { Wallet, TrendingUp, Minus } from 'lucide-react';
import { mockService } from '../../mock/mockService';
import { LoadingState } from '../../components/ui/States';
import { formatCurrency, formatDate } from '../../utils/dateUtils';

function SalaryRow({ label, value, highlight, deduction }) {
  return (
    <div className={`flex items-center justify-between py-3 border-b border-gray-50 last:border-b-0 ${highlight ? 'bg-success-50 rounded-xl px-4 -mx-4' : ''}`}>
      <div className="flex items-center gap-2">
        {deduction
          ? <Minus size={14} className="text-danger-500" />
          : <TrendingUp size={14} className={highlight ? 'text-success-600' : 'text-gray-300'} />}
        <span className={`text-sm ${highlight ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>{label}</span>
      </div>
      <span className={`text-sm font-semibold ${highlight ? 'text-success-700 text-base' : deduction ? 'text-danger-600' : 'text-gray-800'}`}>
        {deduction ? `- ${formatCurrency(value)}` : formatCurrency(value)}
      </span>
    </div>
  );
}

export default function Payroll() {
  const [payroll, setPayroll]   = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    mockService.getMyPayroll()
      .then((res) => setPayroll(res.data))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <LoadingState message="Loading payroll…" />;

  if (!payroll) {
    return (
      <div className="max-w-2xl">
        <div className="card flex flex-col items-center gap-3 py-16 text-gray-400">
          <Wallet size={40} className="text-gray-300" />
          <p className="text-base font-medium text-gray-600">No payroll information available</p>
        </div>
      </div>
    );
  }

  const grossSalary = (payroll.basicSalary ?? 0) + (payroll.allowances ?? 0);

  return (
    <div className="max-w-2xl space-y-6">
      {/* Read-only notice */}
      <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
        <span className="text-primary-600">ℹ</span>
        Payroll information is managed by HR and is read-only.
      </div>

      {/* Hero */}
      <div className="card bg-gradient-to-br from-primary-600 to-primary-700 text-white">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-primary-100 text-sm font-medium">Net Salary</p>
            <p className="text-4xl font-bold mt-1">{formatCurrency(payroll.netSalary)}</p>
          </div>
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
            <Wallet size={24} />
          </div>
        </div>
        <div className="flex items-center justify-between text-primary-100 text-xs">
          <span>Effective from {formatDate(payroll.effectiveFrom)}</span>
          <span>Last updated {formatDate(payroll.updatedAt)}</span>
        </div>
      </div>

      {/* Breakdown */}
      <div className="card">
        <h3 className="section-title mb-5">Salary Breakdown</h3>
        <SalaryRow label="Basic Salary" value={payroll.basicSalary} />
        <SalaryRow label="Allowances"   value={payroll.allowances} />
        <div className="divider my-2" />
        <div className="flex items-center justify-between py-2 text-sm text-gray-500">
          <span>Gross Salary</span>
          <span className="font-medium text-gray-700">{formatCurrency(grossSalary)}</span>
        </div>
        <div className="divider my-2" />
        <SalaryRow label="Deductions"  value={payroll.deductions} deduction />
        <div className="divider my-2" />
        <SalaryRow label="Net Salary"  value={payroll.netSalary}  highlight />
      </div>

      {/* Bar chart */}
      <div className="card">
        <h3 className="section-title mb-4">Distribution</h3>
        <div className="space-y-4">
          {[
            { label: 'Basic Salary', value: payroll.basicSalary, color: 'bg-primary-500', max: grossSalary },
            { label: 'Allowances',   value: payroll.allowances,  color: 'bg-success-500', max: grossSalary },
            { label: 'Deductions',   value: payroll.deductions,  color: 'bg-danger-400',  max: grossSalary },
          ].map(({ label, value, color, max }) => (
            <div key={label}>
              <div className="flex items-center justify-between text-sm mb-1.5">
                <span className="text-gray-600">{label}</span>
                <span className="font-medium text-gray-800">{formatCurrency(value)}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full ${color} rounded-full`}
                  style={{ width: `${max > 0 ? Math.round((value / max) * 100) : 0}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
