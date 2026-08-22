import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Edit3, User, Briefcase, DollarSign, Calendar, CheckCircle } from 'lucide-react';
import { mockService } from '../../mock/mockService';
import { LoadingState } from '../../components/ui/States';
import { FormInput, FormSelect } from '../../components/ui/FormInput';
import toast from 'react-hot-toast';

export default function EmployeeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [salary, setSalary] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Form State for Admin editing
  const [formData, setFormData] = useState({});

  useEffect(() => {
    Promise.all([
      mockService.getEmployeeById(id),
      mockService.getEmployeePayroll(id),
    ]).then(([empRes, salRes]) => {
      setEmployee(empRes.data);
      setSalary(salRes.data);
      setFormData(empRes.data);
    }).catch(() => {
      toast.error('Failed to find employee record');
      navigate('/admin/employees');
    }).finally(() => setIsLoading(false));
  }, [id, navigate]);

  if (isLoading) return <LoadingState message="Loading employee details..." />;
  if (!employee) return null;

  const handleChange = (field, val) => {
    setFormData(prev => ({ ...prev, [field]: val }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await mockService.updateEmployee(id, formData);
      setEmployee(res.data);
      setIsEditing(false);
      toast.success('Employee updated successfully!');
    } catch {
      toast.error('Failed to update employee details');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Top action bar */}
      <div className="flex items-center justify-between">
        <Link to="/admin/employees" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 font-medium">
          <ArrowLeft size={16} /> Back to Directory
        </Link>
        <div className="flex gap-2">
          {!isEditing ? (
            <button onClick={() => setIsEditing(true)} className="btn-primary btn btn-sm inline-flex items-center gap-1.5">
              <Edit3 size={14} /> Edit Full Profile
            </button>
          ) : (
            <button onClick={() => setIsEditing(false)} className="btn-secondary btn btn-sm">
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Header Profile Card */}
      <div className="card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-l-4 border-indigo-600">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-2xl">
            {employee.firstName?.[0]}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-gray-900">{employee.firstName} {employee.lastName}</h2>
              <span className={`badge ${employee.isActive ? 'badge-approved' : 'badge-rejected'}`}>
                {employee.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <p className="text-sm text-gray-500">{employee.designation} · {employee.department}</p>
            <p className="text-xs font-mono text-gray-400 mt-0.5">ID: {employee.employeeId}</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs text-gray-400">Role Privilege</span>
          <p className="text-sm font-semibold text-indigo-700">Full HR Admin Access</p>
        </div>
      </div>

      {/* Profile Form (View or Edit) */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Personal Details */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-3">
            <User size={18} className="text-indigo-600" />
            <h3 className="font-semibold text-gray-900">Personal Information</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              id="firstName"
              label="First Name"
              disabled={!isEditing}
              value={formData.firstName || ''}
              onChange={(e) => handleChange('firstName', e.target.value)}
            />
            <FormInput
              id="lastName"
              label="Last Name"
              disabled={!isEditing}
              value={formData.lastName || ''}
              onChange={(e) => handleChange('lastName', e.target.value)}
            />
            <FormInput
              id="email"
              label="Work Email"
              disabled={!isEditing}
              value={formData.email || ''}
              onChange={(e) => handleChange('email', e.target.value)}
            />
            <FormInput
              id="phone"
              label="Phone Number"
              disabled={!isEditing}
              value={formData.phone || ''}
              onChange={(e) => handleChange('phone', e.target.value)}
            />
            <div className="md:col-span-2">
              <FormInput
                id="address"
                label="Residential Address"
                disabled={!isEditing}
                value={formData.address || ''}
                onChange={(e) => handleChange('address', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Job & Organization Details */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-3">
            <Briefcase size={18} className="text-indigo-600" />
            <h3 className="font-semibold text-gray-900">Job & Department Information</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              id="department"
              label="Department"
              disabled={!isEditing}
              value={formData.department || ''}
              onChange={(e) => handleChange('department', e.target.value)}
            />
            <FormInput
              id="designation"
              label="Designation / Role"
              disabled={!isEditing}
              value={formData.designation || ''}
              onChange={(e) => handleChange('designation', e.target.value)}
            />
            <FormSelect
              id="employmentType"
              label="Employment Type"
              disabled={!isEditing}
              value={formData.employmentType || 'full-time'}
              onChange={(e) => handleChange('employmentType', e.target.value)}
            >
              <option value="full-time">Full-time Regular</option>
              <option value="part-time">Part-time</option>
              <option value="contract">Contractor</option>
            </FormSelect>
            <FormInput
              id="reportingManager"
              label="Reporting Manager"
              disabled={!isEditing}
              value={formData.reportingManager || ''}
              onChange={(e) => handleChange('reportingManager', e.target.value)}
            />
          </div>
        </div>

        {isEditing && (
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setIsEditing(false)} className="btn-secondary btn">
              Cancel
            </button>
            <button type="submit" disabled={isSaving} className="btn-primary btn">
              <Save size={16} /> {isSaving ? 'Saving Changes...' : 'Save All Changes'}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
