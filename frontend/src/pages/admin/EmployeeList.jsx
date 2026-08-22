import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Search, Plus, Filter, Eye, Edit, Check, X } from 'lucide-react';
import { mockService } from '../../mock/mockService';
import { LoadingState } from '../../components/ui/States';
import { formatDate } from '../../utils/dateUtils';

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    mockService.getAllEmployees().then(res => {
      setEmployees(res.data || []);
    }).finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <LoadingState message="Loading workforce directory..." />;

  const departments = ['ALL', ...new Set(employees.map(e => e.department))];

  const filtered = employees.filter(emp => {
    const matchesSearch =
      `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = departmentFilter === 'ALL' || emp.department === departmentFilter;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Employee Management</h2>
          <p className="text-sm text-gray-500">View and update complete employee profiles and employment terms.</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card !p-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, ID, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input pl-9 text-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-gray-400" />
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="form-select text-sm !w-auto"
          >
            {departments.map(d => (
              <option key={d} value={d}>{d === 'ALL' ? 'All Departments' : d}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden !p-0">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Employee ID</th>
                <th>Department</th>
                <th>Designation</th>
                <th>Joining Date</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((emp) => (
                <tr key={emp._id} className="hover:bg-gray-50/80 transition-colors">
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
                        {emp.firstName?.[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{emp.firstName} {emp.lastName}</p>
                        <p className="text-xs text-gray-400">{emp.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="font-mono text-xs font-semibold text-gray-600">{emp.employeeId}</td>
                  <td>
                    <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-700 text-xs font-medium">
                      {emp.department}
                    </span>
                  </td>
                  <td className="text-gray-700">{emp.designation}</td>
                  <td>{formatDate(emp.joiningDate)}</td>
                  <td>
                    <span className={`badge ${emp.isActive ? 'badge-approved' : 'badge-rejected'}`}>
                      {emp.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="text-right">
                    <Link
                      to={`/admin/employees/${emp._id}`}
                      className="btn-secondary btn btn-sm inline-flex items-center gap-1.5"
                    >
                      <Eye size={13} /> View & Manage
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
