import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ShieldCheck, User } from 'lucide-react';
import { FormInput } from '../../components/ui/FormInput';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: 'priya.sharma@dayflow.io', password: 'password123' });
  const [selectedRole, setSelectedRole] = useState('employee');
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedRole === 'admin') {
      navigate('/admin/dashboard', { replace: true });
    } else {
      navigate('/employee/dashboard', { replace: true });
    }
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    if (role === 'admin') {
      setFormData({ email: 'hr.admin@dayflow.io', password: 'password123' });
    } else {
      setFormData({ email: 'priya.sharma@dayflow.io', password: 'password123' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-900 via-primary-700 to-primary-600 items-center justify-center p-12">
        <div className="text-white max-w-md">
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-8 backdrop-blur-sm shadow-inner">
            <span className="text-white font-bold text-2xl">D</span>
          </div>
          <h2 className="text-3xl font-bold mb-4">Dayflow HRMS</h2>
          <p className="text-primary-100 text-lg leading-relaxed">
            "Every workday, perfectly aligned."
          </p>
          <div className="mt-8 space-y-3 text-sm text-primary-200">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Employee Portal: Attendance, leave requests, payroll visibility</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>HR Management: Leave approvals, workforce directory, compensation</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2.5 mb-8 lg:hidden">
            <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">D</span>
            </div>
            <span className="font-semibold text-gray-900 text-lg">Dayflow HRMS</span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome to Dayflow</h1>
          <p className="text-sm text-gray-500 mb-6">Select your portal role to continue</p>

          {/* Role Switcher Pills */}
          <div className="grid grid-cols-2 gap-2.5 p-1 bg-gray-100 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => handleRoleSelect('employee')}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-semibold transition-all ${
                selectedRole === 'employee'
                  ? 'bg-white text-primary-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <User size={15} />
              Employee Portal
            </button>
            <button
              type="button"
              onClick={() => handleRoleSelect('admin')}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-semibold transition-all ${
                selectedRole === 'admin'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <ShieldCheck size={15} />
              HR / Admin Portal
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput
              id="login-email"
              label="Email address"
              type="email"
              placeholder="you@company.com"
              value={formData.email}
              onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))}
              autoComplete="email"
            />

            <div className="flex flex-col">
              <label htmlFor="login-password" className="form-label">Password</label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPass ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData(p => ({ ...p, password: e.target.value }))}
                  autoComplete="current-password"
                  className="form-input pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              id="login-submit-btn"
              type="submit"
              className={`btn w-full btn-lg mt-2 font-semibold text-white ${
                selectedRole === 'admin' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-primary-600 hover:bg-primary-700'
              }`}
            >
              Sign in to {selectedRole === 'admin' ? 'HR / Admin Portal' : 'Employee Portal'}
            </button>
          </form>

          {/* Quick direct links for hassle-free testing */}
          <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col gap-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide text-center mb-1">
              Direct Quick Access (No Auth Needed)
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => navigate('/employee/dashboard')}
                className="flex-1 py-2 px-3 bg-primary-50 text-primary-700 hover:bg-primary-100 rounded-lg text-xs font-medium transition-colors"
              >
                👉 Go to Employee Portal
              </button>
              <button
                type="button"
                onClick={() => navigate('/admin/dashboard')}
                className="flex-1 py-2 px-3 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg text-xs font-medium transition-colors"
              >
                👉 Go to HR Admin Portal
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
