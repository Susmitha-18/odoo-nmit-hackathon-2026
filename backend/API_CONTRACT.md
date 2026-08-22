# DAYFLOW HRMS — API CONTRACT DOCUMENTATION

**Base URL:** `http://localhost:5000/api`  
**Authentication Header:** `Authorization: Bearer <JWT_TOKEN>`

---

## 1. AUTHENTICATION MODULE (`/api/auth`)

### 1.1 Register User
- **Method:** `POST`
- **Path:** `/api/auth/register`
- **Access:** Public
- **Request Body:**
```json
{
  "employeeId": "EMP004",
  "email": "alex@dayflow.com",
  "password": "Password@123",
  "role": "EMPLOYEE",
  "fullName": "Alex Morgan",
  "department": "Engineering",
  "designation": "Backend Developer",
  "phone": "+1 555 019 9999"
}
```
- **Response (201 Created):**
```json
{
  "success": true,
  "token": "<JWT_STRING>",
  "user": {
    "id": "65d8f1a2...",
    "employeeId": "EMP004",
    "email": "alex@dayflow.com",
    "role": "EMPLOYEE",
    "fullName": "Alex Morgan",
    "department": "Engineering",
    "designation": "Backend Developer"
  }
}
```

### 1.2 Login User
- **Method:** `POST`
- **Path:** `/api/auth/login`
- **Access:** Public
- **Request Body:**
```json
{
  "email": "admin@dayflow.com",
  "password": "Admin@123"
}
```
- **Response (200 OK):**
```json
{
  "success": true,
  "token": "<JWT_STRING>",
  "user": {
    "id": "65d8f1a2...",
    "employeeId": "EMP001",
    "email": "admin@dayflow.com",
    "role": "ADMIN",
    "fullName": "Sarah Jenkins",
    "department": "Human Resources",
    "designation": "HR Director"
  }
}
```

### 1.3 Get Current User Session
- **Method:** `GET`
- **Path:** `/api/auth/me`
- **Access:** Private (Bearer Token)
- **Response (200 OK):** Returns current user object and employee profile details.

---

## 2. EMPLOYEE MODULE (`/api/employees`)

### 2.1 Get Employees List
- **Method:** `GET`
- **Path:** `/api/employees`
- **Access:** Private
- **Behavior:**
  - `ADMIN`: Returns all employee profiles in system.
  - `EMPLOYEE`: Returns array containing only own profile.

### 2.2 Get Single Employee Profile
- **Method:** `GET`
- **Path:** `/api/employees/:id` (Can be Mongo `_id` or `employeeId` string)
- **Access:** Private
- **Security Guard:** Non-admin users attempting to view another employee's profile receive `403 Forbidden`.

### 2.3 Update Employee Profile
- **Method:** `PUT`
- **Path:** `/api/employees/:id`
- **Access:** Private
- **Behavior:**
  - `EMPLOYEE`: Can update ONLY `phone`, `address`, `profilePicture`.
  - `ADMIN`: Can update `fullName`, `department`, `designation`, `phone`, `address`, `profilePicture`, `joiningDate`.

---

## 3. ATTENDANCE MODULE (`/api/attendance`)

### 3.1 Clock In
- **Method:** `POST`
- **Path:** `/api/attendance/check-in`
- **Access:** Private
- **Behavior:** Records check-in timestamp for today. Fails if user is already checked in for today.

### 3.2 Clock Out
- **Method:** `POST`
- **Path:** `/api/attendance/check-out`
- **Access:** Private
- **Behavior:** Records check-out timestamp, calculates `workHours`, and sets status to `PRESENT` (>=4 hrs) or `HALF_DAY` (<4 hrs).

### 3.3 Get Personal Attendance Logs
- **Method:** `GET`
- **Path:** `/api/attendance/me?from=2026-08-01&to=2026-08-31`
- **Access:** Private
- **Query Params:** `from` (optional YYYY-MM-DD), `to` (optional YYYY-MM-DD).

### 3.4 Get All Attendance Records
- **Method:** `GET`
- **Path:** `/api/attendance/all`
- **Access:** Private (`ADMIN` only)

### 3.5 Get Attendance By Employee ID
- **Method:** `GET`
- **Path:** `/api/attendance/employee/:employeeId`
- **Access:** Private (Own record or `ADMIN`)

---

## 4. LEAVE MODULE (`/api/leaves`)

### 4.1 Apply For Leave
- **Method:** `POST`
- **Path:** `/api/leaves`
- **Access:** Private
- **Request Body:**
```json
{
  "leaveType": "SICK",
  "startDate": "2026-09-01",
  "endDate": "2026-09-03",
  "remarks": "Flu and rest needed"
}
```
- **Response (201 Created):** Status starts as `PENDING`.

### 4.2 Get Personal Leaves
- **Method:** `GET`
- **Path:** `/api/leaves/me`
- **Access:** Private

### 4.3 Get All Leaves Queue
- **Method:** `GET`
- **Path:** `/api/leaves?status=PENDING`
- **Access:** Private (`ADMIN` views all; `EMPLOYEE` views own)

### 4.4 Approve Leave Request
- **Method:** `PUT`
- **Path:** `/api/leaves/:id/approve`
- **Access:** Private (`ADMIN` only)
- **Request Body:** `{ "adminComment": "Approved by HR" }`
- **Side Effect:** Automatically creates/updates attendance status to `LEAVE` for those dates.

### 4.5 Reject Leave Request
- **Method:** `PUT`
- **Path:** `/api/leaves/:id/reject`
- **Access:** Private (`ADMIN` only)
- **Request Body:** `{ "adminComment": "Project critical deadline week" }`

---

## 5. PAYROLL MODULE (`/api/payroll`)

### 5.1 Get Personal Payroll
- **Method:** `GET`
- **Path:** `/api/payroll/me`
- **Access:** Private (Read-only for Employee)

### 5.2 Get All Payroll Structures
- **Method:** `GET`
- **Path:** `/api/payroll`
- **Access:** Private (`ADMIN` views all; `EMPLOYEE` views own)

### 5.3 Update Salary Structure
- **Method:** `PUT`
- **Path:** `/api/payroll/:employeeId`
- **Access:** Private (`ADMIN` only)
- **Request Body:**
```json
{
  "basicSalary": 85000,
  "allowances": {
    "hra": 22000,
    "conveyance": 6000,
    "special": 15000
  },
  "deductions": {
    "tax": 10000,
    "pf": 6000
  }
}
```
- **Side Effect:** Server automatically calculates `netSalary = basicSalary + HRA + conveyance + special - tax - pf`.
