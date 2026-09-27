import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { 
  PlusCircle, 
  Store, 
  Crown, 
  Flame, 
  LayoutDashboard, 
  ShieldCheck, 
  ShieldAlert, 
  LogOut, 
  LogIn, 
  UserPlus, 
  Menu, 
  X,
  User
} from 'lucide-react';
import { AMFFLLogo } from './AMFFLLogo';
import { NotificationDropdown } from './NotificationDropdown';
import { useAuth } from '../../context/AuthContext';

export const TopNav: React.FC = () => {
  const { user, isAuthenticated, role, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${
      isActive
        ? 'bg-white/20 text-white shadow-sm font-bold'
        : 'text-emerald-100 hover:text-white hover:bg-white/10'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-[#006B3E] text-white shadow-md border-b border-emerald-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-6">
            <AMFFLLogo variant="light" />

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1">
              <NavLink to="/" end className={navLinkClass}>
                <Store className="w-4 h-4" /> Marketplace
              </NavLink>

              <NavLink to="/premium-services" className={navLinkClass}>
                <Crown className="w-4 h-4 text-amber-300" /> Premium Services
              </NavLink>

              <NavLink to="/promotions" className={navLinkClass}>
                <Flame className="w-4 h-4 text-orange-300" /> Promotions
              </NavLink>

              {isAuthenticated && (
                <>
                  <NavLink to="/dashboard" className={navLinkClass}>
                    <LayoutDashboard className="w-4 h-4" /> Dashboard
                  </NavLink>

                  <NavLink to="/verify" className={navLinkClass}>
                    <ShieldCheck className="w-4 h-4 text-emerald-300" /> Verify
                  </NavLink>
                </>
              )}

              {role === 'admin' && (
                <NavLink to="/admin" className={navLinkClass}>
                  <ShieldAlert className="w-4 h-4 text-amber-300" /> Admin
                </NavLink>
              )}
            </nav>
          </div>

          {/* Right Action Area */}
          <div className="hidden md:flex items-center gap-3">
            {/* Post Your Ad CTA Button */}
            <Link
              to="/sell"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs shadow-md shadow-emerald-950/20 transition-all hover:scale-105 active:scale-95"
            >
              <PlusCircle className="w-4 h-4 stroke-[2.5]" />
              <span>POST YOUR AD</span>
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center gap-2 pl-2 border-l border-emerald-700/60">
                <NotificationDropdown />

                <div className="flex items-center gap-2 ml-1 bg-emerald-800/80 hover:bg-emerald-800 py-1 px-2.5 rounded-full border border-emerald-600/50">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shadow-inner">
                    {user?.full_name?.charAt(0) || <User className="w-3.5 h-3.5" />}
                  </div>
                  <span className="text-xs font-semibold text-white max-w-[110px] truncate">
                    {user?.full_name?.split(' ')[0]}
                  </span>
                  <button
                    onClick={handleLogout}
                    title="Sign Out"
                    className="text-emerald-300 hover:text-white ml-1 p-1 rounded-full hover:bg-emerald-700/50 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 pl-2 border-l border-emerald-700/60">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white hover:bg-white/10 transition-colors"
                >
                  <LogIn className="w-3.5 h-3.5" /> Sign In
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white text-emerald-900 font-bold text-xs hover:bg-emerald-50 transition-colors shadow-sm"
                >
                  <UserPlus className="w-3.5 h-3.5 text-emerald-700" /> Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 md:hidden">
            {isAuthenticated && <NotificationDropdown />}

            <Link
              to="/sell"
              className="p-1.5 rounded-full bg-emerald-500 text-white shadow-sm"
              title="Post Ad"
            >
              <PlusCircle className="w-5 h-5" />
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#005230] border-t border-emerald-800 px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-4 duration-200">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-white hover:bg-white/10"
          >
            <Store className="w-5 h-5 text-emerald-300" /> Marketplace
          </Link>
          <Link
            to="/premium-services"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-white hover:bg-white/10"
          >
            <Crown className="w-5 h-5 text-amber-300" /> Premium Services & Memberships
          </Link>
          <Link
            to="/promotions"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-white hover:bg-white/10"
          >
            <Flame className="w-5 h-5 text-orange-300" /> Promotions & Boosts
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-white hover:bg-white/10"
              >
                <LayoutDashboard className="w-5 h-5 text-emerald-300" /> Member Dashboard
              </Link>
              <Link
                to="/verify"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-white hover:bg-white/10"
              >
                <ShieldCheck className="w-5 h-5 text-emerald-300" /> Verification Center
              </Link>
              {role === 'admin' && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-amber-300 hover:bg-white/10"
                >
                  <ShieldAlert className="w-5 h-5 text-amber-300" /> Admin Operations
                </Link>
              )}

              <div className="pt-3 border-t border-emerald-700/60 flex items-center justify-between">
                <span className="text-xs text-emerald-200">
                  Signed in as <strong className="text-white">{user?.full_name}</strong>
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-xs text-red-300 hover:text-red-100 font-semibold px-2 py-1 rounded bg-red-950/40"
                >
                  <LogOut className="w-3.5 h-3.5" /> Sign Out
                </button>
              </div>
            </>
          ) : (
            <div className="pt-3 border-t border-emerald-700/60 grid grid-cols-2 gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-2.5 rounded-xl bg-white/10 text-white font-semibold text-sm hover:bg-white/20"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-2.5 rounded-xl bg-white text-emerald-900 font-bold text-sm hover:bg-emerald-50"
              >
                Create Account
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
