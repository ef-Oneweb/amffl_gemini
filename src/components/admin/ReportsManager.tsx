import React, { useState } from 'react';
import { AlertTriangle, Check, X, ShieldAlert } from 'lucide-react';
import { ListingReport } from '../../types';
import { StorageService } from '../../services/storageService';

export const ReportsManager: React.FC = () => {
  const [reports, setReports] = useState<ListingReport[]>(() => StorageService.getReports());

  const refresh = () => setReports(StorageService.getReports());

  const handleAction = (report: ListingReport, action: 'dismissed' | 'actioned') => {
    StorageService.updateReportStatus(
      report.id,
      action,
      action === 'actioned' ? 'Listing deactivated due to policy violation' : 'Report dismissed after investigation'
    );

    if (action === 'actioned') {
      // Deactivate the offending listing
      const listing = StorageService.getListings().find(l => l.id === report.listing_id);
      if (listing) {
        listing.status = 'inactive';
        StorageService.saveListing(listing);
      }
    }

    refresh();
  };

  return (
    <div className="space-y-4">
      <div className="pb-3 border-b border-slate-100">
        <h3 className="font-extrabold text-sm text-slate-900 font-['Plus_Jakarta_Sans']">
          Reported Listings &amp; Safety Desk ({reports.length})
        </h3>
        <p className="text-xs text-slate-500">Flagged scams, duplicate listings or inappropriate items</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              <th className="py-2.5 px-3">Listing Title / ID</th>
              <th className="py-2.5 px-3">Reason</th>
              <th className="py-2.5 px-3">Report Details</th>
              <th className="py-2.5 px-3">Reporter</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {reports.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400">
                  No active reports reported. The marketplace is running smoothly.
                </td>
              </tr>
            ) : (
              reports.map((rep) => (
                <tr key={rep.id} className="hover:bg-slate-50/80">
                  <td className="py-3 px-3">
                    <span className="font-bold text-slate-900 block truncate max-w-xs">{rep.listing_title}</span>
                    <span className="text-[10px] font-mono text-slate-400">{rep.listing_id}</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-red-100 text-red-800">
                      {rep.reason}
                    </span>
                  </td>
                  <td className="py-3 px-3 max-w-xs truncate text-slate-600">{rep.details}</td>
                  <td className="py-3 px-3 text-slate-600">{rep.reporter_name}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        rep.status === 'open'
                          ? 'bg-amber-100 text-amber-800'
                          : rep.status === 'actioned'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {rep.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right space-x-1.5">
                    {rep.status === 'open' && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleAction(rep, 'actioned')}
                          className="px-2.5 py-1 rounded-lg bg-red-600 text-white font-bold text-[11px] hover:bg-red-700"
                          title="Deactivate listing & mark actioned"
                        >
                          Deactivate Ad
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAction(rep, 'dismissed')}
                          className="px-2.5 py-1 rounded-lg bg-slate-200 text-slate-700 font-bold text-[11px] hover:bg-slate-300"
                          title="Dismiss report"
                        >
                          Dismiss
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
