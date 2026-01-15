import React, { useState } from "react";
import { Filter, X, ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";

const FilterDropdown = ({
    label,
    options = [],
    selected = [],
    onChange,
    width = "w-64",
}) => {
    const { t } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);

    const toggleOption = (option) => {
        let newSelected;
        if (selected.includes(option)) {
            newSelected = selected.filter((item) => item !== option);
        } else {
            newSelected = [...selected, option];
        }
        onChange(newSelected);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center justify-between gap-2 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:border-slate-300 hover:text-slate-900 transition-all ${selected.length > 0 ? "border-primary-200 bg-primary-50/50 text-primary-700" : ""
                    }`}
            >
                <span className="truncate max-w-[120px]">
                    {label}
                    {selected.length > 0 && (
                        <span className="ml-1.5 inline-flex items-center justify-center w-5 h-5 bg-primary-600 text-white rounded-full text-[10px]">
                            {selected.length}
                        </span>
                    )}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Backdrop for closing */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-30"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        className={`absolute z-40 top-full mt-2 left-0 ${width} bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden`}
                    >
                        <div className="p-2 max-h-64 overflow-y-auto custom-scrollbar">
                            {options.length === 0 ? (
                                <div className="p-3 text-center text-xs text-slate-400 font-medium">{t('no_options_available')}</div>
                            ) : (
                                options.map((option) => (
                                    <button
                                        key={option}
                                        onClick={() => toggleOption(option)}
                                        className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${selected.includes(option)
                                            ? "bg-primary-50 text-primary-700 font-bold"
                                            : "text-slate-600 hover:bg-slate-50"
                                            }`}
                                    >
                                        <span className="truncate">{option}</span>
                                        {selected.includes(option) && <Check className="w-3.5 h-3.5 text-primary-600" />}
                                    </button>
                                ))
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const StudentFilterBar = ({
    filterOptions,
    activeFilters,
    onFilterChange,
    onClearFilters,
}) => {
    const { t } = useLanguage();
    const hasActiveFilters =
        activeFilters.school.length > 0 ||
        activeFilters.class.length > 0 ||
        activeFilters.status.length > 0;

    return (
        <div className="flex flex-col gap-4 mb-6">
            <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 mr-2 text-slate-400">
                    <Filter className="w-4 h-4" />
                    <span className="text-xs font-black uppercase tracking-widest">{t('filters')}</span>
                </div>

                <FilterDropdown
                    label={t('school')}
                    options={filterOptions.schools}
                    selected={activeFilters.school}
                    onChange={(val) => onFilterChange("school", val)}
                    width="w-64"
                />

                <FilterDropdown
                    label={t('class')}
                    options={filterOptions.classes}
                    selected={activeFilters.class}
                    onChange={(val) => onFilterChange("class", val)}
                    width="w-48"
                />

                <div className="h-6 w-px bg-slate-200 mx-2 hidden sm:block"></div>

                {hasActiveFilters && (
                    <button
                        onClick={onClearFilters}
                        className="flex items-center gap-1.5 px-3 py-2 bg-red-50 text-red-600 rounded-xl text-xs font-bold hover:bg-red-100 transition-colors ml-auto sm:ml-0"
                    >
                        <X className="w-3.5 h-3.5" />
                        {t('clear')}
                    </button>
                )}
            </div>

            {hasActiveFilters && (
                <div className="flex flex-wrap gap-2">
                    {activeFilters.school.map((item) => (
                        <span key={`school-${item}`} className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-lg text-[10px] font-bold">
                            {item}
                            <button
                                onClick={() => {
                                    const newSchools = activeFilters.school.filter(s => s !== item);
                                    onFilterChange("school", newSchools);
                                }}
                                className="hover:text-blue-900"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </span>
                    ))}
                    {activeFilters.class.map((item) => (
                        <span key={`class-${item}`} className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-50 text-purple-700 border border-purple-100 rounded-lg text-[10px] font-bold">
                            {item}
                            <button
                                onClick={() => {
                                    const newClasses = activeFilters.class.filter(c => c !== item);
                                    onFilterChange("class", newClasses);
                                }}
                                className="hover:text-purple-900"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
};

export default StudentFilterBar;
