import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { TopNav } from '../components/common/TopNav';
import { Footer } from '../components/common/Footer';
import { DemoSwitcherBar } from '../components/common/DemoSwitcherBar';

export const MembershipLayout: React.FC = () => {
  const { pathname } = useLocation();

  // Scroll to top on navigation
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-800">
      <DemoSwitcherBar />
      <TopNav />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
