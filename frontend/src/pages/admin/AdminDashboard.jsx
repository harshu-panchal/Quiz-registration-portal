import React, { useState, useEffect } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import {
  Users,
  Send,
  Clock,
  Search,
  Download,
  Plus,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Filter,
  X,
  Mail,
  UserCheck,
  Trash2,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AddStudentModal from "../../components/AddStudentModal";
import QuizEditorModal from "../../components/QuizEditorModal";
import StudentDetailsModal from "../../components/StudentDetailsModal";
import QuickActionsModal from "../../components/QuickActionsModal";
import ContactStudentModal from "../../components/ContactStudentModal";
import FilterOptionsModal from "../../components/FilterOptionsModal";
import StatusModal from "../../components/StatusModal";
import ExportOptionsModal from "../../components/ExportOptionsModal";
import { analyticsService } from "../../services/analyticsService";
import { studentService } from "../../services/studentService";
import { handleApiError } from "../../utils/errorHandler";

const AdminDashboard = () => {
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [isQuizEditorOpen, setIsQuizEditorOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [statusModal, setStatusModal] = useState({
    isOpen: false,
    type: "info",
    title: "",
    message: "",
  });

  const [selectedFilter, setSelectedFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState({
    status: "All",
    class: "All",
    school: "All",
    dateRange: "All Time",
  });

  // API state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState([
    {
      label: "Total Students",
      value: "0",
      change: "0%",
      icon: Users,
      color: "text-primary-600",
      bg: "bg-primary-50",
    },
    {
      label: "Quizzes Sent",
      value: "0",
      change: "0%",
      icon: Send,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      label: "Pending Response",
      value: "0",
      change: "0%",
      icon: Clock,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
  ]);
  const [students, setStudents] = useState([]);

  // Fetch dashboard data
  useEffect(() => {
    fetchDashboardData();
  }, [searchQuery, selectedFilter]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch analytics and students in parallel
      const [analyticsRes, studentsRes] = await Promise.all([
        analyticsService.getDashboardAnalytics(),
        studentService.getStudents({
          page: 1,
          limit: 5,
          search: searchQuery || undefined,
          status: selectedFilter !== 'All' ? selectedFilter : undefined
        })
      ]);

      if (analyticsRes.data?.stats) {
        setStats(analyticsRes.data.stats);
      }
      setStudents(studentsRes.data || []);
    } catch (err) {
      const errorInfo = handleApiError(err);
      setError(errorInfo.message);
    } finally {
      setLoading(false);
    }
  };

  const handleViewStudent = (student) => {
    setSelectedStudent(student);
    setIsDetailsOpen(true);
  };

  const handleExport = () => {
    setIsExportOpen(true);
  };

  const handleFilterClick = () => {
    setIsFilterOpen(true);
  };

  const handleQuickAction = (actionId, student) => {
    setSelectedStudent(student);
    if (actionId === "view") {
      setIsDetailsOpen(true);
    } else if (actionId === "edit") {
      setIsAddStudentOpen(true);
    } else if (actionId === "contact") {
      setIsContactOpen(true);
    } else if (actionId === "delete") {
      setStatusModal({
        isOpen: true,
        type: "confirm",
        title: "Delete Student",
        message: `Are you sure you want to delete ${student.name}? This action cannot be undone.`,
        onConfirm: () => {
          console.log(`Deleting student: ${student._id}`);
          setStatusModal({
            isOpen: true,
            type: "success",
            title: "Student Deleted",
            message: `${student.name} has been removed from the system.`,
          });
        },
      });
    }
  };

  const filteredStudents = students;

  const toggleSelectAll = () => {
    if (
      selectedStudents.length === filteredStudents.length &&
      filteredStudents.length > 0
    ) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredStudents.map((s) => s.id));
    }
  };

  const toggleSelectStudent = (id) => {
    if (selectedStudents.includes(id)) {
      setSelectedStudents(selectedStudents.filter((sid) => sid !== id));
    } else {
      setSelectedStudents([...selectedStudents, id]);
    }
  };

  const handleBulkAction = (action) => {
    setStatusModal({
      isOpen: true,
      type: action === "Delete" ? "warning" : "success",
      title: action === "Delete" ? "Confirm Deletion" : "Action Successful",
      message:
        action === "Delete"
          ? `Are you sure you want to delete ${selectedStudents.length} selected students?`
          : `${action} has been performed on ${selectedStudents.length} students.`,
      showCancel: action === "Delete",
      onConfirm: () => {
        console.log(`${action} on ${selectedStudents.length} students`);
        setSelectedStudents([]);
      },
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-600";
      case "Sent":
        return "bg-blue-100 text-blue-600";
      case "Pending Quiz":
        return "bg-orange-100 text-orange-600";
      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-slate-900">
              Student Overview
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Manage enrollments and quizzes.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExport}
              className="flex-1 sm:flex-none btn-modern-outline !py-1.5 !px-3.5 flex items-center justify-center gap-2">
              <Download className="w-3.5 h-3.5" />
              <span className="text-[11px] font-bold">Export</span>
            </button>
            <button
              onClick={() => {
                setSelectedStudent(null);
                setIsAddStudentOpen(true);
              }}
              className="flex-1 sm:flex-none btn-modern-primary !py-1.5 !px-3.5 flex items-center justify-center gap-2">
              <Plus className="w-3.5 h-3.5" />
              <span className="text-[11px] font-bold">Add Student</span>
            </button>
          </div>
        </div>

        {/* Modal */}
        <AddStudentModal
          isOpen={isAddStudentOpen}
          onClose={() => setIsAddStudentOpen(false)}
          student={selectedStudent}
        />

        <QuizEditorModal
          isOpen={isQuizEditorOpen}
          onClose={() => setIsQuizEditorOpen(false)}
        />

        <StudentDetailsModal
          isOpen={isDetailsOpen}
          onClose={() => setIsDetailsOpen(false)}
          student={selectedStudent}
        />

        <QuickActionsModal
          isOpen={isQuickActionsOpen}
          onClose={() => setIsQuickActionsOpen(false)}
          student={selectedStudent}
          onAction={handleQuickAction}
        />

        <ContactStudentModal
          isOpen={isContactOpen}
          onClose={() => setIsContactOpen(false)}
          student={selectedStudent}
        />

        <FilterOptionsModal
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          onApply={(filters) => {
            setActiveFilters(filters);
            setIsFilterOpen(false);
          }}
          currentFilters={activeFilters}
        />

        <StatusModal
          {...statusModal}
          onClose={() => setStatusModal({ ...statusModal, isOpen: false })}
        />

        <ExportOptionsModal
          isOpen={isExportOpen}
          onClose={() => setIsExportOpen(false)}
          title="Export Student Overview"
        />

        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs font-bold text-red-900">Failed to load dashboard data</p>
              <p className="text-xs text-red-700 mt-1">{error}</p>
            </div>
            <button
              onClick={fetchDashboardData}
              className="text-xs font-bold text-red-600 hover:text-red-700 underline">
              Retry
            </button>
          </motion.div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="glass-card p-4 rounded-2xl flex items-center justify-between group hover:border-primary-200 transition-all">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">
                  {stat.label}
                </p>
                <div className="flex items-baseline gap-2">
                  <h4 className="text-xl font-black text-slate-900">
                    {stat.value}
                  </h4>
                  <span
                    className={`text-[9px] font-black px-1.5 py-0.5 rounded-md ${stat.change.startsWith("+")
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                      }`}>
                    {stat.change}
                  </span>
                </div>
              </div>
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
          ))}
        </div>

        {/* Filters and Search */}
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row flex-1 items-stretch sm:items-center gap-3">
              <div className="relative flex-1 lg:max-w-xs group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="modern-input !pl-10 !py-2 bg-slate-50 border-transparent focus:bg-white w-full"
                />
              </div>
              <button
                onClick={handleFilterClick}
                className="btn-modern-outline !py-2 !px-3 flex items-center justify-center gap-2">
                <Filter className="w-3.5 h-3.5" />
                <span className="text-[11px] font-bold">Filters</span>
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide flex-1">
                {["All", "Pending", "Sent", "Done"].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setSelectedFilter(filter)}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all ${selectedFilter === filter
                      ? "bg-primary-600 text-white shadow-sm"
                      : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                      }`}>
                    {filter}
                  </button>
                ))}
              </div>
              <div className="hidden sm:block w-px h-6 bg-slate-200 mx-1" />
              <button
                onClick={() => setIsQuizEditorOpen(true)}
                className="btn-modern-primary !py-2 !px-4 flex items-center justify-center gap-2 whitespace-nowrap">
                <Send className="w-3.5 h-3.5" />
                <span className="text-[11px] font-bold">Send Quiz</span>
              </button>
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto relative">
            <AnimatePresence>
              {selectedStudents.length > 0 && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-6 whitespace-nowrap">
                  <div className="flex items-center gap-2 border-r border-slate-700 pr-6">
                    <span className="w-5 h-5 rounded-full bg-primary-600 flex items-center justify-center text-[10px] font-black">
                      {selectedStudents.length}
                    </span>
                    <span className="text-xs font-bold">Selected</span>
                  </div>

                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleBulkAction("Send Quiz")}
                      className="flex items-center gap-2 text-xs font-black hover:text-primary-400 transition-colors">
                      <Mail className="w-4 h-4" />
                      Send Quiz
                    </button>
                    <button
                      onClick={() => handleBulkAction("Activate")}
                      className="flex items-center gap-2 text-xs font-black hover:text-primary-400 transition-colors">
                      <UserCheck className="w-4 h-4" />
                      Activate
                    </button>
                    <button
                      onClick={() => handleBulkAction("Delete")}
                      className="flex items-center gap-2 text-xs font-black hover:text-red-400 transition-colors">
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>

                  <button
                    onClick={() => setSelectedStudents([])}
                    className="p-1 hover:bg-slate-800 rounded-lg transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-slate-50/50 text-slate-400 text-[9px] font-black uppercase tracking-widest">
                  <th className="px-5 py-3 w-10">
                    <input
                      type="checkbox"
                      checked={
                        filteredStudents.length > 0 &&
                        selectedStudents.length === filteredStudents.length
                      }
                      onChange={toggleSelectAll}
                      className="w-4 h-4 rounded border-slate-300"
                    />
                  </th>
                  <th className="px-5 py-3">Student</th>
                  <th className="px-5 py-3">Email</th>
                  <th className="px-5 py-3">School & Class</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">City</th>
                  <th className="px-5 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => (
                    <tr
                      key={student._id}
                      className={`group transition-all ${selectedStudents.includes(student._id)
                        ? "bg-primary-50/30"
                        : "hover:bg-slate-50/30"
                        }`}>
                      <td className="px-5 py-3">
                        <input
                          type="checkbox"
                          checked={selectedStudents.includes(student._id)}
                          onChange={() => toggleSelectStudent(student._id)}
                          className="w-4 h-4 rounded border-slate-300"
                        />
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={student.avatar}
                            alt=""
                            className="w-7 h-7 rounded-lg object-cover ring-2 ring-white group-hover:ring-primary-50 transition-all"
                          />
                          <button
                            onClick={() => handleViewStudent(student)}
                            className="font-bold text-slate-900 text-xs hover:text-primary-600 transition-colors">
                            {student.name}
                          </button>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-slate-500 font-medium text-[11px]">
                        {student.email}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex flex-col">
                          <span className="text-slate-900 font-bold text-[11px]">
                            {student.school}
                          </span>
                          <span className="text-slate-500 font-medium text-[10px]">
                            {student.class || student.level}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1.5 w-fit ${getStatusColor(
                            student.status
                          )}`}>
                          <div
                            className={`w-1 h-1 rounded-full ${student.status === "Completed"
                              ? "bg-green-600"
                              : student.status === "Sent"
                                ? "bg-blue-600"
                                : "bg-orange-600"
                              }`}
                          />
                          {student.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-slate-500 font-medium text-[11px]">
                        {student.city}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <button
                          onClick={() => {
                            setSelectedStudent(student);
                            setIsQuickActionsOpen(true);
                          }}
                          className="p-1.5 rounded-lg hover:bg-white hover:shadow-sm text-slate-400 hover:text-slate-600 transition-all">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300">
                          <Users className="w-6 h-6" />
                        </div>
                        <p className="text-sm font-bold text-slate-900">
                          No students found
                        </p>
                        <p className="text-xs text-slate-500 font-medium">
                          Try adjusting your filters or search query.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[11px] text-slate-500 font-medium order-2 sm:order-1">
              Showing <span className="text-slate-900 font-bold">1-5</span> of{" "}
              <span className="text-slate-900 font-bold">1240</span>
            </p>
            <div className="flex items-center gap-1.5 order-1 sm:order-2">
              <button
                onClick={() => console.log("Prev page")}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 disabled:opacity-50">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-1">
                {[1, 2, 3, "...", 248].map((page, i) => (
                  <button
                    key={i}
                    onClick={() =>
                      typeof page === "number" &&
                      console.log(`Go to page ${page}`)
                    }
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${page === 1
                      ? "bg-primary-600 text-white shadow-sm"
                      : "text-slate-500 hover:bg-slate-50"
                      } ${typeof page !== "number"
                        ? "cursor-default pointer-events-none"
                        : ""
                      }`}>
                    {page}
                  </button>
                ))}
              </div>
              <button
                onClick={() => console.log("Next page")}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div >
      </div >
    </DashboardLayout >
  );
};

export default AdminDashboard;
