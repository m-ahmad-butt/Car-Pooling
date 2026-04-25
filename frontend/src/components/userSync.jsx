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

    useEffect(() => {
        if (isLoaded && !isSignedIn && (currentUser || profile?.email)) {
            dispatch(logoutAuth());
            dispatch(logoutUser());
            syncedEmailRef.current = null;
        }
    }, [isLoaded, isSignedIn, currentUser, profile?.email, dispatch]);

    useEffect(() => {
        const syncUser = async () => {
            if (!isLoaded || !isSignedIn || !user) {
                return;
            }
            
            const userEmail = user.primaryEmailAddress?.emailAddress;
            if (!userEmail) {
                return;
            }

            if (syncedEmailRef.current === userEmail) {
                return;
            }

            syncedEmailRef.current = userEmail;

            try {
                // First, try to get existing profile from backend
                const fullProfile = await authService.getProfile(userEmail, getToken);
                
                // Only sync basic Clerk data if profile doesn't exist or is incomplete
                const syncData = {
                    clerkId: user.id,
                    email: userEmail,
                };
                
                // Only update name if it doesn't exist in backend
                if (!fullProfile?.name) {
                    syncData.name = user.fullName;
                    syncData.firstName = user.firstName;
                    syncData.lastName = user.lastName;
                }
                
                // Only include profile fields if they exist in Redux and not in backend
                if (profile?.campus && !fullProfile?.campus) {
                    syncData.campus = profile.campus;
                }
                if (profile?.contactNo && !fullProfile?.contactNo) {
                    syncData.contactNo = profile.contactNo;
                }
                if (profile?.rollNo && !fullProfile?.rollNo) {
                    syncData.rollNo = profile.rollNo;
                }

                // Only sync if there's something to update beyond email and clerkId
                if (Object.keys(syncData).length > 2) {
                    await authService.syncUser(syncData);
                }
                
                // Fetch updated profile
                const updatedProfile = await authService.getProfile(userEmail, getToken);
                dispatch(updateProfile(updatedProfile));
                
            } catch (error) {
                // If profile doesn't exist yet, sync with Redux data
                if (error.response?.status === 404 && profile?.email) {
                    try {
                        await authService.syncUser({
                            clerkId: user.id,
                            email: userEmail,
                            name: user.fullName,
                            firstName: user.firstName,
                            lastName: user.lastName,
                            campus: profile.campus,
                            contactNo: profile.contactNo,
                            rollNo: profile.rollNo
                        });
                        
                        const newProfile = await authService.getProfile(userEmail, getToken);
                        dispatch(updateProfile(newProfile));
                    } catch (retryError) {
                        console.error('User sync failed:', retryError);
                    }
                }
            }
        };

        syncUser();
    }, [isLoaded, isSignedIn, user?.id, user?.primaryEmailAddress?.emailAddress, getToken, dispatch]);

    return null;
};

export default UserSync;
