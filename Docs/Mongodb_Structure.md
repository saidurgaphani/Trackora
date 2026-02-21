# **MongoDB Structure** 

## **📁 Database Structure Overview**

placement-tracker-db  
│  
├── users  
├── colleges  
├── activities  
├── goals  
├── goalAssignments  
├── mockInterviews  
├── readinessSnapshots (optional optimization)  
---

# **1️⃣ Colleges Collection (Multi-College Support)**

### **colleges**

{  
 \_id: ObjectId,  
 name: "SNIST",  
 location: "Hyderabad",  
 createdAt: Date  
}

👉 Why?  
 Allows scaling to multiple institutions later.

---

# **2️⃣ Users Collection (Role-Based \+ Scalable)**

### **users**

{  
 \_id: ObjectId,  
 firebaseUid: "string",  
 collegeId: ObjectId,  
 name: "string",  
 email: "string",  
 role: "student" | "admin" | "trainer",  
 profile: {  
   branch: "CSE",  
   year: 3,  
   rollNo: "21CS001"  
 },  
 isActive: true,  
 createdAt: Date,  
 updatedAt: Date  
}

### **Indexes**

firebaseUid → unique  
collegeId → index  
role → index  
collegeId \+ role → compound  
---

# **3️⃣ Activities Collection (Event-Based Design)**

Each entry \= one logged activity.

### **activities**

{  
 \_id: ObjectId,  
 userId: ObjectId,  
 collegeId: ObjectId,  
 category: "coding" | "aptitude" | "core" | "softskills",  
 subCategory: "arrays",  
 count: 3,  
 durationMinutes: 90,  
 source: "LeetCode",  
 loggedDate: Date,  
 createdAt: Date  
}

### **Index Strategy**

userId \+ loggedDate → compound  
collegeId → index  
category → index

👉 Supports:

* Weekly summary

* Category analytics

* College-level analytics

---

# **4️⃣ Goals Collection (Reusable Templates)**

### **goals**

{  
 \_id: ObjectId,  
 collegeId: ObjectId,  
 createdBy: ObjectId,  
 title: "Solve 10 Array Problems",  
 category: "coding",  
 targetCount: 10,  
 startDate: Date,  
 deadline: Date,  
 isActive: true,  
 createdAt: Date  
}  
---

# **5️⃣ GoalAssignments Collection (Scalable Assignment Model)**

Instead of embedding student IDs inside goals (bad scaling),  
 use separate collection.

### **goalAssignments**

{  
 \_id: ObjectId,  
 goalId: ObjectId,  
 studentId: ObjectId,  
 status: "pending" | "completed",  
 progress: 6,  
 completedAt: Date  
}

👉 Why?  
 Avoids large array inside goals document.  
 Better for thousands of students.

---

# **6️⃣ Mock Interviews Collection**

{  
 \_id: ObjectId,  
 studentId: ObjectId,  
 trainerId: ObjectId,  
 collegeId: ObjectId,  
 scheduledAt: Date,  
 status: "requested" | "approved" | "completed",  
 feedback: "Good problem solving",  
 score: 8  
}  
---

# **7️⃣ ReadinessSnapshots (Optional Optimization)**

Instead of calculating every time,  
 store periodic snapshots.

{  
 \_id: ObjectId,  
 studentId: ObjectId,  
 weekStartDate: Date,  
 codingScore: 45,  
 aptitudeScore: 30,  
 coreScore: 20,  
 softSkillScore: 10,  
 totalScore: 78,  
 readinessLevel: "Moderate",  
 calculatedAt: Date  
}

👉 Useful when:

* Admin dashboard needs fast loading

* Thousands of students

---

# **🔗 Relationships (Scalable Model)**

Colleges (1) \---- (many) Users  
Users (1) \---- (many) Activities  
Users (admin) \---- (many) Goals  
Goals (1) \---- (many) GoalAssignments  
Users (student) \---- (many) MockInterviews  
Users (student) \---- (many) ReadinessSnapshots  
---

# **⚡ Scalability Principles Used**

✔ Multi-tenant design (collegeId everywhere)  
 ✔ No large embedded arrays  
 ✔ Proper indexing  
 ✔ Event-based activity logging  
 ✔ Snapshot optimization for heavy dashboards  
 ✔ Role-based filtering

