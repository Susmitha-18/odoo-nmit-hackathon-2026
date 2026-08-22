import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { ArrowLeft, Save, X, User, Briefcase, FileText, CalendarCheck, History } from 'lucide-react';
import AdminLayout from '../../components/layout/AdminLayout';
import PageHeader from '../../components/ui/PageHeader';
import StatusBadge from '../../components/ui/StatusBadge';
import Avatar from '../../components/ui/Avatar';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';
import DataTable from '../../components/ui/DataTable';
import { employeeApi } from '../../api/employee.api';
import { formatDate, formatTime } from '../../utils/dateUtils';
import { formatCurrency, getFullName, formatJobType, formatLeaveType, getErrorMessage } from '../../utils/formatUtils';

const DEPARTMENTS = ['Engineering', 'Product', 'Design', 'HR', 'Finance', 'Sales', 'Marketing', 'Operations'];
const JOB_TYPES = ['full-time', 'part-time', 'contract'];
const EMP_STATUSES = ['active', 'inactive', 'terminated'];

function SectionCard({ title, icon: Icon, children }) {
  return (
    <div className="bg-white rounded-xl border border-neutral-200 shadow-sm">
      <div className="flex items-center gap-2 px-5 py-4 border-b border-neutral-100">
        <Icon className="w-4 h-4 text-indigo-500" />
        <h3 className="text-sm font-semibold text-neutral-800">{title}</h3>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center py-2.5 border-b border-neutral-50 last:border-0">
      <span className="text-xs font-medium text-neutral-400 sm:w-40 flex-shrink-0 mb-0.5 sm:mb-0">{label}</span>
      <span className="text-sm text-neutral-800">{value || '—'}</span>
    </div>
  );
}

function EditField({ label, name, type = 'text', value, onChange, options, required, readOnly }) {
  const inputClass = `w-full text-sm border border-neutral-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-colors ${readOnly ? 'bg-neutral-50 text-neutral-500 cursor-not-allowed' : 'bg-white'}`;
  return (
    <div>
      <label className="block text-xs font-medium text-neutral-600 mb-1.5">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {options ? (
        <select name={name} value={value || ''} onChange={onChange} disabled={readOnly} className={inputClass}>
          {options.map((opt) => (
            <option key={opt.value || opt} value={opt.value || opt}>{opt.label || opt}</option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          value={value || ''}
          onChange={onChange}
          readOnly={readOnly}
          className={inputClass}
        />
      )}
    </div>
  );
}

export default function EmployeeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const isEditMode = searchParams.get('edit') === 'true';

  const [employee, setEmployee] = useState(null);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await employeeApi.getById(id);
      setEmployee(data);
      setForm({
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        address: data.address,
        department: data.department,
        designation: data.designation,
        joiningDate: data.joiningDate ? data.joiningDate.split('T')[0] : '',
      });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await employeeApi.update(id, {
        firstName: form.firstName,
        lastName: form.lastName,
        department: form.department,
        designation: form.designation,
        phone: form.phone,
        address: form.address,
        joiningDate: form.joiningDate,
      });
      setEmployee((prev) => ({ ...prev, ...updated }));
      toast.success('Employee details updated successfully.');
      setSearchParams({});
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setForm({
      firstName: employee.firstName, lastName: employee.lastName,
      phone: employee.phone, address: employee.address,
      department: employee.department, designation: employee.designation,
      joiningDate: employee.joiningDate ? employee.joiningDate.split('T')[0] : '',
    });
    setSearchParams({});
  };

  if (loading) return <AdminLayout><LoadingState message="Loading employee profile..." /></AdminLayout>;
  if (error) return <AdminLayout><ErrorState message={error} onRetry={load} /></AdminLayout>;
  if (!employee) return <AdminLayout><ErrorState message="Employee not found." /></AdminLayout>;

  const attendanceCols = [
    { key: 'date', label: 'Date', render: (r) => formatDate(r.date) },
    { key: 'checkIn', label: 'Check In', render: (r) => formatTime(r.checkIn) },
    { key: 'checkOut', label: 'Check Out', render: (r) => formatTime(r.checkOut) },
    { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
  ];

  const leaveCols = [
    { key: 'leaveType', label: 'Type', render: (r) => formatLeaveType(r.leaveType) },
    { key: 'startDate', label: 'Start', render: (r) => formatDate(r.startDate) },
    { key: 'endDate', label: 'End', render: (r) => formatDate(r.endDate) },
    { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
    { key: 'remarks', label: 'Remarks', render: (r) => <span className="text-xs text-neutral-500">{r.remarks || '—'}</span> },
  ];

  return (
    <AdminLayout>
      {/* Page header */}
      <PageHeader
        breadcrumb={[{ label: 'Admin' }, { label: 'Employees', href: '/admin/employees' }, { label: getFullName(employee) }]}
        title={getFullName(employee)}
        subtitle={`${employee.jobTitle} · ${employee.department}`}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/admin/employees')}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-neutral-600 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            {isEditMode ? (
              <>
                <button
                  onClick={handleCancel}
                  disabled={saving}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-neutral-600 border border-neutral-200 rounded-lg hover:bg-neutral-50 disabled:opacity-50 transition-colors"
                >
                  <X className="w-4 h-4" /> Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg disabled:opacity-60 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </>
            ) : (
              <button
                onClick={() => setSearchParams({ edit: 'true' })}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
              >
                Edit Employee
              </button>
            )}
          </div>
        }
      />

      {/* Profile header card */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-5 mb-4 flex items-center gap-4">
        <Avatar firstName={employee.firstName} lastName={employee.lastName} src={employee.profilePicture} size="xl" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-lg font-bold text-neutral-900">{getFullName(employee)}</h2>
            <StatusBadge status={employee.employmentStatus} />
          </div>
          <p className="text-sm text-neutral-500 mt-0.5">{employee.designation} · {employee.department}</p>
          <div className="flex items-center gap-4 mt-2">
            <span className="font-mono text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">{employee.employeeId}</span>
            <span className="text-xs text-neutral-400">{employee.user?.email}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Personal details */}
        <SectionCard title="Personal Details" icon={User}>
          {isEditMode ? (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <EditField label="First Name" name="firstName" value={form.firstName} onChange={handleChange} required />
                <EditField label="Last Name" name="lastName" value={form.lastName} onChange={handleChange} required />
              </div>
              <EditField label="Phone" name="phone" value={form.phone} onChange={handleChange} />
              <EditField label="Address" name="address" value={form.address} onChange={handleChange} />
              <EditField label="Join Date" name="joiningDate" type="date" value={form.joiningDate} onChange={handleChange} />
            </div>
          ) : (
            <>
              <InfoRow label="Full Name" value={getFullName(employee)} />
              <InfoRow label="Phone" value={employee.phone} />
              <InfoRow label="Address" value={employee.address} />
              <InfoRow label="Join Date" value={formatDate(employee.joiningDate)} />
              <InfoRow label="Email" value={employee.user?.email} />
            </>
          )}
        </SectionCard>

        {/* Job details */}
        <SectionCard title="Job Details" icon={Briefcase}>
          {isEditMode ? (
            <div className="space-y-3">
              <EditField label="Designation" name="designation" value={form.designation} onChange={handleChange} />
              <EditField
                label="Department" name="department" value={form.department} onChange={handleChange}
                options={[{ value: '', label: 'Select department' }, ...DEPARTMENTS.map((d) => ({ value: d, label: d }))]}
              />
              <EditField label="Join Date" name="joiningDate" type="date" value={form.joiningDate} onChange={handleChange} />
            </div>
          ) : (
            <>
              <InfoRow label="Designation" value={employee.designation} />
              <InfoRow label="Department" value={employee.department} />
              <InfoRow label="Join Date" value={formatDate(employee.joiningDate)} />
              <InfoRow label="Employee ID" value={employee.employeeId} />
            </>
          )}
        </SectionCard>

        {/* Salary summary */}
        {employee.payroll && (
          <SectionCard title="Salary Overview" icon={FileText}>
            <InfoRow label="Base Salary" value={formatCurrency(employee.payroll.baseSalary, employee.payroll.currency)} />
            <InfoRow
              label="Allowances"
              value={formatCurrency(employee.payroll.allowances?.reduce((s, a) => s + a.amount, 0), employee.payroll.currency)}
            />
            <InfoRow
              label="Deductions"
              value={formatCurrency(employee.payroll.deductions?.reduce((s, d) => s + d.amount, 0), employee.payroll.currency)}
            />
            <div className="mt-3 pt-3 border-t border-neutral-100">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-neutral-700">Net Salary</span>
                <span className="text-base font-bold text-indigo-700">{formatCurrency(employee.payroll.netSalary, employee.payroll.currency)}</span>
              </div>
            </div>
          </SectionCard>
        )}

        {/* Documents */}
        <SectionCard title="Documents" icon={FileText}>
          {employee.documents?.length > 0 ? (
            <div className="space-y-2">
              {employee.documents.map((doc, i) => (
                <div key={i} className="flex items-center justify-between p-3 border border-neutral-100 rounded-lg hover:bg-neutral-50 transition-colors">
                  <span className="text-sm text-neutral-700">{doc.name}</span>
                  <a href={doc.url} target="_blank" rel="noreferrer" className="text-xs text-indigo-600 hover:underline font-medium">View</a>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-neutral-400 text-center py-6">No documents uploaded.</p>
          )}
        </SectionCard>
      </div>

      {/* Attendance summary */}
      {employee.attendanceSummary?.length > 0 && (
        <div className="mt-4">
          <SectionCard title="Recent Attendance" icon={CalendarCheck}>
            <DataTable
              columns={attendanceCols}
              data={employee.attendanceSummary}
              emptyMessage="No attendance records found."
            />
          </SectionCard>
        </div>
      )}

      {/* Leave history */}
      {employee.leaveHistory?.length > 0 && (
        <div className="mt-4">
          <SectionCard title="Leave History" icon={History}>
            <DataTable
              columns={leaveCols}
              data={employee.leaveHistory}
              emptyMessage="No leave requests found."
            />
          </SectionCard>
        </div>
      )}
    </AdminLayout>
  );
}
