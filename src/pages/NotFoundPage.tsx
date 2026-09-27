import React from 'react';
import { Link } from 'react-router-dom';
import { Store, ArrowLeft } from 'lucide-react';
import { AMFFLLogo } from '../components/common/AMFFLLogo';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 text-center">
      <div className="max-w-md space-y-5">
        <div className="flex justify-center mb-2">
          <AMFFLLogo variant="dark" />
        </div>
        <span className="text-6xl font-black text-emerald-800 font-['Plus_Jakarta_Sans']">
          404
        </span>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-['Plus_Jakarta_Sans']">
          Page Not Found
        </h1>
        <p className="text-xs text-slate-500 leading-relaxed">
          The page or classified listing you are searching for might have been moved or removed.
        </p>

        <div className="pt-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all active:scale-95"
          >
            <Store className="w-4 h-4" /> Back to AMFFL Marketplace
          </Link>
        </div>
      </div>
    </div>
  );
};
