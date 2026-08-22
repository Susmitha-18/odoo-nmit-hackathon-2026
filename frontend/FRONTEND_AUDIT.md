# DAYFLOW HRMS — FRONTEND AUDIT & RECONSTRUCTION PLAN

This document represents the comprehensive audit of the current Dayflow frontend architecture, identifying critical bugs, security loopholes, API contract mismatches, redundant code, and UX flaws, followed by a detailed reconstruction blueprint.

---

## 1. Current Architecture

The frontend is a React application built with Vite, Tailwind CSS, and React Router. It uses lightweight contexts (`AuthContext.jsx`) and a modular Axios client (`frontend/src/api/axios.js`) for API requests. However, it suffers from significant structural decay due to parallel mock implementations, resulting in duplicate pages, dead assets, and bypassed auth validation.

---

## 2. Critical Bugs

1. **Authentication Bypass in Login Form (`Login.jsx`):**
   - The login form submission does NOT call the authentication service. It simply checks the UI role selector and calls `navigate()` directly.
2. **Unconditional Route Guards (`ProtectedRoute.jsx`):**
   - `ProtectedRoute` returns `children` unconditionally without verifying `isAuthenticated` or checking user roles, allowing any user to access `/admin/*` or `/employee/*` by manually editing the browser address bar.
3. **Hardcoded Testing Links:**
   - The login page displays "Direct Quick Access" buttons allowing anyone to bypass authentication entirely with a single click.

---

## 3. API Contract Mismatches

| Module / Scope | Frontend Expectation (Current) | Backend Spec (Active) | Impact |
|---|---|---|---|
| **Attendance Status** | `present`, `absent`, `half-day`, `leave` (Lowercase) | `PRESENT`, `ABSENT`, `HALF_DAY`, `LEAVE` (Uppercase) | Status badges in lists appear blank or broken. |
| **Leave Status** | `pending`, `approved`, `rejected` (Lowercase) | `PENDING`, `APPROVED`, `REJECTED` (Uppercase) | Filter tabs and action states fail to match. |
| **Leave Types** | `paid`, `sick`, `unpaid` (Lowercase) | `PAID`, `SICK`, `UNPAID` (Uppercase) | Application form submission fails backend schema validation. |
| **Identity Reference** | Expects `userId` in some attendance structures | Expects `employeeId` / `userId` indexes | Filtering logs per employee returns empty sets. |
| **Leave Decision Routes** | `PUT /api/leaves/:id/approve` / `/reject` | `PUT /api/v1/leaves/:id/approve` / `/reject` | URL structure needs alignment to match Express endpoints. |
| **Payroll Modification** | `PUT /api/payroll/:employeeId` | `PUT /api/v1/payroll/:employeeId` | Endpoint routes must match the backend controller signatures. |

---

## 4. Authentication Problems

- **Missing JWT Storage:** Authenticated tokens returned by `/api/auth/login` are not consistently stored or forwarded in subsequent request headers.
- **No Token Refresh/Verification:** The application lacks logic to check if a token has expired or handle `401 Unauthorized` responses gracefully by redirecting to login.
- **Lack of Persistent User Context:** On page reload, the application loses the logged-in user state.

---

## 5. Admin Portal Problems

- **Duplicate / Dead Pages:**
  - `AttendancePage.jsx` and `LeaveManagement.jsx` are dead files that are not registered in the router.
  - The router uses `AttendanceManagement.jsx` and `LeaveApproval.jsx` instead, which are heavily reliant on `mockService` and do not fetch real database entries.
- **Salary Update Forms:**
  - Admin payroll updates send unvalidated payloads that do not match the expected basic salary, allowances, and deductions structure of the database schema.

---

## 6. Employee Portal Problems

- **Check-in/Out State Mismatch:**
  - The dashboard uses local state to toggle check-in/out rather than querying the backend `/api/attendance/status/today` endpoint first.
- **Overlapping Leaves:**
  - Lacks frontend checks to prevent employees from applying for leave on overlapping dates.
- **Payroll Rendering:**
  - Tries to calculate net salary locally on the frontend instead of displaying the backend-calculated `netSalary` value.

---

## 7. UI/UX Problems

- **Redundant / Duplicated Components:**
  - `States.jsx` duplicates the code of `LoadingState.jsx`, `EmptyState.jsx`, and `ErrorState.jsx`.
  - Multiple sidebars (`AdminSidebar.jsx` vs `Sidebar.jsx`) duplicate navigation markup.
- **Inconsistent Status Colors:**
  - Badges use inconsistent tailwind color tokens for statuses between employee views and admin views.
- **Form Controls:**
  - Lacks consistent disabled states for read-only sections (such as employee payroll fields).

---

## 8. Responsive Problems

- **Responsive Table Overflow:**
  - Master sheets for attendance and payroll overflow horizontally on mobile screens.
- **Missing Navigation Drawer:**
  - The sidebar collapses to a tiny bar on mobile rather than opening as a sliding drawer menu.

---

## 9. Reusable Code

The following elements are well-implemented and should be retained during reconstruction:
- Tailwind form styling classes (`form-input`, `form-select`, `form-textarea`).
- UI utilities in [`dateUtils.js`](file:///d:/odoo-nmit-hackathon-2026/frontend/src/utils/dateUtils.js) and [`formatUtils.js`](file:///d:/odoo-nmit-hackathon-2026/frontend/src/utils/formatUtils.js).
- KPI Cards ([`KpiCard.jsx`](file:///d:/odoo-nmit-hackathon-2026/frontend/src/components/ui/KpiCard.jsx)) and Status Badges ([`StatusBadge.jsx`](file:///d:/odoo-nmit-hackathon-2026/frontend/src/components/ui/StatusBadge.jsx)).

---

## 10. Code to Refactor

- **`AppRouter.jsx`:** Implement route guards using a single, robust `ProtectedRoute.jsx` checking actual token context.
- **`AuthContext.jsx`:** Fully wire to the backend `/auth/login` and `/auth/me` endpoints.
- **`mockService.js`:** Convert into a clean **API Service integration layer** that requests real data from Express endpoints.
- **Sidebar Navigation:** Unify the two sidebars into a single `Sidebar.jsx` that renders links dynamically based on the logged-in user's role.

---

## 11. Code to Remove

- `frontend/src/pages/admin/AttendancePage.jsx` (Dead copy)
- `frontend/src/pages/admin/LeaveManagement.jsx` (Dead copy)
- `frontend/src/pages/auth/LoginPage.jsx` (Duplicate copy)
- `frontend/src/pages/auth/RegisterPage.jsx` (Duplicate copy)
- `frontend/src/components/ui/States.jsx` (Duplicated loading/empty states)
- `frontend/src/components/layout/AdminSidebar.jsx` (Consolidated into unified Sidebar)

---

## 12. Recommended Target Architecture

```
frontend/src/
├── app/
│   ├── App.jsx
│   └── AppRouter.jsx          # Configured with strict Auth & Role guards
├── api/
│   └── axios.js               # Centralized Axios client with token interceptors
├── context/
│   └── AuthContext.jsx        # Keeps persistent user state & validates tokens
├── components/
│   ├── layout/
│   │   ├── Layout.jsx         # Unified wrapper layout
│   │   ├── Sidebar.jsx        # Dynamic role-based navigation sidebar
│   │   └── Topbar.jsx         # Top profile info & logout controls
│   └── ui/
│       ├── Button.jsx
│       ├── Card.jsx
│       ├── DataTable.jsx      # Unified, mobile-friendly data table
│       ├── FormInput.jsx
│       ├── Modal.jsx
│       ├── States.jsx         # Consolidated Loading, Empty, and Error views
│       └── StatusBadge.jsx    # Unified color semantic badge
├── pages/
│   ├── auth/
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   ├── employee/
│   │   ├── Dashboard.jsx      # Clock-in/out form, today's status, activity
│   │   ├── Profile.jsx        # Personal profile with restricted edits
│   │   ├── Attendance.jsx     # Personal attendance history calendar/list
│   │   ├── Leave.jsx          # Leave requests & overlap validations
│   │   └── Payroll.jsx        # Read-only salary info
│   └── admin/
│       ├── AdminDashboard.jsx  # Overview statistics, pending leaves count
│       ├── EmployeeList.jsx   # Master workforce directory
│       ├── EmployeeDetail.jsx # Admin view of single employee details
│       ├── AttendanceManagement.jsx # Global logs & status filters
│       ├── LeaveApproval.jsx  # Queue of leaves with single-click decisions
│       └── PayrollManagement.jsx # Salary structure editor
└── utils/
    ├── dateUtils.js
    └── formatUtils.js
```

---

## 13. Shared Design System

- **Surfaces:** Light neutral background (`#F9FAFB`), clean white cards, thin subtle borders (`#E5E7EB`).
- **Typography:** `Inter` or default system sans-serif font family. Clear weight distinctions between titles (`font-bold text-gray-900`) and metadata labels (`font-medium text-gray-400`).
- **Badges:** Semantically colored badges matching:
  - **Success (Green):** `PRESENT`, `APPROVED`
  - **Warning (Amber):** `HALF_DAY`, `PENDING`
  - **Danger (Red):** `ABSENT`, `REJECTED`
  - **Neutral (Blue):** `LEAVE`

---

## 14. Implementation Sequence

```
┌────────────────────────────────────────────────────────────────────────┐
│ STEP 1: Implement Route Guarding & Context in AuthContext & AppRouter  │
├────────────────────────────────────────────────────────────────────────┤
│ STEP 2: Configure unified API endpoints & status case conversions      │
├────────────────────────────────────────────────────────────────────────┤
│ STEP 3: Remove duplicate files and consolidate UI components           │
├────────────────────────────────────────────────────────────────────────┤
│ STEP 4: Connect Employee portal (Check-in/out, Profile updates)        │
├────────────────────────────────────────────────────────────────────────┤
│ STEP 5: Connect Admin portal (Employee management, leave approvals)    │
├────────────────────────────────────────────────────────────────────────┤
│ STEP 6: Execute end-to-end user experience and security validation     │
└────────────────────────────────────────────────────────────────────────┘
```
