# Frontend Action Plan & TO-DO List

Based on the Frontend Design Document, Structure, and API specifications, here is a comprehensive step-by-step checklist to build out the frontend application.

## 🛠 Phase 1: Project Initialization & Setup
- [ ] **Bootstrap Project:** Initialize Vite + React project.
- [ ] **Setup Styling:** Configure Tailwind CSS (or chosen framework). Define the Design System tokens:
  - Colors (Primary `#1E3A5F`, Accent `#2E86C1`, Success `#27AE60`, Warning `#F39C12`, Danger `#E74C3C`)
  - Typography (Inter for primary headings/body, Fira Code for mono)
  - Breakpoints & Base spacing (4px unit grid)
- [ ] **Install Dependencies:**
  - Routing: `react-router-dom`
  - Forms/Validation: `react-hook-form`, `zod`, `@hookform/resolvers`
  - Fetching/State: `axios`, optionally `react-query`
  - Charts: `recharts`
  - Testing: `vitest`, `@testing-library/react`
- [ ] **Define Directory Structure:** Ensure all scaffolding `src/assets`, `src/components`, `src/context`, `src/hooks`, `src/pages`, `src/routes`, `src/services`, and `src/utils` are created according to `Frontend_Structure.md`.

## ⚙️ Phase 2: Global Configuration & Context
- [ ] **Authentication Context (`AuthContext.jsx`):**
  - Implement Global Context to store `token`, `decoded user profile` (id, name, role).
  - Add `login()`, `logout()`, and `isAuthenticated()` methods.
- [ ] **Hooks:** Create `useAuth.js` to easily consume context.
- [ ] **API Config Layer:** 
  - Create Axios instance with `baseURL`.
  - Add interceptors to automatically attach the `Authorization: Bearer <token>` header to all outgoing requests via `AuthContext`.
- [ ] **Routing Strategy (`AppRoutes.jsx`):** 
  - Map route paths to lazy-loaded components.
  - Implement `ProtectedRoute.jsx` component to gate routes relying on user role (`Student` vs `Admin`).

## 🧱 Phase 3: Reusable UI Components Library
Develop these under `src/components/`, ensuring responsive behaviors and WCAG 2.1 AA accessibility guidelines:
- [ ] `Navbar.jsx` (Top navigation with role-aware links and user logout)
- [ ] `Sidebar.jsx` (Collapsible left nav for desktop, bottom tab bar adaptation for mobile)
- [ ] `Badge.jsx` (Color-coded status labels e.g., Active/Success, Inactive/Warning)
- [ ] `Modal.jsx` (Accessible dialog wrapper with backdrop/overlay and escape-key close capability)
- [ ] `Table.jsx` (Reusable data table supporting pagination, sorting, and filtering operations)
- [ ] `StatCard.jsx` (KPI display with an icon, numeric value, label, and optional trend indicators)
- [ ] `GoalCard.jsx` (Displays goal title, deadline, progress bar, and status badge)
- [ ] `ActivityCard.jsx` (Displays single activity log entry, handling edit/delete UI states)
- [ ] `ProgressChart.jsx` (Recharts wrapper standardizing bar, line, and pie chart presentations)

## 📡 Phase 4: API Services Integration
Implement the HTTP call helpers in `src/services/` that map to the Node.js/MongoDB Backend endpoints:
- [ ] `authService.js`: `login()`, `register()`, `profile()`
- [ ] `activityService.js`: `getLogs()`, `createLog()`, `getSummary(range)`
- [ ] `goalService.js`: `getGoals()`, `createGoal()`, `updateGoal()`, `deleteGoal()`
- [ ] `adminService.js`: `getStudents()`, `getStudent(id)`, `getAnalytics()`

## 🧮 Phase 5: Utility Functions
- [ ] `readinessCalculator.js`: Logic to compute the overall Readiness Score (using the 40% Coding, 35% Aptitude, 25% Soft Skills rule) from a student's activity data array.

## 🔐 Phase 6: Public / Auth Views
Develop these under `src/pages/`:
- [ ] `Login.jsx`: Login form applying `react-hook-form` and `zod` for payload validation. Dispatch user/role upon successful token retrieval.
- [ ] `Register.jsx`: Multi-role registration interface.

## 🎓 Phase 7: Student Portal Views
- [ ] `Dashboard.jsx`: Welcome banner, overall structural layout, rendering `StatCard` usage for readiness score, and displaying an upcoming goals rundown.
- [ ] `ActivityLog.jsx`: Form to log new activities (using categories like 'coding', 'aptitude', 'softskills') alongside a timeline feed mapped to `ActivityCard`.
- [ ] `Progress.jsx`: Category-wise breakdown using `ProgressChart.jsx` reflecting consistency and readiness scoring over intervals.
- [ ] `MockInterview.jsx`: Component to check mock interview eligibility based off readiness score, and functionality to request an interview from the trainer.

## 👑 Phase 8: Admin & Trainer Portal Views
- [ ] `AdminDashboard.jsx`: Overall organization analytics, displaying active student counts, system-wide readiness averages, and aggregate stats via `ProgressChart` and `StatCard`.
- [ ] `ManageGoals.jsx`: Admin capabilities to assign system goals to students/batches, coupled with a table filtering active/expired assignments via `Table.jsx`.
- [ ] `StudentsList.jsx`: Searchable and filterable master view mapping the `/admin/students` API route into a data table. Implement bulk CSV export functionality.
- [ ] `StudentDetails.jsx`: Full drill-down modal/page (`/admin/students/:id`) rendering the individual student’s assigned timeline, readiness scores, category charts, and functionality to add trainer notes.

## ✨ Phase 9: Refinement & Non-Functional Testing
- [ ] **Performance:** Introduce React Lazy/Suspense for code-splitting routes. Address any re-render optimization needed in state-heavy lists (e.g. Activity feed).
- [ ] **Loading & Error States:** Implement UI skeletons for data fetching and robust Error Boundaries or Error toast notifications.
- [ ] **Responsive Audit:** Guarantee "mobile-first" layouts scale correctly to the `1200px` desktop breakpoint and the sidebar safely transitions to mobile tabs.
- [ ] **Unit Testing:** Write fundamental unit tests (e.g. `readinessCalculator.js`) and vital component tests using Vitest + RTL.
