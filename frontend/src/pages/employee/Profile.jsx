import React, { useState, useEffect } from 'react';
import { Pencil, X, Check, Loader2, User, Briefcase, Wallet } from 'lucide-react';
import { mockService } from '../../mock/mockService';
import { FormInput } from '../../components/ui/FormInput';
import { LoadingState } from '../../components/ui/States';
import { formatDate, formatCurrency } from '../../utils/dateUtils';
import toast from 'react-hot-toast';

function InfoRow({ label, value }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center py-3 border-b border-gray-50 last:border-b-0">
      <dt className="w-40 text-xs font-medium text-gray-400 uppercase tracking-wide shrink-0">{label}</dt>
      <dd className="text-sm font-medium text-gray-800 mt-0.5 sm:mt-0">{value || '—'}</dd>
    </div>
  );
}

export default function Profile() {
  const [employee, setEmployee]     = useState(null);
  const [payroll, setPayroll]       = useState(null);
  const [isLoading, setIsLoading]   = useState(true);
  const [isEditing, setIsEditing]   = useState(false);
  const [editForm, setEditForm]     = useState({ phone: '', address: '' });
  const [editErrors, setEditErrors] = useState({});
  const [isSaving, setIsSaving]     = useState(false);

  useEffect(() => {
    Promise.all([
      mockService.getMyProfile(),
      mockService.getMyPayroll(),
    ]).then(([emp, pay]) => {
      setEmployee(emp.data);
      setPayroll(pay.data);
    }).finally(() => setIsLoading(false));
  }, []);

  const startEdit = () => {
    setEditForm({ phone: employee?.phone ?? '', address: employee?.address ?? '' });
    setEditErrors({});
    setIsEditing(true);
  };

  const cancelEdit = () => { setIsEditing(false); setEditErrors({}); };

  const validateEdit = () => {
    const e = {};
    if (!editForm.phone.trim())   e.phone   = 'Phone number is required';
    if (!editForm.address.trim()) e.address = 'Address is required';
    setEditErrors(e);
    return Object.keys(e).length === 0;
  };

  const saveEdit = async () => {
    if (!validateEdit()) return;
    setIsSaving(true);
    const res = await mockService.updateMyProfile(editForm);
    setEmployee((p) => ({ ...p, ...res.data }));
    setIsEditing(false);
    setIsSaving(false);
    toast.success('Profile updated successfully!');
  };

  if (isLoading) return <LoadingState message="Loading your profile…" />;

  const fullName = employee ? `${employee.firstName} ${employee.lastName}` : '—';

  return (
    <div className="max-w-3xl space-y-6">
      {/* Header card */}
      <div className="card flex items-center gap-5">
        <div className="w-16 h-16 rounded-2xl bg-primary-100 flex items-center justify-center text-primary-700 text-2xl font-bold shrink-0">
          {employee?.firstName?.[0]?.toUpperCase() ?? 'P'}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-bold text-gray-900">{fullName}</h2>
          <p className="text-sm text-gray-500">{employee?.designation} · {employee?.department}</p>
          <p className="text-xs text-gray-400 mt-1">{employee?.employeeId}</p>
        </div>
        {!isEditing ? (
          <button id="profile-edit-btn" onClick={startEdit} className="btn-secondary btn btn-sm shrink-0">
            <Pencil size={14} /> Edit Profile
          </button>
        ) : (
          <div className="flex gap-2 shrink-0">
            <button id="profile-cancel-btn" onClick={cancelEdit} disabled={isSaving} className="btn-ghost btn btn-sm">
              <X size={14} /> Cancel
            </button>
            <button id="profile-save-btn" onClick={saveEdit} disabled={isSaving} className="btn-primary btn btn-sm">
              {isSaving
                ? <><Loader2 size={14} className="animate-spin" /> Saving…</>
                : <><Check size={14} /> Save</>}
            </button>
          </div>
        )}
      </div>

      {/* Personal Details */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <User size={17} className="text-gray-400" />
          <h3 className="section-title">Personal Details</h3>
        </div>
        {isEditing ? (
          <div className="space-y-4">
            <InfoRow label="Full Name" value={fullName} />
            <InfoRow label="Email"     value={employee?.email} />
            <div className="divider" />
            <FormInput
              id="edit-phone" label="Phone Number"
              placeholder="+91 98765 43210"
              value={editForm.phone}
              onChange={(e) => setEditForm((p) => ({ ...p, phone: e.target.value }))}
              error={editErrors.phone}
            />
            <div className="flex flex-col">
              <label htmlFor="edit-address" className="form-label">Address</label>
              <textarea
                id="edit-address" rows={3}
                placeholder="Your full address"
                value={editForm.address}
                onChange={(e) => setEditForm((p) => ({ ...p, address: e.target.value }))}
                className={`form-textarea ${editErrors.address ? 'border-danger-600' : ''}`}
              />
              {editErrors.address && <p className="form-error">{editErrors.address}</p>}
            </div>
            <p className="text-xs text-gray-400">
              ⓘ Only phone and address can be edited. Contact HR to update other details.
            </p>
          </div>
        ) : (
          <dl>
            <InfoRow label="Full Name"     value={fullName} />
            <InfoRow label="Email"         value={employee?.email} />
            <InfoRow label="Phone"         value={employee?.phone} />
            <InfoRow label="Address"       value={employee?.address} />
            <InfoRow label="Date of Birth" value={formatDate(employee?.dateOfBirth)} />
            <InfoRow label="Gender"        value={employee?.gender} />
          </dl>
        )}
      </div>

      {/* Job Details */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <Briefcase size={17} className="text-gray-400" />
          <h3 className="section-title">Job Details</h3>
        </div>
        <dl>
          <InfoRow label="Employee ID"     value={employee?.employeeId} />
          <InfoRow label="Department"      value={employee?.department} />
          <InfoRow label="Designation"     value={employee?.designation} />
          <InfoRow label="Employment Type" value={employee?.employmentType} />
          <InfoRow label="Joining Date"    value={formatDate(employee?.joiningDate)} />
          <InfoRow label="Reporting To"    value={employee?.reportingManager} />
        </dl>
        <p className="text-xs text-gray-400 mt-3">Job details are managed by HR.</p>
      </div>

      {/* Salary Summary */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <Wallet size={17} className="text-gray-400" />
          <h3 className="section-title">Salary Summary</h3>
          <span className="ml-auto text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Read only</span>
        </div>
        {payroll ? (
          <dl>
            <InfoRow label="Basic Salary" value={formatCurrency(payroll.basicSalary)} />
            <InfoRow label="Allowances"   value={formatCurrency(payroll.allowances)} />
            <InfoRow label="Deductions"   value={formatCurrency(payroll.deductions)} />
            <InfoRow label="Net Salary"   value={<span className="text-success-700 font-semibold">{formatCurrency(payroll.netSalary)}</span>} />
            <InfoRow label="Effective"    value={formatDate(payroll.effectiveFrom)} />
          </dl>
        ) : (
          <p className="text-sm text-gray-400 py-4 text-center">Salary information not available.</p>
        )}
      </div>
    </div>
  );
}
