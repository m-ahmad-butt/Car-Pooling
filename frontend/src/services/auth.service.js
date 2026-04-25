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
    },
    updateProfileImage: async (email, imageFile, getToken) => {
        const config = await getAuthHeaders(getToken);
        const formData = new FormData();
        formData.append('image', imageFile);
        config.headers['Content-Type'] = 'multipart/form-data';
        const response = await api.put(`/auth/profile/${email}/image`, formData, config);
        return response.data;
    },
    updateProfile: async (email, profileData, getToken) => {
        const config = await getAuthHeaders(getToken);
        const response = await api.put(`/auth/profile/${email}`, profileData, config);
        return response.data;
    }
};
