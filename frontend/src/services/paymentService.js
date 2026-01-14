import api from '../utils/api';

export const paymentService = {
    /**
     * Create Razorpay Order
     * @param {number} amount - Amount in INR
     * @returns {Promise} Order details and key_id
     */
    createOrder: async (amount) => {
        const response = await api.post('/payment/order', { amount });
        return response.data;
    }
};

export const loadRazorpay = () => {
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};
