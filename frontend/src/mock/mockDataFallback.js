export const MOCK_EMPLOYEES = [
  {
    _id: 'emp001', userId: 'user001', employeeId: 'EMP002',
    firstName: 'John', lastName: 'Doe', email: 'emp01@dayflow.com',
    phone: '+1 (555) 123-4567', address: '42 Silicon Avenue, Apt 3B',
    department: 'Engineering', designation: 'Senior Fullstack Engineer',
    joiningDate: '2023-03-10', isActive: true,
  },
  {
    _id: 'emp002', userId: 'user002', employeeId: 'EMP003',
    firstName: 'Emily', lastName: 'Watson', email: 'emp02@dayflow.com',
    phone: '+1 (555) 456-7890', address: '88 Creative Lane, Studio 12',
    department: 'Product & Design', designation: 'UI/UX Lead',
    joiningDate: '2023-06-01', isActive: true,
  }
];

export const MOCK_SALARIES = {
  emp001: { _id: 'sal001', employeeId: 'EMP002', basicSalary: 80000, allowances: { hra: 20000, conveyance: 6000, special: 14000 }, deductions: { tax: 9000, pf: 5000 }, netSalary: 106000 },
  emp002: { _id: 'sal002', employeeId: 'EMP003', basicSalary: 75000, allowances: { hra: 18000, conveyance: 5000, special: 12000 }, deductions: { tax: 8000, pf: 4500 }, netSalary: 97500 }
};
