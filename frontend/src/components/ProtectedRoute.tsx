import { Navigate } from 'react-router-dom';
import { getUser, isAdmin } from '../utils/auth';

interface Props {
    children: React.ReactNode;
    adminOnly?: boolean;
}

const ProtectedRoute = ({ children, adminOnly = false }: Props) => {
    const user = getUser();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (adminOnly && !isAdmin()) {
        return <Navigate to="/problems" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;