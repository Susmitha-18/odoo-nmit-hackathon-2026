const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const EmployeeProfile = require('../models/EmployeeProfile');
const Attendance = require('../models/Attendance');
const Leave = require('../models/Leave');
const Payroll = require('../models/Payroll');

dotenv.config({ path: __dirname + '/../.env' });

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/dayflow_hrms';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await EmployeeProfile.deleteMany({});
    await Attendance.deleteMany({});
    await Leave.deleteMany({});
    await Payroll.deleteMany({});

    console.log('Cleared existing records...');

    // 1. Create Admin
    const adminUser = await User.create({
      employeeId: 'EMP001',
      email: 'admin@dayflow.com',
      password: 'Admin@123', // Will be hashed by pre-save hook
      role: 'ADMIN',
      isVerified: true
    });

    const adminProfile = await EmployeeProfile.create({
      user: adminUser._id,
      employeeId: 'EMP001',
      firstName: 'Sarah',
      lastName: 'Jenkins',
      department: 'Human Resources',
      designation: 'HR Director',
      joiningDate: new Date('2022-01-15'),
      phone: '+1 (555) 987-6543',
      address: '100 Executive Boulevard, Suite 400',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'
    });

    await Payroll.create({
      user: adminUser._id,
      employeeId: 'EMP001',
      basicSalary: 120000,
      allowances: { hra: 30000, conveyance: 10000, special: 20000 },
      deductions: { tax: 15000, pf: 8000 }
    });

    // 2. Create Employee 1
    const emp1User = await User.create({
      employeeId: 'EMP002',
      email: 'emp01@dayflow.com',
      password: 'Emp@12345',
      role: 'EMPLOYEE',
      isVerified: true
    });

    const emp1Profile = await EmployeeProfile.create({
      user: emp1User._id,
      employeeId: 'EMP002',
      firstName: 'John',
      lastName: 'Doe',
      department: 'Engineering',
      designation: 'Senior Fullstack Engineer',
      joiningDate: new Date('2023-03-10'),
      phone: '+1 (555) 123-4567',
      address: '42 Silicon Avenue, Apt 3B',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'
    });

    await Payroll.create({
      user: emp1User._id,
      employeeId: 'EMP002',
      basicSalary: 80000,
      allowances: { hra: 20000, conveyance: 6000, special: 14000 },
      deductions: { tax: 9000, pf: 5000 }
    });

    // 3. Create Employee 2
    const emp2User = await User.create({
      employeeId: 'EMP003',
      email: 'emp02@dayflow.com',
      password: 'Emp@12345',
      role: 'EMPLOYEE',
      isVerified: true
    });

    const emp2Profile = await EmployeeProfile.create({
      user: emp2User._id,
      employeeId: 'EMP003',
      firstName: 'Emily',
      lastName: 'Watson',
      department: 'Product & Design',
      designation: 'UI/UX Lead',
      joiningDate: new Date('2023-06-01'),
      phone: '+1 (555) 456-7890',
      address: '88 Creative Lane, Studio 12',
      avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150'
    });

    await Payroll.create({
      user: emp2User._id,
      employeeId: 'EMP003',
      basicSalary: 75000,
      allowances: { hra: 18000, conveyance: 5000, special: 12000 },
      deductions: { tax: 8000, pf: 4500 }
    });

    // 4. Create Historical Attendance
    const dates = ['2026-08-18', '2026-08-19', '2026-08-20', '2026-08-21'];
    for (const d of dates) {
      await Attendance.create({
        user: emp1User._id,
        employeeId: 'EMP002',
        date: d,
        checkIn: new Date(`${d}T09:00:00Z`),
        checkOut: new Date(`${d}T17:30:00Z`),
        workHours: 8.5,
        status: 'Present',
        remarks: 'On time'
      });

      await Attendance.create({
        user: emp2User._id,
        employeeId: 'EMP003',
        date: d,
        checkIn: new Date(`${d}T09:15:00Z`),
        checkOut: new Date(`${d}T17:15:00Z`),
        workHours: 8.0,
        status: 'Present',
        remarks: 'On time'
      });
    }

    // 5. Create Leaves
    await Leave.create({
      applicant: emp1User._id,
      employeeId: 'EMP002',
      leaveType: 'Sick',
      startDate: new Date('2026-08-25'),
      endDate: new Date('2026-08-26'),
      totalDays: 2,
      reason: 'Fever and rest recommended by doctor',
      status: 'Pending'
    });

    await Leave.create({
      applicant: emp2User._id,
      employeeId: 'EMP003',
      leaveType: 'Paid',
      startDate: new Date('2026-08-28'),
      endDate: new Date('2026-08-29'),
      totalDays: 2,
      reason: 'Family event',
      status: 'Approved',
      adminComment: 'Approved by HR',
      reviewedBy: adminUser._id,
      reviewedAt: new Date()
    });

    console.log('✅ Dayflow HRMS Database seeded successfully!');
    console.log('----------------------------------------------------');
    console.log('Admin Credentials:    admin@dayflow.com / Admin@123');
    console.log('Employee 1 (EMP002): emp01@dayflow.com / Emp@12345');
    console.log('Employee 2 (EMP003): emp02@dayflow.com / Emp@12345');
    console.log('----------------------------------------------------');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
