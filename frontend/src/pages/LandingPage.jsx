import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import {
  GraduationCap,
  Trophy,
  ArrowRight,
  CheckCircle2,
  Users,
  User,
  Sparkles,
  Target,
  Brain,
  Award,
  TrendingUp,
  Clock,
  Shield,
  School,
  Home,
  ChevronLeft,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import LanguageToggle from "../components/LanguageToggle";

// Import Lottie animations
import trophyAnimation from "../assets/animations/Trophy.json";
import confettiAnimation from "../assets/animations/Confetti.json";
import checkMotionAnimation from "../assets/animations/Check Motion.json";

// Import Logos
import quizLogo from "../assets/quiz app logo.png";
import headerLogo from "../assets/header logo.png";

const LandingPage = () => {
  const { t, language } = useLanguage();

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

  // Journey Rounds Data
  const rounds = [
    {
      nameKey: "round_1_name",
      descKey: "round_1_desc",
      icon: Home,
      color: "from-emerald-500 to-teal-600",
      number: 1,
    },
    {
      nameKey: "round_2_name",
      descKey: "round_2_desc",
      icon: Target,
      color: "from-blue-500 to-indigo-600",
      number: 2,
    },
    {
      nameKey: "round_3_name",
      descKey: "round_3_desc",
      icon: Brain,
      color: "from-purple-500 to-pink-600",
      number: 3,
    },
    {
      nameKey: "round_4_name",
      descKey: "round_4_desc",
      icon: Trophy,
      color: "from-amber-500 to-orange-600",
      number: 4,
    },
  ];

  // Eligibility Criteria
  const eligibility = [
    {
      icon: User,
      titleKey: "eligibility_age",
      descKey: "eligibility_age_desc",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: GraduationCap,
      titleKey: "eligibility_class",
      descKey: "eligibility_class_desc",
      color: "bg-purple-100 text-purple-600",
    },
    {
      icon: School,
      titleKey: "eligibility_school",
      descKey: "eligibility_school_desc",
      color: "bg-emerald-100 text-emerald-600",
    },
  ];

  // Benefits Data
  const benefits = [
    {
      icon: Shield,
      titleKey: "benefit_1_title",
      descKey: "benefit_1_desc",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Award,
      titleKey: "benefit_2_title",
      descKey: "benefit_2_desc",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: TrendingUp,
      titleKey: "benefit_3_title",
      descKey: "benefit_3_desc",
      color: "from-emerald-500 to-teal-500",
    },
    {
      icon: Clock,
      titleKey: "benefit_4_title",
      descKey: "benefit_4_desc",
      color: "from-amber-500 to-orange-500",
    },
    {
      icon: Target,
      titleKey: "benefit_5_title",
      descKey: "benefit_5_desc",
      color: "from-rose-500 to-red-500",
    },
    {
      icon: Brain,
      titleKey: "benefit_6_title",
      descKey: "benefit_6_desc",
      color: "from-indigo-500 to-purple-500",
    },
  ];

  // How to Register Steps
  const howToSteps = [
    { titleKey: "how_step_1", descKey: "how_step_1_desc", icon: CheckCircle2 },
    { titleKey: "how_step_2", descKey: "how_step_2_desc", icon: Shield },
    { titleKey: "how_step_3", descKey: "how_step_3_desc", icon: CheckCircle2 },
    { titleKey: "how_step_4", descKey: "how_step_4_desc", icon: Sparkles },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-50 flex flex-col selection:bg-primary-100 selection:text-primary-700">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Confetti Animation - Subtle */}
        <div className="absolute inset-0 opacity-20">
          <Lottie
            animationData={confettiAnimation}
            loop={true}
            style={{ width: "100%", height: "100%" }}
          />
        </div>

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
          className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-amber-200/10 rounded-full blur-[100px]"
        />
      </div>

      {/* Navbar */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="h-16 glass-card sticky top-0 z-50 px-6 lg:px-12 flex items-center justify-between border-b-0 m-4 rounded-2xl shadow-soft"
      >
        <div className="flex items-center gap-3">
          <img
            src={headerLogo}
            alt={t("competition_name")}
            className="h-20 w-auto object-contain"
            loading="lazy"
          />
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-5">
            <a
              href="#eligibility"
              className="text-xs font-bold uppercase tracking-wide text-slate-500 hover:text-primary-600 transition-colors"
            >
              {t("eligibility_title")}
            </a>
            <a
              href="#journey"
              className="text-xs font-bold uppercase tracking-wide text-slate-500 hover:text-primary-600 transition-colors"
            >
              {t("journey_title")}
            </a>
          </div>
          <LanguageToggle />
        </div>
      </motion.nav>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center px-6 py-12 relative z-10">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20 space-y-6 max-w-4xl"
        >
          {/* Animated Heading - Above Logo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8"
          >
            {/* Tal box Enterprises - Character Animation */}
            <motion.h2
              className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-800 mb-2 tracking-tight"
              initial="hidden"
              animate="visible"
            >
              {"Tal box Enterprises".split("").map((char, index) => (
                <motion.span
                  key={`main-${index}`}
                  variants={{
                    hidden: { opacity: 0, y: 50, scale: 0 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      transition: {
                        delay: 0.3 + index * 0.05,
                        duration: 0.5,
                        type: "spring",
                        stiffness: 200,
                        damping: 10,
                      },
                    },
                  }}
                  whileHover={{
                    scale: 1.2,
                    color: "#6366f1",
                    transition: { duration: 0.2 },
                  }}
                  className="inline-block"
                  style={{ display: "inline-block" }}
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
            </motion.h2>

            {/* Quiz Talent Show - Character Animation */}
            <motion.p
              className="text-xl md:text-2xl lg:text-3xl font-semibold text-slate-500 tracking-wide"
              initial="hidden"
              animate="visible"
            >
              {"Quiz Talent Show".split("").map((char, index) => (
                <motion.span
                  key={`sub-${index}`}
                  variants={{
                    hidden: { opacity: 0, y: -30, rotate: -180 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      rotate: 0,
                      transition: {
                        delay: 1.2 + index * 0.04,
                        duration: 0.4,
                        type: "spring",
                        stiffness: 150,
                        damping: 12,
                      },
                    },
                  }}
                  whileHover={{
                    scale: 1.3,
                    rotate: [0, -10, 10, 0],
                    color: "#f59e0b",
                    transition: { duration: 0.3 },
                  }}
                  className="inline-block"
                  style={{ display: "inline-block" }}
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
            </motion.p>
          </motion.div>

          {/* Logo */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{
              scale: 1,
              opacity: 1,
              y: [0, -20, 0], // Floating effect
            }}
            transition={{
              scale: { duration: 0.8, delay: 0.4 },
              opacity: { duration: 0.8, delay: 0.4 },
              y: {
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.4
              }
            }}
            className="flex justify-center mb-8"
          >
            <motion.img
              src={quizLogo}
              alt={t("competition_name")}
              className="w-64 h-auto md:w-80 lg:w-96 object-contain"
              loading="lazy"
              style={{
                filter: "drop-shadow(0 10px 30px rgba(99, 102, 241, 0.3))"
              }}
              animate={{
                rotate: [0, 5, -5, 0], // Subtle rotation
                scale: [1, 1.05, 1], // Pulse effect
                filter: [
                  "drop-shadow(0 10px 30px rgba(99, 102, 241, 0.3))",
                  "drop-shadow(0 15px 40px rgba(251, 191, 36, 0.4))", // Glow effect
                  "drop-shadow(0 10px 30px rgba(99, 102, 241, 0.3))"
                ]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              whileHover={{
                scale: 1.1,
                rotate: [0, 2, -2, 0],
                transition: { duration: 0.3 }
              }}
            />
          </motion.div>

          <p className="text-lg text-slate-600 font-medium leading-relaxed max-w-3xl mx-auto">
            {t("hero_description")}
          </p>

          {/* CTA Button */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <Link to="/register">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative p-[3px] rounded-xl overflow-hidden"
                style={{
                  background: "linear-gradient(90deg, #ff0080, #ff8c00, #40e0d0, #00ff00, #9370db, #ff0080)",
                  backgroundSize: "200% 200%",
                }}
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                <button
                  className="px-8 py-4 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-xl font-bold shadow-xl shadow-primary-500/30 hover:shadow-2xl hover:shadow-primary-500/40 transition-all flex items-center gap-2 text-lg relative"
                >
                  <Sparkles className="w-5 h-5" />
                  {t("register_now")}
                  <ArrowRight className="w-5 h-5" />
                </button>
              </motion.div>
            </Link>

            <motion.a
              href="#journey"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white text-primary-600 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all border-2 border-primary-200 text-lg"
            >
              {t("how_to_register")}
            </motion.a>
          </div>

          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-8 mt-12 pt-8 border-t border-slate-200"
          >
            {[
              { icon: Users, count: "5000+", labelKey: "students_registered" },
              { icon: School, count: "500+", labelKey: "schools_participating" },
              { icon: Trophy, count: "₹10L", labelKey: "prize_worth" },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.1, y: -5 }}
                className="flex flex-col items-center gap-2 cursor-default"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-purple-100 rounded-xl flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-primary-600" />
                </div>
                <p className="text-2xl font-black text-slate-900">{stat.count}</p>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                  {t(stat.labelKey)}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* Competition Overview */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="w-full max-w-6xl mb-20"
        >
          <div className="glass-card rounded-3xl p-12 border border-white/60 shadow-xl">
            <motion.div variants={itemVariants} className="text-center mb-8">
              <h2 className="text-4xl font-black text-slate-900 mb-4">
                {t("overview_title")}
              </h2>
              <p className="text-xl font-bold text-primary-600 mb-6">
                {t("overview_question")}
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-6">
              <p className="text-lg text-slate-700 leading-relaxed text-center max-w-3xl mx-auto">
                {t("overview_answer")}
              </p>
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border-2 border-amber-200"
              >
                <p className="text-center text-lg font-bold text-amber-900">
                  {t("overview_opportunity")}
                </p>
              </motion.div>
            </motion.div>
          </div>
        </motion.section>

        {/* Journey - 4 Rounds */}
        <motion.section
          id="journey"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="w-full max-w-6xl mb-20"
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-4xl font-black text-slate-900 mb-3">
              {t("journey_title")}
            </h2>
            <p className="text-xl text-primary-600 font-bold">
              {t("journey_subtitle")}
            </p>
          </motion.div>

          {/* Rounds Timeline */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {rounds.map((round, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{ y: -10, scale: 1.03 }}
                className="glass-card p-6 rounded-2xl border border-white/60 shadow-lg hover:shadow-2xl transition-all relative overflow-hidden group"
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${round.color} opacity-0 group-hover:opacity-10 transition-opacity`} />

                {/* Round Number Badge */}
                <div className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <span className={`text-lg font-black bg-gradient-to-br ${round.color} bg-clip-text text-transparent`}>
                    {round.number}
                  </span>
                </div>

                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${round.color} flex items-center justify-center mb-4 shadow-lg`}>
                  <round.icon className="w-7 h-7 text-white" />
                </div>

                <h3 className="text-lg font-black text-slate-900 mb-2">
                  {t(round.nameKey)}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {t(round.descKey)}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.div
            variants={itemVariants}
            className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-200 text-center"
          >
            <p className="text-lg font-bold text-blue-900 flex items-center justify-center gap-2">
              <Home className="w-5 h-5" />
              {t("first_three_online")}
            </p>
          </motion.div>
        </motion.section>

        {/* Eligibility Criteria */}
        <motion.section
          id="eligibility"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="w-full max-w-6xl mb-20"
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-4xl font-black text-slate-900 mb-3">
              {t("eligibility_title")}
            </h2>
            <p className="text-xl text-primary-600 font-bold">
              {t("eligibility_subtitle")}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {eligibility.map((item, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{ y: -8, scale: 1.05 }}
                className="glass-card p-8 rounded-2xl border border-white/60 shadow-lg hover:shadow-2xl transition-all text-center"
              >
                <div className={`w-16 h-16 rounded-2xl ${item.color} flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                  <item.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2">
                  {t(item.titleKey)}
                </h3>
                <p className="text-sm text-slate-600 font-medium">
                  {t(item.descKey)}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.div
            variants={itemVariants}
            className="mt-8 p-6 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border-2 border-emerald-200 text-center"
          >
            <p className="text-lg font-bold text-emerald-900">
              ✨ {t("all_eligible")} ✨
            </p>
          </motion.div>
        </motion.section>

        {/* Benefits Section */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="w-full max-w-6xl mb-20"
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-4xl font-black text-slate-900 mb-3">
              {t("benefits_title")}
            </h2>
            <p className="text-xl text-primary-600 font-bold">
              {t("benefits_subtitle")}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.02 }}
                className="glass-card p-6 rounded-2xl border border-white/60 shadow-lg hover:shadow-xl transition-all group"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${benefit.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                  <benefit.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-black text-slate-900 mb-2">
                  {t(benefit.titleKey)}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {t(benefit.descKey)}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* How to Register */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="w-full max-w-5xl mb-20"
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-4xl font-black text-slate-900 mb-3">
              {t("how_to_register")}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {howToSteps.map((step, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="relative"
              >
                <div className="glass-card p-6 rounded-2xl border border-white/60 shadow-lg text-center h-full flex flex-col items-center justify-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-purple-500 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                    <step.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center mb-3 font-black">
                    {idx + 1}
                  </div>
                  <h3 className="text-base font-black text-slate-900 mb-2">
                    {t(step.titleKey)}
                  </h3>
                  <p className="text-xs text-slate-600">
                    {t(step.descKey)}
                  </p>
                </div>

                {idx < howToSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 z-10">
                    <ArrowRight className="w-6 h-6 text-primary-400" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Final CTA */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="w-full max-w-4xl mb-12"
        >
          <motion.div
            variants={itemVariants}
            className="glass-card rounded-3xl p-12 border border-white/60 shadow-2xl text-center relative overflow-hidden"
          >
            {/* Trophy Animation Background */}
            <div className="absolute inset-0 flex items-center justify-center opacity-10">
              <Lottie
                animationData={trophyAnimation}
                loop={true}
                style={{ width: "300px", height: "300px" }}
              />
            </div>

            <div className="relative z-10">
              <h2 className="text-4xl font-black text-slate-900 mb-4">
                {t("dont_miss_out")}!
              </h2>
              <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
                {t("stay_tuned")}
              </p>

              <Link to="/register">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-12 py-5 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-xl font-black shadow-2xl shadow-primary-500/40 hover:shadow-3xl hover:shadow-primary-500/50 transition-all flex items-center gap-3 text-xl mx-auto"
                >
                  <Trophy className="w-6 h-6" />
                  {t("start_your_journey")}
                  <ArrowRight className="w-6 h-6" />
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </motion.section>
      </main>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-slate-200 bg-white/50 backdrop-blur-sm mt-auto relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <Trophy className="w-5 h-5 text-primary-600" />
            <p className="text-xs font-bold text-slate-600">
              © 2026 {t("competition_name")}. All rights reserved.
            </p>
          </div>

          <div className="flex flex-wrap gap-6 justify-center">
            {[
              { key: "terms_and_conditions", href: "#" },
              { key: "privacy_policy", href: "#" },
              { key: "contact_support", href: "#" },
            ].map((link, idx) => (
              <a
                key={idx}
                href={link.href}
                className="text-xs font-bold uppercase tracking-wide text-slate-500 hover:text-primary-600 transition-colors"
              >
                {t(link.key)}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
