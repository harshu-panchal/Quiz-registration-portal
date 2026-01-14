import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import { RotateCcw, MapPin, User, GraduationCap } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { indianStatesCities } from "../data/indianStatesCities";

const filterSchema = z.object({
  state: z.string().optional(),
  city: z.string().optional(),
  gender: z.string().optional(),
  class: z.string().optional(),
});

const FilterOptionsModal = ({
  isOpen,
  onClose,
  onApply,
  currentFilters = {},
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      state: currentFilters.state || "",
      city: currentFilters.city || "",
      gender: currentFilters.gender || "",
      class: currentFilters.class || "",
    },
  });

  const selectedState = watch("state");

  useEffect(() => {
    reset({
      state: currentFilters.state || "",
      city: currentFilters.city || "",
      gender: currentFilters.gender || "",
      class: currentFilters.class || "",
    });
  }, [currentFilters, reset]);

  const handleReset = () => {
    reset({
      state: "",
      city: "",
      gender: "",
      class: "",
    });
  };

  const handleApply = (data) => {
    onApply(data);
    onClose();
  };

  const classOptions = [
    "1st Grade", "2nd Grade", "3rd Grade", "4th Grade", "5th Grade",
    "6th Grade", "7th Grade", "8th Grade", "9th Grade", "10th Grade",
    "11th Grade", "12th Grade", "Other"
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Filter Students"
      maxWidth="max-w-md">
      <div className="space-y-6">

        {/* State Filter */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
            State
          </label>
          <div className="relative group">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
            <select
              className="modern-input !pl-12 !py-2.5 bg-white w-full"
              {...register("state", {
                onChange: (e) => setValue("city", "")
              })}
            >
              <option value="">All States</option>
              {Object.keys(indianStatesCities).sort().map((state) => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>
        </div>

        {/* City Filter */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
            City
          </label>
          <div className="relative group">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
            <select
              className="modern-input !pl-12 !py-2.5 bg-white w-full disabled:bg-slate-50 disabled:text-slate-400"
              disabled={!selectedState}
              {...register("city")}
            >
              <option value="">{selectedState ? "All Cities" : "Select State First"}</option>
              {selectedState && indianStatesCities[selectedState]?.sort().map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Gender Filter */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
              Gender
            </label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
              <select
                className="modern-input !pl-12 !py-2.5 bg-white w-full"
                {...register("gender")}
              >
                <option value="">All</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Class Filter */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
              Class / Grade
            </label>
            <div className="relative group">
              <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
              <select
                className="modern-input !pl-12 !py-2.5 bg-white w-full"
                {...register("class")}
              >
                <option value="">All Classes</option>
                {classOptions.map((cls) => (
                  <option key={cls} value={cls}>{cls}</option>
                ))}
              </select>
            </div>
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
