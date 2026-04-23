import api, { getAuthHeaders } from './api';

export const reviewService = {
    createReview: async (reviewData, getToken) => {
        const config = await getAuthHeaders(getToken);
        const response = await api.post('/reviews', reviewData, config);
        return response.data;
    },
    getReviewsByUser: async (email, getToken) => {
        const config = await getAuthHeaders(getToken);
        const response = await api.get(`/reviews/user/${email}`, config);
        return response.data;
    }
};
