import api, { getAuthHeaders } from './api';

export const requestService = {
    createBooking: async (bookingData, getToken) => {
        const config = await getAuthHeaders(getToken);
        const response = await api.post('/bookings', bookingData, config);
        return response.data;
    },
    getMyBookings: async (getToken) => {
        const config = await getAuthHeaders(getToken);
        const response = await api.get('/bookings/my-bookings', config);
        return response.data;
    },
    getMyRideRequests: async (getToken) => {
        const config = await getAuthHeaders(getToken);
        const response = await api.get('/bookings/my-ride-requests', config);
        return response.data;
    },
    getBookingsByRide: async (rideId, getToken) => {
        const config = await getAuthHeaders(getToken);
        const response = await api.get(`/bookings/ride/${rideId}`, config);
        return response.data;
    },
    updateBookingStatus: async (id, status, getToken) => {
        const config = await getAuthHeaders(getToken);
        const response = await api.patch(`/bookings/${id}/status`, { status }, config);
        return response.data;
    }
};
