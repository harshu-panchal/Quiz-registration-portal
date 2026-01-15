import React from "react";
import Modal from "./Modal";
import {
  CheckCircle2,
  AlertCircle,
  XCircle,
  Info,
  HelpCircle,
  AlertTriangle
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

const StatusModal = ({
  isOpen,
  onClose,
  type = "info",
  title,
  message,
  onConfirm,
  confirmText,
  cancelText,
  showCancel = false
}) => {
  const { t } = useLanguage();
  const effectiveConfirmText = confirmText || t('confirm');
  const effectiveCancelText = cancelText || t('cancel');

  const getConfig = () => {
    switch (type) {
      case "success":
        return {
          icon: CheckCircle2,
          color: "text-green-600",
          bg: "bg-green-50",
          border: "border-green-100"
        };
      case "error":
        return {
          icon: XCircle,
          color: "text-red-600",
          bg: "bg-red-50",
          border: "border-red-100"
        };
      case "warning":
        return {
          icon: AlertTriangle,
          color: "text-orange-600",
          bg: "bg-orange-50",
          border: "border-orange-100"
        };
      case "confirm":
        return {
          icon: HelpCircle,
          color: "text-primary-600",
          bg: "bg-primary-50",
          border: "border-primary-100"
        };
      default:
        return {
          icon: Info,
          color: "text-blue-600",
          bg: "bg-blue-50",
          border: "border-blue-100"
        };
    }
  };

  const config = getConfig();
  const Icon = config.icon;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-sm">
      <div className="flex flex-col items-center text-center space-y-4 py-2">
        <div className={`w-16 h-16 rounded-3xl ${config.bg} ${config.color} flex items-center justify-center`}>
          <Icon className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <p className="text-sm text-slate-500 font-medium leading-relaxed">
            {message}
          </p>
        </div>

        <div className="flex gap-3 w-full pt-4">
          {showCancel && (
            <button
              onClick={onClose}
              className="flex-1 btn-modern-outline !py-2.5 text-xs font-black"
            >
              {effectiveCancelText}
            </button>
          )}
          <button
            onClick={() => {
              if (onConfirm) onConfirm();
              onClose();
            }}
            className={`flex-1 !py-2.5 text-xs font-black rounded-xl transition-all shadow-lg ${type === 'error' || type === 'warning' && showCancel
                ? 'bg-red-600 text-white hover:bg-red-700 shadow-red-100'
                : 'bg-primary-600 text-white hover:bg-primary-700 shadow-primary-100'
              }`}
          >
            {effectiveConfirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default StatusModal;
