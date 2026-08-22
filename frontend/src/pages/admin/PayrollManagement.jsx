import React, { useEffect, useState } from 'react';
import { getAllPayrollsAPI } from '../../api/payroll.api';
import { CreditCard, Edit2, AlertCircle, Calendar } from 'lucide-react';
import DataTable from '../../components/ui/DataTable';
import SalaryEditor from '../../components/employee/SalaryEditor';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';

const PayrollManagement = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [payrolls, setPayrolls] = useState([]);

  // Selected employee for salary editing
  const [selectedPayroll, setSelectedPayroll] = useState(null);

  const fetchPayrolls = async () => {
    try {
      setError('');
      const res = await getAllPayrollsAPI();
      if (res.success) {
        setPayrolls(res.payrolls || []);
        // If there was a selected payroll, update it from fresh data
        if (selectedPayroll) {
          const fresh = res.payrolls.find((p) => p.employeeId === selectedPayroll.employeeId);
          setSelectedPayroll(fresh || null);
        }
      }
    } catch (err) {
      console.error(err);
      setError('Unable to fetch employee payroll logs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayrolls();
  }, []);

  const handleSalaryUpdate = (updatedPayroll) => {
    // Refresh table list
    fetchPayrolls();
  };

  const columns = [
    {
      header: 'Employee ID',
      accessor: 'employeeId',
      render: (row) => <span className="font-extrabold text-indigo-650">{row.employeeId}</span>,
    },
    {
      header: 'User Email',
      accessor: 'userId',
      render: (row) => <span className="text-xs text-slate-500 font-medium">{row.userId?.email || 'N/A'}</span>,
    },
    {
      header: 'Basic Scale',
      accessor: 'basicSalary',
      render: (row) => <span className="font-semibold text-slate-700 block text-right min-w-[80px]">₹{row.basicSalary?.toLocaleString('en-IN')}</span>,
    },
    {
      header: 'Allowances',
      accessor: 'allowances',
      render: (row) => {
        const total = (row.allowances?.hra || 0) + (row.allowances?.conveyance || 0) + (row.allowances?.special || 0);
        return <span className="text-emerald-700 font-semibold block text-right min-w-[80px]">₹{total.toLocaleString('en-IN')}</span>;
      },
    },
    {
      header: 'Deductions',
      accessor: 'deductions',
      render: (row) => {
        const total = (row.deductions?.tax || 0) + (row.deductions?.pf || 0);
        return <span className="text-rose-700 font-semibold block text-right min-w-[80px]">₹{total.toLocaleString('en-IN')}</span>;
      },
    },
    {
      header: 'Net Salary',
      accessor: 'netSalary',
      render: (row) => <span className="font-bold text-slate-800 block text-right min-w-[80px]">₹{row.netSalary?.toLocaleString('en-IN')}</span>,
    },
    {
      header: 'Effective Date',
      accessor: 'effectiveDate',
      render: (row) => (
        <span className="text-xs text-slate-400 font-medium">
          {new Date(row.effectiveDate || row.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      header: 'Actions',
      accessor: '_id',
      render: (row) => (
        <Button
          onClick={() => setSelectedPayroll(row)}
          variant={selectedPayroll?.employeeId === row.employeeId ? 'primary' : 'secondary'}
          className="py-1.5 px-3 text-xs"
          icon={Edit2}
        >
          Edit Scale
        </Button>
      ),
    },
  ];

  if (loading) return <LoadingState message="Fetching payroll tables..." />;
  if (error) return <ErrorState message={error} onRetry={fetchPayrolls} />;

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Workforce Payroll Ledger" 
        subtitle="Modify basic salary scaling, tax deductions, and review company payroll records."
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Table Column */}
        <div className="xl:col-span-2 space-y-4">
          <DataTable
            columns={columns}
            data={payrolls}
            emptyMessage="No payroll structures defined in system."
          />
        </div>

        {/* Salary Editor Column */}
        <div className="space-y-4">
          {selectedPayroll ? (
            <SalaryEditor
              employeeId={selectedPayroll.employeeId}
              initialPayroll={selectedPayroll}
              onUpdateSuccess={handleSalaryUpdate}
            />
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center text-slate-400 shadow-sm flex flex-col items-center justify-center min-h-[350px]">
              <CreditCard size={32} className="text-slate-300 mb-2" />
              <h3 className="text-sm font-bold text-slate-700 tracking-tight">No Employee Selected</h3>
              <p className="text-xs text-slate-400 font-medium max-w-[200px] mt-1.5 leading-relaxed">
                Click "Edit Scale" on an employee record to edit allowances and calculate basic structures.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PayrollManagement;
