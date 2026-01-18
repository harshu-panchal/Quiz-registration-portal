import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import { Search, Bell, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import NotificationsPanel from "../components/NotificationsPanel";
import { useLanguage } from "../context/LanguageContext";

const DashboardLayout = ({ children, role = "student" }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const { language, toggleLanguage, t } = useLanguage();

  return (
    <div className="flex min-h-screen bg-slate-50/50 relative">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar - Desktop & Mobile */}
      <div
        className={`fixed inset-y-0 left-0 z-50 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out`}>
        <Sidebar role={role} onClose={() => setIsSidebarOpen(false)} />
      </div>

      <main className="flex-1 flex flex-col min-w-0 w-full">
        {/* Header */}
        <header className="h-14 bg-white/80 backdrop-blur-md sticky top-0 z-30 border-b border-slate-100 flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-4">
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-600">
              <Menu className="w-5 h-5" />
            </button>

            <div className="relative w-40 sm:w-64 lg:w-72 group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
              <input
                type="text"
                placeholder={t('search_placeholder')}
                className="w-full bg-slate-100 border-none focus:ring-2 focus:ring-primary-500/10 py-1.5 pl-10 pr-4 rounded-lg text-[13px]"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 relative">
            <button
              onClick={toggleLanguage}
              className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition-colors uppercase"
            >
              {language === 'en' ? 'HI' : 'EN'}
            </button>

            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className={`p-2 rounded-lg transition-all relative ${isNotificationsOpen
                ? "bg-primary-600 text-white shadow-lg shadow-primary-100"
                : "bg-slate-100 text-slate-600 hover:bg-primary-50 hover:text-primary-600"
                }`}>
              <Bell className="w-4 h-4" />
              {!isNotificationsOpen && (
                <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full border border-white"></span>
              )}
            </button>

            <NotificationsPanel
              isOpen={isNotificationsOpen}
              onClose={() => setIsNotificationsOpen(false)}
            />
            <div className="w-8 h-8 rounded-full bg-primary-100 lg:hidden overflow-hidden border border-primary-200">
              <img
                src="https://i.pravatar.cc/150?u=current"
                alt="User"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-4 lg:p-6 overflow-x-hidden">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;
