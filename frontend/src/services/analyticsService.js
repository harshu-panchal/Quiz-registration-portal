import api from '../utils/api';

/**
 * Analytics Service
 * Handles all analytics-related API calls
 */
export const analyticsService = {
    /**
     * Get dashboard analytics
     * @param {string} dateRange - Date range filter (optional)
     * @returns {Promise} Dashboard analytics data
     */
    getDashboardAnalytics: async (dateRange) => {
        const response = await api.get('/analytics/dashboard', {
            params: dateRange ? { dateRange } : {}
        });
        return response.data;
    },

    /**
     * Get student statistics
     * @param {Object} params - Query parameters for filtering
     * @returns {Promise} Student statistics
     */
    getStudentStats: async (params = {}) => {
        const response = await api.get('/analytics/students', { params });
        return response.data;
    },

    /**
     * Get quiz statistics
     * @param {Object} params - Query parameters for filtering
     * @returns {Promise} Quiz statistics
     */
    getQuizStats: async (params = {}) => {
        const response = await api.get('/analytics/quizzes', { params });
        return response.data;
    }
};
