import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { indianStatesCities } from "../../data/indianStatesCities";
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
import { settingsService } from "../../services/settingsService";
import { handleApiError } from "../../utils/errorHandler";

const registerSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(50),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^[0-9]{10}$/, "Phone number must be exactly 10 digits"),
  age: z.coerce.number().min(5, "Age must be at least 5").max(100),
  school: z.string().min(2, "School name is required"),
  studentClass: z.string().min(1, "Class/Grade is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  gender: z.enum(["Male", "Female", "Other"], {
    errorMap: () => ({ message: "Please select a gender" }),
  }),
});

const RegisterPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [registrationFee, setRegistrationFee] = useState(100);
  const navigate = useNavigate();
  const { login } = useAuth();

  const steps = {
    1: {
      id: 1,
      title: "Account Setup",
      fields: ["fullName", "email", "password"]
    },
    2: {
      id: 2,
      title: "Personal Info",
      fields: ["phone", "gender", "age", "school", "studentClass"]
    },
    3: {
      id: 3,
      title: "Location & Pay",
      fields: ["state", "city"]
    }
  };

  React.useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settings = await settingsService.getSettings();
        if (settings.registrationFee) {
          setRegistrationFee(settings.registrationFee);
        }
      } catch (error) {
        console.error("Failed to fetch settings:", error);
      }
    };
    fetchSettings();
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
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
      gender: "",
    },
  });

  const selectedState = watch("state");

  const nextStep = async () => {
    const fields = steps[currentStep].fields;
    const isValid = await trigger(fields);
    if (isValid) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const onRegisterSubmit = async (data) => {
    try {
      setLoading(true);
      setApiError('');

      const response = await authService.register({
        name: data.fullName,
        email: data.email,
        password: data.password,
        phone: data.phone,
        age: data.age,
        gender: data.gender,
        school: data.school,
        class: data.studentClass,
        city: data.city,
        state: data.state,
      });

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
          <div className="w-full space-y-6">
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

              {/* Stepper Header */}
              <div className="flex items-center justify-between mb-8">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black border-2 transition-all ${currentStep >= step
                        ? "bg-primary-600 border-primary-600 text-white"
                        : "bg-white border-slate-200 text-slate-400"
                        }`}
                    >
                      {currentStep > step ? <CheckCircle className="w-4 h-4" /> : step}
                    </div>
                    {step < 3 && (
                      <div
                        className={`w-12 h-1 mx-2 rounded-full transition-all ${currentStep > step ? "bg-primary-600" : "bg-slate-200"
                          }`}
                      />
                    )}
                  </div>
                ))}
              </div>

              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                {steps[currentStep].title}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Step {currentStep} of 3
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

            <form onSubmit={handleSubmit(onRegisterSubmit)} className="space-y-4">

              {/* Step 1: Account Setup */}
              {currentStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
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
                </motion.div>
              )}

              {/* Step 2: Personal Info */}
              {currentStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                >
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                      Phone Number
                    </label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                        <Phone className={`w-4 h-4 transition-colors ${errors.phone ? "text-red-400" : "text-slate-300 group-focus-within:text-primary-500"}`} />
                        <span className="text-sm font-bold text-slate-500 border-r border-slate-200 pr-2">+91</span>
                      </div>
                      <input
                        type="tel"
                        placeholder="00000 00000"
                        maxLength={10}
                        className={`modern-input !pl-20 !py-2.5 ${errors.phone ? "!border-red-200 !bg-red-50/50" : ""
                          }`}
                        onInput={(e) => {
                          e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
                        }}
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
                      Gender
                    </label>
                    <div className="relative group">
                      <User
                        className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${errors.gender
                          ? "text-red-400"
                          : "text-slate-300 group-focus-within:text-primary-500"
                          }`}
                      />
                      <select
                        className={`modern-input !pl-12 !py-2.5 ${errors.gender ? "!border-red-200 !bg-red-50/50" : "bg-white"}`}
                        {...register("gender")}
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    {errors.gender && (
                      <p className="text-[10px] text-red-500 font-bold flex items-center gap-1 mt-1 ml-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.gender.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
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

                  <div className="space-y-1.5 sm:col-span-2">
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
                      <select
                        className={`modern-input !pl-12 !py-2.5 ${errors.studentClass
                          ? "!border-red-200 !bg-red-50/50"
                          : "bg-white"
                          }`}
                        {...register("studentClass")}
                      >
                        <option value="">Select Grade</option>
                        {["1st Grade", "2nd Grade", "3rd Grade", "4th Grade", "5th Grade", "6th Grade", "7th Grade", "8th Grade", "9th Grade", "10th Grade", "11th Grade", "12th Grade", "Other"].map((grade) => (
                          <option key={grade} value={grade}>{grade}</option>
                        ))}
                      </select>
                    </div>
                    {errors.studentClass && (
                      <p className="text-[10px] text-red-500 font-bold flex items-center gap-1 mt-1 ml-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.studentClass.message}
                      </p>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Step 3: Location & Pay */}
              {currentStep === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
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
                      <select
                        className={`modern-input !pl-12 !py-2.5 ${errors.state ? "!border-red-200 !bg-red-50/50" : "bg-white"
                          }`}
                        {...register("state", {
                          onChange: (e) => {
                            setValue("city", ""); // Reset city when state changes
                          }
                        })}
                      >
                        <option value="">Select State</option>
                        {Object.keys(indianStatesCities).sort().map((state) => (
                          <option key={state} value={state}>{state}</option>
                        ))}
                      </select>
                    </div>
                    {errors.state && (
                      <p className="text-[10px] text-red-500 font-bold flex items-center gap-1 mt-1 ml-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.state.message}
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
                      <select
                        className={`modern-input !pl-12 !py-2.5 ${errors.city ? "!border-red-200 !bg-red-50/50" : "bg-white"
                          }`}
                        disabled={!selectedState}
                        {...register("city")}
                      >
                        <option value="">{selectedState ? "Select City" : "Select State First"}</option>
                        {selectedState && indianStatesCities[selectedState]?.sort().map((city) => (
                          <option key={city} value={city}>{city}</option>
                        ))}
                      </select>
                    </div>
                    {errors.city && (
                      <p className="text-[10px] text-red-500 font-bold flex items-center gap-1 mt-1 ml-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.city.message}
                      </p>
                    )}
                  </div>

                  <div className="p-4 bg-primary-50 rounded-2xl border border-primary-100 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">
                        Registration Fee
                      </p>
                      <p className="text-lg font-black text-primary-600 leading-none">
                        ₹{registrationFee}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-4 pt-4">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="w-12 h-12 flex items-center justify-center rounded-xl bg-slate-100/50 text-slate-500 hover:bg-slate-100 hover:text-slate-900 border border-slate-200 transition-all active:scale-95"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                )}

                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="relative flex-1 h-12 bg-[#0070D1] hover:bg-[#0060B6] text-white rounded-xl font-bold text-sm tracking-wide transition-all shadow-lg shadow-[#0070D1]/20 hover:shadow-[#0070D1]/40 active:scale-[0.98] overflow-hidden group"
                  >
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 transform group-hover:-translate-x-1 transition-transform">
                      <ArrowRight className="w-5 h-5" />
                    </div>
                    <span className="relative z-10">Next Step</span>
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="relative flex-1 h-12 bg-[#0070D1] hover:bg-[#0060B6] text-white rounded-xl font-bold text-sm tracking-wide transition-all shadow-lg shadow-[#0070D1]/20 hover:shadow-[#0070D1]/40 active:scale-[0.98] overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Creating Account...</span>
                      </div>
                    ) : (
                      <>
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 transform group-hover:-translate-x-1 transition-transform">
                          <ArrowRight className="w-5 h-5" />
                        </div>
                        <span className="relative z-10">Pay & Register</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>

            <div className="pt-2 text-center">
              <p className="text-xs text-slate-500 font-medium">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-primary-600 font-black hover:text-primary-700 transition-colors">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
