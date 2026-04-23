import api, { getAuthHeaders } from './api';

export const notificationService = {
    createNotification: async (notificationData, getToken) => {
        const config = await getAuthHeaders(getToken);
        const response = await api.post('/notifications', notificationData, config);
        return response.data;
    },
    getNotifications: async (email, getToken) => {
        const config = await getAuthHeaders(getToken);
        const response = await api.get(`/notifications/${email}`, config);
        return response.data;
    },
    clearNotifications: async (email, getToken) => {
        const config = await getAuthHeaders(getToken);
        const response = await api.delete(`/notifications/${email}`, config);
        return response.data;
    }
};
