# **Backend API Design**

---

## **1\. Authentication APIs**

| Method | Endpoint | Access | Description |
| ----- | ----- | ----- | ----- |
| POST | /api/auth/register | Public | Register student/admin |
| POST | /api/auth/login | Public | Login & return JWT |
| GET | /api/auth/profile | Protected | Get logged-in user info |

---

## **2\. Student APIs**

### **Activity Logging**

| Method | Endpoint | Description |
| ----- | ----- | ----- |
| POST | /api/activities | Log daily activity (coding/aptitude/etc.) |
| GET | /api/activities/me | Get my activities |
| GET | /api/activities/summary?range=weekly | Weekly summary |
| GET | /api/activities/summary?range=monthly | Monthly summary |

---

### **Progress & Performance**

| Method | Endpoint | Description |
| ----- | ----- | ----- |
| GET | /api/progress/category | Category-wise performance |
| GET | /api/progress/streak | Get consistency/streak |
| GET | /api/progress/readiness | Calculate readiness score |

### 

### 

### 

### **Mock Interview**

| Method | Endpoint | Description |
| ----- | ----- | ----- |
| GET | /api/mock/eligibility | Check eligibility (based on readiness score) |
| POST | /api/mock/schedule | Request mock interview |

---

## **3\. Admin / Trainer APIs**

### **Goal Management**

| Method | Endpoint | Description |
| ----- | ----- | ----- |
| POST | /api/admin/goals | Create task/goal |
| GET | /api/admin/goals | View all goals |
| PUT | /api/admin/goals/:id | Update goal |
| DELETE | /api/admin/goals/:id | Delete goal |

---

### **Student Monitoring**

| Method | Endpoint | Description |
| ----- | ----- | ----- |
| GET | /api/admin/students | View all students |
| GET | /api/admin/student/:id | View individual progress |
| GET | /api/admin/analytics | Overall analytics (active/inactive/avg progress) |

