import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = ({ allowedRoles }) => {
    const { isAuthenticated, user, loading } = useAuth();

    if (loading) return <div>Loading...</div>;

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Check role authorization
    if (allowedRoles && !allowedRoles.includes(user?.role)) {
        // If user's role isn't allowed, redirect to correct default dashboard
        if (user?.role === 'admin' || user?.role === 'trainer') {
            return <Navigate to="/admin/dashboard" replace />;
        } else {
            return <Navigate to="/student/dashboard" replace />;
        }
    }

    return <Outlet />;
};

export default ProtectedRoute;
