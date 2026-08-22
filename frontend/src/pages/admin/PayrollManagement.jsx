import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { Pencil, X, Plus, Trash2, DollarSign, Save } from 'lucide-react';
import AdminLayout from '../../components/layout/AdminLayout';
import PageHeader from '../../components/ui/PageHeader';
import Avatar from '../../components/ui/Avatar';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';
import EmptyState from '../../components/ui/EmptyState';
import { payrollApi } from '../../api/payroll.api';
import { employeeApi } from '../../api/employee.api';
import { formatCurrency, getFullName, getErrorMessage } from '../../utils/formatUtils';
import { formatDate } from '../../utils/dateUtils';

function SalaryLineItem({ item, onChange, onRemove, type, readOnly }) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="text"
        value={item.name}
        onChange={(e) => onChange({ ...item, name: e.target.value })}
        placeholder={type === 'allowance' ? 'Allowance name' : 'Deduction name'}
        readOnly={readOnly}
        className="flex-1 text-sm border border-neutral-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 disabled:bg-neutral-50"
      />
      <div className="relative w-36">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-sm">$</span>
        <input
          type="number"
          value={item.amount}
          onChange={(e) => onChange({ ...item, amount: parseFloat(e.target.value) || 0 })}
          min="0"
          step="0.01"
          readOnly={readOnly}
          className="w-full text-sm border border-neutral-200 rounded-lg pl-7 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 disabled:bg-neutral-50"
        />
      </div>
      {!readOnly && (
        <button
          onClick={onRemove}
          className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

function SalaryEditor({ record, onSave, onCancel }) {
  const [form, setForm] = useState({
    baseSalary: record.baseSalary,
    allowances: record.allowances.map((a) => ({ ...a })),
    deductions: record.deductions.map((d) => ({ ...d })),
  });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const totalAllowances = form.allowances.reduce((s, a) => s + (parseFloat(a.amount) || 0), 0);
  const totalDeductions = form.deductions.reduce((s, d) => s + (parseFloat(d.amount) || 0), 0);
  const netSalary = (parseFloat(form.baseSalary) || 0) + totalAllowances - totalDeductions;

  const validate = () => {
    const e = {};
    if (!form.baseSalary || parseFloat(form.baseSalary) <= 0) e.baseSalary = 'Base salary must be a positive number.';
    form.allowances.forEach((a, i) => {
      if (!a.name.trim()) e[`allow_name_${i}`] = 'Name required.';
      if (isNaN(a.amount) || a.amount < 0) e[`allow_amt_${i}`] = 'Invalid amount.';
    });
    form.deductions.forEach((d, i) => {
      if (!d.name.trim()) e[`ded_name_${i}`] = 'Name required.';
      if (isNaN(d.amount) || d.amount < 0) e[`ded_amt_${i}`] = 'Invalid amount.';
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      await onSave({ ...form, netSalary });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Base salary */}
      <div>
        <label className="block text-xs font-medium text-neutral-600 mb-1.5">Base Salary (USD) *</label>
        <div className="relative w-56">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-sm">$</span>
          <input
            type="number"
            value={form.baseSalary}
            onChange={(e) => setForm((p) => ({ ...p, baseSalary: parseFloat(e.target.value) || 0 }))}
            min="0"
            className="w-full text-sm border border-neutral-200 rounded-lg pl-7 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
          />
        </div>
        {errors.baseSalary && <p className="text-xs text-red-500 mt-1">{errors.baseSalary}</p>}
      </div>

      {/* Allowances */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-medium text-neutral-600">Allowances</label>
          <button
            onClick={() => setForm((p) => ({ ...p, allowances: [...p.allowances, { name: '', amount: 0 }] }))}
            className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-medium"
          >
            <Plus className="w-3 h-3" /> Add
          </button>
        </div>
        <div className="space-y-2">
          {form.allowances.length === 0 && (
            <p className="text-xs text-neutral-400 italic">No allowances.</p>
          )}
          {form.allowances.map((a, i) => (
            <SalaryLineItem
              key={i}
              item={a}
              type="allowance"
              onChange={(updated) => {
                const arr = [...form.allowances];
                arr[i] = updated;
                setForm((p) => ({ ...p, allowances: arr }));
              }}
              onRemove={() => setForm((p) => ({ ...p, allowances: p.allowances.filter((_, idx) => idx !== i) }))}
            />
          ))}
        </div>
        <p className="text-xs text-neutral-400 mt-2">Total: {formatCurrency(totalAllowances)}</p>
      </div>

      {/* Deductions */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-medium text-neutral-600">Deductions</label>
          <button
            onClick={() => setForm((p) => ({ ...p, deductions: [...p.deductions, { name: '', amount: 0 }] }))}
            className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-medium"
          >
            <Plus className="w-3 h-3" /> Add
          </button>
        </div>
        <div className="space-y-2">
          {form.deductions.length === 0 && (
            <p className="text-xs text-neutral-400 italic">No deductions.</p>
          )}
          {form.deductions.map((d, i) => (
            <SalaryLineItem
              key={i}
              item={d}
              type="deduction"
              onChange={(updated) => {
                const arr = [...form.deductions];
                arr[i] = updated;
                setForm((p) => ({ ...p, deductions: arr }));
              }}
              onRemove={() => setForm((p) => ({ ...p, deductions: p.deductions.filter((_, idx) => idx !== i) }))}
            />
          ))}
        </div>
        <p className="text-xs text-neutral-400 mt-2">Total: {formatCurrency(totalDeductions)}</p>
      </div>

      {/* Net salary preview */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex items-center justify-between">
        <span className="text-sm font-semibold text-indigo-800">Net Salary (Preview)</span>
        <span className="text-xl font-bold text-indigo-700">{formatCurrency(netSalary)}</span>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-2 border-t border-neutral-100">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-neutral-600 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg disabled:opacity-60 transition-colors"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save Salary'}
        </button>
      </div>
    </div>
  );
}

export default function PayrollManagement() {
  const [payrollList, setPayrollList] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selected, setSelected] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [payData, empData] = await Promise.all([
        payrollApi.getAll(),
        employeeApi.getAll(),
      ]);
      setPayrollList(payData);
      setEmployees(empData);
      if (payData.length > 0 && !selected) {
        setSelected(payData[0]);
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const getEmployee = (userId) => employees.find((e) => (e.userId || e._id) === userId);

  const handleSave = async (formData) => {
    try {
      const updated = await payrollApi.update(selected.userId, formData);
      setPayrollList((prev) => prev.map((p) => (p.userId === selected.userId ? updated : p)));
      setSelected(updated);
      setEditing(false);
      toast.success('Salary structure updated successfully.');
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  if (loading) return <AdminLayout><LoadingState message="Loading payroll data..." /></AdminLayout>;
  if (error) return <AdminLayout><ErrorState message={error} onRetry={load} /></AdminLayout>;

  return (
    <AdminLayout>
      <PageHeader
        title="Payroll Management"
        subtitle="View and update employee salary structures."
        breadcrumb={[{ label: 'Admin' }, { label: 'Payroll' }]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Employee list sidebar */}
        <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-neutral-100">
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Employees</p>
          </div>
          <div className="divide-y divide-neutral-50 overflow-y-auto max-h-[calc(100vh-220px)]">
            {payrollList.length === 0 ? (
              <EmptyState message="No payroll records found." />
            ) : (
              payrollList.map((pay) => {
                const emp = getEmployee(pay.userId);
                const isActive = selected?.userId === pay.userId;
                return (
                  <button
                    key={pay._id}
                    onClick={() => { setSelected(pay); setEditing(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-neutral-50 transition-colors ${isActive ? 'bg-indigo-50 border-r-2 border-indigo-600' : ''}`}
                  >
                    <Avatar firstName={emp?.firstName || pay.employeeName?.split(' ')[0]} lastName={emp?.lastName || pay.employeeName?.split(' ')[1]} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${isActive ? 'text-indigo-800' : 'text-neutral-800'}`}>
                        {pay.employeeName || getFullName(emp)}
                      </p>
                      <p className="text-xs text-neutral-400 truncate">{pay.department}</p>
                    </div>
                    <span className="text-xs font-semibold text-neutral-500 flex-shrink-0">{formatCurrency(pay.netSalary)}</span>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Salary detail panel */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-neutral-200 shadow-sm">
          {!selected ? (
            <div className="h-full flex items-center justify-center">
              <EmptyState message="Select an employee to view their payroll." icon={DollarSign} />
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
                <div className="flex items-center gap-3">
                  <Avatar
                    firstName={getEmployee(selected.userId)?.firstName || selected.employeeName?.split(' ')[0]}
                    lastName={getEmployee(selected.userId)?.lastName || selected.employeeName?.split(' ')[1]}
                    src={getEmployee(selected.userId)?.profilePicture}
                    size="md"
                  />
                  <div>
                    <p className="text-sm font-semibold text-neutral-800">
                      {selected.employeeName || getFullName(getEmployee(selected.userId))}
                    </p>
                    <p className="text-xs text-neutral-400">{selected.jobTitle} · {selected.department}</p>
                  </div>
                </div>
                {!editing && (
                  <button
                    onClick={() => setEditing(true)}
                    className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" /> Edit Salary
                  </button>
                )}
                {editing && (
                  <button
                    onClick={() => setEditing(false)}
                    className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-neutral-600 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" /> Cancel Edit
                  </button>
                )}
              </div>

              <div className="p-5">
                {editing ? (
                  <SalaryEditor
                    record={selected}
                    onSave={handleSave}
                    onCancel={() => setEditing(false)}
                  />
                ) : (
                  <>
                    {/* View mode */}
                    <div className="space-y-4">
                      {/* Base salary */}
                      <div className="flex items-center justify-between py-3 border-b border-neutral-100">
                        <span className="text-sm font-medium text-neutral-600">Base Salary</span>
                        <span className="text-sm font-semibold text-neutral-900">{formatCurrency(selected.baseSalary, selected.currency)}</span>
                      </div>

                      {/* Allowances */}
                      <div>
                        <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide mb-2">Allowances</p>
                        {selected.allowances?.length > 0 ? (
                          <div className="space-y-1.5">
                            {selected.allowances.map((a, i) => (
                              <div key={i} className="flex justify-between items-center py-1.5">
                                <span className="text-sm text-neutral-600">{a.name}</span>
                                <span className="text-sm font-medium text-emerald-600">+{formatCurrency(a.amount, selected.currency)}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-neutral-400 italic">No allowances.</p>
                        )}
                        <div className="flex justify-between items-center pt-2 mt-1 border-t border-dashed border-neutral-200">
                          <span className="text-xs text-neutral-400">Total Allowances</span>
                          <span className="text-sm font-semibold text-emerald-600">
                            +{formatCurrency(selected.allowances?.reduce((s, a) => s + a.amount, 0) || 0, selected.currency)}
                          </span>
                        </div>
                      </div>

                      {/* Deductions */}
                      <div>
                        <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide mb-2">Deductions</p>
                        {selected.deductions?.length > 0 ? (
                          <div className="space-y-1.5">
                            {selected.deductions.map((d, i) => (
                              <div key={i} className="flex justify-between items-center py-1.5">
                                <span className="text-sm text-neutral-600">{d.name}</span>
                                <span className="text-sm font-medium text-red-500">-{formatCurrency(d.amount, selected.currency)}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-neutral-400 italic">No deductions.</p>
                        )}
                        <div className="flex justify-between items-center pt-2 mt-1 border-t border-dashed border-neutral-200">
                          <span className="text-xs text-neutral-400">Total Deductions</span>
                          <span className="text-sm font-semibold text-red-500">
                            -{formatCurrency(selected.deductions?.reduce((s, d) => s + d.amount, 0) || 0, selected.currency)}
                          </span>
                        </div>
                      </div>

                      {/* Net salary */}
                      <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-medium text-indigo-600">Net Salary</p>
                          <p className="text-xs text-indigo-400 mt-0.5">Effective {formatDate(selected.effectiveDate)}</p>
                        </div>
                        <span className="text-2xl font-bold text-indigo-700">{formatCurrency(selected.netSalary, selected.currency)}</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
