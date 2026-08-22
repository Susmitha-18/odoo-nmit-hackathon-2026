import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Pencil, UserPlus } from 'lucide-react';
import AdminLayout from '../../components/layout/AdminLayout';
import PageHeader from '../../components/ui/PageHeader';
import DataTable from '../../components/ui/DataTable';
import SearchBar from '../../components/ui/SearchBar';
import FilterBar from '../../components/ui/FilterBar';
import StatusBadge from '../../components/ui/StatusBadge';
import Avatar from '../../components/ui/Avatar';
import { employeeApi } from '../../api/employee.api';
import { getFullName, formatJobType } from '../../utils/formatUtils';

const DEPARTMENTS = ['Engineering', 'Product', 'Design', 'HR', 'Finance', 'Sales', 'Marketing', 'Operations'];
const STATUSES = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'terminated', label: 'Terminated' },
];

export default function EmployeeList() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ department: '', status: '' });

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await employeeApi.getAll({ search, ...filters });
      setEmployees(data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load employees.');
    } finally {
      setLoading(false);
    }
  }, [search, filters]);

  useEffect(() => { load(); }, [load]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const filterConfig = [
    {
      key: 'department',
      label: 'Department',
      value: filters.department,
      options: DEPARTMENTS.map((d) => ({ value: d, label: d })),
    },
    {
      key: 'status',
      label: 'Status',
      value: filters.status,
      options: STATUSES,
    },
  ];

  const columns = [
    {
      key: 'employeeId',
      label: 'Employee ID',
      render: (row) => (
        <span className="font-mono text-xs font-semibold text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded">
          {row.employeeId}
        </span>
      ),
    },
    {
      key: 'name',
      label: 'Name',
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <Avatar firstName={row.firstName} lastName={row.lastName} src={row.profilePicture} size="sm" />
          <div>
            <p className="text-sm font-medium text-neutral-800">{getFullName(row)}</p>
            <p className="text-xs text-neutral-400">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'department',
      label: 'Department',
      render: (row) => (
        <span className="text-sm text-neutral-700">{row.department || '—'}</span>
      ),
    },
    {
      key: 'jobTitle',
      label: 'Designation',
      render: (row) => (
        <div>
          <p className="text-sm text-neutral-700">{row.jobTitle || '—'}</p>
          <p className="text-xs text-neutral-400">{formatJobType(row.jobType)}</p>
        </div>
      ),
    },
    {
      key: 'employmentStatus',
      label: 'Status',
      render: (row) => <StatusBadge status={row.employmentStatus} />,
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/admin/employees/${row._id}`)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" /> View
          </button>
          <button
            onClick={() => navigate(`/admin/employees/${row._id}?edit=true`)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-neutral-600 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
          >
            <Pencil className="w-3.5 h-3.5" /> Edit
          </button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout>
      <PageHeader
        title="Employee Management"
        subtitle={`${employees.length} employee${employees.length !== 1 ? 's' : ''} found`}
        breadcrumb={[{ label: 'Admin' }, { label: 'Employees' }]}
      />

      {/* Toolbar */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm mb-4">
        <div className="flex flex-col sm:flex-row gap-3 p-4">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search by name, ID, department..."
            className="sm:w-72"
          />
          <FilterBar
            filters={filterConfig}
            onChange={handleFilterChange}
            onReset={() => setFilters({ department: '', status: '' })}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
        <DataTable
          columns={columns}
          data={employees}
          loading={loading}
          error={error}
          emptyMessage="No employees found."
          emptyIcon={UserPlus}
        />
      </div>

      {/* Footer count */}
      {!loading && !error && employees.length > 0 && (
        <p className="text-xs text-neutral-400 mt-3 text-right">
          Showing {employees.length} result{employees.length !== 1 ? 's' : ''}
        </p>
      )}
    </AdminLayout>
  );
}
