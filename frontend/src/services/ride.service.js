import api, { getAuthHeaders } from './api';

export const rideService = {
    createRide: async (rideData, image, getToken) => {
        const config = await getAuthHeaders(getToken);
        
        const formData = new FormData();
        Object.keys(rideData).forEach(key => {
            formData.append(key, rideData[key]);
        });
        
        if (image) {
            formData.append('image', image);
        }
        
        config.headers['Content-Type'] = 'multipart/form-data';
        const response = await api.post('/rides', formData, config);
        return response.data;
    },
    getRides: async (filters = {}) => {
        const queryParams = new URLSearchParams();
        if (filters.search) queryParams.append('search', filters.search);
        if (filters.destination) queryParams.append('destination', filters.destination);
        if (filters.seats) queryParams.append('seats', filters.seats);
        if (filters.date) queryParams.append('date', filters.date);
        if (filters.location) queryParams.append('location', filters.location);
        if (filters.campus) queryParams.append('campus', filters.campus);
        
        const queryString = queryParams.toString();
        const url = queryString ? `/rides?${queryString}` : '/rides';
        const response = await api.get(url);
        return response.data;
    },
    getRideById: async (id) => {
        const response = await api.get(`/rides/${id}`);
        return response.data;
    },
    getMyOngoingRide: async (getToken) => {
        const config = await getAuthHeaders(getToken);
        const response = await api.get('/rides/my-ongoing', config);
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
