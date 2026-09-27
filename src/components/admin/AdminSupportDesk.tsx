import React, { useState } from 'react';
import { 
  LifeBuoy, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Send, 
  Lock, 
  User, 
  MessageSquare, 
  Tag, 
  ArrowUpRight,
  ShieldCheck,
  Check,
  X
} from 'lucide-react';
import { SupportTicket } from '../../types';
import { StorageService } from '../../services/storageService';
import { useAuth } from '../../context/AuthContext';

export const AdminSupportDesk: React.FC = () => {
  const { canPerform } = useAuth();
  const [tickets, setTickets] = useState<SupportTicket[]>(() => StorageService.getSupportTickets());
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(() => {
    const list = StorageService.getSupportTickets();
    return list.length > 0 ? list[0] : null;
  });

  const [replyMessage, setReplyMessage] = useState('');
  const [isInternalNote, setIsInternalNote] = useState(false);

  const refresh = () => {
    const updated = StorageService.getSupportTickets();
    setTickets(updated);
    if (selectedTicket) {
      const refreshedSelected = updated.find(t => t.id === selectedTicket.id);
      if (refreshedSelected) setSelectedTicket(refreshedSelected);
    }
  };

  const canRespond = canPerform('manage_support');

  const filteredTickets = tickets.filter(t => {
    if (filterStatus !== 'all' && t.status !== filterStatus) return false;
    if (filterPriority !== 'all' && t.priority !== filterPriority) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchSubject = t.subject.toLowerCase().includes(q);
      const matchUser = t.user_name.toLowerCase().includes(q) || t.user_email.toLowerCase().includes(q);
      const matchId = t.id.toLowerCase().includes(q);
      if (!matchSubject && !matchUser && !matchId) return false;
    }
    return true;
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !replyMessage.trim() || !canRespond) return;

    StorageService.addSupportMessage(
      selectedTicket.id,
      'admin_tunde',
      'Tunde Adeleke (Support Lead)',
      replyMessage.trim(),
      isInternalNote
    );

    setReplyMessage('');
    setIsInternalNote(false);
    refresh();
  };

  const handleUpdateStatus = (status: SupportTicket['status']) => {
    if (!selectedTicket || !canRespond) return;
    StorageService.updateTicketStatus(selectedTicket.id, status);
    refresh();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-black text-slate-900 font-['Plus_Jakarta_Sans'] flex items-center gap-2">
            <LifeBuoy className="w-6 h-6 text-teal-600" />
            Support Helpdesk &amp; Member Inquiries
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Authoritative ticket management for seller billing issues, rejected ads, Paystack reconciliations &amp; general member assistance.
          </p>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[600px]">
        {/* Left Column: Tickets Queue */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col overflow-hidden">
          {/* Search & Filters */}
          <div className="p-3 border-b border-slate-200 bg-slate-50/70 space-y-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search ticket subject, member name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="flex-1 px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-[11px] font-bold text-slate-700"
              >
                <option value="all">All Statuses ({tickets.length})</option>
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="waiting_user">Waiting on User</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>

              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="flex-1 px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-[11px] font-bold text-slate-700"
              >
                <option value="all">All Priorities</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          {/* Ticket List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 max-h-[620px]">
            {filteredTickets.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No tickets matching current filters.
              </div>
            ) : (
              filteredTickets.map((t) => {
                const isSelected = selectedTicket?.id === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTicket(t)}
                    className={`w-full text-left p-3.5 transition-colors flex flex-col gap-1.5 ${
                      isSelected
                        ? 'bg-teal-50/70 border-l-4 border-teal-600'
                        : 'hover:bg-slate-50 border-l-4 border-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-slate-400 font-bold">{t.id}</span>
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded ${
                          t.priority === 'urgent'
                            ? 'bg-rose-100 text-rose-800'
                            : t.priority === 'high'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {t.priority}
                        </span>
                        <span className={`text-[9px] font-bold uppercase px-1.5 py-0.2 rounded-full ${
                          t.status === 'open'
                            ? 'bg-emerald-100 text-emerald-800'
                            : t.status === 'in_progress'
                            ? 'bg-blue-100 text-blue-800'
                            : t.status === 'resolved'
                            ? 'bg-slate-100 text-slate-600'
                            : 'bg-slate-100 text-slate-500'
                        }`}>
                          {t.status}
                        </span>
                      </div>
                    </div>

                    <div className="text-xs font-bold text-slate-900 line-clamp-1">{t.subject}</div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span className="font-semibold">{t.user_name}</span>
                      <span className="text-[10px] text-slate-400">{new Date(t.created_at).toLocaleDateString()}</span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Ticket Details & Thread */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col overflow-hidden">
          {selectedTicket ? (
            <>
              {/* Ticket Top bar */}
              <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between flex-wrap gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-teal-700">{selectedTicket.id}</span>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                      {selectedTicket.category}
                    </span>
                  </div>
                  <h3 className="font-black text-sm text-slate-900 mt-1">{selectedTicket.subject}</h3>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    From: <strong className="text-slate-800">{selectedTicket.user_name}</strong> ({selectedTicket.user_email})
                  </div>
                </div>

                {/* Status Dropdown */}
                {canRespond && (
                  <div className="flex items-center gap-2">
                    <select
                      value={selectedTicket.status}
                      onChange={(e) => handleUpdateStatus(e.target.value as any)}
                      className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                    >
                      <option value="open">Open</option>
                      <option value="in_progress">In Progress</option>
                      <option value="waiting_user">Waiting on User</option>
                      <option value="resolved">Mark Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Messages Thread */}
              <div className="flex-1 p-5 overflow-y-auto space-y-4 max-h-[460px] bg-slate-50/30">
                {selectedTicket.messages.map((msg) => {
                  const isStaff = msg.sender_role === 'admin' || msg.sender_role === 'staff';
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${
                        msg.is_internal
                          ? 'bg-amber-50/90 border border-amber-200 rounded-2xl p-4'
                          : isStaff
                          ? 'bg-teal-50/70 border border-teal-200 rounded-2xl p-4 ml-6'
                          : 'bg-white border border-slate-200 rounded-2xl p-4 mr-6 shadow-2xs'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-extrabold text-slate-900">{msg.sender_name}</span>
                          {msg.is_internal && (
                            <span className="text-[9px] font-black uppercase tracking-wider bg-amber-200 text-amber-900 px-1.5 py-0.2 rounded flex items-center gap-1">
                              <Lock className="w-2.5 h-2.5" /> Staff Only Note
                            </span>
                          )}
                          {isStaff && !msg.is_internal && (
                            <span className="text-[9px] font-black uppercase tracking-wider bg-teal-200 text-teal-900 px-1.5 py-0.2 rounded">
                              Official AMFFL Staff
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400">{new Date(msg.created_at).toLocaleString()}</span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                    </div>
                  );
                })}
              </div>

              {/* Response Input */}
              {canRespond && (
                <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-100 bg-white space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-slate-500">
                      Reply to Ticket
                    </label>
                    <label className="flex items-center gap-1.5 text-xs text-slate-600 font-bold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isInternalNote}
                        onChange={(e) => setIsInternalNote(e.target.checked)}
                        className="rounded text-amber-600 focus:ring-amber-500"
                      />
                      <span>Internal staff note (hidden from customer)</span>
                    </label>
                  </div>

                  <div className="flex gap-2">
                    <textarea
                      rows={3}
                      required
                      placeholder={isInternalNote ? "Write internal staff memo or investigation note..." : "Write customer response..."}
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      className={`flex-1 p-3 rounded-xl text-xs border focus:outline-none focus:ring-2 ${
                        isInternalNote
                          ? 'bg-amber-50/40 border-amber-200 focus:ring-amber-500/20'
                          : 'bg-slate-50 border-slate-200 focus:ring-teal-500/20'
                      }`}
                    />
                    <button
                      type="submit"
                      disabled={!replyMessage.trim()}
                      className={`px-4 rounded-xl text-white font-bold text-xs flex flex-col items-center justify-center gap-1 transition-colors ${
                        isInternalNote
                          ? 'bg-amber-600 hover:bg-amber-700'
                          : 'bg-teal-600 hover:bg-teal-700'
                      }`}
                    >
                      <Send className="w-4 h-4" />
                      <span>{isInternalNote ? 'Log Note' : 'Reply'}</span>
                    </button>
                  </div>
                </form>
              )}
            </>
          ) : (
            <div className="py-32 text-center text-slate-400">
              <LifeBuoy className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              Select a ticket to inspect conversation thread.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
