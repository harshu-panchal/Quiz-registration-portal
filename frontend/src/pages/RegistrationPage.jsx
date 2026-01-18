import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    GraduationCap,
    User,
    Mail,
    Phone,
    School,
    MapPin,
    Calendar,
    ArrowRight,
    AlertCircle,
    Loader2,
    CreditCard,
    CheckCircle2,
    ChevronLeft,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import LanguageToggle from "../components/LanguageToggle";
import { studentService } from "../services/studentService";
import { paymentService } from "../services/paymentService";
import { handleApiError } from "../utils/errorHandler";
import { indianStatesCities } from "../data/indianStatesCities";

// Registration form validation schema
const registrationSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    school: z.string().min(2, "School name is required"),
    class: z.string().min(1, "Class/Grade is required").refine(
        (val) => {
            const classNum = parseInt(val) || parseInt(val.match(/\d+/)?.[0] || "0");
            return classNum >= 5 && classNum <= 10;
        },
        { message: "Only students from Class 5 to 10 can register" }
    ),
    city: z.string().min(2, "City is required"),
    state: z.string().min(2, "State is required"),
    age: z.coerce.number()
        .min(5, "Age must be at least 5")
        .max(15, "Age must be 15 or below by 2026"),
    gender: z.enum(["Male", "Female", "Other"], { required_error: "Please select a gender" }),
});

const RegistrationPage = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState("");
    const [selectedState, setSelectedState] = useState("");
    const [availableCities, setAvailableCities] = useState([]);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(registrationSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            school: "",
            class: "",
            city: "",
            state: "",
            age: "",
            gender: "",
        },
    });

    const REGISTRATION_FEE = 500; // Amount in INR

    const handleRegistration = async (data) => {
        try {
            setLoading(true);
            setApiError("");

            // Step 1: Create Razorpay order
            const orderData = await paymentService.createOrder(REGISTRATION_FEE);

            // Step 2: Open Razorpay payment gateway
            const options = {
                key: orderData.key_id,
                amount: orderData.order.amount,
                currency: orderData.order.currency,
                name: "EduPortal Quiz Registration",
                description: "Quiz Registration Fee",
                order_id: orderData.order.id,
                handler: async function (response) {
                    try {
                        // Step 3: Register student with payment details
                        const registrationData = {
                            ...data,
                            paymentId: response.razorpay_payment_id,
                            orderId: response.razorpay_order_id,
                            signature: response.razorpay_signature,
                            amount: REGISTRATION_FEE,
                        };

                        const result = await studentService.registerStudent(registrationData);

                        // Step 4: Redirect to payment success animation page
                        navigate("/payment-success", {
                            state: { studentData: result.data },
                        });
                    } catch (error) {
                        const errorInfo = handleApiError(error, false);
                        setApiError(errorInfo.message);
                        setLoading(false);
                    }
                },
                prefill: {
                    name: data.name,
                    email: data.email,
                    contact: data.phone,
                },
                theme: {
                    color: "#4F46E5",
                },
                modal: {
                    ondismiss: function () {
                        setLoading(false);
                    },
                },
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } catch (error) {
            const errorInfo = handleApiError(error, false);
            setApiError(errorInfo.message);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-50 flex flex-col selection:bg-primary-100 selection:text-primary-700">
            {/* Background Decor */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.15, 0.25, 0.15],
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[-10%] right-[-10%] w-[30%] h-[30%] bg-primary-200/20 rounded-full blur-[100px]"
                />
                <motion.div
                    animate={{
                        scale: [1.2, 1, 1.2],
                        opacity: [0.1, 0.2, 0.1],
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-blue-200/10 rounded-full blur-[100px]"
                />
            </div>

            {/* Navbar */}
            <motion.nav
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="h-16 glass-card sticky top-0 z-50 px-6 lg:px-12 flex items-center justify-between border-b-0 m-4 rounded-2xl shadow-soft">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20">
                        <GraduationCap className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-lg font-black tracking-tighter text-slate-900 uppercase">
                        EduPortal
                    </span>
                </div>

                <div className="flex items-center gap-4">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-slate-400 font-bold text-xs hover:text-primary-600 transition-colors">
                        <ChevronLeft className="w-3.5 h-3.5" />
                        {t('back_to_home')}
                    </Link>
                    <LanguageToggle />
                </div>
            </motion.nav>

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center px-6 py-8 relative z-10">
                <div className="w-full max-w-4xl">
                    {/* Hero Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-8">
                        <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-4">
                            {t("register_for_quiz") || "Register for the "}
                            <span className="text-primary-600">Quiz Competition</span>
                        </h1>

                        <p className="text-slate-600 font-medium max-w-2xl mx-auto text-lg">
                            {t("registration_desc") ||
                                "Fill out the form below to secure your spot in our upcoming quiz competition. Payment required to complete registration."}
                        </p>
                    </motion.div>

                    {/* Registration Form Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="glass-card rounded-3xl p-8 lg:p-12 shadow-2xl border border-white/60 mb-8">

                        {/* Form Header */}
                        <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-100">
                            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                                <User className="w-6 h-6 text-primary-600" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                                    {t("registration_form") || "Registration Form"}
                                </h2>
                                <p className="text-sm text-slate-500 font-medium">
                                    {t("fill_details") || "Please fill in all your details accurately"}
                                </p>
                            </div>
                        </div>

                        {/* Error Message */}
                        {apiError && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3 mb-6">
                                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-red-900">
                                        {t("registration_failed") || "Registration Failed"}
                                    </p>
                                    <p className="text-sm text-red-700 mt-1">{apiError}</p>
                                </div>
                            </motion.div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleSubmit(handleRegistration)} className="space-y-6">
                            {/* Personal Information */}
                            <div className="space-y-5">
                                <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                    <User className="w-4 h-4" />
                                    {t("personal_info") || "Personal Information"}
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <FormField
                                        label={t("full_name") || "Full Name"}
                                        icon={User}
                                        error={errors.name}
                                        placeholder="John Doe"
                                        {...register("name")}
                                    />

                                    <FormField
                                        label={t("email") || "Email Address"}
                                        type="email"
                                        icon={Mail}
                                        error={errors.email}
                                        placeholder="john@example.com"
                                        {...register("email")}
                                    />

                                    <FormField
                                        label={t("phone") || "Phone Number"}
                                        icon={Phone}
                                        error={errors.phone}
                                        placeholder="+91 9876543210"
                                        {...register("phone")}
                                    />

                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                                            {t("gender") || "Gender"}
                                        </label>
                                        <div className="relative">
                                            <select
                                                className={`modern-input !pl-10 ${errors.gender ? "!border-red-200 !bg-red-50/50" : ""
                                                    }`}
                                                {...register("gender")}>
                                                <option value="">Select Gender</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Other">Other</option>
                                            </select>
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 pointer-events-none" />
                                        </div>
                                        {errors.gender && (
                                            <p className="text-xs text-red-500 font-bold flex items-center gap-1 ml-1">
                                                <AlertCircle className="w-3 h-3" />
                                                {errors.gender.message}
                                            </p>
                                        )}
                                    </div>

                                    <FormField
                                        label={t("age") || "Age"}
                                        type="number"
                                        icon={Calendar}
                                        error={errors.age}
                                        placeholder="15"
                                        {...register("age")}
                                    />
                                </div>
                            </div>

                            {/* Academic Information */}
                            <div className="space-y-5 pt-6 border-t border-slate-100">
                                <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                    <School className="w-4 h-4" />
                                    {t("academic_info") || "Academic Information"}
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <FormField
                                        label={t("school") || "School Name"}
                                        icon={School}
                                        error={errors.school}
                                        placeholder="ABC High School"
                                        {...register("school")}
                                    />

                                    <FormField
                                        label={t("class") || "Class/Grade"}
                                        icon={GraduationCap}
                                        error={errors.class}
                                        placeholder="10th Grade"
                                        {...register("class")}
                                    />
                                </div>
                            </div>

                            {/* Location Information */}
                            <div className="space-y-5 pt-6 border-t border-slate-100">
                                <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                    <MapPin className="w-4 h-4" />
                                    {t("location_info") || "Location"}
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {/* State Dropdown */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">
                                            {t("state") || "State"}
                                        </label>
                                        <div className="relative">
                                            <select
                                                className={`w-full px-4 py-3 pl-10 bg-white/80 backdrop-blur-sm border-2 ${errors.state
                                                    ? "border-red-300 focus:border-red-500"
                                                    : "border-slate-200 focus:border-primary-500"
                                                    } rounded-xl text-sm text-slate-700 font-medium transition-all shadow-sm hover:shadow-md focus:shadow-md focus:outline-none appearance-none`}
                                                {...register("state")}
                                                onChange={(e) => {
                                                    const state = e.target.value;
                                                    setSelectedState(state);
                                                    setAvailableCities(indianStatesCities[state] || []);
                                                    // Reset city when state changes
                                                    document.querySelector('[name="city"]').value = '';
                                                }}
                                            >
                                                <option value="">Select State</option>
                                                {Object.keys(indianStatesCities).map((state) => (
                                                    <option key={state} value={state}>
                                                        {state}
                                                    </option>
                                                ))}
                                            </select>
                                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 pointer-events-none" />
                                        </div>
                                        {errors.state && (
                                            <p className="text-xs text-red-500 font-bold flex items-center gap-1 ml-1">
                                                <AlertCircle className="w-3 h-3" />
                                                {errors.state.message}
                                            </p>
                                        )}
                                    </div>

                                    {/* City Dropdown */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">
                                            {t("city") || "City"}
                                        </label>
                                        <div className="relative">
                                            <select
                                                className={`w-full px-4 py-3 pl-10 bg-white/80 backdrop-blur-sm border-2 ${errors.city
                                                    ? "border-red-300 focus:border-red-500"
                                                    : "border-slate-200 focus:border-primary-500"
                                                    } rounded-xl text-sm text-slate-700 font-medium transition-all shadow-sm hover:shadow-md focus:shadow-md focus:outline-none appearance-none`}
                                                {...register("city")}
                                                disabled={!selectedState}
                                            >
                                                <option value="">
                                                    {selectedState ? "Select City" : "Select State First"}
                                                </option>
                                                {availableCities.map((city) => (
                                                    <option key={city} value={city}>
                                                        {city}
                                                    </option>
                                                ))}
                                            </select>
                                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 pointer-events-none" />
                                        </div>
                                        {errors.city && (
                                            <p className="text-xs text-red-500 font-bold flex items-center gap-1 ml-1">
                                                <AlertCircle className="w-3 h-3" />
                                                {errors.city.message}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Payment Information */}
                            <div className="pt-6 border-t border-slate-100">
                                <div className="p-6 bg-gradient-to-r from-primary-50 to-blue-50 rounded-2xl border border-primary-100">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
                                                <CreditCard className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-slate-900">
                                                    {t("registration_fee") || "Registration Fee"}
                                                </p>
                                                <p className="text-xs text-slate-600 font-medium">
                                                    {t("secure_payment") || "Secure payment via Razorpay"}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-3xl font-black text-primary-600">₹{REGISTRATION_FEE}</p>
                                            <p className="text-xs text-slate-500 font-bold">
                                                {t("one_time_fee") || "One-time payment"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <motion.button
                                whileHover={{ scale: loading ? 1 : 1.01 }}
                                whileTap={{ scale: loading ? 1 : 0.99 }}
                                type="submit"
                                disabled={loading}
                                className="w-full btn-modern-primary flex items-center justify-center gap-3 text-base py-4 disabled:opacity-50 disabled:cursor-not-allowed">
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        {t("processing") || "Processing..."}
                                    </>
                                ) : (
                                    <>
                                        <CreditCard className="w-5 h-5" />
                                        {t("proceed_to_payment") || "Proceed to Payment"}
                                        <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </motion.button>

                            <p className="text-xs text-center text-slate-500 font-medium">
                                {t("payment_secure") ||
                                    "Your payment information is secure and encrypted. By proceeding, you agree to our terms and conditions."}
                            </p>
                        </form>
                    </motion.div>

                    {/* Features */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        {[
                            {
                                icon: CheckCircle2,
                                title: t("instant_confirmation") || "Instant Confirmation",
                                desc: t("instant_confirmation_desc") || "Get immediate confirmation after registration",
                            },
                            {
                                icon: CreditCard,
                                title: t("secure_payment") || "Secure Payment",
                                desc: t("secure_payment_desc") || "100% secure payment gateway",
                            },
                            {
                                icon: GraduationCap,
                                title: t("easy_process") || "Easy Process",
                                desc: t("easy_process_desc") || "Simple and quick registration",
                            },
                        ].map((feature, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 + idx * 0.1 }}
                                className="glass-card p-5 rounded-2xl flex items-center gap-4 border border-white/60 hover:border-primary-200 transition-all">
                                <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <feature.icon className="w-5 h-5 text-primary-600" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-black text-slate-900 mb-1">{feature.title}</h4>
                                    <p className="text-xs text-slate-600">{feature.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="py-6 px-6 border-t border-slate-100 bg-white/50 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-slate-400" />
                        <p className="text-xs font-bold text-slate-400">
                            © 2024 EduPortal Systems. All rights reserved.
                        </p>
                    </div>
                    <div className="flex gap-6">
                        {["Privacy", "Terms", "Support"].map((link) => (
                            <a
                                key={link}
                                href="#"
                                className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-primary-600 transition-colors">
                                {link}
                            </a>
                        ))}
                    </div>
                </div>
            </footer>
        </div>
    );
};

// Reusable Form Field Component
const FormField = React.forwardRef(
    ({ label, icon: Icon, error, type = "text", placeholder, ...props }, ref) => (
        <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                {label}
            </label>
            <div className="relative group">
                <Icon
                    className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${error ? "text-red-400" : "text-slate-300 group-focus-within:text-primary-500"
                        }`}
                />
                <input
                    ref={ref}
                    type={type}
                    placeholder={placeholder}
                    className={`modern-input !pl-10 ${error ? "!border-red-200 !bg-red-50/50" : ""}`}
                    {...props}
                />
            </div>
            {error && (
                <p className="text-xs text-red-500 font-bold flex items-center gap-1 ml-1">
                    <AlertCircle className="w-3 h-3" />
                    {error.message}
                </p>
            )}
        </div>
    )
);

FormField.displayName = "FormField";

export default RegistrationPage;
