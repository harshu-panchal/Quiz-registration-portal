import React, { useState } from "react";
import Modal from "./Modal";
import { Filter, X, Check, RotateCcw, AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const filterSchema = z.object({
  status: z.string(),
  class: z.string(),
  school: z.string(),
  dateRange: z.string(),
});

const FilterOptionsModal = ({
  isOpen,
  onClose,
  onApply,
  currentFilters = {},
  filterOptions = {}, // Add filterOptions prop
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      status: currentFilters.status || "All",
      class: currentFilters.class || "All",
      school: currentFilters.school || "All",
      dateRange: currentFilters.dateRange || "All Time",
    },
  });

  const filters = watch();

  const statusOptions = [
    "All",
    "Active",
    "Pending",
    "Sent",
    "Completed",
    "Inactive",
  ];

  // Use dynamic options if available, relative to "All"
  const classOptions = ["All", ...(filterOptions.classes || ["10th Grade", "11th Grade", "12th Grade"])];
  const schoolOptions = ["All", ...(filterOptions.schools || ["Evergreen High School", "Oakwood Academy", "Riverside International", "Maplewood Prep", "Summit High"])];
  const dateOptions = ["All Time", "Today", "Last 7 Days", "Last 30 Days"];

  const handleReset = () => {
    reset({
      status: "All",
      class: "All",
      school: "All",
      dateRange: "All Time",
    });
  };

  const handleApply = (data) => {
    onApply(data);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Filter Students"
      maxWidth="max-w-md">
      <div className="space-y-6">
        {/* Status Filter */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
            Student Status
          </label>
          <div className="flex flex-wrap gap-2">
            {statusOptions.map((status) => (
              <button
                key={status}
                type="button"
                onClick={() =>
                  setValue("status", status, { shouldValidate: true })
                }
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${filters.status === status
                  ? "bg-primary-600 text-white shadow-sm"
                  : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                  }`}>
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* School and Class filters moved to StudentFilterBar */}

        {/* Date Range */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
            Date Joined
          </label>
          <div className="grid grid-cols-2 gap-2">
            {dateOptions.map((date) => (
              <button
                key={date}
                type="button"
                onClick={() =>
                  setValue("dateRange", date, { shouldValidate: true })
                }
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border ${filters.dateRange === date
                  ? "bg-primary-50 border-primary-200 text-primary-600"
                  : "bg-white border-slate-100 text-slate-500 hover:border-slate-200"
                  }`}>
                {date}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={handleReset}
            className="flex-1 btn-modern-outline !py-3 flex items-center justify-center gap-2">
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
          <button
            type="button"
            onClick={handleSubmit(handleApply)}
            className="flex-[2] btn-modern-primary !py-3">
            Apply Filters
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default FilterOptionsModal;
