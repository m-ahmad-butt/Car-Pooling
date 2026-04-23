import api, { getAuthHeaders } from './api';

export const authService = {
    syncUser: async (userData) => {
        const response = await api.post('/auth/sync', userData);
        return response.data;
    },
    getProfile: async (email, getToken) => {
        const config = await getAuthHeaders(getToken);
        const response = await api.get(`/auth/profile/${email}`, config);
        return response.data;
    }
};
