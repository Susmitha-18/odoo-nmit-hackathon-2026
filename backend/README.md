# DAYFLOW HRMS — Backend Service Engine

"Every workday, perfectly aligned."

The backend for **DAYFLOW HRMS** is built with Node.js, Express, MongoDB, and Mongoose, providing role-based REST APIs for Employee Onboarding, Profiles, Attendance Tracking, Leave Workflows, and Payroll Visibility.

---

## 🛠️ Tech Stack & Architecture
- **Runtime:** Node.js (v24+)
- **Framework:** Express.js
- **Database:** MongoDB & Mongoose ORM
- **Authentication:** JSON Web Tokens (JWT) & bcryptjs password hashing
- **Security:** Server-side RBAC Middleware (`requireAuth`, `requireRole('ADMIN')`)

---

## 📁 Directory Layout
```
backend/
├── src/
│   ├── config/          # Database connection
│   ├── controllers/     # Business logic handlers
│   ├── middleware/      # Auth & RBAC security checks
│   ├── models/          # Mongoose schemas (User, Employee, Attendance, LeaveRequest, Payroll)
│   ├── routes/          # Express route definitions
│   └── utils/           # JWT utilities & database seed script
│   └── app.js           # Main Express application entry point
├── .env.example         # Template for environment variables
├── API_CONTRACT.md      # Detailed API specification for frontend developers
├── package.json
└── README.md
```

---

## 🚀 Quickstart Guide

### 1. Environment Setup
Copy `.env.example` to `.env` and verify configuration:
```bash
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/dayflow_hrms
JWT_SECRET=dayflow_super_secret_jwt_key_2026_nmit_hackathon
JWT_EXPIRE=30d
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Seed Database
Run the seed script to populate test Admin and Employee accounts:
```bash
npm run seed
```

### 4. Start Server
```bash
# Production / Standard execution
npm start

# Development execution with auto-reload
npm run dev
```

---

## 🔑 Test Credentials

| Role | Employee ID | Email | Password |
|---|---|---|---|
| **Admin / HR Director** | `EMP001` | `admin@dayflow.com` | `Admin@123` |
| **Employee (Senior Engineer)** | `EMP002` | `emp01@dayflow.com` | `Emp@12345` |
| **Employee (UI/UX Lead)** | `EMP003` | `emp02@dayflow.com` | `Emp@12345` |

---

## 🔒 Security & Authorization Highlights
1. **Server-Side Enforcement:** Identity is derived exclusively from the verified JWT payload (`req.user.id`, `req.user.role`). Frontend-supplied IDs or roles are never trusted.
2. **Restricted Self-Service:** Non-admin users attempting to edit protected profile fields (department, designation) or view other employees' records are blocked with `403 Forbidden`.
3. **Attendance Rule Guards:** Prevents double clock-in on the same day and prevents clock-out without prior clock-in.
4. **Leave Sync:** Approving a leave application automatically updates attendance status to `LEAVE` for those dates.
