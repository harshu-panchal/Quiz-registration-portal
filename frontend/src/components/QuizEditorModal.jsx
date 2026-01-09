import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import {
  BookOpen,
  Clock,
  FileText,
  Link as LinkIcon,
  HelpCircle,
  Plus,
  Trash2,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const quizSchema = z
  .object({
    title: z.string().min(5, "Title must be at least 5 characters").max(100),
    description: z.string().max(500, "Description is too long").optional(),
    type: z.enum(["Google Form", "Internal"]),
    link: z.string().url("Invalid URL").optional().or(z.literal("")),
    timeLimit: z.coerce
      .number()
      .min(1, "Minimum 1 minute")
      .max(300, "Maximum 300 minutes"),
    category: z.string().min(2, "Category is required"),
  })
  .refine(
    (data) => {
      if (data.type === "Google Form" && !data.link) {
        return false;
      }
      return true;
    },
    {
      message: "External link is required for Google Form",
      path: ["link"],
    }
  );

const QuizEditorModal = ({ isOpen, onClose, quiz = null }) => {
  const [activeTab, setActiveTab] = useState("Basic");

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      title: "",
      description: "",
      type: "Google Form",
      link: "",
      timeLimit: "45",
      category: "Screening",
    },
  });

  const selectedType = watch("type");
  const formData = watch();

  useEffect(() => {
    if (quiz) {
      reset({
        title: quiz.title || "",
        description: quiz.description || "",
        type: quiz.type || "Google Form",
        link: quiz.link || "",
        timeLimit: quiz.timeLimit || "45",
        category: quiz.category || "Screening",
      });
    } else {
      reset({
        title: "",
        description: "",
        type: "Google Form",
        link: "",
        timeLimit: "45",
        category: "Screening",
      });
    }
  }, [quiz, isOpen, reset]);

  const onSubmit = (data) => {
    console.log("Saving quiz:", data);
    onClose();
  };

  const tabs = ["Basic", "Questions", "Settings"];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={quiz ? "Edit Quiz" : "Create New Quiz"}
      maxWidth="max-w-2xl">
      <div className="flex bg-slate-100 p-1 rounded-2xl w-fit mb-8">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${
              activeTab === tab
                ? "bg-white text-primary-600 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}>
            {tab}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {activeTab === "Basic" && (
          <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                Quiz Title
              </label>
              <div className="relative group">
                <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-300 group-focus-within:text-primary-500 transition-colors" />
                <input
                  {...register("title")}
                  type="text"
                  placeholder="e.g. Mid-Term Assessment"
                  className={`modern-input !pl-12 !py-3 bg-slate-50 border-transparent focus:bg-white w-full ${
                    errors.title ? "border-red-500 focus:ring-red-500/10" : ""
                  }`}
                />
              </div>
              {errors.title && (
                <p className="text-[10px] font-bold text-red-500 ml-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.title.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                Description
              </label>
              <textarea
                {...register("description")}
                rows={3}
                placeholder="Briefly describe what this quiz covers..."
                className={`modern-input !py-3 bg-slate-50 border-transparent focus:bg-white w-full resize-none ${
                  errors.description
                    ? "border-red-500 focus:ring-red-500/10"
                    : ""
                }`}
              />
              {errors.description && (
                <p className="text-[10px] font-bold text-red-500 ml-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />{" "}
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  Quiz Type
                </label>
                <select
                  {...register("type")}
                  className="modern-input !py-3 bg-slate-50 border-transparent focus:bg-white w-full">
                  <option value="Google Form">Google Form</option>
                  <option value="Internal">Internal (Beta)</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  Time Limit (Mins)
                </label>
                <div className="relative group">
                  <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-300 group-focus-within:text-primary-500 transition-colors" />
                  <input
                    {...register("timeLimit")}
                    type="number"
                    className={`modern-input !pl-12 !py-3 bg-slate-50 border-transparent focus:bg-white w-full ${
                      errors.timeLimit
                        ? "border-red-500 focus:ring-red-500/10"
                        : ""
                    }`}
                  />
                </div>
                {errors.timeLimit && (
                  <p className="text-[10px] font-bold text-red-500 ml-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />{" "}
                    {errors.timeLimit.message}
                  </p>
                )}
              </div>
            </div>

            {selectedType === "Google Form" && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  External Link
                </label>
                <div className="relative group">
                  <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-300 group-focus-within:text-primary-500 transition-colors" />
                  <input
                    {...register("link")}
                    type="url"
                    placeholder="https://forms.google.com/..."
                    className={`modern-input !pl-12 !py-3 bg-slate-50 border-transparent focus:bg-white w-full ${
                      errors.link ? "border-red-500 focus:ring-red-500/10" : ""
                    }`}
                  />
                </div>
                {errors.link && (
                  <p className="text-[10px] font-bold text-red-500 ml-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.link.message}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === "Questions" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            {formData.type === "Google Form" ? (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-4 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                <div className="w-16 h-16 rounded-full bg-primary-50 flex items-center justify-center text-primary-600">
                  <LinkIcon className="w-8 h-8" />
                </div>
                <div className="max-w-sm">
                  <h4 className="font-black text-slate-900">External Quiz</h4>
                  <p className="text-xs text-slate-500 font-medium mt-1">
                    Questions for Google Forms are managed directly on their
                    platform. EduPortal will track the completion status.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-400 font-bold text-xs">
                      1
                    </div>
                    <p className="text-sm font-bold text-slate-700">
                      How many types of loops are in Python?
                    </p>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      className="p-2 rounded-lg hover:bg-white text-slate-400 hover:text-primary-600">
                      <HelpCircle className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      className="p-2 rounded-lg hover:bg-white text-slate-400 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center gap-2 text-slate-400 hover:border-primary-300 hover:bg-primary-50/30 hover:text-primary-600 transition-all">
                  <Plus className="w-4 h-4" />
                  <span className="text-xs font-black uppercase tracking-widest">
                    Add Question
                  </span>
                </button>
              </div>
            )}
          </div>
        )}

        <div className="flex gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 btn-modern-outline !py-3">
            Cancel
          </button>
          <button
            type="submit"
            className="flex-[2] btn-modern-primary !py-3 flex items-center justify-center gap-2">
            {quiz ? "Update Quiz" : "Publish Quiz"}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default QuizEditorModal;
