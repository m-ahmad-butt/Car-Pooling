import { useEffect, useRef } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import { useDispatch, useSelector } from 'react-redux';
import { logoutAuth } from '../features/authSlice';
import { logoutUser, updateProfile } from '../features/userSlice';
import { authService } from '../services/auth.service';

const UserSync = () => {
    const { isLoaded, isSignedIn, user } = useUser();
    const { getToken } = useAuth();
    const dispatch = useDispatch();
    const currentUser = useSelector((state) => state.auth.currentUser);
    const profile = useSelector((state) => state.user.profile);
    const syncedEmailRef = useRef(null);

    // Handle logout
    useEffect(() => {
        if (isLoaded && !isSignedIn && (currentUser || profile?.email)) {
            dispatch(logoutAuth());
            dispatch(logoutUser());
            syncedEmailRef.current = null;
        }
    }, [isLoaded, isSignedIn, currentUser, profile?.email, dispatch]);

    // Handle login and sync
    useEffect(() => {
        const syncUser = async () => {
            if (!isLoaded || !isSignedIn || !user) {
                return;
            }
            
            const userEmail = user.primaryEmailAddress?.emailAddress;
            if (!userEmail) {
                return;
            }

            // Prevent duplicate syncs for the same email
            if (syncedEmailRef.current === userEmail) {
                return;
            }

            syncedEmailRef.current = userEmail;

            try {
                // Sync with backend
                const syncResponse = await authService.syncUser({
                    clerkId: user.id,
                    email: userEmail,
                    name: user.fullName,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    campus: profile?.campus || '',
                    contactNo: profile?.contactNo || '',
                    rollNo: profile?.rollNo || ''
                });

                // Fetch full profile from backend
                const fullProfile = await authService.getProfile(userEmail, getToken);
                
                // Update Redux state
                dispatch(updateProfile(fullProfile));
                
            } catch (error) {
                // Silent fail - user can manually refresh if needed
            }
        };

        syncUser();
    }, [isLoaded, isSignedIn, user?.id, user?.primaryEmailAddress?.emailAddress, getToken, dispatch]);

    return null;
};

export default UserSync;
