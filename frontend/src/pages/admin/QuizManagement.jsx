import React, { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Calendar,
  Clock,
  Users,
  ExternalLink,
  Copy,
  Trash2,
  Edit,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { motion } from "framer-motion";
import QuizEditorModal from "../../components/QuizEditorModal";
import StatusModal from "../../components/StatusModal";
import QuizActionsModal from "../../components/QuizActionsModal";

const QuizManagement = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("Active");
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [statusModal, setStatusModal] = useState({
    isOpen: false,
    type: "info",
    title: "",
    message: "",
    showCancel: false,
    onConfirm: null,
  });

  const handleCreate = () => {
    setEditingQuiz(null);
    setIsEditorOpen(true);
  };

  const handleEdit = (quiz) => {
    setEditingQuiz(quiz);
    setIsEditorOpen(true);
  };

  const handleAction = (type, quiz) => {
    switch (type) {
      case "edit":
        handleEdit(quiz);
        break;
      case "copy":
        setStatusModal({
          isOpen: true,
          type: "success",
          title: t('link_copied'),
          message:
            t('link_copied_msg'),
          showCancel: false,
        });
        break;
      case "view":
        window.open(quiz.link, "_blank");
        break;
      case "results":
        // Navigate to results or show results modal
        console.log("Viewing results for quiz:", quiz.id);
        break;
      case "delete":
        setStatusModal({
          isOpen: true,
          type: "warning",
          title: t('delete_quiz'),
          message: `Are you sure you want to delete "${quiz.title}"? This will remove all associated responses.`,
          showCancel: true,
          confirmText: t('delete'),
          onConfirm: () => console.log(`Deleted quiz: ${quiz.id}`),
        });
        break;
      default:
        break;
    }
  };

  const quizzes = [
    {
      id: 1,
      title: "Entrance Assessment 2024",
      description:
        "Mandatory screening quiz for new computer science enrollments.",
      category: "Screening",
      questions: 25,
      timeLimit: "45 mins",
      status: "Active",
      responses: 420,
      lastModified: "2 days ago",
      type: "Google Form",
      link: "https://forms.google.com/quiz-1",
    },
    {
      id: 2,
      title: "Mid-Term Python Basics",
      description:
        "Assessment covering basic syntax, loops, and data structures.",
      category: "Academic",
      questions: 40,
      timeLimit: "60 mins",
      status: "Draft",
      responses: 0,
      lastModified: "5 hours ago",
      type: "Internal",
      link: "#",
    },
    {
      id: 3,
      title: "Scholarship Test - Phase 1",
      description: "Advanced logic and problem solving for merit students.",
      category: "Scholarship",
      questions: 50,
      timeLimit: "90 mins",
      status: "Active",
      responses: 156,
      lastModified: "1 week ago",
      type: "Google Form",
      link: "https://forms.google.com/quiz-2",
    },
    {
      id: 4,
      title: "Placement Preparation #4",
      description: "Mock test for final year students focusing on aptitude.",
      category: "Placement",
      questions: 30,
      timeLimit: "40 mins",
      status: "Archived",
      responses: 890,
      lastModified: "1 month ago",
      type: "Internal",
      link: "#",
    },
  ];

  const filteredQuizzes = quizzes.filter((quiz) => {
    const matchesSearch =
      quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quiz.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "All" || quiz.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-600 border-green-200";
      case "Draft":
        return "bg-slate-100 text-slate-500 border-slate-200";
      case "Archived":
        return "bg-orange-100 text-orange-600 border-orange-200";
      default:
        return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              {t('quiz_management')}
            </h2>
            <p className="text-sm text-slate-500 font-medium mt-1">
              {t('quiz_management_desc')}
            </p>
          </div>
          <button
            onClick={handleCreate}
            className="btn-modern-primary !py-2.5 !px-5 flex items-center justify-center gap-2">
            <Plus className="w-5 h-5" />
            <span className="text-xs font-bold">{t('create_new_quiz')}</span>
          </button>
        </div>

        {/* Editor Modal */}
        <QuizEditorModal
          isOpen={isEditorOpen}
          onClose={() => setIsEditorOpen(false)}
          quiz={editingQuiz}
        />

        <QuizActionsModal
          isOpen={isActionsOpen}
          onClose={() => setIsActionsOpen(false)}
          quiz={selectedQuiz}
          onAction={handleAction}
        />

        <StatusModal
          {...statusModal}
          onClose={() => setStatusModal({ ...statusModal, isOpen: false })}
        />

        {/* Search & Tabs */}
        <div className="flex flex-col lg:flex-row gap-5 items-stretch lg:items-center justify-between">
          <div className="flex bg-slate-100 p-1 rounded-2xl w-fit">
            {["All", "Active", "Draft", "Archived"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${activeTab === tab
                  ? "bg-white text-primary-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
                  }`}>
                {t(tab.toLowerCase())}
              </button>
            ))}
          </div>
          <div className="relative flex-1 lg:max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
            <input
              type="text"
              placeholder={t('search_quizzes_placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="modern-input !pl-12 !py-2.5 bg-white border-slate-100 shadow-sm w-full"
            />
          </div>
        </div>

        {/* Quiz Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredQuizzes.length > 0 ? (
            filteredQuizzes.map((quiz) => (
              <motion.div
                layout
                key={quiz.id}
                className="glass-card rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-100 transition-all group flex flex-col">
                <div className="p-6 flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-primary-50 text-primary-600 group-hover:scale-110 transition-transform duration-500`}>
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${getStatusBadge(
                        quiz.status
                      )}`}>
                      {quiz.status}
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-slate-900 group-hover:text-primary-600 transition-colors line-clamp-1">
                    {quiz.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-2 line-clamp-2 leading-relaxed">
                    {quiz.description}
                  </p>

                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                        <Clock className="w-3 h-3" />
                        {t('duration')}
                      </p>
                      <p className="text-xs font-bold text-slate-700">
                        {quiz.timeLimit}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                        <Users className="w-3 h-3" />
                        {t('responses')}
                      </p>
                      <p className="text-xs font-bold text-slate-700">
                        {quiz.responses}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                    <Calendar className="w-3 h-3" />
                    {t('modified')} {quiz.lastModified}
                  </div>
                  <button
                    onClick={() => {
                      setSelectedQuiz(quiz);
                      setIsActionsOpen(true);
                    }}
                    className="p-2 rounded-lg hover:bg-white hover:shadow-sm text-slate-400 hover:text-primary-600 transition-all group/btn"
                    title="More Options">
                    <MoreVertical className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-16 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 rounded-3xl bg-slate-50 flex items-center justify-center text-slate-300 mb-4">
                <BookOpen className="w-10 h-10" />
              </div>
              <h3 className="text-lg font-black text-slate-900">
                {t('no_quizzes_found')}
              </h3>
              <p className="text-sm text-slate-500 font-medium mt-1 max-w-xs">
                {t('no_quizzes_desc')}
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setActiveTab("Active");
                }}
                className="mt-6 text-xs font-black text-primary-600 hover:text-primary-700 uppercase tracking-widest">
                {t('clear_all_filters')}
              </button>
            </div>
          )}

          {/* Create New Placeholder */}
          <button
            onClick={handleCreate}
            className="rounded-3xl border-2 border-dashed border-slate-200 p-8 flex flex-col items-center justify-center text-slate-400 hover:border-primary-300 hover:bg-primary-50/30 hover:text-primary-600 transition-all group min-h-[280px]">
            <div className="w-14 h-14 rounded-full bg-slate-50 flex items-center justify-center mb-4 group-hover:bg-primary-100 transition-colors">
              <Plus className="w-8 h-8" />
            </div>
            <p className="font-black text-sm uppercase tracking-widest">
              {t('add_new_quiz_card')}
            </p>
            <p className="text-xs font-medium mt-1">
              {t('start_scratch_desc')}
            </p>
          </button>
        </div>

        {/* Footer Info */}
        <div className="p-6 rounded-3xl bg-primary-600 text-white relative overflow-hidden shadow-xl shadow-primary-100">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <h4 className="text-lg font-black">{t('google_forms_integration')}</h4>
              <p className="text-primary-100 text-xs font-medium max-w-md">
                {t('integration_desc')}
              </p>
            </div>
            <button
              onClick={() =>
                setStatusModal({
                  isOpen: true,
                  type: "info",
                  title: t('integration_guide'),
                  message:
                    t('integration_guide_msg'),
                  showCancel: false,
                })
              }
              className="px-6 py-2.5 rounded-xl bg-white text-primary-600 font-black text-xs hover:bg-primary-50 transition-all whitespace-nowrap">
              {t('learn_how_it_works')}
            </button>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl -ml-20 -mb-20"></div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default QuizManagement;
