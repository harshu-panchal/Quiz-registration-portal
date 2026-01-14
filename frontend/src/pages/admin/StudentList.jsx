import React, { useState, useEffect } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import {
  Users,
  Search,
  Filter,
  Download,
  Plus,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Mail,
  UserCheck,
  Trash2,
  X,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AddStudentModal from "../../components/AddStudentModal";
import StudentDetailsModal from "../../components/StudentDetailsModal";
import QuickActionsModal from "../../components/QuickActionsModal";
import ContactStudentModal from "../../components/ContactStudentModal";
import FilterOptionsModal from "../../components/FilterOptionsModal";
// import StudentFilterBar from "../../components/StudentFilterBar"; // REPLACED
import StatusModal from "../../components/StatusModal";
import ExportOptionsModal from "../../components/ExportOptionsModal";
import { studentService } from "../../services/studentService";
import { handleApiError } from "../../utils/errorHandler";

const StudentList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All"); // Status Tabs

  const [activeFilters, setActiveFilters] = useState({
    state: "",
    city: "",
    gender: "",
    class: "",
  });

  // API state
  const [students, setStudents] = useState([]);
  const [filterOptions, setFilterOptions] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  // Fetch students and filter options
  useEffect(() => {
    fetchStudents();
    fetchFilterOptions();
  }, [searchQuery, selectedFilter, activeFilters, pagination.page]);

  const fetchFilterOptions = async () => {
    try {
      const options = await studentService.getFilterOptions();
      setFilterOptions(options.data || {});
    } catch (err) {
      console.error("Failed to fetch filter options:", err);
    }
  };

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search: searchQuery || undefined,
        status: selectedFilter !== 'All' ? selectedFilter : undefined,

        // New filters
        state: activeFilters.state || undefined,
        city: activeFilters.city || undefined,
        gender: activeFilters.gender || undefined,
        class: activeFilters.class || undefined,
      };

      const response = await studentService.getStudents(params);

      setStudents(response.data || []);
      setPagination(prev => ({
        ...prev,
        total: response.total || 0,
        totalPages: response.totalPages || 0
      }));
    } catch (err) {
      const errorInfo = handleApiError(err);
      setError(errorInfo.message);
    } finally {
      setLoading(false);
    }
  };

  // Filter Handlers
  const handleFilterApply = (newFilters) => {
    setActiveFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const filteredStudents = students;

  const [selectedStudents, setSelectedStudents] = useState([]);
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [statusModal, setStatusModal] = useState({
    isOpen: false, type: "info", title: "", message: "", showCancel: false, onConfirm: null,
  });

  const handleViewStudent = (student) => { setSelectedStudent(student); setIsDetailsOpen(true); };
  const handleExport = () => { setIsExportOpen(true); };

  const handleBulkAction = (action) => {
    // ... (keep existing bulk action logic)
    if (action === "Delete") {
      setStatusModal({
        isOpen: true,
        type: "warning",
        title: "Confirm Deletion",
        message: `Are you sure you want to delete ${selectedStudents.length} selected students?`,
        showCancel: true,
        confirmText: "Delete Students",
        onConfirm: () => { setSelectedStudents([]); },
      });
    } else {
      setStatusModal({
        isOpen: true,
        type: "success",
        title: "Action Successful",
        message: `${action} has been performed on ${selectedStudents.length} students.`,
        showCancel: false,
      });
      setSelectedStudents([]);
    }
  };

  const handleQuickAction = (actionId, student) => {
    setSelectedStudent(student);
    if (actionId === "view") setIsDetailsOpen(true);
    else if (actionId === "edit") setIsAddStudentOpen(true);
    else if (actionId === "contact") setIsContactOpen(true);
    else if (actionId === "delete") {
      setStatusModal({
        isOpen: true, type: "confirm", title: "Delete Student",
        message: `Delete ${student.name}?`,
        onConfirm: () => {
          console.log(`Deleting ${student.id}`);
          setStatusModal({ isOpen: true, type: "success", title: "Deleted", message: `${student.name} data removed.` });
        },
      });
    }
  };

  const handleRowAction = (student, action) => {
    setSelectedStudent(student);
    if (action === "Delete") handleQuickAction("delete", student);
    else if (action === "Edit") setIsAddStudentOpen(true);
    else if (action === "Send Email") setIsContactOpen(true);
    else if (action === "More Options") setIsQuickActionsOpen(true);
  };

  const toggleSelectAll = () => {
    if (selectedStudents.length === filteredStudents.length) setSelectedStudents([]);
    else setSelectedStudents(filteredStudents.map((s) => s.id));
  };

  const toggleSelectStudent = (id) => {
    if (selectedStudents.includes(id)) setSelectedStudents(selectedStudents.filter((sid) => sid !== id));
    else setSelectedStudents([...selectedStudents, id]);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-600";
      case "Inactive": return "bg-red-100 text-red-600";
      case "Pending": return "bg-orange-100 text-orange-600";
      default: return "bg-slate-100 text-slate-600";
    }
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Student Directory</h2>
            <p className="text-sm text-slate-500 font-medium mt-1">Manage and monitor all registered students.</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={handleExport} className="flex-1 sm:flex-none btn-modern-outline !py-2 !px-4 flex items-center justify-center gap-2">
              <Download className="w-4 h-4" /> <span className="text-xs font-bold">Export CSV</span>
            </button>
            <button onClick={() => { setSelectedStudent(null); setIsAddStudentOpen(true); }} className="flex-1 sm:flex-none btn-modern-primary !py-2 !px-4 flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" /> <span className="text-xs font-bold">Add New Student</span>
            </button>
          </div>
        </div>

        {/* Modals */}
        <AddStudentModal isOpen={isAddStudentOpen} onClose={() => setIsAddStudentOpen(false)} student={selectedStudent} />
        <StudentDetailsModal isOpen={isDetailsOpen} onClose={() => setIsDetailsOpen(false)} student={selectedStudent} />
        <QuickActionsModal isOpen={isQuickActionsOpen} onClose={() => setIsQuickActionsOpen(false)} student={selectedStudent} onAction={handleQuickAction} />
        <ContactStudentModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} student={selectedStudent} />

        {/* Deprecated FilterOptionsModal removed from render */}
        <FilterOptionsModal
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          onApply={handleFilterApply}
          currentFilters={activeFilters}
        />

        <StatusModal {...statusModal} onClose={() => setStatusModal({ ...statusModal, isOpen: false })} />
        <ExportOptionsModal isOpen={isExportOpen} onClose={() => setIsExportOpen(false)} title="Export Student Directory" />

        {/* Filters and Search Area */}
        <div className="glass-card rounded-3xl overflow-hidden border border-slate-100 shadow-sm">
          <div className="p-5 border-b border-slate-100 flex flex-col gap-5">
            {/* Top Row: Search and Status Tabs */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
              <div className="relative flex-1 lg:max-w-md group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Search by name, email or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="modern-input !pl-12 !py-2.5 bg-slate-50 border-transparent focus:bg-white w-full"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
                {["All", "Active", "Pending", "Inactive"].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setSelectedFilter(filter)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${selectedFilter === filter
                      ? "bg-primary-600 text-white shadow-lg shadow-primary-100"
                      : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                      }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter Toggle and Modal */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsFilterOpen(true)}
                className={`btn-modern-outline !py-2.5 flex items-center gap-2 ${Object.values(activeFilters).some(v => v) ? "bg-primary-50 border-primary-200 text-primary-700" : ""
                  }`}>
                <Filter className="w-4 h-4" />
                Filters
                {Object.values(activeFilters).filter(v => v).length > 0 && (
                  <span className="bg-primary-600 text-white w-5 h-5 rounded-full text-xs flex items-center justify-center">
                    {Object.values(activeFilters).filter(v => v).length}
                  </span>
                )}
              </button>

              {Object.values(activeFilters).some(v => v) && (
                <button
                  onClick={() => setActiveFilters({ state: "", city: "", gender: "", class: "" })}
                  className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1 bg-red-50 p-2 rounded-lg"
                >
                  <X className="w-3.5 h-3.5" />
                  Clear Filter
                </button>
              )}
            </div>


          </div>

          {/* Error Display */}
          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3 mb-4 mx-5 mt-4">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs font-bold text-red-900">Failed to load students</p>
                <p className="text-xs text-red-700 mt-1">{error}</p>
              </div>
              <button onClick={fetchStudents} className="text-xs font-bold text-red-600 hover:text-red-700 underline">Retry</button>
            </motion.div>
          )}

          {/* Table */}
          <div className="overflow-x-auto relative">
            {/* ... (keep table header and body exactly as is, logic doesn't change here) ... */}
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                  <th className="px-6 py-4 w-12">
                    <input
                      type="checkbox"
                      checked={
                        filteredStudents.length > 0 &&
                        selectedStudents.length === filteredStudents.length
                      }
                      onChange={toggleSelectAll}
                      className="w-4.5 h-4.5 rounded border-slate-300 text-primary-600 focus:ring-primary-500/20"
                    />
                  </th>
                  <th className="px-6 py-4">Unique ID</th>
                  <th className="px-6 py-4">Student Info</th>
                  <th className="px-6 py-4">School & Class</th>
                  <th className="px-6 py-4">Join Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">City</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  // Loading skeleton
                  [...Array(5)].map((_, idx) => (
                    <tr key={idx} className="animate-pulse">
                      <td className="px-6 py-4">
                        <div className="w-4 h-4 bg-slate-200 rounded"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="w-20 h-4 bg-slate-200 rounded"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-slate-200 rounded-xl"></div>
                          <div className="space-y-2">
                            <div className="w-32 h-3 bg-slate-200 rounded"></div>
                            <div className="w-40 h-3 bg-slate-200 rounded"></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <div className="w-36 h-3 bg-slate-200 rounded"></div>
                          <div className="w-24 h-3 bg-slate-200 rounded"></div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="w-20 h-3 bg-slate-200 rounded"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="w-16 h-6 bg-slate-200 rounded-full"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="w-20 h-3 bg-slate-200 rounded"></div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="w-8 h-8 bg-slate-200 rounded-lg ml-auto"></div>
                      </td>
                    </tr>
                  ))
                ) : filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => (
                    <motion.tr
                      layout
                      key={student._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="hover:bg-slate-50/80 transition-colors border-b border-slate-100 last:border-0">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedStudents.includes(student._id)}
                          onChange={() => toggleSelectStudent(student._id)}
                          className="w-4.5 h-4.5 rounded border-slate-300 text-primary-600 focus:ring-primary-500/20"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-1 rounded-lg">
                          #STU-{student._id.toString().slice(-4).padStart(4, "0")}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative shrink-0">
                            <img
                              src={student.avatar}
                              alt=""
                              className="w-10 h-10 rounded-xl object-cover ring-2 ring-white group-hover:ring-primary-100 transition-all shadow-sm"
                            />
                            <div
                              className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 border-2 border-white rounded-full ${student.status === "Active"
                                ? "bg-green-500"
                                : "bg-slate-300"
                                }`}></div>
                          </div>
                          <div className="min-w-0">
                            <button
                              onClick={() => handleViewStudent(student)}
                              className="font-bold text-slate-900 text-sm group-hover:text-primary-600 transition-colors truncate block text-left w-full">
                              {student.name}
                            </button>
                            <p className="text-slate-500 text-[11px] font-medium truncate">
                              {student.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-slate-900 font-bold text-xs">
                            {student.school}
                          </span>
                          <span className="text-slate-500 font-medium text-[10px]">
                            {student.class || student.level}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-500 font-bold text-xs">
                        {student.joinDate}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${getStatusColor(
                            student.status
                          )}`}>
                          {student.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-500 font-medium text-xs">
                        {student.city}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() =>
                            handleRowAction(student, "More Options")
                          }
                          className="p-2 rounded-lg hover:bg-white hover:shadow-sm text-slate-400 hover:text-slate-600 transition-all">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="px-6 py-12 text-center">
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
          <div className="p-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/30">
            <div className="flex items-center gap-4 order-2 sm:order-1">
              <p className="text-xs text-slate-500 font-bold">
                Showing <span className="text-slate-900">{((pagination.page - 1) * pagination.limit) + 1}-{Math.min(pagination.page * pagination.limit, pagination.total)}</span> of{" "}
                <span className="text-slate-900">{pagination.total}</span> students
              </p>
              <select
                value={pagination.limit}
                onChange={(e) => {
                  setPagination(prev => ({ ...prev, limit: Number(e.target.value), page: 1 }));
                }}
                className="bg-transparent border-none text-xs font-bold text-slate-500 focus:ring-0 cursor-pointer hover:text-primary-600 transition-colors">
                <option value="10">Show 10</option>
                <option value="20">Show 20</option>
                <option value="50">Show 50</option>
              </select>
            </div>
            <div className="flex items-center gap-2 order-1 sm:order-2">
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                disabled={pagination.page === 1 || loading}
                className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:bg-white hover:text-primary-600 hover:border-primary-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm">
                <ChevronLeft className="w-4.5 h-4.5" />
              </button>
              <div className="flex items-center gap-1">
                {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPagination(prev => ({ ...prev, page: pageNum }))}
                      disabled={loading}
                      className={`w-9 h-9 rounded-xl text-xs font-black transition-all disabled:cursor-not-allowed ${pagination.page === pageNum
                        ? "bg-primary-600 text-white shadow-lg shadow-primary-100"
                        : "text-slate-500 hover:bg-white hover:text-primary-600 border border-transparent hover:border-slate-200"
                        }`}>
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.totalPages, prev.page + 1) }))}
                disabled={pagination.page >= pagination.totalPages || loading}
                className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:bg-white hover:text-primary-600 hover:border-primary-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm">
                <ChevronRight className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentList;
