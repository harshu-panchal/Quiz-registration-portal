import React from "react";
import {
  Edit2,
  Copy,
  Trash2,
  ExternalLink,
  ChevronRight,
  BarChart2,
  BookOpen,
} from "lucide-react";
import Modal from "./Modal";

const QuizActionsModal = ({ isOpen, onClose, quiz, onAction }) => {
  if (!quiz) return null;

  const actions = [
    {
      id: "edit",
      title: "Edit Quiz",
      description: "Modify questions and settings",
      icon: Edit2,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      id: "copy",
      title: "Copy Link",
      description: "Get shareable quiz link",
      icon: Copy,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      id: "view",
      title: "View Link",
      description: "Open quiz in new tab",
      icon: ExternalLink,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      id: "results",
      title: "View Results",
      description: "Check student responses",
      icon: BarChart2,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      id: "delete",
      title: "Delete Quiz",
      description: "Permanently remove quiz",
      icon: Trash2,
      color: "text-red-600",
      bg: "bg-red-50",
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Quiz Options"
      maxWidth="max-w-md">
      <div className="p-2 space-y-2">
        {/* Quiz Summary */}
        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl mb-4">
          <div className="w-12 h-12 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center shadow-sm">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-black text-slate-900 text-sm leading-tight">
              {quiz.title}
            </h4>
            <p className="text-[10px] text-slate-500 font-bold leading-tight mt-0.5">
              {quiz.category} • {quiz.questions} Questions
            </p>
          </div>
        </div>

        {/* Action List */}
        <div className="grid gap-2">
          {actions.map((action) => (
            <button
              key={action.id}
              onClick={() => {
                onAction(action.id, quiz);
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

export default QuizActionsModal;
