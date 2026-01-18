import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
import checkMotionAnimation from '../assets/animations/Check Motion.json';

const PaymentSuccessAnimation = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const studentData = location.state?.studentData;

    useEffect(() => {
        // If no student data, redirect to home
        if (!studentData) {
            navigate('/');
            return;
        }

        // Redirect to thank you page after animation (3 seconds)
        const timer = setTimeout(() => {
            navigate('/thank-you', { state: { studentData }, replace: true });
        }, 3000);

        return () => clearTimeout(timer);
    }, [navigate, studentData]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-4">
            {/* Animated Background Gradient */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute inset-0 bg-gradient-to-r from-green-200/20 via-emerald-200/20 to-teal-200/20 blur-3xl"
            />

            {/* Success Animation Container */}
            <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                    type: 'spring',
                    stiffness: 200,
                    damping: 20,
                    duration: 0.6,
                }}
                className="relative z-10 flex flex-col items-center"
            >
                {/* Lottie Animation */}
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                    className="w-64 h-64 md:w-80 md:h-80"
                >
                    <Lottie
                        animationData={checkMotionAnimation}
                        loop={true}
                        style={{ width: '100%', height: '100%' }}
                    />
                </motion.div>

                {/* Success Text */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="mt-6 text-center"
                >
                    <h1 className="text-4xl md:text-5xl font-black text-green-600 mb-3">
                        Payment Successful!
                    </h1>
                    <p className="text-lg text-slate-600 font-medium">
                        Processing your registration...
                    </p>

                    {/* Loading Dots */}
                    <motion.div className="flex items-center justify-center gap-2 mt-4">
                        {[0, 1, 2].map((index) => (
                            <motion.div
                                key={index}
                                className="w-2 h-2 bg-green-500 rounded-full"
                                animate={{
                                    scale: [1, 1.5, 1],
                                    opacity: [0.5, 1, 0.5],
                                }}
                                transition={{
                                    duration: 1,
                                    repeat: Infinity,
                                    delay: index * 0.2,
                                }}
                            />
                        ))}
                    </motion.div>
                </motion.div>

                {/* Decorative Elements */}
                <motion.div
                    animate={{
                        rotate: [0, 360],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: 'linear',
                    }}
                    className="absolute -z-10 w-96 h-96 bg-gradient-to-r from-green-200/20 to-emerald-200/20 rounded-full blur-3xl"
                />
            </motion.div>
        </div>
    );
};

export default PaymentSuccessAnimation;
