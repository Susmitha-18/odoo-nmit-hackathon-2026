import React, { useState, useEffect } from 'react';
import { Wallet, DollarSign, Edit, Save, Plus, ArrowUpRight, TrendingUp } from 'lucide-react';
import { mockService } from '../../mock/mockService';
import Modal from '../../components/ui/Modal';
import { FormInput } from '../../components/ui/FormInput';
import { LoadingState } from '../../components/ui/States';
import { formatCurrency, formatDate } from '../../utils/dateUtils';
import toast from 'react-hot-toast';

export default function PayrollManagement() {
  const [salaries, setSalaries] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingEmpId, setEditingEmpId] = useState(null);
  const [salaryForm, setSalaryForm] = useState({
    basicSalary: 0,
    allowances: 0,
    deductions: 0,
  });
  const [isSaving, setIsSaving] = useState(false);

  const fetchData = () => {
    Promise.all([
      mockService.getAllPayroll(),
      mockService.getAllEmployees(),
    ]).then(([salRes, empRes]) => {
      setSalaries(salRes.data || []);
      setEmployees(empRes.data || []);
    }).finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) return <LoadingState message="Loading payroll structures..." />;

  const getEmployee = (empId) => employees.find(e => e._id === empId);

  const handleOpenEdit = (sal) => {
    setEditingEmpId(sal.employeeId);
    setSalaryForm({
      basicSalary: sal.basicSalary || 0,
      allowances: sal.allowances || 0,
      deductions: sal.deductions || 0,
    });
  };

  const handleSaveSalary = async (e) => {
    e.preventDefault();
    if (!editingEmpId) return;
    setIsSaving(true);

    try {
      await mockService.updateSalary(editingEmpId, {
        basicSalary: Number(salaryForm.basicSalary),
        allowances: Number(salaryForm.allowances),
        deductions: Number(salaryForm.deductions),
      });
      toast.success('Salary structure updated successfully!');
      setEditingEmpId(null);
      fetchData();
    } catch {
      toast.error('Failed to update salary');
    } finally {
      setIsSaving(false);
    }
  };

  const totalBasic = salaries.reduce((acc, curr) => acc + (curr.basicSalary || 0), 0);
  const totalAllowances = salaries.reduce((acc, curr) => acc + (curr.allowances || 0), 0);
  const totalDeductions = salaries.reduce((acc, curr) => acc + (curr.deductions || 0), 0);
  const totalNet = salaries.reduce((acc, curr) => acc + (curr.netSalary || 0), 0);

  const selectedEmployee = editingEmpId ? getEmployee(editingEmpId) : null;
  const calculatedNet = (Number(salaryForm.basicSalary) || 0) + (Number(salaryForm.allowances) || 0) - (Number(salaryForm.deductions) || 0);

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">Payroll & Salary Administration</h2>
        <p className="text-sm text-gray-500">Configure salary structures, view breakdowns, and update compensation for all employees.</p>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card !p-4 bg-indigo-50/50 border-indigo-100">
          <span className="text-xs text-indigo-700 font-semibold uppercase">Total Net Payout</span>
          <p className="text-2xl font-bold text-indigo-900 mt-1">{formatCurrency(totalNet)}</p>
          <span className="text-[11px] text-indigo-600">Company-wide monthly</span>
        </div>
        <div className="card !p-4">
          <span className="text-xs text-gray-400 font-semibold uppercase">Base Salaries</span>
          <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(totalBasic)}</p>
          <span className="text-[11px] text-gray-500">Fixed basic component</span>
        </div>
        <div className="card !p-4">
          <span className="text-xs text-gray-400 font-semibold uppercase">Total Allowances</span>
          <p className="text-2xl font-bold text-success-700 mt-1">+{formatCurrency(totalAllowances)}</p>
          <span className="text-[11px] text-gray-500">HRA, Travel, Performance</span>
        </div>
        <div className="card !p-4">
          <span className="text-xs text-gray-400 font-semibold uppercase">Total Deductions</span>
          <p className="text-2xl font-bold text-danger-600 mt-1">-{formatCurrency(totalDeductions)}</p>
          <span className="text-[11px] text-gray-500">PF, Taxes, Insurance</span>
        </div>
      </div>

      {/* Salaries Table */}
      <div className="card overflow-hidden !p-0">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Department</th>
                <th>Basic Salary</th>
                <th>Allowances</th>
                <th>Deductions</th>
                <th>Net Payout</th>
                <th>Effective Date</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {salaries.map((sal) => {
                const emp = getEmployee(sal.employeeId);
                return (
                  <tr key={sal._id} className="hover:bg-gray-50/80 transition-colors">
                    <td>
                      <div>
                        <p className="font-semibold text-gray-900">{emp ? `${emp.firstName} ${emp.lastName}` : sal.employeeId}</p>
                        <p className="text-xs font-mono text-gray-400">{emp?.employeeId}</p>
                      </div>
                    </td>
                    <td>
                      <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                        {emp?.department || '—'}
                      </span>
                    </td>
                    <td className="font-medium text-gray-800">{formatCurrency(sal.basicSalary)}</td>
                    <td className="font-medium text-success-600">+{formatCurrency(sal.allowances)}</td>
                    <td className="font-medium text-danger-600">-{formatCurrency(sal.deductions)}</td>
                    <td>
                      <span className="font-bold text-gray-900 px-2.5 py-1 bg-success-50 rounded-lg text-sm border border-success-100">
                        {formatCurrency(sal.netSalary)}
                      </span>
                    </td>
                    <td className="text-xs text-gray-500">{formatDate(sal.effectiveFrom)}</td>
                    <td className="text-right">
                      <button
                        onClick={() => handleOpenEdit(sal)}
                        className="btn-secondary btn btn-sm inline-flex items-center gap-1"
                      >
                        <Edit size={13} /> Update Salary
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Salary Modal */}
      <Modal
        isOpen={!!editingEmpId}
        onClose={() => setEditingEmpId(null)}
        title="Update Salary Structure"
        size="md"
      >
        {selectedEmployee && (
          <form onSubmit={handleSaveSalary} className="space-y-4">
            <div className="p-3 bg-gray-50 rounded-xl text-sm mb-4">
              <p className="font-semibold text-gray-900">{selectedEmployee.firstName} {selectedEmployee.lastName}</p>
              <p className="text-xs text-gray-500">{selectedEmployee.designation} · {selectedEmployee.department}</p>
            </div>

            <FormInput
              id="basicSalary"
              label="Basic Salary (₹)"
              type="number"
              min="0"
              required
              value={salaryForm.basicSalary}
              onChange={(e) => setSalaryForm(p => ({ ...p, basicSalary: e.target.value }))}
            />

            <FormInput
              id="allowances"
              label="Allowances (HRA, Special, etc.) (₹)"
              type="number"
              min="0"
              required
              value={salaryForm.allowances}
              onChange={(e) => setSalaryForm(p => ({ ...p, allowances: e.target.value }))}
            />

            <FormInput
              id="deductions"
              label="Deductions (Tax, PF, Medical) (₹)"
              type="number"
              min="0"
              required
              value={salaryForm.deductions}
              onChange={(e) => setSalaryForm(p => ({ ...p, deductions: e.target.value }))}
            />

            {/* Live Calculated Net Salary Banner */}
            <div className="p-3.5 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs text-indigo-700 font-semibold block">Computed Net Salary</span>
                <span className="text-xs text-gray-500">Basic + Allowances - Deductions</span>
              </div>
              <p className="text-xl font-bold text-indigo-900">{formatCurrency(calculatedNet)}</p>
            </div>

            <div className="flex justify-end gap-2 pt-3">
              <button
                type="button"
                onClick={() => setEditingEmpId(null)}
                className="btn-secondary btn"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="btn-primary btn"
              >
                {isSaving ? 'Saving...' : 'Save New Structure'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
