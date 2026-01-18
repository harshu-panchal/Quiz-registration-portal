import React, { useState } from "react";
import Modal from "./Modal";
import StatusModal from "./StatusModal";
import ContactStudentModal from "./ContactStudentModal";
import ReportOptionsModal from "./ReportOptionsModal";
import {
  Mail,
  Calendar,
  GraduationCap,
  CheckCircle2,
  Clock,
  BarChart3,
  Award,
  ArrowUpRight,
  School,
  MapPin,
  Phone,
  User,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

const StudentDetailsModal = ({ isOpen, onClose, student }) => {
  const { t } = useLanguage();
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [statusModal, setStatusModal] = useState({
    isOpen: false,
    type: "info",
    title: "",
    message: "",
  });

  if (!student) return null;

  const quizHistory = [
    {
      title: "Entrance Assessment",
      score: "92%",
      date: "Oct 20, 2023",
      status: "Passed",
    },
    {
      title: "Python Basics",
      score: "88%",
      date: "Oct 24, 2023",
      status: "Passed",
    },
    {
      title: "Data Structures",
      score: "74%",
      date: "Oct 28, 2023",
      status: "Review",
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('student_profile')}
      maxWidth="max-w-2xl">
      <div className="space-y-8">
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-slate-50 rounded-3xl border border-slate-100">
          <div className="relative group">
            <img
              src={student.avatar}
              alt={student.name}
              className="w-24 h-24 rounded-3xl object-cover ring-4 ring-white shadow-xl"
            />
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-xl border-4 border-slate-50 flex items-center justify-center shadow-lg">
              <CheckCircle2 className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="text-center sm:text-left space-y-1">
            <h3 className="text-2xl font-black text-slate-900">
              {student.name}
            </h3>
            <p className="text-sm text-slate-500 font-medium flex items-center justify-center sm:justify-start gap-2">
              <Mail className="w-3.5 h-3.5" />
              {student.email}
            </p>
            <div className="flex items-center justify-center sm:justify-start gap-2 mt-3">
              <span className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
                <GraduationCap className="w-3 h-3 text-primary-600" />
                {student.level}
              </span>
              <span className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
                <Calendar className="w-3 h-3 text-primary-600" />
                {t('joined')} {student.joinDate || "Oct 2023"}
              </span>
            </div>
          </div>
        </div>

        {/* Detailed Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
              {t('academic_details')}
            </h4>
            <div className="space-y-2">
              <div className="flex items-center gap-3 text-slate-600">
                <School className="w-4 h-4 text-primary-500" />
                <span className="text-xs font-bold">
                  {student.school || "N/A"}
                </span>
              </div>
              <div className="flex items-center gap-3 text-slate-600">
                <GraduationCap className="w-4 h-4 text-primary-500" />
                <span className="text-xs font-bold">
                  {student.class || student.level || "N/A"}
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
              {t('personal_contact')}
            </h4>
            <div className="space-y-2">
              <div className="flex items-center gap-3 text-slate-600">
                <Phone className="w-4 h-4 text-primary-500" />
                <span className="text-xs font-bold">
                  {student.phone || "N/A"}
                </span>
              </div>
              <div className="flex items-center gap-3 text-slate-600">
                <User className="w-4 h-4 text-primary-500" />
                <span className="text-xs font-bold">
                  {student.age ? `${student.age} ${t('years_old')}` : "N/A"}
                </span>
              </div>
              <div className="flex items-center gap-3 text-slate-600">
                <MapPin className="w-4 h-4 text-primary-500" />
                <span className="text-xs font-bold">
                  {[student.city, student.state].filter(Boolean).join(", ") ||
                    "N/A"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="glass-card p-4 rounded-2xl border border-slate-100 bg-white shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
              {t('avg_score')}
            </p>
            <div className="flex items-baseline gap-2">
              <h4 className="text-xl font-black text-slate-900">84.7%</h4>
              <span className="text-[10px] font-black text-green-600 flex items-center">
                <ArrowUpRight className="w-3 h-3" /> 2.4%
              </span>
            </div>
          </div>
          <div className="glass-card p-4 rounded-2xl border border-slate-100 bg-white shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
              {t('quizzes_done')}
            </p>
            <h4 className="text-xl font-black text-slate-900">12</h4>
          </div>
          <div className="glass-card p-4 rounded-2xl border border-slate-100 bg-white shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
              {t('consistency')}
            </p>
            <div className="flex items-center gap-2">
              <h4 className="text-xl font-black text-slate-900">92%</h4>
              <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-primary-600 w-[92%]"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Quiz History */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">
              {t('recent_activity')}
            </h4>
            <button
              onClick={() =>
                setStatusModal({
                  isOpen: true,
                  type: "info",
                  title: "Student Activity",
                  message: `Viewing full activity history for ${student.name}. This will show all quiz attempts and performance trends.`,
                })
              }
              className="text-[11px] font-black text-primary-600 hover:underline">
              {t('view_all')}
            </button>
          </div>
          <div className="space-y-3">
            {quizHistory.map((quiz, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 flex items-center justify-between group hover:border-primary-100 hover:bg-white transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-primary-600 shadow-sm border border-slate-100">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      {quiz.title}
                    </p>
                    <p className="text-[11px] text-slate-500 font-medium">
                      {quiz.date}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-slate-900">
                    {quiz.score}
                  </p>
                  <span
                    className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${quiz.status === "Passed"
                      ? "bg-green-100 text-green-600"
                      : "bg-orange-100 text-orange-600"
                      }`}>
                    {quiz.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t border-slate-100">
          <button
            onClick={() => setIsReportOpen(true)}
            className="flex-1 btn-modern-outline !py-3 !text-xs font-black">
            {t('generate_report')}
          </button>
          <button
            onClick={() => setIsContactOpen(true)}
            className="flex-1 btn-modern-primary !py-3 !text-xs font-black">
            {t('contact_student')}
          </button>
        </div>

        <ContactStudentModal
          isOpen={isContactOpen}
          onClose={() => setIsContactOpen(false)}
          student={student}
        />

        <ReportOptionsModal
          isOpen={isReportOpen}
          onClose={() => setIsReportOpen(false)}
          student={student}
        />

        <StatusModal
          isOpen={statusModal.isOpen}
          onClose={() => setStatusModal((prev) => ({ ...prev, isOpen: false }))}
          type={statusModal.type}
          title={statusModal.title}
          message={statusModal.message}
          onConfirm={statusModal.onConfirm}
          showCancel={statusModal.showCancel}
        />
      </div>
    </Modal>
  );
};

export default StudentDetailsModal;
