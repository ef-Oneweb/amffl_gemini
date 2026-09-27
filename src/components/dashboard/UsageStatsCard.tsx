import React from 'react';
import { Eye, PhoneCall, Tag, Sparkles, BarChart2 } from 'lucide-react';
import { Listing, MembershipPlan } from '../../types';

interface UsageStatsCardProps {
  listings: Listing[];
  plan?: MembershipPlan;
}

export const UsageStatsCard: React.FC<UsageStatsCardProps> = ({ listings, plan }) => {
  const activeListings = listings.filter(l => l.status === 'active');
  const featuredListings = activeListings.filter(l => l.is_featured);
  const totalViews = listings.reduce((sum, l) => sum + (l.views_count || 0), 0);
  const totalContacts = listings.reduce((sum, l) => sum + (l.contact_reveals || 0), 0);

  const featuredLimit = plan?.featured_ads || 0;

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-blue-50 text-blue-700">
            <BarChart2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-slate-900 font-['Plus_Jakarta_Sans']">
              Usage &amp; Engagement Stats
            </h3>
            <p className="text-[11px] text-slate-500">Live analytics across your posted listings</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Active Ads */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
          <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-bold uppercase tracking-wider">
            <Tag className="w-3.5 h-3.5 text-emerald-600" /> Active Ads
          </div>
          <p className="text-2xl font-black text-slate-900 mt-1 font-['Plus_Jakarta_Sans']">
            {activeListings.length}
          </p>
          <span className="text-[10px] text-slate-400">Live in marketplace</span>
        </div>

        {/* Featured Ads Used */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
          <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Featured Slots
          </div>
          <p className="text-2xl font-black text-slate-900 mt-1 font-['Plus_Jakarta_Sans']">
            {featuredListings.length} <span className="text-xs text-slate-400 font-normal">/ {featuredLimit}</span>
          </p>
          <span className="text-[10px] text-slate-400">Slots utilized</span>
        </div>

        {/* Views */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
          <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-bold uppercase tracking-wider">
            <Eye className="w-3.5 h-3.5 text-blue-600" /> Total Views
          </div>
          <p className="text-2xl font-black text-slate-900 mt-1 font-['Plus_Jakarta_Sans']">
            {totalViews.toLocaleString()}
          </p>
          <span className="text-[10px] text-slate-400">Organic shopper impressions</span>
        </div>

        {/* Phone Reveals */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
          <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-bold uppercase tracking-wider">
            <PhoneCall className="w-3.5 h-3.5 text-emerald-600" /> Contact Reveals
          </div>
          <p className="text-2xl font-black text-emerald-700 mt-1 font-['Plus_Jakarta_Sans']">
            {totalContacts.toLocaleString()}
          </p>
          <span className="text-[10px] text-slate-400">Direct buyer inquiries</span>
        </div>
      </div>
    </div>
  );
};
