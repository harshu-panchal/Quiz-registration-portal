import React from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  Calendar,
  Settings,
  LogOut,
  User,
  Wallet,
  ChevronRight,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

const Sidebar = ({ role = "student", onClose }) => {
  const { user, logout } = useAuth();
  const { t } = useLanguage();

  const studentLinks = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  ];

  const adminLinks = [
    { name: "dashboard", icon: LayoutDashboard, path: "/admin" },
    { name: "student_list", icon: User, path: "/admin/students" },
    { name: "financials", icon: Wallet, path: "/admin/wallet" },
    { name: "analytics", icon: GraduationCap, path: "/admin/analytics" },
    { name: "settings", icon: Settings, path: "/admin/settings" },
  ];

  const links = role === "admin" ? adminLinks : studentLinks;

  return (
    <div className="w-64 h-full glass-sidebar flex flex-col p-6 relative">
      {/* Mobile Close Button */}
      <button
        onClick={onClose}
        className="lg:hidden absolute top-4 right-4 p-2 rounded-lg hover:bg-slate-100 text-slate-400">
        <X className="w-5 h-5" />
      </button>

      <div className="flex items-center gap-3 mb-10 px-1">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative">
          <img
            src={user?.avatar || `https://i.pravatar.cc/150?u=${user?.email}`}
            alt="Avatar"
            className="w-10 h-10 rounded-xl object-cover ring-2 ring-primary-50 shadow-md"
            loading="lazy"
          />
          <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
        </motion.div>
        <div className="min-w-0">
          <p className="font-black text-slate-900 leading-tight truncate text-sm">
            {user?.name || "User"}
          </p>
          <p className="text-[9px] text-primary-600 font-black uppercase tracking-widest mt-0.5 truncate">
            {role === "admin" ? t('administrator') : t('cs_student')}
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-1.5 overflow-y-auto">
        {links.map((link, index) => (
          <motion.div
            key={link.name}
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.05 }}>
            <NavLink
              to={link.path}
              onClick={onClose}
              className={({ isActive }) =>
                `nav-link group !px-3 !py-2 ${isActive ? "active" : ""}`
              }>
              {({ isActive }) => (
                <>
                  <link.icon
                    className={`w-4 h-4 transition-colors ${isActive
                      ? "text-primary-600"
                      : "text-slate-400 group-hover:text-primary-500"
                      }`}
                  />
                  <span className="flex-1 text-[11px]">{t(link.name)}</span>
                  {isActive && (
                    <motion.div layoutId="active-pill">
                      <ChevronRight className="w-3.5 h-3.5 text-primary-600" />
                    </motion.div>
                  )}
                </>
              )}
            </NavLink>
          </motion.div>
        ))}
      </nav>

      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={() => {
          logout();
          if (onClose) onClose();
        }}
        className="mt-6 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
        <LogOut className="w-4 h-4 text-primary-400" />
        {t('log_out')}
      </motion.button>
    </div>
  );
};

export default Sidebar;
