import React, { useState } from 'react';
import { 
  Settings, 
  Sliders, 
  ShieldCheck, 
  ToggleLeft, 
  ToggleRight, 
  Save, 
  RotateCcw, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  Coins, 
  PhoneCall, 
  Image as ImageIcon 
} from 'lucide-react';
import { RankingWeightsConfig, MarketplaceSettings, FeatureFlag } from '../../types';
import { StorageService } from '../../services/storageService';
import { useAuth } from '../../context/AuthContext';

export const AdminSettingsDesk: React.FC = () => {
  const { canPerform } = useAuth();
  const [activeTab, setActiveTab] = useState<'ranking' | 'general' | 'flags'>('ranking');

  const [weights, setWeights] = useState<RankingWeightsConfig>(() => StorageService.getRankingWeights());
  const [settings, setSettings] = useState<MarketplaceSettings>(() => StorageService.getMarketplaceSettings());
  const [featureFlags, setFeatureFlags] = useState<FeatureFlag[]>(() => StorageService.getFeatureFlags());

  const canSave = canPerform('manage_settings');

  const totalWeight = 
    weights.subscription_plan_weight +
    weights.seller_rating_weight +
    weights.seller_response_time_weight +
    weights.verified_seller_boost +
    weights.image_count_and_quality +
    weights.listing_age_decay +
    weights.renewal_recency_boost;

  const handleNormalizeWeights = () => {
    if (totalWeight === 0) return;
    const factor = 100 / totalWeight;
    setWeights({
      subscription_plan_weight: Math.round(weights.subscription_plan_weight * factor),
      seller_rating_weight: Math.round(weights.seller_rating_weight * factor),
      seller_response_time_weight: Math.round(weights.seller_response_time_weight * factor),
      verified_seller_boost: Math.round(weights.verified_seller_boost * factor),
      image_count_and_quality: Math.round(weights.image_count_and_quality * factor),
      listing_age_decay: Math.round(weights.listing_age_decay * factor),
      renewal_recency_boost: 100 - (
        Math.round(weights.subscription_plan_weight * factor) +
        Math.round(weights.seller_rating_weight * factor) +
        Math.round(weights.seller_response_time_weight * factor) +
        Math.round(weights.verified_seller_boost * factor) +
        Math.round(weights.image_count_and_quality * factor) +
        Math.round(weights.listing_age_decay * factor)
      )
    });
  };

  const handleSaveWeights = () => {
    if (!canSave) return;
    StorageService.saveRankingWeights(weights);
    StorageService.logAuditEvent({
      action: 'settings_update',
      actor_id: 'admin_tunde',
      actor_name: 'Tunde Adeleke (Super Admin)',
      target_type: 'settings',
      target_id: 'ranking_weights',
      details: weights
    });
    alert('Search and feed ranking algorithm weights successfully updated!');
  };

  const handleSaveSettings = () => {
    if (!canSave) return;
    StorageService.saveMarketplaceSettings(settings);
    StorageService.logAuditEvent({
      action: 'settings_update',
      actor_id: 'admin_tunde',
      actor_name: 'Tunde Adeleke (Super Admin)',
      target_type: 'settings',
      target_id: 'marketplace_settings',
      details: settings
    });
    alert('General marketplace parameters saved successfully!');
  };

  const handleToggleFlag = (id: string) => {
    if (!canSave) return;
    StorageService.toggleFeatureFlag(id);
    setFeatureFlags(StorageService.getFeatureFlags());
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-black text-slate-900 font-['Plus_Jakarta_Sans'] flex items-center gap-2">
            <Settings className="w-6 h-6 text-slate-700" />
            Marketplace Engine &amp; Algorithmic Governance
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Authoritative configuration for search ranking weights, platform parameters, contact disclosure rules &amp; feature toggles.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTab('ranking')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'ranking'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Ranking Algorithm Weights</span>
        </button>

        <button
          onClick={() => setActiveTab('general')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'general'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Marketplace Operational Rules</span>
        </button>

        <button
          onClick={() => setActiveTab('flags')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'flags'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <ToggleRight className="w-4 h-4" />
          <span>Feature Flags ({featureFlags.length})</span>
        </button>
      </div>

      {/* TAB 1: RANKING WEIGHTS */}
      {activeTab === 'ranking' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-extrabold text-base text-slate-900 font-['Plus_Jakarta_Sans']">
                Algorithmic Feed &amp; Search Scoring Factors
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Every classified ad is scored dynamically based on seller membership tier, reputation, response time, and freshness.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className={`px-3 py-1.5 rounded-xl border text-xs font-black flex items-center gap-1.5 ${
                totalWeight === 100
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                  : 'bg-rose-50 border-rose-300 text-rose-800'
              }`}>
                {totalWeight === 100 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                )}
                <span>Total Weight: {totalWeight}%</span>
              </div>

              {totalWeight !== 100 && (
                <button
                  type="button"
                  onClick={handleNormalizeWeights}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
                >
                  Auto-Normalize to 100%
                </button>
              )}

              {canSave && (
                <button
                  type="button"
                  onClick={handleSaveWeights}
                  disabled={totalWeight !== 100}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <Save className="w-4 h-4" /> Save Algorithm Weights
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Slider 1 */}
            <div className="p-4 bg-slate-50/70 border border-slate-200 rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold text-slate-800">Paid Membership Plan Tier</span>
                <span className="font-mono font-black text-emerald-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                  {weights.subscription_plan_weight}%
                </span>
              </div>
              <p className="text-[11px] text-slate-500">Boost given to Diamond, Gold, and Silver tier active subscribers.</p>
              <input
                type="range"
                min="0"
                max="60"
                value={weights.subscription_plan_weight}
                onChange={(e) => setWeights({ ...weights, subscription_plan_weight: parseInt(e.target.value) || 0 })}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>

            {/* Slider 2 */}
            <div className="p-4 bg-slate-50/70 border border-slate-200 rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold text-slate-800">Seller Rating &amp; Review Score</span>
                <span className="font-mono font-black text-emerald-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                  {weights.seller_rating_weight}%
                </span>
              </div>
              <p className="text-[11px] text-slate-500">Reward sellers with positive verified buyer reviews (4.5★ - 5.0★).</p>
              <input
                type="range"
                min="0"
                max="50"
                value={weights.seller_rating_weight}
                onChange={(e) => setWeights({ ...weights, seller_rating_weight: parseInt(e.target.value) || 0 })}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>

            {/* Slider 3 */}
            <div className="p-4 bg-slate-50/70 border border-slate-200 rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold text-slate-800">Verified Seller Badge (NIN / CAC)</span>
                <span className="font-mono font-black text-emerald-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                  {weights.verified_seller_boost}%
                </span>
              </div>
              <p className="text-[11px] text-slate-500">Trust uplift for merchants with confirmed national identity / CAC registration.</p>
              <input
                type="range"
                min="0"
                max="40"
                value={weights.verified_seller_boost}
                onChange={(e) => setWeights({ ...weights, verified_seller_boost: parseInt(e.target.value) || 0 })}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>

            {/* Slider 4 */}
            <div className="p-4 bg-slate-50/70 border border-slate-200 rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold text-slate-800">Chat Response Time &amp; Responsiveness</span>
                <span className="font-mono font-black text-emerald-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                  {weights.seller_response_time_weight}%
                </span>
              </div>
              <p className="text-[11px] text-slate-500">Prioritizes sellers who reply to buyer messages within 15 minutes.</p>
              <input
                type="range"
                min="0"
                max="30"
                value={weights.seller_response_time_weight}
                onChange={(e) => setWeights({ ...weights, seller_response_time_weight: parseInt(e.target.value) || 0 })}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>

            {/* Slider 5 */}
            <div className="p-4 bg-slate-50/70 border border-slate-200 rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold text-slate-800">Image Count &amp; High-Resolution Photos</span>
                <span className="font-mono font-black text-emerald-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                  {weights.image_count_and_quality}%
                </span>
              </div>
              <p className="text-[11px] text-slate-500">Rewards listings with 4+ real gallery photos over single-image ads.</p>
              <input
                type="range"
                min="0"
                max="30"
                value={weights.image_count_and_quality}
                onChange={(e) => setWeights({ ...weights, image_count_and_quality: parseInt(e.target.value) || 0 })}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>

            {/* Slider 6 */}
            <div className="p-4 bg-slate-50/70 border border-slate-200 rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold text-slate-800">Listing Freshness Decay</span>
                <span className="font-mono font-black text-emerald-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                  {weights.listing_age_decay}%
                </span>
              </div>
              <p className="text-[11px] text-slate-500">Gradually lowers ranking score as an ad gets older than 14 days without bump.</p>
              <input
                type="range"
                min="0"
                max="30"
                value={weights.listing_age_decay}
                onChange={(e) => setWeights({ ...weights, listing_age_decay: parseInt(e.target.value) || 0 })}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>

            {/* Slider 7 */}
            <div className="p-4 bg-slate-50/70 border border-slate-200 rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold text-slate-800">Renewal / Top-Ad Boost Recency</span>
                <span className="font-mono font-black text-emerald-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                  {weights.renewal_recency_boost}%
                </span>
              </div>
              <p className="text-[11px] text-slate-500">Instant jump to page 1 top for freshly purchased Top/Featured boosts.</p>
              <input
                type="range"
                min="0"
                max="30"
                value={weights.renewal_recency_boost}
                onChange={(e) => setWeights({ ...weights, renewal_recency_boost: parseInt(e.target.value) || 0 })}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: GENERAL MARKETPLACE OPERATIONAL RULES */}
      {activeTab === 'general' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-extrabold text-base text-slate-900 font-['Plus_Jakarta_Sans']">
                Public Marketplace Operational Rules
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Configure contact disclosure, image watermarking, listing expiry periods &amp; escrow commission fees.
              </p>
            </div>
            {canSave && (
              <button
                type="button"
                onClick={handleSaveSettings}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <Save className="w-4 h-4" /> Save Marketplace Rules
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Require Login to Reveal Phone</span>
                  <span className="text-[11px] text-slate-500">Prevents web scraping of Nigerian seller phone numbers</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.require_login_for_contact}
                  onChange={(e) => setSettings({ ...settings, require_login_for_contact: e.target.checked })}
                  className="w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Watermark Uploaded Photos</span>
                  <span className="text-[11px] text-slate-500">Automatically stamps "AMFFL Verified" watermark onto photos</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.watermark_images}
                  onChange={(e) => setSettings({ ...settings, watermark_images: e.target.checked })}
                  className="w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
              <label className="text-xs font-bold text-slate-900 block">Classified Ad Validity Period (Days)</label>
              <p className="text-[11px] text-slate-500">Number of days before an active ad auto-expires if not renewed</p>
              <input
                type="number"
                value={settings.auto_expire_days}
                onChange={(e) => setSettings({ ...settings, auto_expire_days: parseInt(e.target.value) || 30 })}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold"
              />
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
              <label className="text-xs font-bold text-slate-900 block">Escrow Platform Commission Fee (%)</label>
              <p className="text-[11px] text-slate-500">Fee charged on successful buyer and seller escrow settlements</p>
              <input
                type="number"
                step="0.1"
                value={settings.escrow_fee_percent}
                onChange={(e) => setSettings({ ...settings, escrow_fee_percent: parseFloat(e.target.value) || 2.5 })}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold"
              />
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
              <label className="text-xs font-bold text-slate-900 block">Maximum Photos Per Listing</label>
              <p className="text-[11px] text-slate-500">Gallery upload limit for standard classified ads</p>
              <input
                type="number"
                value={settings.max_photos_per_listing}
                onChange={(e) => setSettings({ ...settings, max_photos_per_listing: parseInt(e.target.value) || 10 })}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold"
              />
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
              <label className="text-xs font-bold text-slate-900 block">Minimum Classified Price (₦)</label>
              <p className="text-[11px] text-slate-500">Guards against fake ₦0 or ₦1 placeholder ads</p>
              <input
                type="number"
                value={settings.min_listing_price_ngn}
                onChange={(e) => setSettings({ ...settings, min_listing_price_ngn: parseInt(e.target.value) || 500 })}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: FEATURE FLAGS */}
      {activeTab === 'flags' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="pb-4 border-b border-slate-100">
            <h3 className="font-extrabold text-base text-slate-900 font-['Plus_Jakarta_Sans']">
              Marketplace Feature Flags &amp; Toggles
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Instantly enable or disable capabilities in real-time across the marketplace without code redeployment.
            </p>
          </div>

          <div className="divide-y divide-slate-100">
            {featureFlags.map((flag) => {
              const flagKey = flag.key || flag.id || '';
              const isEnabled = flag.is_enabled ?? flag.enabled ?? false;
              return (
                <div key={flagKey} className="py-4 flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-slate-900">{flag.name}</span>
                      <span className="text-[10px] font-mono text-slate-400">({flagKey})</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{flag.description}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleFlag(flagKey)}
                    disabled={!canSave}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      isEnabled ? 'bg-emerald-600' : 'bg-slate-200'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                        isEnabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
