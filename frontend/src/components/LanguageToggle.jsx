import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

/**
 * A compact language toggle button for public pages (landing, login, register)
 * Switches between English and Hindi
 */
const LanguageToggle = ({ className = '' }) => {
    const { language, toggleLanguage } = useLanguage();

    return (
        <button
            onClick={toggleLanguage}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest 
        bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-800 transition-all ${className}`}
            title={language === 'en' ? 'हिंदी में बदलें' : 'Switch to English'}
        >
            <Globe className="w-3.5 h-3.5" />
            <span>{language === 'en' ? 'हिंदी' : 'EN'}</span>
        </button>
    );
};

export default LanguageToggle;

