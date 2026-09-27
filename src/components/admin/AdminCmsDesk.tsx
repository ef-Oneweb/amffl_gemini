import React, { useState } from 'react';
import { 
  Layout, 
  Image, 
  Megaphone, 
  FileText, 
  BellRing, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  EyeOff, 
  Check, 
  X, 
  ExternalLink,
  MousePointerClick,
  Sparkles,
  Save
} from 'lucide-react';
import { 
  MarketplaceBanner, 
  MarketplaceAnnouncement, 
  CMSPage, 
  NotificationTemplate 
} from '../../types';
import { StorageService } from '../../services/storageService';
import { useAuth } from '../../context/AuthContext';

export const AdminCmsDesk: React.FC = () => {
  const { canPerform } = useAuth();
  const [activeTab, setActiveTab] = useState<'banners' | 'announcements' | 'pages' | 'templates'>('banners');

  const [banners, setBanners] = useState<MarketplaceBanner[]>(() => StorageService.getBanners());
  const [announcements, setAnnouncements] = useState<MarketplaceAnnouncement[]>(() => StorageService.getAnnouncements());
  const [cmsPages, setCmsPages] = useState<CMSPage[]>(() => StorageService.getCmsPages());
  const [templates, setTemplates] = useState<NotificationTemplate[]>(() => StorageService.getNotificationTemplates());

  // Editing state for Banners
  const [bannerModalOpen, setBannerModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Partial<MarketplaceBanner> | null>(null);

  // Editing state for CMS Pages
  const [selectedPage, setSelectedPage] = useState<CMSPage | null>(null);
  const [pageContent, setPageContent] = useState('');
  const [pageTitle, setPageTitle] = useState('');

  // Editing state for Templates
  const [selectedTemplate, setSelectedTemplate] = useState<NotificationTemplate | null>(null);
  const [templateSubject, setTemplateSubject] = useState('');
  const [templateBody, setTemplateBody] = useState('');

  const refresh = () => {
    setBanners(StorageService.getBanners());
    setAnnouncements(StorageService.getAnnouncements());
    setCmsPages(StorageService.getCmsPages());
    setTemplates(StorageService.getNotificationTemplates());
  };

  const canEdit = canPerform('manage_cms');

  // Banner Actions
  const handleToggleBanner = (banner: MarketplaceBanner) => {
    if (!canEdit) return;
    const updated = { ...banner, is_active: !banner.is_active };
    StorageService.saveBanner(updated);
    refresh();
  };

  const handleSaveBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBanner || !editingBanner.title) return;

    const bannerToSave: MarketplaceBanner = {
      id: editingBanner.id || `banner_${Date.now()}`,
      title: editingBanner.title,
      placement: editingBanner.placement || 'home_hero',
      image_url: editingBanner.image_url || 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=1200&q=80',
      link_url: editingBanner.link_url || '/marketplace',
      is_active: editingBanner.is_active !== undefined ? editingBanner.is_active : true,
      impressions_count: editingBanner.impressions_count || 0,
      clicks_count: editingBanner.clicks_count || 0,
      created_at: editingBanner.created_at || new Date().toISOString()
    };

    StorageService.saveBanner(bannerToSave);
    StorageService.logAuditEvent({
      action: 'cms_update',
      actor_id: 'admin_tunde',
      actor_name: 'Tunde Adeleke',
      target_type: 'banner',
      target_id: bannerToSave.id,
      details: { title: bannerToSave.title, placement: bannerToSave.placement }
    });

    setBannerModalOpen(false);
    setEditingBanner(null);
    refresh();
  };

  // CMS Page Actions
  const handleSelectPage = (page: CMSPage) => {
    setSelectedPage(page);
    setPageTitle(page.title);
    setPageContent(page.content);
  };

  const handleSavePage = () => {
    if (!selectedPage || !canEdit) return;
    const updated: CMSPage = {
      ...selectedPage,
      title: pageTitle,
      content: pageContent,
      updated_at: new Date().toISOString()
    };
    StorageService.saveCmsPage(updated);
    StorageService.logAuditEvent({
      action: 'cms_update',
      actor_id: 'admin_tunde',
      actor_name: 'Tunde Adeleke',
      target_type: 'cms_page',
      target_id: updated.id,
      details: { slug: updated.slug, title: updated.title }
    });
    alert('CMS page published successfully!');
    refresh();
  };

  // Template Actions
  const handleSelectTemplate = (template: NotificationTemplate) => {
    setSelectedTemplate(template);
    setTemplateSubject(template.subject);
    setTemplateBody(template.body);
  };

  const handleSaveTemplate = () => {
    if (!selectedTemplate || !canEdit) return;
    const updatedTemplates = templates.map(t => 
      t.id === selectedTemplate.id 
        ? { ...t, subject: templateSubject, body: templateBody, updated_at: new Date().toISOString() }
        : t
    );
    localStorage.setItem('amffl_notification_templates', JSON.stringify(updatedTemplates));
    alert('Template updated successfully!');
    refresh();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-black text-slate-900 font-['Plus_Jakarta_Sans'] flex items-center gap-2">
            <Layout className="w-6 h-6 text-indigo-600" />
            Content Management &amp; Communications Desk
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Authoritative control over promotional marketplace banners, system announcements, legal CMS pages, and transactional notification templates.
          </p>
        </div>

        {activeTab === 'banners' && canEdit && (
          <button
            onClick={() => {
              setEditingBanner({
                title: '',
                placement: 'home_hero',
                image_url: '',
                link_url: '/marketplace',
                is_active: true
              });
              setBannerModalOpen(true);
            }}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" /> Add Promotional Banner
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTab('banners')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'banners'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Image className="w-4 h-4" />
          <span>Banners &amp; Creatives ({banners.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('announcements')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'announcements'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Megaphone className="w-4 h-4" />
          <span>Announcements &amp; Broadcasts ({announcements.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('pages')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'pages'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Static CMS Pages ({cmsPages.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('templates')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'templates'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <BellRing className="w-4 h-4" />
          <span>Notification Templates ({templates.length})</span>
        </button>
      </div>

      {/* TAB 1: BANNERS */}
      {activeTab === 'banners' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {banners.map((banner) => (
            <div
              key={banner.id}
              className={`bg-white rounded-3xl border transition-all overflow-hidden shadow-xs hover:shadow-md ${
                banner.is_active ? 'border-slate-200' : 'border-slate-200/60 opacity-60'
              }`}
            >
              <div className="relative h-40 bg-slate-900 overflow-hidden">
                <img
                  src={banner.image_url}
                  alt={banner.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-4">
                  <span className="text-white text-xs font-black truncate">{banner.title}</span>
                </div>
                <span className={`absolute top-3 right-3 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full ${
                  banner.is_active ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-300'
                }`}>
                  {banner.is_active ? 'Active Live' : 'Paused'}
                </span>
                <span className="absolute top-3 left-3 text-[10px] font-bold uppercase bg-slate-900/80 backdrop-blur-xs text-white px-2 py-0.5 rounded-md">
                  {banner.placement}
                </span>
              </div>

              <div className="p-5 space-y-4">
                <div className="grid grid-cols-2 gap-2 text-center bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Impressions</span>
                    <p className="text-sm font-black text-slate-900 font-mono">{banner.impressions_count.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Clicks (CTR)</span>
                    <p className="text-sm font-black text-emerald-600 font-mono">
                      {banner.clicks_count.toLocaleString()} ({banner.impressions_count ? ((banner.clicks_count / banner.impressions_count) * 100).toFixed(1) : 0}%)
                    </p>
                  </div>
                </div>

                <div className="text-xs text-slate-500 flex items-center justify-between">
                  <span className="truncate max-w-[180px]">Link: {banner.link_url}</span>
                  <a href={banner.link_url} target="_blank" rel="noreferrer" className="text-emerald-700 hover:text-emerald-800">
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  {canEdit && (
                    <>
                      <button
                        onClick={() => handleToggleBanner(banner)}
                        className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-colors flex items-center gap-1"
                      >
                        {banner.is_active ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        <span>{banner.is_active ? 'Pause' : 'Activate'}</span>
                      </button>
                      <button
                        onClick={() => {
                          setEditingBanner(banner);
                          setBannerModalOpen(true);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold transition-colors flex items-center gap-1"
                      >
                        <Edit3 className="w-3.5 h-3.5" /> Edit
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: ANNOUNCEMENTS */}
      {activeTab === 'announcements' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-slate-900">
              Active Broadcasts &amp; Alerts ({announcements.length})
            </h3>
            <span className="text-xs text-slate-500">Live system-wide banners and popups</span>
          </div>

          <div className="divide-y divide-slate-100">
            {announcements.map((ann) => (
              <div key={ann.id} className="p-5 flex items-start justify-between gap-4 hover:bg-slate-50/70 transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-md ${
                      ann.severity === 'urgent'
                        ? 'bg-rose-100 text-rose-800'
                        : ann.severity === 'warning'
                        ? 'bg-amber-100 text-amber-800'
                        : ann.severity === 'success'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {ann.severity}
                    </span>
                    <span className="text-xs font-black text-slate-900">{ann.title}</span>
                    <span className="text-[10px] font-mono text-slate-400">Target: {ann.target_audience}</span>
                  </div>
                  <p className="text-xs text-slate-600 max-w-2xl">{ann.message}</p>
                  <span className="text-[10px] text-slate-400">Created: {new Date(ann.created_at).toLocaleDateString()}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    ann.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {ann.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: STATIC CMS PAGES */}
      {activeTab === 'pages' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Page List */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 space-y-2">
            <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-500 mb-3">
              Standard Marketplace Legal &amp; Policy Pages
            </h3>
            {cmsPages.map((page) => (
              <button
                key={page.id}
                onClick={() => handleSelectPage(page)}
                className={`w-full text-left p-3 rounded-xl transition-all flex items-center justify-between ${
                  selectedPage?.id === page.id
                    ? 'bg-emerald-50 border border-emerald-300 text-emerald-950 font-bold'
                    : 'bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700'
                }`}
              >
                <div>
                  <div className="text-xs font-bold">{page.title}</div>
                  <div className="text-[10px] text-slate-400 font-mono">/{page.slug}</div>
                </div>
                <span className="text-[10px] font-mono text-slate-400">
                  {new Date(page.updated_at).toLocaleDateString()}
                </span>
              </button>
            ))}
          </div>

          {/* Page Editor */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
            {selectedPage ? (
              <>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      Publishing to /{selectedPage.slug}
                    </span>
                    <h3 className="font-extrabold text-base text-slate-900 mt-1">
                      Editing CMS Document
                    </h3>
                  </div>
                  {canEdit && (
                    <button
                      onClick={handleSavePage}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
                    >
                      <Save className="w-4 h-4" /> Save &amp; Publish Changes
                    </button>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-600 block">
                    Page Title
                  </label>
                  <input
                    type="text"
                    value={pageTitle}
                    onChange={(e) => setPageTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-600 block">
                    Page Content (Markdown / HTML)
                  </label>
                  <textarea
                    rows={14}
                    value={pageContent}
                    onChange={(e) => setPageContent(e.target.value)}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/20 leading-relaxed"
                  />
                </div>
              </>
            ) : (
              <div className="py-24 text-center text-slate-400">
                <FileText className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                Select a policy page from the left to view or edit authoritative text.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: NOTIFICATION TEMPLATES */}
      {activeTab === 'templates' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 space-y-2">
            <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-500 mb-3">
              Automated Transactional Emails &amp; SMS
            </h3>
            {templates.map((tpl) => (
              <button
                key={tpl.id}
                onClick={() => handleSelectTemplate(tpl)}
                className={`w-full text-left p-3 rounded-xl transition-all flex items-center justify-between ${
                  selectedTemplate?.id === tpl.id
                    ? 'bg-indigo-50 border border-indigo-300 text-indigo-950 font-bold'
                    : 'bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700'
                }`}
              >
                <div>
                  <div className="text-xs font-bold">{tpl.name}</div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold">{tpl.channel} • {tpl.trigger}</div>
                </div>
              </button>
            ))}
          </div>

          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
            {selectedTemplate ? (
              <>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                      Channel: {selectedTemplate.channel}
                    </span>
                    <h3 className="font-extrabold text-base text-slate-900 mt-1">
                      {selectedTemplate.name}
                    </h3>
                  </div>
                  {canEdit && (
                    <button
                      onClick={handleSaveTemplate}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
                    >
                      <Save className="w-4 h-4" /> Save Template
                    </button>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-600 block">
                    Email Subject Line
                  </label>
                  <input
                    type="text"
                    value={templateSubject}
                    onChange={(e) => setTemplateSubject(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-600 block">
                    Message Body (Available placeholders: {`{seller_name}, {listing_title}, {amount}, {plan_name}`})
                  </label>
                  <textarea
                    rows={8}
                    value={templateBody}
                    onChange={(e) => setTemplateBody(e.target.value)}
                    className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </>
            ) : (
              <div className="py-24 text-center text-slate-400">
                <BellRing className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                Select a transactional template from the left to configure message text.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Banner Modal */}
      {bannerModalOpen && (
        <div className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleSaveBanner} className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-4">
            <h3 className="font-extrabold text-base text-slate-900">
              {editingBanner?.id ? 'Edit Promotional Banner' : 'Create Promotional Banner'}
            </h3>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">Banner Title / Campaign</label>
              <input
                type="text"
                required
                value={editingBanner?.title || ''}
                onChange={(e) => setEditingBanner({ ...editingBanner, title: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500/20"
                placeholder="e.g. Lagos Auto Festival 2026"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">Placement Slot</label>
              <select
                value={editingBanner?.placement || 'home_hero'}
                onChange={(e) => setEditingBanner({ ...editingBanner, placement: e.target.value as any })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              >
                <option value="home_hero">Homepage Hero Carousel</option>
                <option value="marketplace_top">Marketplace Header Banner</option>
                <option value="category_sidebar">Category Sidebar Skyscraper</option>
                <option value="mobile_app_banner">Mobile App Interstitial</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">Image URL</label>
              <input
                type="url"
                required
                value={editingBanner?.image_url || ''}
                onChange={(e) => setEditingBanner({ ...editingBanner, image_url: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                placeholder="https://..."
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">Destination Link</label>
              <input
                type="text"
                required
                value={editingBanner?.link_url || ''}
                onChange={(e) => setEditingBanner({ ...editingBanner, link_url: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                placeholder="/marketplace?category=vehicles"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setBannerModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
              >
                Save Banner
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
