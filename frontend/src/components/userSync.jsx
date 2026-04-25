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

                const fullProfile = await authService.getProfile(userEmail, getToken);
                

                const syncData = {
                    clerkId: user.id,
                    email: userEmail,
                };
                

                if (!fullProfile?.name) {
                    syncData.name = user.fullName;
                    syncData.firstName = user.firstName;
                    syncData.lastName = user.lastName;
                }
                

                if (profile?.campus && !fullProfile?.campus) {
                    syncData.campus = profile.campus;
                }
                if (profile?.contactNo && !fullProfile?.contactNo) {
                    syncData.contactNo = profile.contactNo;
                }
                if (profile?.rollNo && !fullProfile?.rollNo) {
                    syncData.rollNo = profile.rollNo;
                }


                if (Object.keys(syncData).length > 2) {
                    await authService.syncUser(syncData);
                }
                

                const updatedProfile = await authService.getProfile(userEmail, getToken);
                dispatch(updateProfile(updatedProfile));
                
            } catch (error) {

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
