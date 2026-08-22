import React from 'react';
import { Calendar, Phone, MapPin, Mail, ShieldAlert, Award, FileText, CheckCircle2, Clock } from 'lucide-react';
import StatusBadge from '../ui/StatusBadge';

const EmployeeDetails = ({ profile, payroll, attendanceList = [], leaveList = [] }) => {
  if (!profile) return null;

  // Calculate some summaries
  const presentCount = attendanceList.filter(a => a.status === 'PRESENT' || a.status === 'Present').length;
  const halfDayCount = attendanceList.filter(a => a.status === 'HALF_DAY' || a.status === 'Half-day').length;
  const leaveCount = attendanceList.filter(a => a.status === 'LEAVE' || a.status === 'Leave').length;

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col md:flex-row items-center md:items-start md:space-x-6 space-y-4 md:space-y-0">
        <img
          src={profile.profilePicture || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'}
          alt={profile.fullName}
          className="h-24 w-24 rounded-full object-cover border-4 border-indigo-55 shadow-md"
        />
        <div className="flex-1 text-center md:text-left space-y-2">
          <div className="space-y-0.5">
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">
              {profile.fullName}
            </h2>
            <p className="text-sm text-indigo-650 font-semibold uppercase tracking-wider">
              {profile.designation} — {profile.department}
            </p>
          </div>
          <div className="flex flex-wrap justify-center md:justify-start gap-4 text-xs font-medium text-slate-500 pt-1">
            <span className="inline-flex items-center space-x-1">
              <Mail size={14} className="text-slate-400" />
              <span>{profile.user?.email || 'N/A'}</span>
            </span>
            <span className="inline-flex items-center space-x-1">
              <Phone size={14} className="text-slate-400" />
              <span>{profile.phone || 'N/A'}</span>
            </span>
            <span className="inline-flex items-center space-x-1">
              <MapPin size={14} className="text-slate-400" />
              <span>{profile.address || 'N/A'}</span>
            </span>
          </div>
        </div>
        <div className="rounded-xl bg-slate-50 border border-slate-100 p-4.5 text-center min-w-[140px] shadow-inner">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Employee ID</p>
          <p className="text-lg font-black text-indigo-600 mt-0.5">{profile.employeeId}</p>
          <p className="text-[10px] font-medium text-slate-500 mt-1.5 flex items-center justify-center space-x-1">
            <Calendar size={11} />
            <span>Joined: {profile.joiningDate ? new Date(profile.joiningDate).toLocaleDateString() : 'N/A'}</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Col: Salary & Documents */}
        <div className="lg:col-span-2 space-y-6">
          {/* Salary Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800 tracking-wider uppercase border-b border-slate-100 pb-2">
              Salary Structure
            </h3>
            {payroll ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 text-center">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Basic Salary</p>
                  <p className="text-lg font-bold text-slate-700 mt-1">₹{payroll.basicSalary?.toLocaleString()}</p>
                </div>
                <div className="bg-emerald-50/40 rounded-xl p-4 border border-emerald-100 text-center">
                  <p className="text-[10px] font-semibold text-emerald-600 uppercase tracking-wider">Total Allowances</p>
                  <p className="text-lg font-bold text-emerald-700 mt-1">
                    ₹{(
                      (payroll.allowances?.hra || 0) +
                      (payroll.allowances?.conveyance || 0) +
                      (payroll.allowances?.special || 0)
                    ).toLocaleString()}
                  </p>
                </div>
                <div className="bg-rose-50/40 rounded-xl p-4 border border-rose-100 text-center">
                  <p className="text-[10px] font-semibold text-rose-600 uppercase tracking-wider">Total Deductions</p>
                  <p className="text-lg font-bold text-rose-700 mt-1">
                    ₹{(
                      (payroll.deductions?.tax || 0) +
                      (payroll.deductions?.pf || 0)
                    ).toLocaleString()}
                  </p>
                </div>
                <div className="md:col-span-3 bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-900 uppercase">Net Monthly Salary</span>
                  <span className="text-xl font-extrabold text-indigo-700">₹{payroll.netSalary?.toLocaleString()}</span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 font-medium italic">No payroll configuration found.</p>
            )}
          </div>

          {/* Documents Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800 tracking-wider uppercase border-b border-slate-100 pb-2">
              Uploaded Documents
            </h3>
            {profile.documents && profile.documents.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {profile.documents.map((doc, idx) => (
                  <div key={idx} className="flex items-center justify-between py-3">
                    <div className="flex items-center space-x-2.5">
                      <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
                        <FileText size={18} />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-700">{doc.name || 'document.pdf'}</p>
                        <p className="text-[10px] text-slate-400">Uploaded on {doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString() : 'N/A'}</p>
                      </div>
                    </div>
                    <a
                      href={doc.url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                    >
                      Download
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-slate-400">
                <FileText size={28} className="mx-auto text-slate-300 mb-2" />
                <p className="text-xs font-medium">No verified documents submitted yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Attendance & Leaves summary */}
        <div className="space-y-6">
          {/* Attendance Stats */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800 tracking-wider uppercase border-b border-slate-100 pb-2">
              Attendance Logs
            </h3>
            <div className="grid grid-cols-2 gap-3.5">
              <div className="rounded-xl border border-slate-100 p-3 bg-slate-50/50">
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Present</p>
                <p className="text-lg font-bold text-slate-750">{presentCount} days</p>
              </div>
              <div className="rounded-xl border border-slate-100 p-3 bg-slate-50/50">
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Half-day</p>
                <p className="text-lg font-bold text-slate-750">{halfDayCount} days</p>
              </div>
              <div className="rounded-xl border border-slate-100 p-3 bg-slate-50/50 col-span-2 flex items-center justify-between">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">On Approved Leave</span>
                <span className="text-xs font-bold text-slate-700">{leaveCount} days</span>
              </div>
            </div>
          </div>

          {/* Leave History Summary */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800 tracking-wider uppercase border-b border-slate-100 pb-2">
              Leave Requests History
            </h3>
            {leaveList && leaveList.length > 0 ? (
              <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1">
                {leaveList.map((leave, idx) => (
                  <div key={idx} className="rounded-xl border border-slate-100 p-3 space-y-2 bg-slate-50/30 hover:bg-slate-50/60 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700">{leave.leaveType} Leave</span>
                      <StatusBadge status={leave.status} />
                    </div>
                    <div className="text-[10px] text-slate-450 space-y-0.5">
                      <p>
                        {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()} ({leave.totalDays} days)
                      </p>
                      <p className="italic text-slate-500 font-medium truncate">
                        "{leave.remarks || leave.reason || 'No remarks provided'}"
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 font-medium italic">No leave applications lodged.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetails;
