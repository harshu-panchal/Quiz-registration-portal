/**
 * Global error handler for API errors
 * @param {Error} error - Error object from axios
 * @returns {Object} Formatted error with message and status
 */
export const handleApiError = (error, shouldRedirect = true) => {
    if (error.response) {
        // Server responded with error status
        const message = error.response.data?.message || 'An error occurred';
        const status = error.response.status;

        if (status === 401 && shouldRedirect) {
            // Unauthorized - clear user data and redirect to login
            localStorage.removeItem('user');
            // Normalize path by removing trailing slash for check
            const currentPath = window.location.pathname.replace(/\/+$/, '');
            if (currentPath !== '/login' && currentPath !== '/admin/login') {
                window.location.href = '/login';
            }
        }

        return { message, status };
    } else if (error.request) {
        // Request made but no response received
        return {
            message: 'Server not responding. Please check your connection and try again.',
            status: 503
        };
    } else {
        // Something else happened while setting up the request
        return {
            message: error.message || 'An unexpected error occurred',
            status: 500
        };
    }
};

/**
 * Format validation errors from backend
 * @param {Object} errors - Validation errors object
 * @returns {string} Formatted error message
 */
export const formatValidationErrors = (errors) => {
    if (typeof errors === 'string') return errors;
    if (Array.isArray(errors)) return errors.join(', ');
    if (typeof errors === 'object') {
        return Object.values(errors).flat().join(', ');
    }
    return 'Validation failed';
};
