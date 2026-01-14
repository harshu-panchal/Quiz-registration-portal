import api from '../utils/api';

/**
 * Quiz Service
 * Handles all quiz-related API calls
 */
export const quizService = {
    /**
     * Get all quizzes with optional filters
     * @param {Object} params - Query parameters
     * @returns {Promise} Response with quizzes array
     */
    getQuizzes: async (params = {}) => {
        const response = await api.get('/quizzes', { params });
        return response.data;
    },

    /**
     * Get single quiz by ID
     * @param {string} id - Quiz ID
     * @returns {Promise} Quiz data
     */
    getQuiz: async (id) => {
        const response = await api.get(`/quizzes/${id}`);
        return response.data;
    },

    /**
     * Create new quiz
     * @param {Object} quizData - Quiz information
     * @returns {Promise} Created quiz data
     */
    createQuiz: async (quizData) => {
        const response = await api.post('/quizzes', quizData);
        return response.data;
    },

    /**
     * Update existing quiz
     * @param {string} id - Quiz ID
     * @param {Object} quizData - Updated quiz information
     * @returns {Promise} Updated quiz data
     */
    updateQuiz: async (id, quizData) => {
        const response = await api.put(`/quizzes/${id}`, quizData);
        return response.data;
    },

    /**
     * Delete quiz
     * @param {string} id - Quiz ID
     * @returns {Promise} Deletion confirmation
     */
    deleteQuiz: async (id) => {
        const response = await api.delete(`/quizzes/${id}`);
        return response.data;
    },

    /**
     * Send quiz to students
     * @param {string} id - Quiz ID
     * @param {Array} studentIds - Array of student IDs
     * @returns {Promise} Send confirmation
     */
    sendQuiz: async (id, studentIds) => {
        const response = await api.post(`/quizzes/${id}/send`, { studentIds });
        return response.data;
    },

    /**
     * Get quiz statistics
     * @param {string} id - Quiz ID
     * @returns {Promise} Quiz statistics
     */
    getQuizStats: async (id) => {
        const response = await api.get(`/quizzes/${id}/stats`);
        return response.data;
    }
};
