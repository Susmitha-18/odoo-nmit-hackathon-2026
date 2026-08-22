import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ShieldCheck, User, Lock, Mail } from 'lucide-react';
import { FormInput } from '../../components/ui/FormInput';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: 'emp01@dayflow.com', password: 'Emp@12345' });
  const [selectedRole, setSelectedRole] = useState('employee');
  const [showPass, setShowPass] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const loggedInUser = await login(formData.email, formData.password);
      toast.success(`Logged in as ${loggedInUser.fullName || loggedInUser.email}`);
      
      if (loggedInUser.role === 'ADMIN') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/employee/dashboard', { replace: true });
      }
    } catch (error) {
      console.error('Login submit error:', error);
      toast.error(error.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    if (role === 'admin') {
      setFormData({ email: 'admin@dayflow.com', password: 'Admin@123' });
    } else {
      setFormData({ email: 'emp01@dayflow.com', password: 'Emp@12345' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-950 via-primary-800 to-primary-600 items-center justify-center p-12">
        <div className="text-white max-w-md">
          <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-8 backdrop-blur-md shadow-inner border border-white/10">
            <span className="text-white font-bold text-2xl">D</span>
          </div>
          <h2 className="text-3xl font-extrabold mb-4 tracking-tight">Dayflow HRMS</h2>
          <p className="text-primary-100 text-lg leading-relaxed font-medium">
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
      <div className="flex-1 flex items-center justify-center p-6 bg-[#FAFBFC]">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl border border-gray-100 shadow-card">
          {/* Mobile logo */}
          <div className="flex items-center gap-2.5 mb-8 lg:hidden">
            <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">D</span>
            </div>
            <span className="font-semibold text-gray-900 text-lg">Dayflow HRMS</span>
          </div>

          <h1 className="text-2xl font-extrabold text-gray-900 mb-1 tracking-tight">Sign in to Dayflow</h1>
          <p className="text-sm text-gray-400 mb-6">Select your portal access level</p>

          {/* Role Switcher Pills */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => handleRoleSelect('employee')}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-bold transition-all duration-150 ${
                selectedRole === 'employee'
                  ? 'bg-white text-primary-700 shadow-sm border border-gray-200/50'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <User size={14} />
              Employee Portal
            </button>
            <button
              type="button"
              onClick={() => handleRoleSelect('admin')}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-bold transition-all duration-150 ${
                selectedRole === 'admin'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <ShieldCheck size={14} />
              HR / Admin Portal
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput
              id="login-email"
              label="Company Email"
              type="email"
              placeholder="you@company.com"
              value={formData.email}
              onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))}
              autoComplete="email"
              required
            />

            <div className="flex flex-col">
              <label htmlFor="login-password" className="form-label">Password</label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPass ? 'text' : 'password'}
                  placeholder="Enter secure password"
                  value={formData.password}
                  onChange={(e) => setFormData(p => ({ ...p, password: e.target.value }))}
                  autoComplete="current-password"
                  required
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
              disabled={isSubmitting}
              className={`btn w-full btn-lg mt-2 font-bold text-white transition-all duration-150 shadow-md ${
                selectedRole === 'admin' ? 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500' : 'bg-primary-600 hover:bg-primary-700 focus:ring-primary-500'
              }`}
            >
              {isSubmitting ? 'Signing in...' : `Sign in to ${selectedRole === 'admin' ? 'HR Portal' : 'Employee Portal'}`}
            </button>
          </form>

          {/* Quick Info presets */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center mb-2">
              Seeded Quick Access Demo Accounts
            </p>
            <div className="space-y-1 text-[11px] text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-100">
              <p>👤 <strong>Employee:</strong> emp01@dayflow.com / Emp@12345</p>
              <p>🔑 <strong>HR Admin:</strong> admin@dayflow.com / Admin@123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
