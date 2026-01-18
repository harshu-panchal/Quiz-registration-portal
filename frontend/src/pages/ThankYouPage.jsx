import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
import {
    CheckCircle2,
    User,
    Mail,
    Phone,
    School,
    MapPin,
    Calendar,
    CreditCard,
    Download,
    GraduationCap,
    Sparkles,
    ArrowLeft,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

// Import Lottie animations
import confettiAnimation from '../assets/animations/Confetti.json';

const ThankYouPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useLanguage();
    const studentData = location.state?.studentData;

    // Redirect if no data
    if (!studentData) {
        navigate('/');
        return null;
    }

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-blue-50 flex items-center justify-center p-4 selection:bg-primary-100 selection:text-primary-700">
            {/* Background Decor */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                {/* Confetti Animation */}
                <div className="absolute inset-0 opacity-20">
                    <Lottie
                        animationData={confettiAnimation}
                        loop={true}
                        style={{ width: '100%', height: '100%' }}
                    />
                </div>

                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.1, 0.2, 0.1],
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute top-[-10%] right-[-10%] w-[30%] h-[30%] bg-primary-200/20 rounded-full blur-[100px]"
                />
                <motion.div
                    animate={{
                        scale: [1.2, 1, 1.2],
                        opacity: [0.1, 0.15, 0.1],
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-blue-200/10 rounded-full blur-[100px]"
                />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-3xl relative z-10">

                {/* Success Header */}
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                    className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6 relative">
                        <CheckCircle2 className="w-12 h-12 text-green-600" />
                    </div>

                    <motion.h1
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-4xl font-black text-slate-900 mb-3 tracking-tight">
                        {t('registration_successful') || 'Registration Successful!'}
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-slate-600 font-medium max-w-md mx-auto">
                        {t('thank_you_message') || 'Thank you for registering! Your payment has been confirmed and your details have been saved.'}
                    </motion.p>
                </motion.div>

                {/* Student Details Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="glass-card rounded-3xl p-8 shadow-2xl border border-white/60 mb-6">

                    <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-100">
                        <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                            <GraduationCap className="w-5 h-5 text-primary-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-900 tracking-tight">
                                {t('student_details') || 'Student Details'}
                            </h2>
                            <p className="text-xs text-slate-500 font-medium">
                                {t('registration_confirmation') || 'Your registration confirmation'}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <DetailItem icon={User} label={t('name') || 'Name'} value={studentData.name} />
                        <DetailItem icon={Mail} label={t('email') || 'Email'} value={studentData.email} />
                        <DetailItem icon={Phone} label={t('phone') || 'Phone'} value={studentData.phone} />
                        <DetailItem icon={School} label={t('school') || 'School'} value={studentData.school} />
                        <DetailItem icon={GraduationCap} label={t('class') || 'Class'} value={studentData.class} />
                        <DetailItem icon={Calendar} label={t('age') || 'Age'} value={`${studentData.age} years`} />
                        <DetailItem
                            icon={MapPin}
                            label={t('location') || 'Location'}
                            value={`${studentData.city}, ${studentData.state}`}
                        />
                        <DetailItem icon={User} label={t('gender') || 'Gender'} value={studentData.gender} />
                    </div>

                    {/* Payment Info */}
                    {studentData.paymentId && (
                        <div className="pt-6 border-t border-slate-100">
                            <div className="flex items-center gap-2 mb-4">
                                <CreditCard className="w-4 h-4 text-green-600" />
                                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                                    {t('payment_details') || 'Payment Details'}
                                </h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="p-3 bg-green-50 rounded-xl border border-green-100">
                                    <p className="text-[10px] font-bold text-green-600 uppercase tracking-wider mb-1">
                                        {t('payment_id') || 'Payment ID'}
                                    </p>
                                    <p className="text-xs font-mono text-green-900 break-all">
                                        {studentData.paymentId}
                                    </p>
                                </div>
                                <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                                    <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-1">
                                        {t('order_id') || 'Order ID'}
                                    </p>
                                    <p className="text-xs font-mono text-blue-900 break-all">
                                        {studentData.orderId}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="flex flex-col sm:flex-row gap-4 print:hidden">
                    <button
                        onClick={handlePrint}
                        className="flex-1 btn-modern-primary flex items-center justify-center gap-2 py-3">
                        <Download className="w-4 h-4" />
                        {t('download_print') || 'Download / Print'}
                    </button>
                    <button
                        onClick={() => navigate('/')}
                        className="flex-1 bg-white border-2 border-slate-200 text-slate-900 font-black text-sm px-6 py-3 rounded-xl hover:border-primary-300 hover:bg-primary-50 transition-all duration-200 flex items-center justify-center gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        {t('back_to_home') || 'Back to Home'}
                    </button>
                </motion.div>

                {/* Footer Note */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="mt-8 p-6 bg-amber-50 border border-amber-100 rounded-2xl print:hidden">
                    <div className="flex items-start gap-3">
                        <Sparkles className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <h4 className="text-sm font-black text-amber-900 mb-1">
                                {t('next_steps') || 'What\'s Next?'}
                            </h4>
                            <p className="text-xs text-amber-700 leading-relaxed">
                                {t('next_steps_desc') || 'You will receive a confirmation email shortly with further instructions. Please keep this confirmation safe for your records. For any queries, contact our support team.'}
                            </p>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};

// Helper component for detail items
const DetailItem = ({ icon: Icon, label, value }) => (
    <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-primary-200 transition-colors">
        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
            <Icon className="w-4 h-4 text-primary-600" />
        </div>
        <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                {label}
            </p>
            <p className="text-sm font-bold text-slate-900 truncate">
                {value}
            </p>
        </div>
    </div>
);

export default ThankYouPage;
