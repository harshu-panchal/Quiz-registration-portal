import React, { useState, useEffect } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Clock,
  Download,
  ExternalLink,
  MessageSquare,
  User,
  FileText,
  ChevronRight,
  ShieldCheck,
  Zap,
  CreditCard,
  GraduationCap,
  Phone,
  School,
  MapPin,
  Calendar,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { authService } from "../../services/authService";
import { handleApiError } from "../../utils/errorHandler";

const StudentDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [studentData, setStudentData] = useState(null);

  // Fetch student data on mount
  useEffect(() => {
    fetchStudentData();
  }, []);

  const fetchStudentData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get current user details from backend
      const response = await authService.getCurrentUser();
      setStudentData(response.data);
    } catch (err) {
      const errorInfo = handleApiError(err);
      setError(errorInfo.message);
    } finally {
      setLoading(false);
    }
  };

  // Use fetched data or fallback to user from context
  const student = studentData || {
    studentId: user?._id?.slice(-8) || "N/A",
    name: user?.name || "Student",
    email: user?.email || "N/A",
    phone: "N/A",
    school: "N/A",
    studentClass: "N/A",
    city: "N/A",
    state: "N/A",
    age: "N/A",
    regDate: "N/A",
    paymentStatus: "PAID",
    quizStatus: "PENDING",
    quizLink: "#",
    messages: [],
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const item = {
    hidden: { y: 15, opacity: 0 },
    show: { y: 0, opacity: 1 },
  };

  return (
    <DashboardLayout role="student">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="xl:col-span-2 space-y-6">
          {/* Hero Banner */}
          <motion.div
            variants={item}
            className="relative overflow-hidden rounded-3xl bg-slate-900 p-6 sm:p-8 text-white shadow-xl">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary-500/20 border border-primary-500/30 text-primary-300 text-[10px] font-black uppercase tracking-widest">
                  <ShieldCheck className="w-3 h-3" />
                  Verified
                </div>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
                  Welcome back, <br />
                  <span className="text-primary-400">
                    {student.name.split(" ")[0]}!
                  </span>
                </h2>
                <p className="text-slate-400 text-sm max-w-sm font-medium">
                  Registration{" "}
                  <span className="text-white font-bold">
                    #{student.studentId}
                  </span>{" "}
                  is active.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 w-full md:w-auto">
                <div className="glass-card p-4 rounded-2xl text-center flex-1">
                  <p className="text-xl font-black text-white">100%</p>
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-0.5">
                    Payment
                  </p>
                </div>
                <div className="glass-card p-4 rounded-2xl text-center border-primary-500/30 bg-primary-500/10 flex-1">
                  <p className="text-xl font-black text-primary-400">1/1</p>
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-0.5">
                    Quizzes
                  </p>
                </div>
              </div>
            </div>

            {/* Abstract Background Elements */}
            <div className="absolute -top-16 -right-16 w-48 h-48 bg-primary-600/20 rounded-full blur-[80px]"></div>
            <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-blue-600/10 rounded-full blur-[80px]"></div>
          </motion.div>

          {/* Profile Overview */}
          <motion.div
            variants={item}
            className="glass-card rounded-3xl p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div className="space-y-0.5">
                <h3 className="text-lg font-black text-slate-900">
                  Profile Details
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Registration & academic info.
                </p>
              </div>
              <button className="btn-modern-outline !py-1.5 !px-3.5 w-full sm:w-auto">
                Edit
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              <div className="space-y-4">
                {[
                  {
                    label: "Student ID",
                    value: student.studentId,
                    icon: ShieldCheck,
                  },
                  { label: "Full Name", value: student.name, icon: User },
                  { label: "Email", value: student.email, icon: FileText },
                  { label: "Phone", value: student.phone, icon: Phone },
                ].map((info) => (
                  <div
                    key={info.label}
                    className="flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary-50 group-hover:text-primary-600 transition-all shrink-0">
                      <info.icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 truncate">
                        {info.label}
                      </p>
                      <p className="text-slate-900 font-bold text-xs truncate">
                        {info.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-4">
                {[
                  { label: "School", value: student.school, icon: School },
                  {
                    label: "Class",
                    value: student.studentClass,
                    icon: GraduationCap,
                  },
                  { label: "Age", value: student.age, icon: Calendar },
                  {
                    label: "City",
                    value: `${student.city}, ${student.state}`,
                    icon: MapPin,
                  },
                ].map((info) => (
                  <div
                    key={info.label}
                    className="flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary-50 group-hover:text-primary-600 transition-all shrink-0">
                      <info.icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 truncate">
                        {info.label}
                      </p>
                      <p className="text-slate-900 font-bold text-xs truncate">
                        {info.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-4">
                {[
                  { label: "Reg. Date", value: student.regDate, icon: Clock },
                  {
                    label: "Payment",
                    value: student.paymentStatus,
                    icon: CreditCard,
                    badge: true,
                  },
                ].map((info) => (
                  <div
                    key={info.label}
                    className="flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary-50 group-hover:text-primary-600 transition-all shrink-0">
                      <info.icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 truncate">
                        {info.label}
                      </p>
                      {info.badge ? (
                        <span className="stat-badge bg-green-100 text-green-600 mt-0.5 inline-block">
                          {info.value}
                        </span>
                      ) : (
                        <p className="text-slate-900 font-bold text-xs truncate">
                          {info.value}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Quiz CTA */}
          <motion.div
            variants={item}
            className="group relative overflow-hidden rounded-3xl bg-primary-600 p-[1px] transition-all hover:shadow-xl hover:shadow-primary-100">
            <div className="bg-white rounded-[1.4rem] p-6 flex flex-col md:flex-row items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600 group-hover:scale-105 transition-transform duration-500 shrink-0">
                <FileText className="w-7 h-7" />
              </div>
              <div className="flex-1 space-y-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-1.5 text-primary-600">
                  <Clock className="w-3.5 h-3.5" />
                  <span className="text-[9px] font-black uppercase tracking-widest">
                    Status: {student.quizStatus}
                  </span>
                </div>
                <h4 className="text-xl font-black text-slate-900">
                  Entrance Quiz
                </h4>
                <p className="text-slate-500 text-xs font-medium">
                  Complete the Google Form quiz to finalize enrollment.
                </p>
              </div>
              <a
                href={student.quizLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-modern-primary flex items-center gap-2 w-full md:w-auto justify-center !py-2.5 !px-5">
                Start Quiz
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Status Tracker */}
          <motion.div variants={item} className="glass-card rounded-3xl p-6">
            <h3 className="text-base font-black text-slate-900 mb-6">
              Track Progress
            </h3>
            <div className="space-y-6 relative">
              <div className="absolute left-[19px] top-2 bottom-2 w-[1.5px] bg-slate-100"></div>

              {[
                {
                  title: "Registration",
                  desc: "Fee Paid",
                  status: "done",
                  icon: CheckCircle2,
                },
                {
                  title: "Quiz Sent",
                  desc: "Link Delivered",
                  status: "done",
                  icon: CheckCircle2,
                },
                {
                  title: "Completion",
                  desc: "Sync Pending",
                  status: "pending",
                  icon: Clock,
                },
              ].map((step, idx) => (
                <div key={idx} className="flex items-start gap-4 relative z-10">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm shrink-0 ${step.status === "done"
                      ? "bg-primary-600 text-white"
                      : "bg-white text-slate-300 border border-slate-100"
                      }`}>
                    <step.icon className="w-4 h-4" />
                  </div>
                  <div className="pt-1">
                    <p className="text-xs font-black text-slate-900 leading-none">
                      {step.title}
                    </p>
                    <p className="text-[10px] text-slate-400 font-bold mt-1">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Messages */}
          <motion.div variants={item} className="glass-card rounded-3xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-base font-black text-slate-900">
                Notifications
              </h3>
              <div className="w-5 h-5 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-[10px] font-black">
                2
              </div>
            </div>
            <div className="space-y-4">
              {(student.messages || []).map((msg) => (
                <div
                  key={msg.id}
                  className="p-3.5 rounded-2xl bg-slate-50/50 border border-slate-100 hover:bg-white hover:shadow-sm transition-all group">
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-[10px] font-black text-primary-600 uppercase tracking-wider">
                      {msg.sender}
                    </p>
                    <p className="text-[9px] text-slate-400 font-medium">
                      {msg.date}
                    </p>
                  </div>
                  <p className="text-xs text-slate-700 font-medium leading-relaxed">
                    {msg.text}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Download Receipt */}
          <motion.div variants={item}>
            <button className="w-full btn-modern-outline !py-3.5 flex items-center justify-center gap-2 rounded-2xl">
              <Download className="w-4 h-4" />
              Download Fee Receipt
            </button>
          </motion.div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
