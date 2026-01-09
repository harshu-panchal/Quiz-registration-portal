import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  CheckCircle2,
  Clock,
  AlertCircle,
  UserPlus,
  BookOpen,
  X,
} from "lucide-react";
import StatusModal from "./StatusModal";

const NotificationsPanel = ({ isOpen, onClose }) => {
  const [statusModal, setStatusModal] = useState({
    isOpen: false,
    type: "info",
    title: "",
    message: "",
  });
  const notifications = [
    {
      id: 1,
      title: "New Student Registered",
      desc: "Alex Johnson just joined the platform.",
      time: "2 mins ago",
      icon: UserPlus,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      id: 2,
      title: "Quiz Completed",
      desc: "Jane Smith finished 'Python Basics' with 85%.",
      time: "1 hour ago",
      icon: CheckCircle2,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      id: 3,
      title: "System Update",
      desc: "Analytics module has been updated to v2.4.",
      time: "5 hours ago",
      icon: AlertCircle,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      id: 4,
      title: "Pending Approval",
      desc: "3 students are waiting for quiz approval.",
      time: "Yesterday",
      icon: Clock,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop for mobile */}
          <div className="fixed inset-0 z-40 lg:hidden" onClick={onClose} />

          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 top-full mt-3 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl shadow-slate-200 border border-slate-100 overflow-hidden z-50">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-primary-600" />
                <h3 className="font-black text-slate-900 text-sm">
                  Notifications
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-white text-slate-400 hover:text-slate-600 transition-all">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
              {notifications.map((n, idx) => (
                <div
                  key={n.id}
                  className={`p-4 flex gap-4 hover:bg-slate-50 transition-colors cursor-pointer ${
                    idx !== notifications.length - 1
                      ? "border-b border-slate-50"
                      : ""
                  }`}>
                  <div
                    className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center ${n.bg} ${n.color}`}>
                    <n.icon className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-black text-slate-900">
                      {n.title}
                    </p>
                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                      {n.desc}
                    </p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest pt-1">
                      {n.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 border-t border-slate-100 bg-slate-50/50">
              <button
                onClick={() =>
                  setStatusModal({
                    isOpen: true,
                    type: "info",
                    title: "Notifications",
                    message:
                      "You are being redirected to the full notifications center.",
                  })
                }
                className="w-full py-2 rounded-xl text-[11px] font-black text-primary-600 hover:bg-white transition-all uppercase tracking-widest">
                View All Notifications
              </button>
            </div>
          </motion.div>
          <StatusModal
            {...statusModal}
            onClose={() => setStatusModal({ ...statusModal, isOpen: false })}
          />
        </>
      )}
    </AnimatePresence>
  );
};

export default NotificationsPanel;
