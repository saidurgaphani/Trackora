**Frontend Structure**  
src/  
│  
├── assets/                \# Images, icons  
│  
├── components/            \# Reusable UI components  
│   ├── Navbar.jsx  
│   ├── Sidebar.jsx  
│   ├── ActivityCard.jsx  
│   ├── ProgressChart.jsx  
│   ├── GoalCard.jsx  
│   └── ProtectedRoute.jsx  
│  
├── pages/                 \# Page-level components  
│   ├── Login.jsx  
│   ├── Register.jsx  
│   │  
│   ├── student/  
│   │   ├── Dashboard.jsx  
│   │   ├── ActivityLog.jsx  
│   │   ├── Progress.jsx  
│   │   ├── MockInterview.jsx  
│   │  
│   ├── admin/  
│   │   ├── AdminDashboard.jsx  
│   │   ├── ManageGoals.jsx  
│   │   ├── StudentsList.jsx  
│   │   ├── StudentDetails.jsx  
│  
├── services/              \# API calls  
│   ├── authService.js  
│   ├── activityService.js  
│   ├── goalService.js  
│   └── adminService.js  
│  
├── context/               \# Global state  
│   └── AuthContext.jsx  
│  
├── hooks/                 \# Custom hooks  
│   └── useAuth.js  
│  
├── utils/  
│   └── readinessCalculator.js  
│  
├── routes/  
│   └── AppRoutes.jsx  
│  
├── App.jsx  
└── main.jsx