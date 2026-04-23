import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getAuthHeaders = async (getToken) => {
    if (!getToken) return {};
    try {
        const token = await getToken();
        return {
            headers: { Authorization: `Bearer ${token}` }
        };
    } catch (error) {
        return {};
    }
};

export default api;
