import React, { useState } from "react";
import Modal from "./Modal";
import { 
  Search, 
  Filter, 
  Users, 
  Award, 
  BookOpen, 
  Activity,
  ArrowUpRight,
  Calendar,
  Clock,
  ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const RecentActivityModal = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const filters = ["All", "Students", "Quizzes", "System"];

  const allLogs = [
    {
      id: 1,
      action: "New student registration",
      target: "Sarah Connor",
      time: "2 mins ago",
      date: "Oct 24, 2023",
      icon: Users,
      type: "Students",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
      details: "Successfully completed email verification and profile setup."
    },
    {
      id: 2,
      action: "Quiz completed",
      target: "Entrance Test - Grade 10",
      time: "15 mins ago",
      date: "Oct 24, 2023",
      icon: Award,
      type: "Quizzes",
      bgColor: "bg-green-50",
      textColor: "text-green-600",
      details: "Scored 92/100. Time taken: 24 minutes."
    },
    {
      id: 3,
      action: "New quiz published",
      target: "Scholarship Phase 2",
      time: "1 hour ago",
      date: "Oct 24, 2023",
      icon: BookOpen,
      type: "Quizzes",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
      details: "Published by Admin. 50 questions, 60 min limit."
    },
    {
      id: 4,
      action: "System update",
      target: "v2.4.0 Patch",
      time: "4 hours ago",
      date: "Oct 24, 2023",
      icon: Activity,
      type: "System",
      bgColor: "bg-orange-50",
      textColor: "text-orange-600",
      details: "Fixed responsive issues on student dashboard and improved chart performance."
    },
    {
      id: 5,
      action: "Password changed",
      target: "Mike Ross",
      time: "Yesterday",
      date: "Oct 23, 2023",
      icon: Users,
      type: "Students",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
      details: "Password successfully reset via recovery email."
    },
    {
      id: 6,
      action: "Course assigned",
      target: "Advanced Mathematics",
      time: "Yesterday",
      date: "Oct 23, 2023",
      icon: BookOpen,
      type: "Quizzes",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
      details: "Assigned to 45 students in Grade 12-A."
    },
    {
      id: 7,
      action: "Data export",
      target: "Monthly Report",
      time: "2 days ago",
      date: "Oct 22, 2023",
      icon: Activity,
      type: "System",
      bgColor: "bg-orange-50",
      textColor: "text-orange-600",
      details: "Full system analytics exported in PDF format."
    }
  ];

  const filteredLogs = allLogs.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         log.target.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === "All" || log.type === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Recent System Activity" 
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6">
        {/* Search and Filter Header */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search activity..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
            />
          </div>
          <div className="flex bg-slate-50 p-1 rounded-2xl border border-slate-100">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all ${
                  activeFilter === filter
                    ? "bg-white text-primary-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Logs List */}
        <div className="space-y-3">
          {filteredLogs.length > 0 ? (
            filteredLogs.map((log) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={log.id}
                className="group p-4 rounded-3xl border border-slate-100 hover:border-primary-100 hover:bg-primary-50/10 transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${log.bgColor} ${log.textColor}`}>
                      <log.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-black text-slate-900 leading-none">
                          {log.action}
                        </h4>
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-[9px] font-black text-slate-500 uppercase tracking-wider">
                          {log.type}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium mb-2">
                        Target: <span className="text-slate-900 font-bold">{log.target}</span>
                      </p>
                      <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                        {log.details}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-black text-slate-900">{log.time}</p>
                    <p className="text-[10px] text-slate-400 font-bold mt-1">{log.date}</p>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="py-12 text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-6 h-6 text-slate-300" />
              </div>
              <h4 className="text-sm font-black text-slate-900">No logs found</h4>
              <p className="text-xs text-slate-500 mt-1">Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default RecentActivityModal;
