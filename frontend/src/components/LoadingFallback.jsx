import React from "react";
import { motion } from "framer-motion";

const LoadingFallback = ({ message = "Loading..." }) => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-primary-50">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="text-center space-y-4"
            >
                {/* Spinner */}
                <div className="relative w-16 h-16 mx-auto">
                    <motion.div
                        className="absolute inset-0 border-4 border-primary-200 rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                    />
                    <motion.div
                        className="absolute inset-0 border-4 border-transparent border-t-primary-600 rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{
                            duration: 0.8,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                    />
                </div>

                {/* Loading Text */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-sm font-bold text-slate-600"
                >
                    {message}
                </motion.p>
            </motion.div>
        </div>
    );
};

export default LoadingFallback;
