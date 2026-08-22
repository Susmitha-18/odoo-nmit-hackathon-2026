import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { getMyProfileAPI, updateMyProfileAPI } from '../../api/employee.api';
import { getMyPayrollAPI } from '../../api/payroll.api';
import { getMyLeavesAPI } from '../../api/leave.api';
import { getMyAttendanceAPI } from '../../api/attendance.api';
import { Edit2, Save, X, Phone, MapPin, Image } from 'lucide-react';
import EmployeeDetails from '../../components/employee/EmployeeDetails';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';

const EmployeeProfile = () => {
  const { user, updateCachedUser } = useAuth();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [profile, setProfile] = useState(null);
  const [payroll, setPayroll] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [leaves, setLeaves] = useState([]);

  // Editing state
  const [isEditing, setIsEditing] = useState(false);
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [saveLoading, setSaveLoading] = useState(false);

  const fetchProfileData = async () => {
    try {
      setError('');
      const [profRes, payRes, attRes, leaveRes] = await Promise.all([
        getMyProfileAPI(),
        getMyPayrollAPI().catch(() => ({ success: false })),
        getMyAttendanceAPI().catch(() => ({ success: false })),
        getMyLeavesAPI().catch(() => ({ success: false })),
      ]);

      if (profRes.success && profRes.profile) {
        setProfile(profRes.profile);
        // Pre-fill editable fields
        setPhone(profRes.profile.phone || '');
        setAddress(profRes.profile.address || '');
        setAvatarUrl(profRes.profile.profilePicture || '');
      }

      if (payRes.success && payRes.payroll) {
        setPayroll(payRes.payroll);
      }

      if (attRes.success && attRes.attendance) {
        setAttendance(attRes.attendance);
      }

      if (leaveRes.success && leaveRes.leaves) {
        setLeaves(leaveRes.leaves);
      }
    } catch (err) {
      console.error(err);
      setError('Unable to load employee profile details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaveLoading(true);

    try {
      const res = await updateMyProfileAPI(profile._id, { phone, address, profilePicture: avatarUrl });
      if (res.success && res.employee) {
        showToast('Profile updated successfully!', 'success');
        setProfile(res.employee);
        updateCachedUser(res.employee);
        setIsEditing(false);
      } else {
        showToast(res.message || 'Failed to update profile.', 'error');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Server error during update.', 'error');
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) return <LoadingState message="Loading your profile..." />;
  if (error) return <ErrorState message={error} onRetry={fetchProfileData} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">
            My Employee Profile
          </h1>
          <p className="text-xs font-medium text-slate-500">
            View employment contract, salaries, documents, and manage contact info.
          </p>
        </div>

        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center space-x-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 text-xs font-semibold shadow-sm transition-colors"
          >
            <Edit2 size={14} />
            <span>Edit Profile</span>
          </button>
        ) : (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                // Reset form values
                setPhone(profile?.phone || '');
                setAddress(profile?.address || '');
                setAvatarUrl(profile?.profilePicture || '');
                setIsEditing(false);
              }}
              className="inline-flex items-center space-x-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-650 px-4 py-2.5 text-xs font-semibold transition-colors"
            >
              <X size={14} />
              <span>Cancel</span>
            </button>
            <button
              onClick={handleSave}
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

      {/* Editing Form Overlay */}
      {isEditing && (
        <form onSubmit={handleSave} className="rounded-2xl border border-indigo-150 bg-indigo-50/20 p-5 shadow-inner space-y-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-3 pb-1 border-b border-indigo-100 flex items-center space-x-2">
            <span className="h-2 w-2 rounded-full bg-indigo-600"></span>
            <span className="text-xs font-bold text-indigo-905 uppercase tracking-wide">Self Service Form</span>
          </div>

          {/* Phone */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-550 uppercase">Phone Number</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400"><Phone size={14} /></span>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-550 transition-colors"
              />
            </div>
          </div>

          {/* Avatar Url */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-550 uppercase">Profile Image URL</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400"><Image size={14} /></span>
              <input
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-550 transition-colors"
              />
            </div>
          </div>

          {/* Address */}
          <div className="space-y-1 md:col-span-3">
            <label className="text-[10px] font-bold text-slate-550 uppercase">Residential Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400"><MapPin size={14} /></span>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-550 transition-colors"
              />
            </div>
          </div>
        </form>
      )}

      {/* Profile Details rendering */}
      <EmployeeDetails
        profile={profile}
        payroll={payroll}
        attendanceList={attendance}
        leaveList={leaves}
      />
    </div>
  );
};

export default EmployeeProfile;
