import React from 'react';
import { Link } from 'react-router-dom';

interface AMFFLLogoProps {
  variant?: 'light' | 'dark';
  className?: string;
}

export const AMFFLLogo: React.FC<AMFFLLogoProps> = ({ variant = 'light', className = '' }) => {
  return (
    <Link to="/" className={`flex items-center gap-2.5 group select-none ${className}`}>
      {/* Icon emblem matching AMFFL brand */}
      <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 via-emerald-600 to-green-800 shadow-md border border-white/20 transition-transform group-hover:scale-105">
        <svg viewBox="0 0 32 32" className="w-5 h-5 fill-white" xmlns="http://www.w3.org/2000/svg">
          <path d="M7 23L16 6l9 17h-5.5l-3.5-7.5-3.5 7.5H7z" fill="#ffffff" />
          <circle cx="21" cy="9.5" r="3" fill="#fbbf24" />
        </svg>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className={`text-xl font-extrabold tracking-tight font-['Plus_Jakarta_Sans'] ${
            variant === 'light' ? 'text-white' : 'text-slate-900'
          }`}>
            AMFFL
          </span>
          <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase rounded bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
            Hub
          </span>
        </div>
        <span className={`text-[10px] font-medium tracking-wider uppercase -mt-1 ${
          variant === 'light' ? 'text-emerald-100/80' : 'text-slate-500'
        }`}>
          Classifieds & Membership
        </span>
      </div>
    </Link>
  );
};
