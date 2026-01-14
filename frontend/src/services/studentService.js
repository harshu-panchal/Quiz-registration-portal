import api from '../utils/api';

/**
 * Student Service
 * Handles all student-related API calls
 */
export const studentService = {
    /**
     * Get all students with pagination and filters
     * @param {Object} params - Query parameters (page, limit, search, status, etc.)
     * @returns {Promise} Response with students array and pagination info
     */
    getStudents: async (params = {}) => {
        const response = await api.get('/students', { params });
        return response.data;
    },

    /**
     * Get single student by ID
     * @param {string} id - Student ID
     * @returns {Promise} Student data
     */
    getStudent: async (id) => {
        const response = await api.get(`/students/${id}`);
        return response.data;
    },

    /**
     * Create new student
     * @param {Object} studentData - Student information
     * @returns {Promise} Created student data
     */
    createStudent: async (studentData) => {
        const response = await api.post('/students', studentData);
        return response.data;
    },

    /**
     * Update existing student
     * @param {string} id - Student ID
     * @param {Object} studentData - Updated student information
     * @returns {Promise} Updated student data
     */
    updateStudent: async (id, studentData) => {
        const response = await api.put(`/students/${id}`, studentData);
        return response.data;
    },

    /**
     * Delete student
     * @param {string} id - Student ID
     * @returns {Promise} Deletion confirmation
     */
    deleteStudent: async (id) => {
        const response = await api.delete(`/students/${id}`);
        return response.data;
    },

    /**
     * Bulk delete students
     * @param {Array} studentIds - Array of student IDs to delete
     * @returns {Promise} Bulk deletion confirmation
     */
    bulkDelete: async (studentIds) => {
        const response = await api.post('/students/bulk/delete', { studentIds });
        return response.data;
    },

    /**
     * Bulk activate students
     * @param {Array} studentIds - Array of student IDs to activate
     * @returns {Promise} Bulk activation confirmation
     */
    bulkActivate: async (studentIds) => {
        const response = await api.post('/students/bulk/activate', { studentIds });
        return response.data;
    },

    /**
     * Export students to file
     * @param {string} format - Export format (csv, excel, etc.)
     * @returns {Promise} File blob
     */
    // Export students to CSV
    exportStudents: async () => {
        const response = await api.get('/students/export', {
            responseType: 'blob',
        });
        return response.data;
    },

    // Get student quiz statistics from Google Sheets
    getStudentStats: async (studentId) => {
        const response = await api.get(`/students/${studentId}/stats`);
        return response.data;
    },
    // Get dynamic filter options
    getFilterOptions: async () => {
        const response = await api.get('/students/filters');
        return response.data;
    },
};

export default studentService;
