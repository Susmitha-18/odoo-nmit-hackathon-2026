import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import api from '../../api/axios';
import { FormInput } from '../../components/ui/FormInput';
import toast from 'react-hot-toast';

const ROLES = [
  { value: 'EMPLOYEE', label: 'Employee' },
  { value: 'ADMIN',    label: 'Admin / HR Officer' },
];

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    employeeId: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'EMPLOYEE',
    fullName: '',
    department: 'Engineering',
    designation: 'Software Engineer',
  });
  const [errors, setErrors]             = useState({});
  const [showPass, setShowPass]         = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const e = {};
    if (!formData.employeeId.trim())    e.employeeId = 'Employee ID is required';
    if (!formData.fullName.trim())      e.fullName = 'Full Name is required';
    if (!formData.email.trim())         e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = 'Enter a valid email';
    if (!formData.password)             e.password = 'Password is required';
    else if (formData.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword)
                                        e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await api.post('/auth/register', {
        employeeId: formData.employeeId,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        fullName: formData.fullName,
        department: formData.department,
        designation: formData.designation
      });
      toast.success('Account created successfully! You can now log in.');
      navigate('/login');
    } catch (err) {
      const msg = err?.response?.data?.message ?? 'Registration failed. Please check inputs.';
      setErrors({ general: msg });
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field) => (e) => {
    setFormData((p) => ({ ...p, [field]: e.target.value }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: '' }));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 bg-[#FAFBFC]">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl border border-gray-100 shadow-card">
        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-6">
          <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold">D</span>
          </div>
          <span className="font-semibold text-gray-900 text-lg">Dayflow</span>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-1">Create account</h1>
        <p className="text-sm text-gray-400 mb-6">Register to access the HR portal</p>

        {errors.general && (
          <div className="mb-4 p-3 bg-danger-50 border border-danger-100 rounded-lg text-danger-700 text-xs font-semibold">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <FormInput
            id="reg-employee-id"
            label="Employee ID"
            placeholder="e.g. EMP004"
            value={formData.employeeId}
            onChange={handleChange('employeeId')}
            error={errors.employeeId}
            required
          />

          <FormInput
            id="reg-fullname"
            label="Full Name"
            placeholder="e.g. Priya Sharma"
            value={formData.fullName}
            onChange={handleChange('fullName')}
            error={errors.fullName}
            required
          />

          <FormInput
            id="reg-email"
            label="Email address"
            type="email"
            placeholder="you@company.com"
            value={formData.email}
            onChange={handleChange('email')}
            error={errors.email}
            autoComplete="email"
            required
          />

          {/* Role selector */}
          <div className="flex flex-col">
            <label htmlFor="reg-role" className="form-label">Role</label>
            <select
              id="reg-role"
              value={formData.role}
              onChange={handleChange('role')}
              className="form-select"
            >
              {ROLES.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          {/* Password */}
          <div className="flex flex-col">
            <label htmlFor="reg-password" className="form-label">Password</label>
            <div className="relative">
              <input
                id="reg-password"
                type={showPass ? 'text' : 'password'}
                placeholder="Minimum 6 characters"
                value={formData.password}
                onChange={handleChange('password')}
                autoComplete="new-password"
                className={`form-input pr-10 ${errors.password ? 'border-danger-600 focus:ring-danger-600' : ''}`}
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
            {errors.password && <p className="form-error">{errors.password}</p>}
          </div>

          <FormInput
            id="reg-confirm-password"
            label="Confirm password"
            type="password"
            placeholder="Re-enter your password"
            value={formData.confirmPassword}
            onChange={handleChange('confirmPassword')}
            error={errors.confirmPassword}
            autoComplete="new-password"
          />

          <button
            id="register-submit-btn"
            type="submit"
            disabled={isSubmitting}
            className="btn-primary btn w-full btn-lg mt-2 font-bold shadow-md"
          >
            {isSubmitting ? (
              <><Loader2 size={18} className="animate-spin" /> Creating account…</>
            ) : (
              'Create account'
            )}
          </button>
        </form>

        <p className="text-sm text-center text-gray-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-600 font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
