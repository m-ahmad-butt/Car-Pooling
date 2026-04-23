import api, { getAuthHeaders } from './api';

export const rideService = {
    createRide: async (rideData, getToken) => {
        const config = await getAuthHeaders(getToken);
        const response = await api.post('/rides', rideData, config);
        return response.data;
    },
    getRides: async (getToken) => {
        const config = await getAuthHeaders(getToken);
        const response = await api.get('/rides', config);
        return response.data;
    },
    updateRide: async (id, updateData, getToken) => {
        const config = await getAuthHeaders(getToken);
        const response = await api.put(`/rides/${id}`, updateData, config);
        return response.data;
    },
    deleteRide: async (id, getToken) => {
        const config = await getAuthHeaders(getToken);
        const response = await api.delete(`/rides/${id}`, config);
        return response.data;
    }
};
