import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Sparkles, Power, Eye, Search } from 'lucide-react';
import { Listing } from '../../types';
import { StorageService } from '../../services/storageService';

export const ListingsManager: React.FC = () => {
  const [listings, setListings] = useState<Listing[]>(() => StorageService.getListings());
  const [searchTerm, setSearchTerm] = useState('');

  const refresh = () => setListings(StorageService.getListings());

  const handleToggleStatus = (listing: Listing) => {
    const updated = { ...listing, status: (listing.status === 'active' ? 'inactive' : 'active') as any };
    StorageService.saveListing(updated);
    refresh();
  };

  const handleToggleFeatured = (listing: Listing) => {
    const updated = { ...listing, is_featured: !listing.is_featured };
    StorageService.saveListing(updated);
    refresh();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this listing permanently from the database?')) {
      StorageService.deleteListing(id);
      refresh();
    }
  };

  const filtered = listings.filter(l =>
    l.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.location_state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="pb-3 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-extrabold text-sm text-slate-900 font-['Plus_Jakarta_Sans']">
            Classifieds Moderation ({listings.length})
          </h3>
          <p className="text-xs text-slate-500">Monitor active listings, feature ads, deactivate or delete</p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by title, state..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              <th className="py-2.5 px-3">Ad Title</th>
              <th className="py-2.5 px-3">Price</th>
              <th className="py-2.5 px-3">Category</th>
              <th className="py-2.5 px-3">Location</th>
              <th className="py-2.5 px-3">Seller</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3 text-right">Moderation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((l) => (
              <tr key={l.id} className="hover:bg-slate-50/80">
                <td className="py-3 px-3">
                  <span className="font-bold text-slate-900 block truncate max-w-xs">{l.title}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{l.id}</span>
                </td>
                <td className="py-3 px-3 font-extrabold text-emerald-700">
                  ₦{l.price.toLocaleString()}
                </td>
                <td className="py-3 px-3 text-slate-600 truncate max-w-[120px]">
                  {l.category}
                </td>
                <td className="py-3 px-3 text-slate-500 text-[11px]">
                  {l.location_state}
                </td>
                <td className="py-3 px-3 text-slate-600">
                  {l.seller_name || l.user_id}
                </td>
                <td className="py-3 px-3">
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      l.status === 'active'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {l.status}
                  </span>
                </td>
                <td className="py-3 px-3 text-right space-x-1">
                  <button
                    type="button"
                    onClick={() => handleToggleFeatured(l)}
                    className={`p-1.5 rounded-lg border ${
                      l.is_featured
                        ? 'bg-purple-100 text-purple-700 border-purple-300'
                        : 'bg-slate-50 text-slate-400 border-slate-200 hover:text-purple-600'
                    }`}
                    title={l.is_featured ? 'Remove Feature Boost' : 'Feature Listing'}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleStatus(l)}
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100"
                    title={l.status === 'active' ? 'Deactivate' : 'Activate'}
                  >
                    <Power className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(l.id)}
                    className="p-1.5 rounded-lg bg-red-50 text-red-700 hover:bg-red-100"
                    title="Delete permanently"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
