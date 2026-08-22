import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { getEmployeeByIdAPI, updateEmployeeByAdminAPI } from '../../api/employee.api';
import { getAllPayrollsAPI } from '../../api/payroll.api';
import { getAllAttendanceAPI } from '../../api/attendance.api';
import { getAllLeavesAPI } from '../../api/leave.api';
import { useToast } from '../../context/ToastContext';
import { Edit2, Save, X, ChevronLeft, Calendar, Shield, CreditCard } from 'lucide-react';
import EmployeeDetails from '../../components/employee/EmployeeDetails';
import SalaryEditor from '../../components/employee/SalaryEditor';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';

const EmployeeDetail = () => {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Data states
  const [profile, setProfile] = useState(null);
  const [payroll, setPayroll] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [leaves, setLeaves] = useState([]);

  // Editing state
  const [isEditing, setIsEditing] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  // Edit fields
  const [fullName, setFullName] = useState('');
  const [department, setDepartment] = useState('');
  const [designation, setDesignation] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [joiningDate, setJoiningDate] = useState('');

  const fetchEmployeeData = async () => {
    try {
      setError('');
      const profRes = await getEmployeeByIdAPI(id);

      if (profRes.success && profRes.employee) {
        const emp = profRes.employee;
        setProfile(emp);

        // Pre-fill edits
        setFullName(emp.fullName || '');
        setDepartment(emp.department || '');
        setDesignation(emp.designation || '');
        setPhone(emp.phone || '');
        setAddress(emp.address || '');
        setAvatarUrl(emp.profilePicture || '');
        setJoiningDate(emp.joiningDate ? emp.joiningDate.split('T')[0] : '');

        // Now run secondary fetches using employee ID
        const [payrollsRes, attRes, leavesRes] = await Promise.all([
          getAllPayrollsAPI().catch(() => ({ success: false })),
          getAllAttendanceAPI({ employeeId: emp.employeeId }).catch(() => ({ success: false })),
          getAllLeavesAPI().catch(() => ({ success: false })),
        ]);

        if (payrollsRes.success && payrollsRes.payrolls) {
          const matched = payrollsRes.payrolls.find((p) => p.employeeId === emp.employeeId);
          setPayroll(matched || null);
        }

        if (attRes.success && attRes.attendance) {
          setAttendance(attRes.attendance);
        }

        if (leavesRes.success && leavesRes.leaves) {
          const matchedLeaves = leavesRes.leaves.filter((l) => l.employeeId === emp.employeeId);
          setLeaves(matchedLeaves);
        }
      } else {
        setError('Employee not found.');
      }
    } catch (err) {
      console.error(err);
      setError('Unable to load employee information.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployeeData();
  }, [id]);

  // Sync editing mode from query params
  useEffect(() => {
    if (searchParams.get('edit') === 'true') {
      setIsEditing(true);
    } else {
      setIsEditing(false);
    }
  }, [searchParams]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaveLoading(true);

    const payload = {
      fullName,
      department,
      designation,
      phone,
      address,
      profilePicture: avatarUrl,
      joiningDate,
    };

    try {
      const res = await updateEmployeeByAdminAPI(id, payload);
      if (res.success && res.employee) {
        showToast('Employee profile updated successfully!', 'success');
        setProfile(res.employee);
        setSearchParams({}); // removes the edit flag
      } else {
        showToast(res.message || 'Failed to update employee.', 'error');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Server error during update.', 'error');
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) return <LoadingState message="Loading profile details..." />;
  if (error) return <ErrorState message={error} onRetry={fetchEmployeeData} />;

  return (
    <div className="space-y-6">
      {/* Back & Actions header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <button
          onClick={() => navigate('/admin/employees')}
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ChevronLeft size={16} />
          <span>Back to Employees</span>
        </button>

        {!isEditing ? (
          <button
            onClick={() => setSearchParams({ edit: 'true' })}
            className="inline-flex items-center space-x-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 text-xs font-semibold shadow-sm transition-colors"
          >
            <Edit2 size={14} />
            <span>Edit Employee Profile</span>
          </button>
        ) : (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setSearchParams({})}
              className="inline-flex items-center space-x-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-650 px-4 py-2.5 text-xs font-semibold transition-colors"
            >
              <X size={14} />
              <span>Cancel</span>
            </button>
            <button
              onClick={handleUpdate}
              disabled={saveLoading}
              className="inline-flex items-center space-x-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white px-4 py-2.5 text-xs font-semibold shadow-sm transition-colors"
            >
              {saveLoading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white"></div>
              ) : (
                <Save size={14} />
              )}
              <span>Save Changes</span>
            </button>
          </div>
        )}
      </div>

      {/* Editing Layout */}
      {isEditing && (
        <form onSubmit={handleUpdate} className="rounded-2xl border border-indigo-150 bg-indigo-50/10 p-6 shadow-inner space-y-4">
          <div className="pb-2.5 border-b border-indigo-100 flex items-center space-x-2">
            <Shield size={16} className="text-indigo-600" />
            <span className="text-xs font-bold text-indigo-905 uppercase tracking-wide">
              Administrator Master Edit Panel
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* Full Name */}
            <div className="space-y-1 md:col-span-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
                required
              />
            </div>

            {/* Joining Date */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Joining Date</label>
              <div className="relative">
                <input
                  type="date"
                  value={joiningDate}
                  onChange={(e) => setJoiningDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors cursor-pointer"
                />
              </div>
            </div>

            {/* Department */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Department</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
                required
              />
            </div>

            {/* Designation */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Designation / Job Title</label>
              <input
                type="text"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
                required
              />
            </div>

            {/* Phone */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
              />
            </div>

            {/* Avatar URL */}
            <div className="space-y-1 md:col-span-3">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Avatar Picture URL</label>
              <input
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
              />
            </div>

            {/* Address */}
            <div className="space-y-1 md:col-span-3">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Residential Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
              />
            </div>
          </div>
        </form>
      )}

      {/* Main Details View */}
      <EmployeeDetails
        profile={profile}
        payroll={payroll}
        attendanceList={attendance}
        leaveList={leaves}
      />

      {/* Salary Editor Section (Only Visible to Admin) */}
      <div className="mt-8">
        <SalaryEditor
          employeeId={profile.employeeId}
          initialPayroll={payroll}
          onUpdateSuccess={(newPayroll) => setPayroll(newPayroll)}
        />
      </div>
    </div>
  );
};

export default EmployeeDetail;
