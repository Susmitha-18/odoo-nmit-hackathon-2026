# ACTUAL API CONTRACT

This document represents the actual API endpoints implemented in the Dayflow HRMS backend under the `backend/src` directory.

## Base URL
All routes are mounted relative to:
`http://localhost:5000/api`

---

## 1. Authentication (`/auth`)

### 1.1 Register New User
* **Method:** `POST`
* **Path:** `/api/auth/register`
* **Access:** Public
* **Request Body:**
  ```json
  {
    "employeeId": "EMP002",
    "email": "emp01@dayflow.com",
    "password": "Password@123",
    "role": "EMPLOYEE",
    "fullName": "John Doe",
    "department": "Engineering",
    "designation": "Software Engineer",
    "phone": "+1 (555) 019-2834"
  }
  ```
* **Response Shape (201 Created):**
  ```json
  {
    "success": true,
    "token": "eyJhbG...",
    "user": {
      "id": "6a896...",
      "employeeId": "EMP002",
      "email": "emp01@dayflow.com",
      "role": "EMPLOYEE",
      "fullName": "John Doe",
      "department": "Engineering",
      "designation": "Software Engineer"
    }
  }
  ```

### 1.2 Login User
* **Method:** `POST`
* **Path:** `/api/auth/login`
* **Access:** Public
* **Request Body:**
  ```json
  {
    "email": "emp01@dayflow.com",
    "password": "Password@123"
  }
  ```
* **Response Shape (200 OK):**
  ```json
  {
    "success": true,
    "token": "eyJhbG...",
    "user": {
      "id": "6a896...",
      "employeeId": "EMP002",
      "email": "emp01@dayflow.com",
      "role": "EMPLOYEE",
      "fullName": "John Doe",
      "department": "Engineering",
      "designation": "Software Engineer",
      "profilePicture": "https://..."
    }
  }
  ```

### 1.3 Get Current Session (`/me`)
* **Method:** `GET`
* **Path:** `/api/auth/me`
* **Access:** Private (Auth JWT required)
* **Request Headers:** `Authorization: Bearer <JWT>`
* **Response Shape (200 OK):**
  ```json
  {
    "success": true,
    "user": {
      "id": "6a896...",
      "employeeId": "EMP002",
      "email": "emp01@dayflow.com",
      "role": "EMPLOYEE",
      "employee": {
        "_id": "6a89...",
        "userId": "6a89...",
        "employeeId": "EMP002",
        "fullName": "John Doe",
        "email": "emp01@dayflow.com",
        "phone": "+1 (555) 019-2834",
        "address": "123 Tech Park, Innovation Way",
        "profilePicture": "https://...",
        "department": "Engineering",
        "designation": "Software Engineer",
        "joiningDate": "2026-08-22T09:00:00.000Z",
        "documents": []
      }
    }
  }
  ```

---

## 2. Employees (`/employees`)

### 2.1 Get Employee Profiles
* **Method:** `GET`
* **Path:** `/api/employees`
* **Access:** Private (Auth JWT required)
* **Behavior:**
  * If `ADMIN`: Returns all employees.
  * If `EMPLOYEE`: Returns list containing only caller's employee profile.
* **Response Shape (200 OK):**
  ```json
  {
    "success": true,
    "count": 1,
    "employees": [
      {
        "_id": "6a89...",
        "userId": {
          "_id": "6a89...",
          "email": "emp01@dayflow.com",
          "role": "EMPLOYEE",
          "emailVerified": true,
          "createdAt": "2026-08-22T09:00:00.000Z"
        },
        "employeeId": "EMP002",
        "fullName": "John Doe",
        "email": "emp01@dayflow.com",
        "phone": "+1...",
        "address": "...",
        "profilePicture": "...",
        "department": "Engineering",
        "designation": "Senior Fullstack Engineer",
        "joiningDate": "2023-03-10T00:00:00.000Z",
        "documents": []
      }
    ]
  }
  ```

### 2.2 Get Specific Employee
* **Method:** `GET`
* **Path:** `/api/employees/:id`
* **Access:** Private (Auth JWT required)
* **Behavior:** Employee can only view own profile; Admin can view any profile. `:id` can be Mongo `_id` or `employeeId` (e.g. `EMP002`).
* **Response Shape (200 OK):**
  ```json
  {
    "success": true,
    "employee": {
      "_id": "6a89...",
      "userId": {
        "_id": "6a89...",
        "email": "emp01@dayflow.com",
        "role": "EMPLOYEE"
      },
      "employeeId": "EMP002",
      "fullName": "John Doe",
      "email": "emp01@dayflow.com",
      "phone": "+1...",
      ...
    }
  }
  ```

### 2.3 Update Employee Profile
* **Method:** `PUT`
* **Path:** `/api/employees/:id`
* **Access:** Private (Auth JWT required)
* **Behavior:** Employee self-update allows restricted fields (`phone`, `address`, `profilePicture`). Admin update allows all fields. `:id` can be Mongo `_id` or `employeeId`.
* **Request Body:**
  ```json
  {
    "phone": "+1 (555) 000-1111",
    "address": "New Address",
    "profilePicture": "https://..."
  }
  ```
* **Response Shape (200 OK):**
  ```json
  {
    "success": true,
    "message": "Employee profile updated successfully",
    "employee": {
      "_id": "6a89...",
      "fullName": "John Doe",
      "phone": "+1 (555) 000-1111",
      ...
    }
  }
  ```

---

## 3. Attendance (`/attendance`)

### 3.1 Clock In
* **Method:** `POST`
* **Path:** `/api/attendance/check-in`
* **Access:** Private (Auth JWT required)
* **Response Shape (21 Created):**
  ```json
  {
    "success": true,
    "message": "Check-in recorded successfully",
    "attendance": {
      "_id": "6a89...",
      "employeeId": "EMP002",
      "userId": "6a89...",
      "date": "2026-08-22",
      "checkIn": "2026-08-22T09:12:00.000Z",
      "status": "PRESENT",
      "remarks": "Clocked in successfully"
    }
  }
  ```

### 3.2 Clock Out
* **Method:** `POST`
* **Path:** `/api/attendance/check-out`
* **Access:** Private (Auth JWT required)
* **Response Shape (200 OK):**
  ```json
  {
    "success": true,
    "message": "Check-out recorded successfully",
    "attendance": {
      "_id": "6a89...",
      "employeeId": "EMP002",
      "userId": "6a89...",
      "date": "2026-08-22",
      "checkIn": "2026-08-22T09:12:00.000Z",
      "checkOut": "2026-08-22T17:30:00.000Z",
      "workHours": 8.3,
      "status": "PRESENT",
      "remarks": "Clocked out. Total hours: 8.3"
    }
  }
  ```

### 3.3 Get My Attendance Logs
* **Method:** `GET`
* **Path:** `/api/attendance/me`
* **Access:** Private (Auth JWT required)
* **Request Params:** `?from=YYYY-MM-DD&to=YYYY-MM-DD` (optional)
* **Response Shape (200 OK):**
  ```json
  {
    "success": true,
    "count": 4,
    "attendance": [
      {
        "_id": "6a89...",
        "employeeId": "EMP002",
        "date": "2026-08-22",
        "checkIn": "...",
        "checkOut": "...",
        "workHours": 8.5,
        "status": "PRESENT",
        "remarks": "On time"
      }
    ]
  }
  ```

### 3.4 Get All Attendance Logs (Admin only)
* **Method:** `GET`
* **Path:** `/api/attendance/all`
* **Access:** Private (Admin only)
* **Request Params:** `?date=YYYY-MM-DD&status=STATUS&from=YYYY-MM-DD&to=YYYY-MM-DD` (optional)
* **Response Shape (200 OK):**
  ```json
  {
    "success": true,
    "count": 8,
    "attendance": [
      {
        "_id": "6a89...",
        "employeeId": "EMP002",
        "userId": {
          "_id": "6a89...",
          "email": "emp01@dayflow.com",
          "role": "EMPLOYEE"
        },
        "date": "2026-08-22",
        "checkIn": "...",
        "checkOut": "...",
        "workHours": 8.5,
        "status": "PRESENT",
        "remarks": "On time"
      }
    ]
  }
  ```

### 3.5 Get Attendance Logs by Employee
* **Method:** `GET`
* **Path:** `/api/attendance/employee/:employeeId`
* **Access:** Private (Auth JWT required)
* **Behavior:** Employee can query own; Admin can query any employee.
* **Response Shape (200 OK):**
  ```json
  {
    "success": true,
    "count": 4,
    "attendance": [ ... ]
  }
  ```

---

## 4. Leave Requests (`/leaves`)

### 4.1 Apply for Leave
* **Method:** `POST`
* **Path:** `/api/leaves`
* **Access:** Private (Auth JWT required)
* **Request Body:**
  ```json
  {
    "leaveType": "SICK",
    "startDate": "2026-08-25",
    "endDate": "2026-08-26",
    "remarks": "Doctor recommended rest"
  }
  ```
* **Response Shape (201 Created):**
  ```json
  {
    "success": true,
    "message": "Leave application submitted successfully",
    "leave": {
      "_id": "6a89...",
      "employeeId": "EMP002",
      "userId": "6a89...",
      "leaveType": "SICK",
      "startDate": "2026-08-25T00:00:00.000Z",
      "endDate": "2026-08-26T00:00:00.000Z",
      "totalDays": 2,
      "remarks": "Doctor recommended rest",
      "status": "PENDING"
    }
  }
  ```

### 4.2 Get My Leaves Log
* **Method:** `GET`
* **Path:** `/api/leaves/me`
* **Access:** Private (Auth JWT required)
* **Response Shape (200 OK):**
  ```json
  {
    "success": true,
    "count": 1,
    "leaves": [
      {
        "_id": "6a89...",
        "employeeId": "EMP002",
        "leaveType": "SICK",
        "startDate": "...",
        "endDate": "...",
        "totalDays": 2,
        "remarks": "...",
        "status": "PENDING"
      }
    ]
  }
  ```

### 4.3 Get Leave Requests
* **Method:** `GET`
* **Path:** `/api/leaves`
* **Access:** Private (Auth JWT required)
* **Request Params:** `?status=PENDING` (optional)
* **Behavior:**
  * If `ADMIN`: Returns all leave requests.
  * If `EMPLOYEE`: Returns only caller's leave requests.
* **Response Shape (200 OK):**
  ```json
  {
    "success": true,
    "count": 5,
    "leaves": [
      {
        "_id": "6a89...",
        "userId": {
          "_id": "6a89...",
          "email": "emp01@dayflow.com",
          "role": "EMPLOYEE"
        },
        "employeeId": "EMP002",
        "leaveType": "SICK",
        "startDate": "...",
        "endDate": "...",
        "totalDays": 2,
        "remarks": "...",
        "status": "PENDING"
      }
    ]
  }
  ```

### 4.4 Approve Leave Request
* **Method:** `PUT`
* **Path:** `/api/leaves/:id/approve`
* **Access:** Private (Admin only)
* **Request Body:** `{ "adminComment": "Approved by HR" }`
* **Response Shape (200 OK):**
  ```json
  {
    "success": true,
    "message": "Leave request approved successfully",
    "leave": {
      "_id": "6a89...",
      "status": "APPROVED",
      "adminComment": "Approved by HR",
      "reviewedBy": "6a89...",
      "reviewedAt": "..."
    }
  }
  ```

### 4.5 Reject Leave Request
* **Method:** `PUT`
* **Path:** `/api/leaves/:id/reject`
* **Access:** Private (Admin only)
* **Request Body:** `{ "adminComment": "Overlapping schedule" }`
* **Response Shape (200 OK):**
  ```json
  {
    "success": true,
    "message": "Leave request rejected",
    "leave": {
      "_id": "6a89...",
      "status": "REJECTED",
      "adminComment": "Overlapping schedule",
      "reviewedBy": "6a89...",
      "reviewedAt": "..."
    }
  }
  ```

---

## 5. Payroll (`/payroll`)

### 5.1 Get My Payroll Record
* **Method:** `GET`
* **Path:** `/api/payroll/me`
* **Access:** Private (Auth JWT required)
* **Response Shape (200 OK):**
  ```json
  {
    "success": true,
    "payroll": {
      "_id": "6a89...",
      "userId": "6a89...",
      "employeeId": "EMP002",
      "basicSalary": 80000,
      "allowances": {
        "hra": 20000,
        "conveyance": 6000,
        "special": 14000
      },
      "deductions": {
        "tax": 9000,
        "pf": 5000
      },
      "currency": "INR",
      "netSalary": 106000
    }
  }
  ```

### 5.2 Get Payroll Records
* **Method:** `GET`
* **Path:** `/api/payroll`
* **Access:** Private (Auth JWT required)
* **Behavior:**
  * If `ADMIN`: Returns all payroll records.
  * If `EMPLOYEE`: Returns list containing only caller's payroll record.
* **Response Shape (200 OK):**
  ```json
  {
    "success": true,
    "count": 3,
    "payrolls": [
      {
        "_id": "6a89...",
        "userId": {
          "_id": "6a89...",
          "email": "emp01@dayflow.com"
        },
        "employeeId": "EMP002",
        "basicSalary": 80000,
        "allowances": { "hra": 20000, ... },
        "deductions": { "tax": 9000, ... },
        "currency": "INR",
        "netSalary": 106000
      }
    ]
  }
  ```

### 5.3 Update Employee Payroll Record
* **Method:** `PUT`
* **Path:** `/api/payroll/:employeeId`
* **Access:** Private (Admin only)
* **Request Body:**
  ```json
  {
    "basicSalary": 85000,
    "allowances": { "hra": 22000 },
    "deductions": { "tax": 10000 }
  }
  ```
* **Response Shape (200 OK):**
  ```json
  {
    "success": true,
    "message": "Salary structure updated successfully",
    "payroll": {
      "_id": "6a89...",
      "basicSalary": 85000,
      "netSalary": 113000,
      ...
    }
  }
  ```
