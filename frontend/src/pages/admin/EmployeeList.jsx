import React, { useEffect, useState } from 'react';
import { getAllEmployeesAPI } from '../../api/employee.api';
import { Eye, Edit2, Search, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import DataTable from '../../components/ui/DataTable';
import SearchBar from '../../components/ui/SearchBar';
import FilterBar from '../../components/ui/FilterBar';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';

const EmployeeList = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [employees, setEmployees] = useState([]);

  // Search/Filters
  const [searchVal, setSearchVal] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [desigFilter, setDesigFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  const fetchEmployees = async () => {
    try {
      setError('');
      const res = await getAllEmployeesAPI();
      if (res.success) {
        setEmployees(res.employees || []);
      }
    } catch (err) {
      console.error(err);
      setError('Unable to load employee list. Verify backend database status.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Filter lists
  const departments = Array.from(new Set(employees.map(e => e.department).filter(Boolean)));
  const designations = Array.from(new Set(employees.map(e => e.designation).filter(Boolean)));

  const filteredEmployees = employees.filter((e) => {
    const fullName = (e.fullName || '').toLowerCase();
    const empId = (e.employeeId || '').toLowerCase();
    const email = (e.user?.email || '').toLowerCase();
    const matchSearch =
      fullName.includes(searchVal.toLowerCase()) ||
      empId.includes(searchVal.toLowerCase()) ||
      email.includes(searchVal.toLowerCase());

    const matchDept = !deptFilter || e.department === deptFilter;
    const matchDesig = !desigFilter || e.designation === desigFilter;
    const matchRole = !roleFilter || e.user?.role === roleFilter;

    return matchSearch && matchDept && matchDesig && matchRole;
  });

  const filters = [
    {
      label: 'Department',
      value: deptFilter,
      onChange: setDeptFilter,
      options: departments,
    },
    {
      label: 'Designation',
      value: desigFilter,
      onChange: setDesigFilter,
      options: designations,
    },
    {
      label: 'Role',
      value: roleFilter,
      onChange: setRoleFilter,
      options: [
        { label: 'Standard Employee', value: 'EMPLOYEE' },
        { label: 'HR Administrator', value: 'ADMIN' },
      ],
    },
  ];

  const columns = [
    {
      header: 'Employee ID',
      accessor: 'employeeId',
      render: (row) => <span className="font-extrabold text-indigo-650">{row.employeeId}</span>,
    },
    {
      header: 'Full Name',
      accessor: 'firstName',
      render: (row) => (
        <div className="flex items-center space-x-3">
          <img
            src={row.profilePicture || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'}
            alt="Avatar"
            className="h-8 w-8 rounded-full object-cover border border-slate-200"
          />
          <div>
            <p className="text-xs font-bold text-slate-800 leading-tight">
              {row.fullName}
            </p>
            <p className="text-[10px] text-slate-400 font-medium">{row.userId?.email || row.user?.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Department',
      accessor: 'department',
      render: (row) => <span className="text-xs font-semibold text-slate-650">{row.department}</span>,
    },
    {
      header: 'Designation',
      accessor: 'designation',
      render: (row) => <span className="text-xs text-slate-600 font-medium">{row.designation}</span>,
    },
    {
      header: 'Role',
      accessor: 'role',
      render: (row) => (
        <span
          className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border ${
            row.user?.role === 'ADMIN'
              ? 'bg-purple-50 text-purple-700 border-purple-100'
              : 'bg-slate-50 text-slate-700 border-slate-100'
          }`}
        >
          {row.user?.role === 'ADMIN' ? 'HR Admin' : 'Employee'}
        </span>
      ),
    },
    {
      header: 'Joining Date',
      accessor: 'joiningDate',
      render: (row) => (
        <span className="text-xs text-slate-500 font-medium">
          {row.joiningDate ? new Date(row.joiningDate).toLocaleDateString() : 'N/A'}
        </span>
      ),
    },
    {
      header: 'Actions',
      accessor: '_id',
      render: (row) => (
        <div className="flex items-center space-x-3.5">
          <Link
            to={`/admin/employees/${row._id}`}
            className="inline-flex items-center space-x-1.5 font-bold text-xs text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            <Eye size={13} />
            <span>View</span>
          </Link>
          <Link
            to={`/admin/employees/${row._id}?edit=true`}
            className="inline-flex items-center space-x-1.5 font-bold text-xs text-slate-600 hover:text-slate-900 transition-colors"
          >
            <Edit2 size={13} />
            <span>Edit</span>
          </Link>
        </div>
      ),
    },
  ];

  if (loading) return <LoadingState message="Fetching employee catalog..." />;
  if (error) return <ErrorState message={error} onRetry={fetchEmployees} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">
            Employee Directory
          </h1>
          <p className="text-xs font-medium text-slate-500">
            Search, filter, and modify profiles for employees.
          </p>
        </div>

        <Link
          to="/register"
          className="inline-flex items-center space-x-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 text-xs font-semibold shadow-sm transition-colors"
        >
          <Plus size={14} />
          <span>Onboard Employee</span>
        </Link>
      </div>

      {/* Search and Filters Box */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-4 flex flex-col md:flex-row md:items-center justify-between md:space-y-0 gap-4">
        <SearchBar
          value={searchVal}
          onChange={setSearchVal}
          placeholder="Search by ID, Name or Email..."
          onClear={() => setSearchVal('')}
        />
        <FilterBar filters={filters} />
      </div>

      {/* Directory Table */}
      <DataTable
        columns={columns}
        data={filteredEmployees}
        emptyMessage="No employees matching the current query were found."
      />
    </div>
  );
};

export default EmployeeList;
