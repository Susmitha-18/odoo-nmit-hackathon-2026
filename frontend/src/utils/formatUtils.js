// Number and string formatting utilities
export const formatCurrency = (amount, currency = 'USD') => {
  if (amount === null || amount === undefined) return '—';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatNumber = (n) => {
  if (n === null || n === undefined) return '—';
  return new Intl.NumberFormat('en-US').format(n);
};

export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const capitalizeWords = (str) => {
  if (!str) return '';
  return str.replace(/\b\w/g, (c) => c.toUpperCase());
};

export const getInitials = (firstName, lastName) => {
  const f = firstName?.charAt(0) || '';
  const l = lastName?.charAt(0) || '';
  return (f + l).toUpperCase();
};

export const getFullName = (employee) => {
  if (!employee) return 'Unknown';
  return `${employee.firstName || ''} ${employee.lastName || ''}`.trim();
};

export const formatLeaveType = (type) => {
  const map = { paid: 'Paid Leave', sick: 'Sick Leave', unpaid: 'Unpaid Leave' };
  return map[type] || capitalize(type);
};

export const formatJobType = (type) => {
  const map = { 'full-time': 'Full-Time', 'part-time': 'Part-Time', contract: 'Contract' };
  return map[type] || capitalize(type);
};

export const formatEmploymentStatus = (status) => {
  const map = { active: 'Active', inactive: 'Inactive', terminated: 'Terminated' };
  return map[status] || capitalize(status);
};

export const truncate = (str, maxLen = 60) => {
  if (!str) return '';
  return str.length > maxLen ? str.slice(0, maxLen) + '…' : str;
};

export const getErrorMessage = (error) => {
  return (
    error?.response?.data?.message ||
    error?.message ||
    'An unexpected error occurred. Please try again.'
  );
};
