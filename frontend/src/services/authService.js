import api from '../utils/api';

/**
 * Authentication Service
 * Handles all authentication-related API calls
 */
export const authService = {
    /**
     * Student login
     * @param {string} email - User email
     * @param {string} password - User password
     * @returns {Promise} Response with user data and token
     */
    login: async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        return response.data;
    },

    /**
     * Admin login
     * @param {string} email - Admin email
     * @param {string} password - Admin password
     * @returns {Promise} Response with admin data and token
     */
    adminLogin: async (email, password) => {
        const response = await api.post('/auth/admin/login', { email, password });
        return response.data;
    },

    /**
     * Register new user
     * @param {Object} userData - User registration data
     * @returns {Promise} Response with new user data
     */
    register: async (userData) => {
        const response = await api.post('/auth/register', userData);
        return response.data;
    },

    /**
     * Get current authenticated user
     * @returns {Promise} Current user data
     */
    getCurrentUser: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    },

    /**
     * Logout current user
     * @returns {Promise} Logout confirmation
     */
    logout: async () => {
        const response = await api.post('/auth/logout');
        return response.data;
    }
};
