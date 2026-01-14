import api from '../utils/api';

export const transactionService = {
    /**
     * Get all transactions with filter and pagination
     * @param {Object} params - { type, search, page, limit }
     * @returns {Promise} Transaction data and stats
     */
    getTransactions: async (params) => {
        const response = await api.get('/transactions', { params });
        return response.data;
    },
};
