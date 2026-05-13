import { Navigate } from 'react-router-dom';
import { getUser, isAdmin } from '../utils/auth';

interface Props {
    children: React.ReactNode;
    adminOnly?: boolean;
    userOnly?: boolean;
}

const ProtectedRoute = ({ children, adminOnly = false, userOnly = false }: Props) => {
    const user = getUser();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (adminOnly && !isAdmin()) {
        return <Navigate to="/home" replace />;
    }

    if (userOnly && isAdmin()) {
        return <Navigate to="/admin" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;