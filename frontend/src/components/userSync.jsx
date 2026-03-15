import { useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useSelector } from 'react-redux';
import axios from 'axios';

const UserSync = () => {
    const { isLoaded, isSignedIn, user } = useUser();
    const profile = useSelector((state) => state.user.profile);

    useEffect(() => {
        const syncUser = async () => {
            console.log('UserSync state:', { isLoaded, isSignedIn, userId: user?.id });
            if (isLoaded && isSignedIn && user) {
                try {
                    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
                    console.log('Syncing user with URL:', `${apiUrl}/auth/sync`, {
                        clerkId: user.id,
                        email: user.primaryEmailAddress?.emailAddress,
                        name: user.fullName
                    });
                    const response = await axios.post(`${apiUrl}/auth/sync`, {
                        clerkId: user.id,
                        email: user.primaryEmailAddress?.emailAddress,
                        name: user.fullName,
                        firstName: user.firstName || profile?.firstName,
                        lastName: user.lastName || profile?.lastName,
                        campus: profile?.campusId,
                        contactNo: profile?.contactNo,
                        rollNo: profile?.rollNo
                    });
                    console.log('User synced with backend success:', response.data);
                } catch (error) {
                    console.error('Failed to sync user error:', error.response?.data || error.message);
                }
            }
        };

        syncUser();
    }, [isLoaded, isSignedIn, user, profile]);

    return null;
};

export default UserSync;
