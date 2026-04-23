import { useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useSelector } from 'react-redux';
import { authService } from '../services/auth.service';

const UserSync = () => {
    const { isLoaded, isSignedIn, user } = useUser();
    const profile = useSelector((state) => state.user.profile);

    useEffect(() => {
        const syncUser = async () => {
            console.log('UserSync state:', { isLoaded, isSignedIn, userId: user?.id });
            if (isLoaded && isSignedIn && user && !profile._id) {
                try {
                    const response = await authService.syncUser({
                        clerkId: user.id,
                        email: user.primaryEmailAddress?.emailAddress,
                        name: user.fullName,
                        firstName: user.firstName || profile?.firstName,
                        lastName: user.lastName || profile?.lastName,
                        campus: profile?.campus,
                        contactNo: profile?.contactNo,
                        rollNo: profile?.rollNo
                    });
                    console.log('User synced with backend success:', response);
                } catch (error) {
                    console.error('Failed to sync user error:', error?.response?.data || error?.message);
                }
            }
        };

        syncUser();
    }, [isLoaded, isSignedIn, user?.id]);

    return null;
};

export default UserSync;
