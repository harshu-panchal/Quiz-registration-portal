import React, { useState, useEffect, useRef } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import StatusModal from "../../components/StatusModal";
import { useAuth } from "../../context/AuthContext";
import { authService } from "../../services/authService";
import {
  User,
  Shield,
  Globe,
  Database,
  Lock,
  Mail,
  Camera,
  CheckCircle2,
  AlertCircle,
  IndianRupee,
  LogOut,
  ChevronRight,
  AlertTriangle,
  Trash2,
  X,
  BookOpen
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { settingsService } from "../../services/settingsService";

// ... schemas remain same ...
const profileSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters").max(50),
  email: z.string().email("Invalid email address"),
  bio: z.string().max(500, "Bio is too long").optional(),
});

const platformSchema = z.object({
  platformName: z.string().min(3, "Platform name must be at least 3 characters").max(100),
  registrationFee: z.coerce.number().min(0, "Fee cannot be negative").max(10000, "Fee is too high"),
  language: z.string().optional(),
  theme: z.string().optional(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const Settings = () => {
  const { t } = useLanguage();
  const { user, login } = useAuth();
  const fileInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState("Profile");
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const [platformSettings, setPlatformSettings] = useState({
    platformName: "AppZeto Quiz Platform",
    maintenanceMode: false,
    language: "English (US)",
    theme: "Light",
  });

  const [statusModal, setStatusModal] = useState({
    isOpen: false,
    type: "info",
    title: "",
    message: "",
    showCancel: false,
    onConfirm: null,
  });

  // Profile Form
  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors },
    reset: resetProfile,
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: "",
      email: "",
      bio: "",
    },
  });

  // Platform Form
  const {
    register: registerPlatform,
    handleSubmit: handleSubmitPlatform,
    setValue: setPlatformValue,
    formState: { errors: platformErrors },
  } = useForm({
    resolver: zodResolver(platformSchema),
    defaultValues: {
      platformName: "AppZeto Quiz Platform",
      registrationFee: 100,
    },
  });

  // Password Form
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors },
    reset: resetPassword
  } = useForm({
    resolver: zodResolver(passwordSchema)
  });

  // Fetch settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settings = await settingsService.getSettings();
        setPlatformValue("platformName", settings.platformName);
        setPlatformValue("registrationFee", settings.registrationFee);
        setPlatformSettings(prev => ({
          ...prev,
          platformName: settings.platformName,
          maintenanceMode: settings.maintenanceMode,
          language: settings.language || "English (US)",
          theme: settings.theme || "Light",
        }));
      } catch (error) {
        console.error("Failed to fetch settings:", error);
      }
    };
    fetchSettings();
  }, [setPlatformValue]);

  // Update profile form when user user data is available
  useEffect(() => {
    if (user) {
      resetProfile({
        fullName: user.name || "",
        email: user.email || "",
        bio: user.bio || "",
      });
    }
  }, [user, resetProfile]);

  const tabs = [
    { id: "Profile", icon: User },
    { id: "Security", icon: Shield },
    { id: "Platform", icon: Globe },
    { id: "Data", icon: Database },
  ];


  const handleSavePlatform = async (data) => {
    try {
      await settingsService.updateSettings({
        platformName: data.platformName,
        registrationFee: data.registrationFee,
        maintenanceMode: platformSettings.maintenanceMode,
        language: platformSettings.language,
        theme: platformSettings.theme,
      });

      setPlatformSettings((prev) => ({ ...prev, ...data }));
      setStatusModal({
        isOpen: true,
        type: "success",
        title: "Platform Updated",
        message: "Platform settings have been applied to the system.",
      });
    } catch (error) {
      setStatusModal({
        isOpen: true,
        type: "error",
        title: "Update Failed",
        message: "Failed to update platform settings.",
      });
    }
  };

  const handleExportData = (type) => {
    setStatusModal({
      isOpen: true,
      type: "info",
      title: "Export Started",
      message: `Preparing your ${type} export. This may take a few moments depending on the data size.`,
    });
  };

  const handleClearCache = () => {
    setStatusModal({
      isOpen: true,
      type: "confirm",
      title: "Clear System Cache",
      message: "Are you sure you want to clear the system cache? This will sign out all active sessions.",
      showCancel: true,
      onConfirm: () => {
        setStatusModal({
          isOpen: true,
          type: "success",
          title: "Cache Cleared",
          message: "System cache has been successfully cleared.",
        });
      },
    });
  };

  const handleSignOut = () => {
    setStatusModal({
      isOpen: true,
      type: "confirm",
      title: "Sign Out",
      message: "Are you sure you want to sign out of your admin account?",
      showCancel: true,
      confirmText: "Sign Out",
      onConfirm: () => {
        // In real app, call logout service
        console.log("Signing out...");
        // You might want to actually logout here
        // window.location.href = '/login'; 
      },
    });
  };

  const onProfileSubmit = async (data) => {
    try {
      const response = await authService.updateProfile({
        name: data.fullName,
        email: data.email,
        bio: data.bio
      });

      if (response.success) {
        login(response.data); // Update context
        setStatusModal({
          isOpen: true,
          type: "success",
          title: "Settings Saved",
          message: "Your profile information has been updated successfully.",
          showCancel: false,
        });
      }
    } catch (err) {
      setStatusModal({
        isOpen: true,
        type: "error",
        title: "Update Failed",
        message: err.response?.data?.message || "Failed to update profile",
      });
    }
  };

  const handleCancel = () => {
    if (user) {
      resetProfile({
        fullName: user.name || "",
        email: user.email || "",
        bio: user.bio || "",
      });
    }
  };

  const onPasswordSubmit = async (data) => {
    try {
      await authService.updatePassword(data.currentPassword, data.newPassword);
      setIsPasswordModalOpen(false);
      resetPassword();
      setStatusModal({
        isOpen: true,
        type: "success",
        title: "Password Updated",
        message: "Your password has been changed successfully.",
      });
    } catch (err) {
      // Show error in modal or toast? We don't have toast validation in modal easily.
      // We can render error in form manually or use setStatusModal error
      setStatusModal({
        isOpen: true,
        type: "error",
        title: "Password Change Failed",
        message: err.response?.data?.message || "Failed to change password",
      });
    }
  };

  const handleChangePassword = () => {
    setIsPasswordModalOpen(true);
  };

  const handleDeleteAccount = () => {
    setStatusModal({
      isOpen: true,
      type: "error",
      title: "Critical Action",
      message: "Are you sure you want to delete your admin account? This action is permanent and cannot be reversed.",
      showCancel: true,
      confirmText: "Delete Permanently",
      onConfirm: () => {
        console.log("Account deleted");
      },
    });
  };

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Create FormData
    const formData = new FormData();
    formData.append("photo", file);

    try {
      const response = await authService.uploadProfilePhoto(formData);

      if (response && response.success) {
        // Update local user context with new avatar path
        // user object in context usually has the user data.
        // response.data is the avatar path string string based on my controller logic.
        const updatedUser = { ...user, avatar: response.data };
        login(updatedUser); // Update AuthContext

        setStatusModal({
          isOpen: true,
          type: "success",
          title: "Photo Updated",
          message: "Profile picture has been updated successfully.",
        });
      }
    } catch (error) {
      console.error(error);
      setStatusModal({
        isOpen: true,
        type: "error",
        title: "Upload Failed",
        message: error.response?.data?.message || "Failed to upload profile photo",
      });
    }
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            {t('admin_settings')}
          </h2>
          <p className="text-sm text-slate-500 font-medium mt-1">
            {t('configure_account')}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Tabs */}
          <div className="lg:w-64 shrink-0 space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${activeTab === tab.id
                  ? "bg-primary-600 text-white shadow-lg shadow-primary-100"
                  : "text-slate-500 hover:bg-slate-100"
                  }`}>
                <tab.icon className="w-4.5 h-4.5" />
                {t(tab.id.toLowerCase())}
              </button>
            ))}
            <div className="pt-4 mt-4 border-t border-slate-100">
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all">
                <LogOut className="w-4.5 h-4.5" />
                {t('sign_out')}
              </button>
            </div>
          </div>

          {/* Settings Content */}
          <div className="flex-1 max-w-3xl">
            <AnimatePresence mode="wait">
              {activeTab === "Profile" && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-6">
                  {/* Profile Section */}
                  <div className="glass-card rounded-3xl p-8 border border-slate-100 shadow-sm">
                    <h3 className="text-lg font-black text-slate-900 mb-6">
                      {t('profile_information')}
                    </h3>

                    <div className="flex items-center gap-6 mb-8">
                      <div className="relative group">
                        <img
                          src={user?.avatar || "https://i.pravatar.cc/150?u=admin"}
                          alt="Admin"
                          className="w-24 h-24 rounded-3xl object-cover ring-4 ring-slate-50 group-hover:ring-primary-100 transition-all shadow-md"
                          loading="lazy"
                        />
                        <button
                          onClick={handleCameraClick}
                          className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-primary-600 text-white shadow-lg hover:scale-110 transition-transform">
                          <Camera className="w-4 h-4" />
                        </button>
                        <input
                          type="file"
                          ref={fileInputRef}
                          className="hidden"
                          accept="image/*"
                          onChange={handleFileChange}
                        />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xl font-black text-slate-900">
                          {user?.name || "Admin User"}
                        </h4>
                        <p className="text-xs text-slate-500 font-medium">
                          {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "Administrator"}
                        </p>
                        <div className="flex items-center gap-1.5 text-green-600 mt-2">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span className="text-[10px] font-black uppercase tracking-widest">
                            {t('verified_account')}
                          </span>
                        </div>
                      </div>
                    </div>

                    <form onSubmit={handleSubmitProfile(onProfileSubmit)}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                            {t('full_name')}
                          </label>
                          <div className="relative group">
                            <User
                              className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${profileErrors.fullName
                                ? "text-red-400"
                                : "text-slate-300 group-focus-within:text-primary-500"
                                }`}
                            />
                            <input
                              type="text"
                              {...registerProfile("fullName")}
                              className={`modern-input !pl-12 !py-2.5 bg-slate-50 border-transparent focus:bg-white w-full ${profileErrors.fullName
                                ? "!border-red-200 !bg-red-50/50"
                                : ""
                                }`}
                            />
                          </div>
                          {profileErrors.fullName && (
                            <p className="text-[10px] text-red-500 font-bold flex items-center gap-1 mt-1 ml-1">
                              <AlertCircle className="w-3 h-3" />
                              {profileErrors.fullName.message}
                            </p>
                          )}
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                            {t('email_address')}
                          </label>
                          <div className="relative group">
                            <Mail
                              className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${profileErrors.email
                                ? "text-red-400"
                                : "text-slate-300 group-focus-within:text-primary-500"
                                }`}
                            />
                            <input
                              type="email"
                              {...registerProfile("email")}
                              className={`modern-input !pl-12 !py-2.5 bg-slate-50 border-transparent focus:bg-white w-full ${profileErrors.email
                                ? "!border-red-200 !bg-red-50/50"
                                : ""
                                }`}
                            />
                          </div>
                          {profileErrors.email && (
                            <p className="text-[10px] text-red-500 font-bold flex items-center gap-1 mt-1 ml-1">
                              <AlertCircle className="w-3 h-3" />
                              {profileErrors.email.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="mt-8 flex justify-end">
                        <button
                          type="submit"
                          className="btn-modern-primary !py-2.5 !px-6 text-xs font-black">
                          {t('save_changes')}
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Public Details */}
                  <div className="glass-card rounded-3xl p-8 border border-slate-100 shadow-sm">
                    <h3 className="text-lg font-black text-slate-900 mb-6">
                      {t('public_bio')}
                    </h3>
                    <div className="space-y-1.5">
                      <textarea
                        {...registerProfile("bio")}
                        placeholder={t('bio_placeholder')}
                        rows={4}
                        className={`modern-input !py-3 bg-slate-50 border-transparent focus:bg-white w-full resize-none ${profileErrors.bio
                          ? "!border-red-200 !bg-red-50/50"
                          : ""
                          }`}
                      />
                      {profileErrors.bio && (
                        <p className="text-[10px] text-red-500 font-bold flex items-center gap-1 mt-1 ml-1">
                          <AlertCircle className="w-3 h-3" />
                          {profileErrors.bio.message}
                        </p>
                      )}
                    </div>
                    <div className="mt-6 flex justify-end">
                      <button
                        onClick={handleCancel}
                        className="btn-modern-outline !py-2.5 !px-6 text-xs font-black">
                        {t('cancel')}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}



              {activeTab === "Platform" && (
                <motion.div
                  key="platform"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-6">
                  <div className="glass-card rounded-3xl p-8 border border-slate-100 shadow-sm">
                    <h3 className="text-lg font-black text-slate-900 mb-6">
                      {t('general_platform')}
                    </h3>

                    <form
                      onSubmit={handleSubmitPlatform(handleSavePlatform)}
                      className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                          {t('platform_name')}
                        </label>
                        <input
                          type="text"
                          {...registerPlatform("platformName")}
                          className={`modern-input !py-3 bg-slate-50 border-transparent focus:bg-white w-full ${platformErrors.platformName
                            ? "!border-red-200 !bg-red-50/50"
                            : ""
                            }`}
                        />
                        {platformErrors.platformName && (
                          <p className="text-[10px] text-red-500 font-bold flex items-center gap-1 mt-1 ml-1">
                            <AlertCircle className="w-3 h-3" />
                            {platformErrors.platformName.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                          {t('registration_fee')} (₹)
                        </label>
                        <div className="relative group">
                          <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-primary-500 transition-colors" />
                          <input
                            type="number"
                            {...registerPlatform("registrationFee")}
                            className={`modern-input !pl-12 !py-3 bg-slate-50 border-transparent focus:bg-white w-full ${platformErrors.registrationFee ? "!border-red-200 !bg-red-50/50" : ""
                              }`}
                          />
                        </div>
                        {platformErrors.registrationFee && (
                          <p className="text-[10px] text-red-500 font-bold flex items-center gap-1 mt-1 ml-1">
                            <AlertCircle className="w-3 h-3" />
                            {platformErrors.registrationFee.message}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                            {t('default_language')}
                          </label>
                          <select
                            value={platformSettings.language}
                            onChange={(e) =>
                              setPlatformSettings({
                                ...platformSettings,
                                language: e.target.value,
                              })
                            }
                            className="modern-input !py-3 bg-slate-50 border-transparent focus:bg-white w-full appearance-none">
                            <option>English (US)</option>
                            <option>Spanish</option>
                            <option>French</option>
                            <option>Hindi</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                            {t('system_theme')}
                          </label>
                          <select
                            value={platformSettings.theme}
                            onChange={(e) =>
                              setPlatformSettings({
                                ...platformSettings,
                                theme: e.target.value,
                              })
                            }
                            className="modern-input !py-3 bg-slate-50 border-transparent focus:bg-white w-full appearance-none">
                            <option>Light</option>
                            <option>Dark</option>
                            <option>System Default</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-4 rounded-2xl bg-orange-50 border border-orange-100">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-orange-600 shadow-sm">
                            <Globe className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-sm font-black text-slate-900">
                              {t('maintenance_mode')}
                            </p>
                            <p className="text-[11px] text-slate-500 font-medium">
                              {t('maintenance_desc')}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setPlatformSettings({
                              ...platformSettings,
                              maintenanceMode:
                                !platformSettings.maintenanceMode,
                            })
                          }
                          className={`w-12 h-6 rounded-full transition-all relative ${platformSettings.maintenanceMode
                            ? "bg-orange-600"
                            : "bg-slate-200"
                            }`}>
                          <div
                            className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${platformSettings.maintenanceMode
                              ? "left-7"
                              : "left-1"
                              }`}
                          />
                        </button>
                      </div>

                      <div className="mt-8 flex justify-end">
                        <button
                          type="submit"
                          className="btn-modern-primary !py-2.5 !px-8 text-xs font-black">
                          {t('update_platform')}
                        </button>
                      </div>
                    </form>
                  </div>
                </motion.div>
              )}

              {activeTab === "Data" && (
                <motion.div
                  key="data"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-6">
                  <div className="glass-card rounded-3xl p-8 border border-slate-100 shadow-sm">
                    <h3 className="text-lg font-black text-slate-900 mb-6">
                      {t('data_management')}
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                      {[
                        {
                          label: t('student_records'),
                          type: "Students",
                          icon: User,
                        },
                        {
                          label: t('quiz_analytics'),
                          type: "Quizzes",
                          icon: BookOpen,
                        },
                        { label: t('system_logs'), type: "Logs", icon: Database },
                        { label: t('full_backup'), type: "Full", icon: Shield },
                      ].map((item) => (
                        <button
                          key={item.label}
                          onClick={() => handleExportData(item.type)}
                          className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-primary-100 hover:bg-white transition-all text-left group">
                          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-slate-400 group-hover:text-primary-600 transition-all shadow-sm">
                            <item.icon className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-xs font-black text-slate-900">
                              {item.label}
                            </p>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">
                              {t('export_csv')}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>

                    <div className="p-6 rounded-3xl bg-blue-50 border border-blue-100 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-blue-600 shadow-sm">
                          <Database className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-900">
                            {t('system_cache')}
                          </p>
                          <p className="text-xs text-slate-500 font-medium mt-0.5">
                            {t('current_size')}: 124.5 MB
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={handleClearCache}
                        className="px-6 py-2 rounded-xl bg-white text-blue-600 text-xs font-black shadow-sm hover:bg-blue-50 transition-all">
                        {t('clear_cache')}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "Security" && (
                <motion.div
                  key="security"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-6">
                  <div className="glass-card rounded-3xl p-8 border border-slate-100 shadow-sm">
                    <h3 className="text-lg font-black text-slate-900 mb-6">
                      {t('password_auth')}
                    </h3>

                    <div className="space-y-6">
                      <div
                        onClick={handleChangePassword}
                        className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 group hover:border-primary-100 transition-all cursor-pointer">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-slate-400 group-hover:text-primary-600 transition-all">
                            <Lock className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-sm font-black text-slate-900">
                              {t('change_password')}
                            </p>
                            <p className="text-[11px] text-slate-500 font-medium">
                              {t('change_password_desc')}
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="w-4.5 h-4.5 text-slate-300" />
                      </div>


                    </div>
                  </div>

                  <div className="glass-card rounded-3xl p-8 border border-red-50 bg-red-50/10 shadow-sm">
                    <div className="flex items-center gap-3 mb-6 text-red-600">
                      <AlertTriangle className="w-6 h-6" />
                      <h3 className="text-lg font-black">{t('danger_zone')}</h3>
                    </div>
                    <p className="text-sm text-slate-600 font-medium mb-6 leading-relaxed">
                      {t('delete_account_warning')}
                    </p>
                    <button
                      onClick={handleDeleteAccount}
                      className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-red-600 text-white font-black text-xs hover:bg-red-700 transition-all shadow-lg shadow-red-100">
                      <Trash2 className="w-4 h-4" />
                      {t('delete_account')}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      <AnimatePresence>
        {isPasswordModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 transition-opacity"
              onClick={() => setIsPasswordModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
              <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md pointer-events-auto p-8 border border-slate-100">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-black text-slate-900">{t('change_password')}</h3>
                  <button onClick={() => setIsPasswordModalOpen(false)} className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-red-500 transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmitPassword(onPasswordSubmit)} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">{t('current_password')}</label>
                    <input
                      type="password"
                      {...registerPassword("currentPassword")}
                      className={`modern-input !py-3 bg-slate-50 border-transparent focus:bg-white w-full ${passwordErrors.currentPassword ? "!border-red-200 !bg-red-50/50" : ""}`}
                    />
                    {passwordErrors.currentPassword && <p className="text-[10px] text-red-500 font-bold mt-1 ml-1">{passwordErrors.currentPassword.message}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">{t('new_password')}</label>
                    <input
                      type="password"
                      {...registerPassword("newPassword")}
                      className={`modern-input !py-3 bg-slate-50 border-transparent focus:bg-white w-full ${passwordErrors.newPassword ? "!border-red-200 !bg-red-50/50" : ""}`}
                    />
                    {passwordErrors.newPassword && <p className="text-[10px] text-red-500 font-bold mt-1 ml-1">{passwordErrors.newPassword.message}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">{t('confirm_password')}</label>
                    <input
                      type="password"
                      {...registerPassword("confirmPassword")}
                      className={`modern-input !py-3 bg-slate-50 border-transparent focus:bg-white w-full ${passwordErrors.confirmPassword ? "!border-red-200 !bg-red-50/50" : ""}`}
                    />
                    {passwordErrors.confirmPassword && <p className="text-[10px] text-red-500 font-bold mt-1 ml-1">{passwordErrors.confirmPassword.message}</p>}
                  </div>

                  <button type="submit" className="w-full btn-modern-primary !py-3 mt-4 text-sm font-black">
                    {t('password_updated')}
                  </button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <StatusModal
        {...statusModal}
        onClose={() => setStatusModal({ ...statusModal, isOpen: false })}
      />
    </DashboardLayout>
  );
};

export default Settings;
