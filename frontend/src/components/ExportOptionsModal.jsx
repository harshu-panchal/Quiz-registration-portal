import React, { useState } from "react";
import Modal from "./Modal";
import {
  Download,
  FileText,
  Table,
  Calendar,
  Settings2,
  Info,
  AlertCircle,
} from "lucide-react";
import StatusModal from "./StatusModal";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useLanguage } from "../context/LanguageContext";

const exportSchema = z.object({
  format: z.enum(["CSV", "PDF"]),
  range: z.enum(["All Time", "This Month", "Last 30 Days", "Custom Range"]),
});

const ExportOptionsModal = ({ isOpen, onClose, title = "Export Data" }) => {
  const { t } = useLanguage();
  const [isExporting, setIsExporting] = useState(false);
  const [statusModal, setStatusModal] = useState({
    isOpen: false,
    type: "success",
    title: "",
    message: "",
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(exportSchema),
    defaultValues: {
      format: "CSV",
      range: "All Time",
    },
  });

  const format = watch("format");
  const range = watch("range");

  const handleExport = (data) => {
    setIsExporting(true);

    // Simulate export process
    setTimeout(() => {
      setIsExporting(false);
      setStatusModal({
        isOpen: true,
        type: "success",
        title: t('export_complete'),
        message: t('export_success_msg'),
      });
      reset();
    }, 2000);
  };

  const handleStatusClose = () => {
    setStatusModal((prev) => ({ ...prev, isOpen: false }));
    onClose();
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={title === "Export Data" ? t('export_data') : title}
        maxWidth="max-w-md">
        <form onSubmit={handleSubmit(handleExport)} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                {t('file_format')}
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: "CSV", icon: Table, label: t('comma_separated') },
                  { id: "PDF", icon: FileText, label: t('document_format') },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() =>
                      setValue("format", item.id, { shouldValidate: true })
                    }
                    className={`flex items-center gap-3 p-4 rounded-2xl border transition-all text-left ${format === item.id
                      ? "bg-primary-50 border-primary-200 text-primary-600 shadow-sm"
                      : "bg-white border-slate-100 text-slate-400 hover:border-slate-200"
                      }`}>
                    <item.icon className="w-5 h-5 shrink-0" />
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest leading-none mb-1">
                        {item.id}
                      </p>
                      <p className="text-[9px] font-medium opacity-70 whitespace-nowrap">
                        {item.label}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
              {errors.format && (
                <p className="text-[10px] text-red-500 font-bold flex items-center gap-1 mt-1 ml-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.format.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                {t('date_range')}
              </label>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { value: "All Time", label: t('all_time') },
                  { value: "This Month", label: t('this_month') },
                  { value: "Last 30 Days", label: t('last_30_days') },
                  { value: "Custom Range", label: t('custom_range') },
                ].map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() =>
                      setValue("range", item.value, { shouldValidate: true })
                    }
                    className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${range === item.value
                        ? "bg-slate-50 border-primary-200 text-primary-600 font-bold"
                        : "bg-white border-slate-100 text-slate-500 hover:bg-slate-50"
                      }`}>
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4" />
                      <span className="text-xs">{item.label}</span>
                    </div>
                    {range === item.value && (
                      <div className="w-1.5 h-1.5 rounded-full bg-primary-600" />
                    )}
                  </button>
                )
                )}
              </div>
              {errors.range && (
                <p className="text-[10px] text-red-500 font-bold flex items-center gap-1 mt-1 ml-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.range.message}
                </p>
              )}
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex gap-3">
            <Settings2 className="w-5 h-5 text-slate-400 shrink-0" />
            <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
              {t('export_settings_msg')}
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn-modern-outline !py-3">
              {t('cancel')}
            </button>
            <button
              type="submit"
              disabled={isExporting}
              className="flex-[2] btn-modern-primary !py-3 flex items-center justify-center gap-2 disabled:opacity-50">
              {isExporting ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              {isExporting ? t('processing') : t('start_export')}
            </button>
          </div>
        </form>
      </Modal>

      <StatusModal
        isOpen={statusModal.isOpen}
        onClose={handleStatusClose}
        type={statusModal.type}
        title={statusModal.title}
        message={statusModal.message}
      />
    </>
  );
};

export default ExportOptionsModal;
