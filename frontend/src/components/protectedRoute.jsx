import { Navigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { useDispatch, useSelector } from 'react-redux';
import { setProfileFromAuth } from '../features/userSlice';
import { useEffect } from 'react';

const ProtectedRoute = ({ children }) => {
    const { isLoaded, isSignedIn, user } = useUser();
    const dispatch = useDispatch();
    const profile = useSelector(state => state.user.profile);

    useEffect(() => {
        if (isSignedIn && user && !profile.name) {
            dispatch(setProfileFromAuth({
                firstName: user.firstName || 'User',
                lastName: user.lastName || '',
                email: user.primaryEmailAddress?.emailAddress,
                campusId: user.unsafeMetadata?.campusId || 'NUCES',
                contactNo: user.unsafeMetadata?.contactNo || '00000000000',
                rollNo: user.unsafeMetadata?.rollNo || 'N/A'
            }));
        }
    }, [isSignedIn, user, profile.name, dispatch]);

    if (!isLoaded) {
        return <div className="flex items-center justify-center min-h-screen font-black text-gray-400">Loading profile...</div>;
    }

    if (!isSignedIn) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
