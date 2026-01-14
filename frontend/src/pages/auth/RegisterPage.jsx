import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  GraduationCap,
  ChevronDown,
  CheckCircle,
  ArrowRight,
  ShieldCheck,
  Zap,
  ChevronLeft,
  Phone,
  School,
  MapPin,
  Calendar,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { authService } from "../../services/authService";
import { handleApiError } from "../../utils/errorHandler";

const registerSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(50),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  age: z.coerce.number().min(5, "Age must be at least 5").max(100),
  school: z.string().min(2, "School name is required"),
  studentClass: z.string().min(1, "Class/Grade is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      age: "",
      school: "",
      studentClass: "",
      city: "",
      state: "",
      password: "",
    },
  });

  const onRegisterSubmit = async (data) => {
    try {
      setLoading(true);
      setApiError('');

      // Call backend registration API
      const response = await authService.register({
        name: data.fullName,
        email: data.email,
        password: data.password,
        phone: data.phone,
        age: data.age,
        school: data.school,
        class: data.studentClass,
        city: data.city,
        state: data.state,
      });

      // Backend returns: { success: true, data: { _id, name, email, role, avatar, token } }
      // Auto-login after successful registration
      login({
        _id: response.data._id,
        name: response.data.name,
        email: response.data.email,
        role: response.data.role,
        avatar: response.data.avatar,
        token: response.data.token
      });

      navigate("/dashboard");
    } catch (err) {
      const errorInfo = handleApiError(err);
      setApiError(errorInfo.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 selection:bg-primary-100 selection:text-primary-700">
      {/* Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary-200/30 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-200/20 rounded-full blur-[120px]"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 bg-white/70 backdrop-blur-2xl rounded-3xl shadow-glass overflow-hidden border border-white/40 relative z-10">
        {/* Left: Branding & Info */}
        <div className="hidden lg:flex flex-col justify-between p-12 bg-slate-900 text-white relative overflow-hidden">
          <div className="relative z-10">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20 group-hover:scale-110 transition-transform">
                <GraduationCap className="w-6 h-6" />
              </div>
              <span className="text-2xl font-black tracking-tighter">
                EduPortal
              </span>
            </Link>

            <div className="mt-16 space-y-8">
              <h1 className="text-5xl font-black tracking-tight leading-[1.1]">
                Start your <br />
                <span className="text-primary-400">Journey</span> here.
              </h1>
              <p className="text-slate-400 text-base max-w-xs font-medium leading-relaxed">
                Join our community of learners and get access to exclusive
                quizzes and tracking tools.
              </p>
            </div>
          </div>

          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-4">
              <div className="flex -space-x-4">
                {[1, 2, 3, 4].map((i) => (
                  <img
                    key={i}
                    className="w-10 h-10 rounded-full border-2 border-slate-900 ring-2 ring-primary-500/10"
                    src={`https://i.pravatar.cc/150?u=${i + 10}`}
                    alt="Student"
                  />
                ))}
              </div>
              <div>
                <p className="font-black text-white text-sm">
                  10,000+ Students
                </p>
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">
                  Trust our platform
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-5 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                <CheckCircle className="w-6 h-6 text-green-400 mb-4" />
                <p className="text-sm font-bold text-white mb-1">
                  Instant Access
                </p>
                <p className="text-[11px] text-slate-400 font-medium">
                  Auto-login after pay.
                </p>
              </div>
              <div className="p-5 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                <Zap className="w-6 h-6 text-primary-400 mb-4" />
                <p className="text-sm font-bold text-white mb-1">Quiz Ready</p>
                <p className="text-[11px] text-slate-400 font-medium">
                  Start testing now.
                </p>
              </div>
            </div>
          </div>

          {/* Abstract background for dark side */}
          <div className="absolute top-0 right-0 w-full h-full opacity-20">
            <div className="absolute top-[20%] right-[-10%] w-80 h-80 bg-primary-500 rounded-full blur-[120px]"></div>
          </div>
        </div>

        {/* Right: Register Form */}
        <div className="p-8 lg:p-10 flex flex-col justify-center overflow-y-auto max-h-[90vh]">
          <div className="w-full space-y-8">
            <div className="space-y-2">
              <div className="flex items-center justify-between lg:hidden mb-6">
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 text-slate-400 font-bold text-xs hover:text-primary-600 transition-colors">
                  <ChevronLeft className="w-3.5 h-3.5" />
                  Back
                </Link>
                <Link to="/" className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-primary-600 rounded-lg flex items-center justify-center shadow-lg shadow-primary-500/20">
                    <GraduationCap className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-black tracking-tighter text-slate-900">
                    EduPortal
                  </span>
                </Link>
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Create Account
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Fill in your details to get started.
              </p>
            </div>

            {apiError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs font-bold text-red-900">Registration Failed</p>
                  <p className="text-xs text-red-700 mt-1">{apiError}</p>
                </div>
              </motion.div>
            )}

            <form
              onSubmit={handleSubmit(onRegisterSubmit)}
              className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                    Full Name
                  </label>
                  <div className="relative group">
                    <User
                      className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${errors.fullName
                        ? "text-red-400"
                        : "text-slate-300 group-focus-within:text-primary-500"
                        }`}
                    />
                    <input
                      type="text"
                      placeholder="Alex Johnson"
                      className={`modern-input !pl-12 !py-2.5 ${errors.fullName ? "!border-red-200 !bg-red-50/50" : ""
                        }`}
                      {...register("fullName")}
                    />
                  </div>
                  {errors.fullName && (
                    <p className="text-[10px] text-red-500 font-bold flex items-center gap-1 mt-1 ml-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.fullName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                    Email Address
                  </label>
                  <div className="relative group">
                    <Mail
                      className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${errors.email
                        ? "text-red-400"
                        : "text-slate-300 group-focus-within:text-primary-500"
                        }`}
                    />
                    <input
                      type="email"
                      placeholder="name@example.com"
                      className={`modern-input !pl-12 !py-2.5 ${errors.email ? "!border-red-200 !bg-red-50/50" : ""
                        }`}
                      {...register("email")}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-[10px] text-red-500 font-bold flex items-center gap-1 mt-1 ml-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                    Phone Number
                  </label>
                  <div className="relative group">
                    <Phone
                      className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${errors.phone
                        ? "text-red-400"
                        : "text-slate-300 group-focus-within:text-primary-500"
                        }`}
                    />
                    <input
                      type="tel"
                      placeholder="+91 00000 00000"
                      className={`modern-input !pl-12 !py-2.5 ${errors.phone ? "!border-red-200 !bg-red-50/50" : ""
                        }`}
                      {...register("phone")}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-[10px] text-red-500 font-bold flex items-center gap-1 mt-1 ml-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                    Age
                  </label>
                  <div className="relative group">
                    <Calendar
                      className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${errors.age
                        ? "text-red-400"
                        : "text-slate-300 group-focus-within:text-primary-500"
                        }`}
                    />
                    <input
                      type="number"
                      placeholder="18"
                      className={`modern-input !pl-12 !py-2.5 ${errors.age ? "!border-red-200 !bg-red-50/50" : ""
                        }`}
                      {...register("age")}
                    />
                  </div>
                  {errors.age && (
                    <p className="text-[10px] text-red-500 font-bold flex items-center gap-1 mt-1 ml-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.age.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                    School Name
                  </label>
                  <div className="relative group">
                    <School
                      className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${errors.school
                        ? "text-red-400"
                        : "text-slate-300 group-focus-within:text-primary-500"
                        }`}
                    />
                    <input
                      type="text"
                      placeholder="High School Name"
                      className={`modern-input !pl-12 !py-2.5 ${errors.school ? "!border-red-200 !bg-red-50/50" : ""
                        }`}
                      {...register("school")}
                    />
                  </div>
                  {errors.school && (
                    <p className="text-[10px] text-red-500 font-bold flex items-center gap-1 mt-1 ml-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.school.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                    Class / Grade
                  </label>
                  <div className="relative group">
                    <GraduationCap
                      className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${errors.studentClass
                        ? "text-red-400"
                        : "text-slate-300 group-focus-within:text-primary-500"
                        }`}
                    />
                    <input
                      type="text"
                      placeholder="e.g. 10th"
                      className={`modern-input !pl-12 !py-2.5 ${errors.studentClass
                        ? "!border-red-200 !bg-red-50/50"
                        : ""
                        }`}
                      {...register("studentClass")}
                    />
                  </div>
                  {errors.studentClass && (
                    <p className="text-[10px] text-red-500 font-bold flex items-center gap-1 mt-1 ml-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.studentClass.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                    City
                  </label>
                  <div className="relative group">
                    <MapPin
                      className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${errors.city
                        ? "text-red-400"
                        : "text-slate-300 group-focus-within:text-primary-500"
                        }`}
                    />
                    <input
                      type="text"
                      placeholder="City"
                      className={`modern-input !pl-12 !py-2.5 ${errors.city ? "!border-red-200 !bg-red-50/50" : ""
                        }`}
                      {...register("city")}
                    />
                  </div>
                  {errors.city && (
                    <p className="text-[10px] text-red-500 font-bold flex items-center gap-1 mt-1 ml-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.city.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                    State
                  </label>
                  <div className="relative group">
                    <MapPin
                      className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${errors.state
                        ? "text-red-400"
                        : "text-slate-300 group-focus-within:text-primary-500"
                        }`}
                    />
                    <input
                      type="text"
                      placeholder="State"
                      className={`modern-input !pl-12 !py-2.5 ${errors.state ? "!border-red-200 !bg-red-50/50" : ""
                        }`}
                      {...register("state")}
                    />
                  </div>
                  {errors.state && (
                    <p className="text-[10px] text-red-500 font-bold flex items-center gap-1 mt-1 ml-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.state.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                    Password
                  </label>
                  <div className="relative group">
                    <Lock
                      className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${errors.password
                        ? "text-red-400"
                        : "text-slate-300 group-focus-within:text-primary-500"
                        }`}
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className={`modern-input !pl-12 !py-2.5 ${errors.password ? "!border-red-200 !bg-red-50/50" : ""
                        }`}
                      {...register("password")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500">
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-[10px] text-red-500 font-bold flex items-center gap-1 mt-1 ml-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.password.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="p-4 bg-primary-50 rounded-2xl border border-primary-100 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">
                    Registration Fee
                  </p>
                  <p className="text-lg font-black text-primary-600 leading-none">
                    ₹100
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] text-slate-500 font-bold leading-relaxed max-w-[140px]">
                    Required to activate your account and access the quiz
                    module.
                  </p>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: loading ? 1 : 1.01 }}
                whileTap={{ scale: loading ? 1 : 0.99 }}
                type="submit"
                disabled={loading}
                className="btn-modern-primary w-full flex items-center justify-center gap-2 text-sm py-3.5 mt-2 disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Registering...
                  </>
                ) : (
                  <>
                    Pay & Register
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </form>

            <p className="text-center text-xs text-slate-500 font-medium">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-primary-600 font-black hover:underline underline-offset-4">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
