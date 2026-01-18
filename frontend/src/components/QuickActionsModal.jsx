import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Edit2,
  MessageSquare,
  Trash2,
  X,
  ChevronRight,
} from "lucide-react";
import Modal from "./Modal";

const QuickActionsModal = ({ isOpen, onClose, student, onAction }) => {
  if (!student) return null;

  const actions = [
    {
      id: "view",
      title: "View Full Profile",
      description: "Check performance history and details",
      icon: User,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      id: "edit",
      title: "Edit Student",
      description: "Update personal and academic info",
      icon: Edit2,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      id: "contact",
      title: "Send Message",
      description: "Contact via platform, email or SMS",
      icon: MessageSquare,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      id: "delete",
      title: "Delete Record",
      description: "Permanently remove from database",
      icon: Trash2,
      color: "text-red-600",
      bg: "bg-red-50",
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Quick Actions"
      maxWidth="max-w-md">
      <div className="p-2 space-y-2">
        {/* Student Summary */}
        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl mb-4">
          <img
            src={student.avatar}
            alt=""
            className="w-12 h-12 rounded-xl object-cover ring-2 ring-white shadow-sm"
            loading="lazy"
          />
          <div>
            <h4 className="font-black text-slate-900 text-sm leading-tight">
              {student.name}
            </h4>
            <p className="text-[10px] text-slate-500 font-bold leading-tight mt-0.5">
              {student.school} • {student.class || student.level}
            </p>
          </div>
        </div>

        {/* Action List */}
        <div className="grid gap-2">
          {actions.map((action) => (
            <button
              key={action.id}
              onClick={() => {
                onAction(action.id, student);
                onClose();
              }}
              className="group flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50 transition-all text-left border border-transparent hover:border-slate-100">
              <div
                className={`w-10 h-10 rounded-xl ${action.bg} ${action.color} flex items-center justify-center transition-transform group-hover:scale-110`}>
                <action.icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h5 className="text-[13px] font-black text-slate-900 leading-tight">
                  {action.title}
                </h5>
                <p className="text-[11px] text-slate-500 font-medium">
                  {action.description}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-450 transition-colors" />
            </button>
          ))}
        </div>
      </div>
    </Modal>
  );
};

export default QuickActionsModal;
