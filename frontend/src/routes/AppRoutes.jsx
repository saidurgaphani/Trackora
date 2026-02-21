import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import Layout from '../components/Layout';

// Lazy loaded pages
const Landing = lazy(() => import('../pages/Landing'));
const Login = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));
const StudentDashboard = lazy(() => import('../pages/student/Dashboard'));
const ActivityLog = lazy(() => import('../pages/student/ActivityLog'));
const Progress = lazy(() => import('../pages/student/Progress'));
const MockInterview = lazy(() => import('../pages/student/MockInterview'));
const MyCourses = lazy(() => import('../pages/student/MyCourses'));
const Learning = lazy(() => import('../pages/student/Learning'));
const Resources = lazy(() => import('../pages/student/Resources'));
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'));
const ManageGoals = lazy(() => import('../pages/admin/ManageGoals'));
const StudentsList = lazy(() => import('../pages/admin/StudentsList'));
const StudentDetails = lazy(() => import('../pages/admin/StudentDetails'));
const Profile = lazy(() => import('../pages/student/Profile'));

const AppRoutes = () => {
    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
            <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Default root Landing page */}
                <Route path="/" element={<Landing />} />

                {/* Student Routes */}
                <Route element={<ProtectedRoute allowedRoles={['student']} />}>
                    <Route element={<Layout />}>
                        <Route path="/student/dashboard" element={<StudentDashboard />} />
                        <Route path="/student/profile" element={<Profile />} />
                        <Route path="/student/courses" element={<MyCourses />} />
                        <Route path="/student/resources" element={<Resources />} />
                        <Route path="/student/learning/:courseId" element={<Learning />} />
                        <Route path="/student/activity-log" element={<ActivityLog />} />
                        <Route path="/student/progress" element={<Progress />} />
                        <Route path="/student/mock-interview" element={<MockInterview />} />
                    </Route>
                </Route>

                {/* Admin / Trainer Routes */}
                <Route element={<ProtectedRoute allowedRoles={['admin', 'trainer']} />}>
                    <Route element={<Layout />}>
                        <Route path="/admin/dashboard" element={<AdminDashboard />} />
                        <Route path="/admin/profile" element={<Profile />} />
                        <Route path="/admin/manage-goals" element={<ManageGoals />} />
                        <Route path="/admin/students" element={<StudentsList />} />
                        <Route path="/admin/students/:id" element={<StudentDetails />} />
                    </Route>
                </Route>

                {/* Catch all */}
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </Suspense>
    );
};

export default AppRoutes;
