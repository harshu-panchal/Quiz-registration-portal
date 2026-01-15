import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  GraduationCap,
  BarChart3,
  Calendar,
  Newspaper,
  ShieldCheck,
  ArrowRight,
  LayoutDashboard,
  Zap,
  CheckCircle2,
  Users,
  Sparkles,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import LanguageToggle from "../components/LanguageToggle";

const LandingPage = () => {
  const { t } = useLanguage();
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const features = [
    {
      titleKey: "performance_tracking",
      descKey: "performance_tracking_desc",
      icon: BarChart3,
      color: "bg-blue-50 text-blue-600",
      glow: "group-hover:shadow-blue-500/20",
    },
    {
      titleKey: "smart_scheduling",
      descKey: "smart_scheduling_desc",
      icon: Calendar,
      color: "bg-indigo-50 text-indigo-600",
      glow: "group-hover:shadow-indigo-500/20",
    },
    {
      titleKey: "instant_updates",
      descKey: "instant_updates_desc",
      icon: Newspaper,
      color: "bg-emerald-50 text-emerald-600",
      glow: "group-hover:shadow-emerald-500/20",
    },
    {
      titleKey: "secure_access",
      descKey: "secure_access_desc",
      icon: ShieldCheck,
      color: "bg-amber-50 text-amber-600",
      glow: "group-hover:shadow-amber-500/20",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col selection:bg-primary-100 selection:text-primary-700">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2],
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
        className="h-14 glass-card sticky top-0 z-50 px-6 lg:px-12 flex items-center justify-between border-b-0 m-4 rounded-2xl shadow-soft">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center shadow-lg shadow-primary-500/20">
            <GraduationCap className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-black tracking-tighter text-slate-900 uppercase">
            EduPortal
          </span>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-5">
            <Link
              to="#"
              className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary-600 transition-colors">
              {t('resources')}
            </Link>
            <Link
              to="#"
              className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary-600 transition-colors">
              {t('support')}
            </Link>
          </div>
          <LanguageToggle />
          <Link to="/login" className="btn-modern-primary !py-1.5 !px-4">
            {t('portal_login')}
          </Link>
        </div>
      </motion.nav>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative z-10">
        {/* Hero Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 space-y-3 max-w-xl">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-primary-50 rounded-full border border-primary-100 mb-2 cursor-default">
            <Zap className="w-3 h-3 text-primary-600 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-primary-700">
              {t('new_academic_year')}
            </span>
          </motion.div>
          <motion.h1
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2, // Start after initial entrance animations
            }}
            className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
            {t('streamlined_academic').split("").map((char, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.05,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="inline-block">
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
            {" "}
            <motion.span
              initial={{ opacity: 0, scale: 0.5, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{
                duration: 0.8,
                delay: 1.2,
                type: "spring",
                stiffness: 100,
              }}
              className="text-primary-600 inline-block">
              {t('management')}
            </motion.span>
          </motion.h1>
          <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-md mx-auto">
            {t('hero_desc')}
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-4xl relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Left Column */}
            <div className="space-y-6 order-2 md:order-1">
              {[features[0], features[2]].map((feature, idx) => (
                <motion.div
                  key={feature.titleKey}
                  variants={itemVariants}
                  whileHover={{
                    y: -5,
                    scale: 1.02,
                    transition: { duration: 0.2 },
                  }}
                  className={`glass-card p-5 rounded-2xl transition-all duration-300 group cursor-pointer border border-white/60 hover:border-primary-200 shadow-sm hover:shadow-xl ${feature.glow}`}>
                  <div className="flex flex-col gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center ${feature.color} group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                      <feature.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-xs font-black text-slate-900 uppercase tracking-tight">
                          {t(feature.titleKey)}
                        </h3>
                        <Sparkles className="w-3 h-3 text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium leading-relaxed group-hover:text-slate-600 transition-colors">
                        {t(feature.descKey)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Middle Column */}
            <motion.div
              variants={itemVariants}
              className="flex justify-center order-1 md:order-2">
              <div className="relative group">
                <motion.div
                  animate={{
                    scale: [1.4, 1.6, 1.4],
                    opacity: [0.15, 0.25, 0.15],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-0 bg-primary-500 rounded-full blur-3xl"
                />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute inset-[-20px] border-2 border-dashed border-primary-200/40 rounded-full"
                />

                <Link to="/login">
                  <motion.div
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative z-10 w-32 h-32 bg-slate-900 text-white rounded-full flex flex-col items-center justify-center gap-2 shadow-2xl shadow-primary-900/40 group-hover:shadow-primary-600/30 transition-all duration-500 border-4 border-white overflow-hidden">
                    <motion.div
                      animate={{ y: [0, -4, 0] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}>
                      <LayoutDashboard className="w-6 h-6 text-primary-400" />
                    </motion.div>
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      {t('enter_portal')}
                    </span>

                    {/* Hover Shine Effect */}
                    <motion.div
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 0.6 }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"
                    />
                  </motion.div>
                </Link>
              </div>
            </motion.div>

            {/* Right Column */}
            <div className="space-y-6 order-3">
              {[features[1], features[3]].map((feature, idx) => (
                <motion.div
                  key={feature.titleKey}
                  variants={itemVariants}
                  whileHover={{
                    y: -5,
                    scale: 1.02,
                    transition: { duration: 0.2 },
                  }}
                  className={`glass-card p-5 rounded-2xl transition-all duration-300 group cursor-pointer border border-white/60 hover:border-primary-200 shadow-sm hover:shadow-xl ${feature.glow}`}>
                  <div className="flex flex-col gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center ${feature.color} group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300`}>
                      <feature.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-xs font-black text-slate-900 uppercase tracking-tight">
                          {t(feature.titleKey)}
                        </h3>
                        <Sparkles className="w-3 h-3 text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium leading-relaxed group-hover:text-slate-600 transition-colors">
                        {t(feature.descKey)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Social Proof */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="mt-20 flex items-center gap-12 grayscale hover:grayscale-0 transition-all duration-700">
          {[
            { icon: Users, text: "10k+ Students" },
            { icon: CheckCircle2, text: "ISO Certified" },
            { icon: LayoutDashboard, text: "24/7 Support" },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.1, y: -2 }}
              className="flex items-center gap-2 cursor-default">
              <stat.icon className="w-4 h-4 text-primary-600" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">
                {stat.text}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-slate-100 bg-white/50 backdrop-blur-sm mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-slate-400" />
            <p className="text-[10px] font-bold text-slate-400">
              © 2024 EduPortal Systems. All rights reserved.
            </p>
          </div>
          <div className="flex gap-6">
            {["Privacy", "Terms", "Cookies"].map((link) => (
              <Link
                key={link}
                to="#"
                className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary-600 transition-colors">
                {link}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
