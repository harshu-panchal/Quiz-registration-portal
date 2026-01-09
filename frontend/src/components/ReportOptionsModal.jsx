import React, { useState } from "react";
import Modal from "./Modal";
import {
  BarChart3,
  PieChart,
  FileText,
  Download,
  CheckCircle2,
  Info,
  AlertCircle,
} from "lucide-react";
import StatusModal from "./StatusModal";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const reportSchema = z.object({
  reportType: z.enum(["Full Performance", "Recent Progress", "Brief Summary"]),
  includeCharts: z.boolean(),
});

const ReportOptionsModal = ({ isOpen, onClose, student }) => {
  const [isGenerating, setIsGenerating] = useState(false);
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
    resolver: zodResolver(reportSchema),
    defaultValues: {
      reportType: "Full Performance",
      includeCharts: true,
    },
  });

  const reportType = watch("reportType");
  const includeCharts = watch("includeCharts");

  if (!student) return null;

  const handleGenerate = (data) => {
    setIsGenerating(true);

    // Simulate generation process
    setTimeout(() => {
      setIsGenerating(false);
      setStatusModal({
        isOpen: true,
        type: "success",
        title: "Report Ready",
        message: `The ${data.reportType} report for ${student.name} has been generated successfully.`,
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
        title="Generate Performance Report"
        maxWidth="max-w-md">
        <form onSubmit={handleSubmit(handleGenerate)} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                Report Type
              </label>
              <div className="space-y-2">
                {[
                  {
                    id: "Full Performance",
                    desc: "Comprehensive analysis of all quizzes",
                    icon: BarChart3,
                  },
                  {
                    id: "Recent Progress",
                    desc: "Performance trends over the last 30 days",
                    icon: PieChart,
                  },
                  {
                    id: "Brief Summary",
                    desc: "One-page executive overview",
                    icon: FileText,
                  },
                ].map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() =>
                      setValue("reportType", type.id, { shouldValidate: true })
                    }
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left ${
                      reportType === type.id
                        ? "bg-primary-50 border-primary-200 text-primary-600 shadow-sm"
                        : "bg-white border-slate-100 text-slate-500 hover:border-slate-200"
                    }`}>
                    <div
                      className={`p-2 rounded-xl ${
                        reportType === type.id
                          ? "bg-white shadow-sm"
                          : "bg-slate-50"
                      }`}>
                      <type.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-black uppercase tracking-wide leading-none mb-1">
                        {type.id}
                      </p>
                      <p className="text-[10px] font-medium opacity-70">
                        {type.desc}
                      </p>
                    </div>
                    {reportType === type.id && (
                      <CheckCircle2 className="w-5 h-5" />
                    )}
                  </button>
                ))}
              </div>
              {errors.reportType && (
                <p className="text-[10px] text-red-500 font-bold flex items-center gap-1 mt-1 ml-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.reportType.message}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-3">
                <PieChart className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="text-[11px] font-black uppercase tracking-widest text-slate-700">
                    Include Visual Charts
                  </p>
                  <p className="text-[10px] text-slate-500 font-medium">
                    Generate visual growth graphs
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setValue("includeCharts", !includeCharts)}
                className={`w-10 h-6 rounded-full transition-all relative ${
                  includeCharts ? "bg-primary-600" : "bg-slate-300"
                }`}>
                <div
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                    includeCharts ? "left-5" : "left-1"
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex gap-3">
            <Info className="w-5 h-5 text-blue-600 shrink-0" />
            <p className="text-[11px] text-blue-700 font-medium leading-relaxed">
              Reports are generated as high-quality PDFs and stored in the
              student's cloud directory.
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn-modern-outline !py-3">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isGenerating}
              className="flex-[2] btn-modern-primary !py-3 flex items-center justify-center gap-2 disabled:opacity-50">
              {isGenerating ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              {isGenerating ? "Generating..." : "Generate PDF"}
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

export default ReportOptionsModal;
