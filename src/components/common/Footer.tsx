import React from 'react';
import { Link } from 'react-router-dom';
import { AMFFLLogo } from './AMFFLLogo';
import { Facebook, Twitter, Instagram, Linkedin, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0b1120] text-slate-400 border-t border-slate-800 pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <AMFFLLogo variant="light" />
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              With AMFFL, buying and selling in Nigeria has never been easier. Find great deals or earn money by selling your items — join the premier classifieds marketplace today.
            </p>
            <div className="flex items-center gap-3 pt-2 text-slate-400">
              <a href="#" className="p-2 rounded-lg bg-slate-800/80 hover:bg-emerald-600 hover:text-white transition-colors" aria-label="Facebook">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-slate-800/80 hover:bg-emerald-600 hover:text-white transition-colors" aria-label="Twitter">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-slate-800/80 hover:bg-emerald-600 hover:text-white transition-colors" aria-label="Instagram">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-slate-800/80 hover:bg-emerald-600 hover:text-white transition-colors" aria-label="LinkedIn">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
            <div className="flex items-center gap-2 pt-2 text-[11px] text-emerald-400">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Verified Merchant Escrow & Paystack Secured</span>
            </div>
          </div>

          {/* How to Sell Fast */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4 font-['Plus_Jakarta_Sans']">
              How to Sell Fast
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/premium-services" className="hover:text-emerald-400 transition-colors">
                  Membership Plans
                </Link>
              </li>
              <li>
                <Link to="/sell" className="hover:text-emerald-400 transition-colors">
                  Post Your Ad
                </Link>
              </li>
              <li>
                <Link to="/promotions" className="hover:text-emerald-400 transition-colors">
                  Promote Listings
                </Link>
              </li>
              <li>
                <Link to="/verify" className="hover:text-emerald-400 transition-colors">
                  Get Verified
                </Link>
              </li>
            </ul>
          </div>

          {/* Information */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4 font-['Plus_Jakarta_Sans']">
              Information
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/" className="hover:text-emerald-400 transition-colors">
                  Marketplace
                </Link>
              </li>
              <li>
                <Link to="/premium-services" className="hover:text-emerald-400 transition-colors">
                  Premium Services
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-emerald-400 transition-colors">
                  My Dashboard
                </Link>
              </li>
              <li>
                <Link to="/promotions" className="hover:text-emerald-400 transition-colors">
                  Promotion Engine
                </Link>
              </li>
            </ul>
          </div>

          {/* Help & Support */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4 font-['Plus_Jakarta_Sans']">
              Help & Support
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/verify" className="hover:text-emerald-400 transition-colors">
                  Verification Center
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-emerald-400 transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-emerald-400 transition-colors">
                  Create Account
                </Link>
              </li>
              <li>
                <span className="text-slate-500 cursor-not-allowed">
                  24/7 Helpline: 0800-AMFFL-NG
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 AMFFL Marketplace. All rights reserved.</p>
          <div className="flex items-center gap-1 text-[11px] text-slate-500">
            <span>Built for Nigerian Commerce with</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline" />
            <span>&amp; Paystack Integration</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
