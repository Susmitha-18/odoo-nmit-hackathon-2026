const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db.js');
const errorHandler = require('./middlewares/errorMiddleware.js');

// Route imports
const authRoutes = require('./routes/authRoutes.js');
const employeeRoutes = require('./routes/employeeRoutes.js');
const attendanceRoutes = require('./routes/attendanceRoutes.js');
const leaveRoutes = require('./routes/leaveRoutes.js');
const payrollRoutes = require('./routes/payrollRoutes.js');

dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Healthcheck
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    system: 'DAYFLOW HRMS API Engine',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/employees', employeeRoutes);
app.use('/api/v1/attendance', attendanceRoutes);
app.use('/api/v1/leaves', leaveRoutes);
app.use('/api/v1/payroll', payrollRoutes);

// Error Handling Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 DAYFLOW HRMS Backend Server running on port ${PORT}`);
});
