import { useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';

const UserSync = () => {
    const { isLoaded, isSignedIn, user } = useUser();

    useEffect(() => {
        const syncUser = async () => {
            if (isLoaded && isSignedIn && user) {
                try {
                    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
                    await axios.post(`${apiUrl}/auth/sync`, {
                        clerkId: user.id,
                        email: user.primaryEmailAddress?.emailAddress,
                        name: user.fullName
                    });
                    console.log('User synced with backend');
                } catch (error) {
                    console.error('Failed to sync user:', error);
                }
            }
        };

        syncUser();
    }, [isLoaded, isSignedIn, user]);

    return null;
};

export default UserSync;
