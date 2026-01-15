import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  User,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  Zap,
  CheckCircle2,
  ChevronLeft,
  GraduationCap,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import { authService } from "../../services/authService";
import { handleApiError } from "../../utils/errorHandler";
import LanguageToggle from "../../components/LanguageToggle";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional(),
});

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onLoginSubmit = async (data) => {
    try {
      setLoading(true);
      setApiError('');

      // Call real authentication API
      const response = await authService.login(data.email, data.password);

      // Backend returns: { success: true, data: { _id, name, email, role, avatar, token } }
      // Store user data with token
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
      const errorInfo = handleApiError(err, false);
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
        className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 bg-white/70 backdrop-blur-2xl rounded-3xl shadow-glass overflow-hidden border border-white/40 relative z-10">
        {/* Left: Branding & Info */}
        <div className="hidden lg:flex flex-col justify-between p-10 bg-slate-900 text-white relative overflow-hidden">
          <div className="relative z-10">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20 group-hover:scale-110 transition-transform">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="text-xl font-black tracking-tighter">
                EduPortal
              </span>
            </Link>

            <div className="mt-16 space-y-6">
              <h1 className="text-4xl font-black tracking-tight leading-[1.1]">
                {t('welcome_back')} <br />
                <span className="text-primary-400">Future</span> today.
              </h1>
              <p className="text-slate-400 text-sm max-w-xs font-medium leading-relaxed">
                The most advanced student management system for modern
                educational institutions.
              </p>
            </div>
          </div>

          <div className="relative z-10 grid grid-cols-2 gap-4">
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
              <Zap className="w-5 h-5 text-primary-400 mb-3" />
              <p className="text-xs font-bold text-white mb-0.5">
                {t('fast_reliable')}
              </p>
              <p className="text-[10px] text-slate-400 font-medium">
                {t('uptime_guaranteed')}
              </p>
            </div>
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
              <ShieldCheck className="w-5 h-5 text-green-400 mb-3" />
              <p className="text-xs font-bold text-white mb-0.5">{t('secure_data')}</p>
              <p className="text-[10px] text-slate-400 font-medium">
                {t('enterprise_encryption')}
              </p>
            </div>
          </div>

          {/* Abstract background for dark side */}
          <div className="absolute top-0 right-0 w-full h-full opacity-20">
            <div className="absolute top-[20%] right-[-10%] w-64 h-64 bg-primary-500 rounded-full blur-[100px]"></div>
          </div>
        </div>

        {/* Right: Login Form */}
        <div className="p-8 lg:p-12 flex flex-col justify-center">
          <div className="max-w-sm mx-auto w-full space-y-8">
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-6">
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 text-slate-400 font-bold text-xs hover:text-primary-600 transition-colors">
                  <ChevronLeft className="w-3.5 h-3.5" />
                  {t('back_to_home')}
                </Link>
                <div className="flex items-center gap-3">
                  <LanguageToggle />
                  <Link to="/" className="flex items-center gap-2 lg:hidden">
                    <div className="w-7 h-7 bg-primary-600 rounded-lg flex items-center justify-center shadow-lg shadow-primary-500/20">
                      <GraduationCap className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-black tracking-tighter text-slate-900">
                      EduPortal
                    </span>
                  </Link>
                </div>
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                {t('welcome_back')}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                {t('sign_in_continue')}
              </p>
            </div>

            {apiError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs font-bold text-red-900">{t('login_failed')}</p>
                  <p className="text-xs text-red-700 mt-1">{apiError}</p>
                </div>
              </motion.div>
            )}

            <form onSubmit={handleSubmit(onLoginSubmit)} className="space-y-5">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                    {t('email_address')}
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
                      placeholder="name@company.com"
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
                  <div className="flex justify-between items-center ml-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      {t('password')}
                    </label>
                    <button
                      type="button"
                      className="text-[10px] font-bold text-primary-600 hover:text-primary-700">
                      {t('forgot_password')}
                    </button>
                  </div>
                  <div className="relative group">
                    <Lock
                      className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${errors.password
                        ? "text-red-400"
                        : "text-slate-300 group-focus-within:text-primary-500"
                        }`}
                    />
                    <input
                      type="password"
                      placeholder="••••••••"
                      className={`modern-input !pl-12 !py-2.5 ${errors.password ? "!border-red-200 !bg-red-50/50" : ""
                        }`}
                      {...register("password")}
                    />
                  </div>
                  {errors.password && (
                    <p className="text-[10px] text-red-500 font-bold flex items-center gap-1 mt-1 ml-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.password.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2.5 ml-1">
                <input
                  type="checkbox"
                  id="remember"
                  className="w-4 h-4 rounded border-slate-200 text-primary-600 focus:ring-primary-500/20"
                  {...register("rememberMe")}
                />
                <label
                  htmlFor="remember"
                  className="text-xs font-bold text-slate-600">
                  Remember me
                </label>
              </div>

              <motion.button
                whileHover={{ scale: loading ? 1 : 1.01 }}
                whileTap={{ scale: loading ? 1 : 0.99 }}
                type="submit"
                disabled={loading}
                className="btn-modern-primary w-full flex items-center justify-center gap-2 text-sm py-3 disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {t('signing_in')}
                  </>
                ) : (
                  <>
                    {t('sign_in')}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </form>

            <p className="text-center text-xs text-slate-500 font-medium">
              {t('dont_have_account')}{" "}
              <Link
                to="/register"
                className="text-primary-600 font-black hover:underline underline-offset-4">
                {t('create_one')}
              </Link>
            </p>

            <div className="pt-4 border-t border-slate-200">
              <p className="text-center text-xs text-slate-500 font-medium">
                {t('administrator')}{" "}
                <Link
                  to="/admin/login"
                  className="text-amber-600 font-black hover:underline underline-offset-4">
                  {t('admin_login')}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
