import { Navigate } from 'react-router-dom';
import { useUser, useAuth } from '@clerk/clerk-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfileAsync } from '../features/userSlice';
import { useEffect } from 'react';

const ProtectedRoute = ({ children }) => {
    const { isLoaded, isSignedIn, user } = useUser();
    const { getToken } = useAuth();
    const dispatch = useDispatch();
    const profile = useSelector(state => state.user.profile);

    useEffect(() => {
        if (isSignedIn && user && !profile.name) {
            dispatch(fetchProfileAsync({ 
                email: user.primaryEmailAddress?.emailAddress, 
                getToken 
            }));
        }
    }, [isSignedIn, user, profile.name, dispatch, getToken]);

    if (!isLoaded) {
        return <div className="flex items-center justify-center min-h-screen font-black text-gray-400">Loading profile...</div>;
    }

    if (!isSignedIn) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
