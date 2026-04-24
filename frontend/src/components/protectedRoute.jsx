import { Navigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';

const ProtectedRoute = ({ children }) => {
    const { isLoaded, isSignedIn } = useUser();

    if (!isLoaded) {
        return <div className="flex items-center justify-center min-h-screen font-black text-gray-400">Loading...</div>;
    }

    if (!isSignedIn) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
