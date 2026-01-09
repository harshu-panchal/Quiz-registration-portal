import React, { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import {
  Users,
  Search,
  Download,
  Plus,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Filter,
  Mail,
  UserCheck,
  UserX,
  Trash2,
  Edit2,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AddStudentModal from "../../components/AddStudentModal";
import StudentDetailsModal from "../../components/StudentDetailsModal";
import QuickActionsModal from "../../components/QuickActionsModal";
import ContactStudentModal from "../../components/ContactStudentModal";
import FilterOptionsModal from "../../components/FilterOptionsModal";
import StatusModal from "../../components/StatusModal";
import ExportOptionsModal from "../../components/ExportOptionsModal";

const StudentList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [activeFilters, setActiveFilters] = useState({
    status: "All",
    class: "All",
    school: "All",
    dateRange: "All Time",
  });

  const students = [
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+1 (555) 123-4567",
      school: "Evergreen High School",
      class: "10th Grade",
      city: "San Francisco",
      state: "California",
      age: 16,
      level: "Grade 10 - Science",
      status: "Active",
      lastActivity: "Oct 24, 2023",
      avatar: "https://i.pravatar.cc/150?u=1",
      joinDate: "Jan 12, 2023",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@example.com",
      phone: "+1 (555) 234-5678",
      school: "Oakwood Academy",
      class: "11th Grade",
      city: "New York",
      state: "New York",
      age: 17,
      level: "Grade 11 - Arts",
      status: "Active",
      lastActivity: "2 hours ago",
      avatar: "https://i.pravatar.cc/150?u=2",
      joinDate: "Feb 05, 2023",
    },
    {
      id: 3,
      name: "Robert Fox",
      email: "robert.fox@example.com",
      phone: "+1 (555) 345-6789",
      school: "Riverside International",
      class: "12th Grade",
      city: "Austin",
      state: "Texas",
      age: 18,
      level: "Grade 12 - Commerce",
      status: "Inactive",
      lastActivity: "Yesterday",
      avatar: "https://i.pravatar.cc/150?u=3",
      joinDate: "Mar 20, 2023",
    },
    {
      id: 4,
      name: "Alice Lee",
      email: "alice.lee@example.com",
      phone: "+1 (555) 456-7890",
      school: "Maplewood Prep",
      class: "10th Grade",
      city: "Seattle",
      state: "Washington",
      age: 15,
      level: "Grade 10 - Science",
      status: "Active",
      lastActivity: "3 days ago",
      avatar: "https://i.pravatar.cc/150?u=4",
      joinDate: "Apr 15, 2023",
    },
    {
      id: 5,
      name: "Cameron Williamson",
      email: "cameron.w@example.com",
      phone: "+1 (555) 567-8901",
      school: "Summit High",
      class: "11th Grade",
      city: "Denver",
      state: "Colorado",
      age: 16,
      level: "Grade 11 - Arts",
      status: "Pending",
      lastActivity: "5 days ago",
      avatar: "https://i.pravatar.cc/150?u=5",
      joinDate: "May 10, 2023",
    },
  ];

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.id.toString().includes(searchQuery);

    const matchesStatus =
      selectedFilter === "All" || student.status === selectedFilter;

    const matchesAdvancedStatus =
      activeFilters.status === "All" || student.status === activeFilters.status;

    const matchesClass =
      activeFilters.class === "All" || student.class === activeFilters.class;

    const matchesSchool =
      activeFilters.school === "All" || student.school === activeFilters.school;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesAdvancedStatus &&
      matchesClass &&
      matchesSchool
    );
  });

  const [selectedStudents, setSelectedStudents] = useState([]);

  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
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
    showCancel: false,
    onConfirm: null,
  });

  const handleViewStudent = (student) => {
    setSelectedStudent(student);
    setIsDetailsOpen(true);
  };

  const handleExport = () => {
    setIsExportOpen(true);
  };

  const handleMoreFilters = () => {
    setIsFilterOpen(true);
  };

  const handleBulkAction = (action) => {
    if (action === "Delete") {
      setStatusModal({
        isOpen: true,
        type: "warning",
        title: "Confirm Deletion",
        message: `Are you sure you want to delete ${selectedStudents.length} selected students? This action cannot be undone.`,
        showCancel: true,
        confirmText: "Delete Students",
        onConfirm: () => {
          console.log(`Deleting ${selectedStudents.length} students`);
          setSelectedStudents([]);
        },
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
          console.log(`Deleting student: ${student.id}`);
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

  const handleRowAction = (student, action) => {
    setSelectedStudent(student);
    if (action === "Delete") {
      handleQuickAction("delete", student);
    } else if (action === "Edit") {
      setIsAddStudentOpen(true);
    } else if (action === "Send Email") {
      setIsContactOpen(true);
    } else if (action === "More Options") {
      setIsQuickActionsOpen(true);
    }
  };

  const toggleSelectAll = () => {
    if (selectedStudents.length === filteredStudents.length) {
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

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-600";
      case "Inactive":
        return "bg-red-100 text-red-600";
      case "Pending":
        return "bg-orange-100 text-orange-600";
      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Student Directory
            </h2>
            <p className="text-sm text-slate-500 font-medium mt-1">
              Manage and monitor all registered students.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleExport}
              className="flex-1 sm:flex-none btn-modern-outline !py-2 !px-4 flex items-center justify-center gap-2">
              <Download className="w-4 h-4" />
              <span className="text-xs font-bold">Export CSV</span>
            </button>
            <button
              onClick={() => {
                setSelectedStudent(null);
                setIsAddStudentOpen(true);
              }}
              className="flex-1 sm:flex-none btn-modern-primary !py-2 !px-4 flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" />
              <span className="text-xs font-bold">Add New Student</span>
            </button>
          </div>
        </div>

        {/* Modal */}
        <AddStudentModal
          isOpen={isAddStudentOpen}
          onClose={() => setIsAddStudentOpen(false)}
          student={selectedStudent}
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
          title="Export Student Directory"
        />

        {/* Filters and Search */}
        <div className="glass-card rounded-3xl overflow-hidden border border-slate-100 shadow-sm">
          <div className="p-5 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            <div className="flex flex-col sm:flex-row flex-1 items-stretch sm:items-center gap-4">
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
              <button
                onClick={handleMoreFilters}
                className="btn-modern-outline !py-2.5 !px-4 flex items-center justify-center gap-2">
                <Filter className="w-4 h-4" />
                <span className="text-xs font-bold">More Filters</span>
              </button>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
              {["All", "Active", "Pending", "Inactive"].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    selectedFilter === filter
                      ? "bg-primary-600 text-white shadow-lg shadow-primary-100"
                      : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                  }`}>
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
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
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => (
                    <motion.tr
                      layout
                      key={student.id}
                      className={`group transition-all ${
                        selectedStudents.includes(student.id)
                          ? "bg-primary-50/30"
                          : "hover:bg-slate-50/50"
                      }`}>
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedStudents.includes(student.id)}
                          onChange={() => toggleSelectStudent(student.id)}
                          className="w-4.5 h-4.5 rounded border-slate-300 text-primary-600 focus:ring-primary-500/20"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-1 rounded-lg">
                          #STU-{student.id.toString().padStart(4, "0")}
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
                              className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 border-2 border-white rounded-full ${
                                student.status === "Active"
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
                Showing <span className="text-slate-900">1-5</span> of{" "}
                <span className="text-slate-900">1,240</span> students
              </p>
              <select
                onChange={(e) =>
                  console.log(`Page size changed to: ${e.target.value}`)
                }
                className="bg-transparent border-none text-xs font-bold text-slate-500 focus:ring-0 cursor-pointer hover:text-primary-600 transition-colors">
                <option value="10">Show 10</option>
                <option value="20">Show 20</option>
                <option value="50">Show 50</option>
              </select>
            </div>
            <div className="flex items-center gap-2 order-1 sm:order-2">
              <button
                onClick={() => console.log("Prev page")}
                className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:bg-white hover:text-primary-600 hover:border-primary-100 disabled:opacity-50 transition-all shadow-sm">
                <ChevronLeft className="w-4.5 h-4.5" />
              </button>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((page) => (
                  <button
                    key={page}
                    onClick={() => console.log(`Go to page ${page}`)}
                    className={`w-9 h-9 rounded-xl text-xs font-black transition-all ${
                      page === 1
                        ? "bg-primary-600 text-white shadow-lg shadow-primary-100"
                        : "text-slate-500 hover:bg-white hover:text-primary-600 border border-transparent hover:border-slate-200"
                    }`}>
                    {page}
                  </button>
                ))}
              </div>
              <button
                onClick={() => console.log("Next page")}
                className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:bg-white hover:text-primary-600 hover:border-primary-100 transition-all shadow-sm">
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
