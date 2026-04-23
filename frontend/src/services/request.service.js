import api, { getAuthHeaders } from './api';

export const requestService = {
    createRequest: async (requestData, getToken) => {
        const config = await getAuthHeaders(getToken);
        const response = await api.post('/requests', requestData, config);
        return response.data;
    },
    getRequestsByRide: async (rideId, getToken) => {
        const config = await getAuthHeaders(getToken);
        const response = await api.get(`/requests/ride/${rideId}`, config);
        return response.data;
    },
    updateRequestStatus: async (id, status, getToken) => {
        const config = await getAuthHeaders(getToken);
        const response = await api.patch(`/requests/${id}/status`, { status }, config);
        return response.data;
    }
};
