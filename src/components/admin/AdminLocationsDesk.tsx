import React, { useState } from 'react';
import { 
  MapPin, 
  Search, 
  Plus, 
  Check, 
  X, 
  Building, 
  CheckCircle2, 
  Compass, 
  Layers, 
  Edit3, 
  Trash2,
  Sparkles
} from 'lucide-react';
import { StorageService } from '../../services/storageService';
import { useAuth } from '../../context/AuthContext';

interface StateData {
  state: string;
  capital: string;
  zone: string;
  is_active: boolean;
  lgas: { name: string; is_active: boolean; is_commercial_hub?: boolean }[];
}

const DEFAULT_NIGERIAN_LOCATIONS: StateData[] = [
  {
    state: 'Lagos',
    capital: 'Ikeja',
    zone: 'South West',
    is_active: true,
    lgas: [
      { name: 'Ikeja (Computer Village, Allen)', is_active: true, is_commercial_hub: true },
      { name: 'Lekki Phase 1 & Chevron', is_active: true, is_commercial_hub: true },
      { name: 'Victoria Island (VI)', is_active: true, is_commercial_hub: true },
      { name: 'Ikoyi & Banana Island', is_active: true, is_commercial_hub: true },
      { name: 'Alaba International (Ojo)', is_active: true, is_commercial_hub: true },
      { name: 'Surulere & Ojuelegba', is_active: true },
      { name: 'Yaba (Tech Hub / UNILAG)', is_active: true, is_commercial_hub: true },
      { name: 'Ikorodu Town & Agric', is_active: true },
      { name: 'Oshodi-Isolo (Trade Fair)', is_active: true, is_commercial_hub: true },
      { name: 'Epe', is_active: true },
      { name: 'Badagry', is_active: true },
      { name: 'Agege & Pen Cinema', is_active: true },
      { name: 'Kosofe (Ketu, Mile 12)', is_active: true }
    ]
  },
  {
    state: 'Abuja (FCT)',
    capital: 'Garki',
    zone: 'North Central',
    is_active: true,
    lgas: [
      { name: 'Wuse 2 & Wuse Zone 1-6', is_active: true, is_commercial_hub: true },
      { name: 'Garki 1 & 2', is_active: true, is_commercial_hub: true },
      { name: 'Maitama Diplomatic Zone', is_active: true },
      { name: 'Asokoro', is_active: true },
      { name: 'Jabi & Utako Commercial', is_active: true, is_commercial_hub: true },
      { name: 'Gwarinpa Estate', is_active: true },
      { name: 'Kubwa', is_active: true },
      { name: 'Lugbe (Airport Road)', is_active: true },
      { name: 'Bwari Central', is_active: true },
      { name: 'Kuje', is_active: true }
    ]
  },
  {
    state: 'Rivers',
    capital: 'Port Harcourt',
    zone: 'South South',
    is_active: true,
    lgas: [
      { name: 'Port Harcourt City (Old GRA, D/Line)', is_active: true, is_commercial_hub: true },
      { name: 'Obio-Akpor (GRA Phase 2, Rumuokoro)', is_active: true, is_commercial_hub: true },
      { name: 'Eleme (Refinery & Petrochem)', is_active: true },
      { name: 'Oyigbo', is_active: true },
      { name: 'Ikwerre', is_active: true },
      { name: 'Bonny Island', is_active: true }
    ]
  },
  {
    state: 'Kano',
    capital: 'Kano',
    zone: 'North West',
    is_active: true,
    lgas: [
      { name: 'Kano Municipal (Kurmi Market)', is_active: true, is_commercial_hub: true },
      { name: 'Fagge (Kafin Agur Commercial)', is_active: true, is_commercial_hub: true },
      { name: 'Dala', is_active: true },
      { name: 'Nassarawa (Bompai Industrial)', is_active: true, is_commercial_hub: true },
      { name: 'Tarauni', is_active: true },
      { name: 'Gwale', is_active: true }
    ]
  },
  {
    state: 'Oyo',
    capital: 'Ibadan',
    zone: 'South West',
    is_active: true,
    lgas: [
      { name: 'Ibadan North (Bodija Market, UI)', is_active: true, is_commercial_hub: true },
      { name: 'Ibadan South-West (Ring Road)', is_active: true, is_commercial_hub: true },
      { name: 'Ibadan North-West (Dugbe CBD)', is_active: true, is_commercial_hub: true },
      { name: 'Oyo Town', is_active: true },
      { name: 'Ogbomoso North', is_active: true }
    ]
  },
  {
    state: 'Anambra',
    capital: 'Awka',
    zone: 'South East',
    is_active: true,
    lgas: [
      { name: 'Onitsha North (Main Market)', is_active: true, is_commercial_hub: true },
      { name: 'Onitsha South (Ochanja)', is_active: true, is_commercial_hub: true },
      { name: 'Nnewi North (Auto Parts Hub)', is_active: true, is_commercial_hub: true },
      { name: 'Awka South Central', is_active: true },
      { name: 'Idemili North (Ogidi)', is_active: true }
    ]
  },
  {
    state: 'Enugu',
    capital: 'Enugu',
    zone: 'South East',
    is_active: true,
    lgas: [
      { name: 'Enugu North (Ogbete Main Market)', is_active: true, is_commercial_hub: true },
      { name: 'Enugu South (Independence Layout)', is_active: true },
      { name: 'Enugu East (Trans-Ekulu)', is_active: true },
      { name: 'Nsukka Town', is_active: true }
    ]
  },
  {
    state: 'Ogun',
    capital: 'Abeokuta',
    zone: 'South West',
    is_active: true,
    lgas: [
      { name: 'Ado-Odo/Ota (Covenant, Sango Industrial)', is_active: true, is_commercial_hub: true },
      { name: 'Abeokuta South', is_active: true },
      { name: 'Sagamu (Interchange)', is_active: true, is_commercial_hub: true },
      { name: 'Ijebu Ode', is_active: true },
      { name: 'Mowe / Ibafo Corridor', is_active: true }
    ]
  },
  {
    state: 'Kaduna',
    capital: 'Kaduna',
    zone: 'North West',
    is_active: true,
    lgas: [
      { name: 'Kaduna North (Central Market)', is_active: true, is_commercial_hub: true },
      { name: 'Kaduna South (Kakuri Industrial)', is_active: true },
      { name: 'Chikun', is_active: true },
      { name: 'Zaria City', is_active: true }
    ]
  },
  {
    state: 'Edo',
    capital: 'Benin City',
    zone: 'South South',
    is_active: true,
    lgas: [
      { name: 'Oredo (King Square, Ring Road)', is_active: true, is_commercial_hub: true },
      { name: 'Ikpoba-Okha', is_active: true },
      { name: 'Egor (Uselu Market)', is_active: true },
      { name: 'Uromi', is_active: true }
    ]
  },
  {
    state: 'Delta',
    capital: 'Asaba',
    zone: 'South South',
    is_active: true,
    lgas: [
      { name: 'Warri South (Main Market, Enerhen)', is_active: true, is_commercial_hub: true },
      { name: 'Oshimili South (Asaba CBD)', is_active: true },
      { name: 'Uvwie (Effurun, PTI)', is_active: true, is_commercial_hub: true },
      { name: 'Sapele', is_active: true },
      { name: 'Ughelli North', is_active: true }
    ]
  },
  {
    state: 'Akwa Ibom',
    capital: 'Uyo',
    zone: 'South South',
    is_active: true,
    lgas: [
      { name: 'Uyo City (Plaza, Ewet Housing)', is_active: true, is_commercial_hub: true },
      { name: 'Ikot Ekpene (Raffia City)', is_active: true },
      { name: 'Eket Oil & Gas Hub', is_active: true, is_commercial_hub: true },
      { name: 'Oron', is_active: true }
    ]
  },
  {
    state: 'Plateau',
    capital: 'Jos',
    zone: 'North Central',
    is_active: true,
    lgas: [
      { name: 'Jos North (Terminus CBD)', is_active: true, is_commercial_hub: true },
      { name: 'Jos South (Bukuru)', is_active: true },
      { name: 'Bassa', is_active: true }
    ]
  },
  {
    state: 'Kwara',
    capital: 'Ilorin',
    zone: 'North Central',
    is_active: true,
    lgas: [
      { name: 'Ilorin West (Taiwo Road Commercial)', is_active: true, is_commercial_hub: true },
      { name: 'Ilorin South (GRA)', is_active: true },
      { name: 'Ilorin East', is_active: true },
      { name: 'Offa', is_active: true }
    ]
  },
  {
    state: 'Abia',
    capital: 'Umuahia',
    zone: 'South East',
    is_active: true,
    lgas: [
      { name: 'Aba South (Ariaria International Market)', is_active: true, is_commercial_hub: true },
      { name: 'Aba North (Eziukwu Market)', is_active: true, is_commercial_hub: true },
      { name: 'Umuahia North', is_active: true }
    ]
  },
  {
    state: 'Osun',
    capital: 'Osogbo',
    zone: 'South West',
    is_active: true,
    lgas: [
      { name: 'Osogbo Central', is_active: true },
      { name: 'Ife Central (OAU, Mayfair)', is_active: true, is_commercial_hub: true },
      { name: 'Ilesa East', is_active: true },
      { name: 'Ede North', is_active: true }
    ]
  },
  {
    state: 'Ondo',
    capital: 'Akure',
    zone: 'South West',
    is_active: true,
    lgas: [
      { name: 'Akure South (Oba Adesida CBD)', is_active: true, is_commercial_hub: true },
      { name: 'Ondo West (Ondo Town)', is_active: true },
      { name: 'Owo', is_active: true }
    ]
  },
  {
    state: 'Benue',
    capital: 'Makurdi',
    zone: 'North Central',
    is_active: true,
    lgas: [
      { name: 'Makurdi Central (Wurukum)', is_active: true, is_commercial_hub: true },
      { name: 'Gboko', is_active: true },
      { name: 'Otukpo', is_active: true }
    ]
  },
  {
    state: 'Nasarawa',
    capital: 'Lafia',
    zone: 'North Central',
    is_active: true,
    lgas: [
      { name: 'Karu (Mararaba / Nyanya Corridor)', is_active: true, is_commercial_hub: true },
      { name: 'Lafia Central', is_active: true },
      { name: 'Keffi', is_active: true }
    ]
  },
  {
    state: 'Cross River',
    capital: 'Calabar',
    zone: 'South South',
    is_active: true,
    lgas: [
      { name: 'Calabar Municipal (Watt Market)', is_active: true, is_commercial_hub: true },
      { name: 'Calabar South', is_active: true },
      { name: 'Ikom (Cocoa Trading Hub)', is_active: true, is_commercial_hub: true }
    ]
  }
];

export const AdminLocationsDesk: React.FC = () => {
  const { canPerform } = useAuth();
  const [locations, setLocations] = useState<StateData[]>(() => {
    const saved = localStorage.getItem('amffl_locations_directory');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return DEFAULT_NIGERIAN_LOCATIONS;
  });

  const [selectedState, setSelectedState] = useState<StateData>(() => locations[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [newHubName, setNewHubName] = useState('');

  const saveLocationsToStorage = (updated: StateData[]) => {
    setLocations(updated);
    localStorage.setItem('amffl_locations_directory', JSON.stringify(updated));
    const cur = updated.find(s => s.state === selectedState.state);
    if (cur) setSelectedState(cur);
  };

  const handleToggleState = (stateName: string) => {
    const updated = locations.map(s => 
      s.state === stateName ? { ...s, is_active: !s.is_active } : s
    );
    saveLocationsToStorage(updated);
    StorageService.logAuditEvent({
      action: 'location_toggle',
      actor_id: 'admin_tunde',
      actor_name: 'Tunde Adeleke (Super Admin)',
      target_type: 'location',
      target_id: stateName,
      details: { state: stateName }
    });
  };

  const handleToggleLga = (lgaName: string) => {
    const updated = locations.map(s => {
      if (s.state === selectedState.state) {
        return {
          ...s,
          lgas: s.lgas.map(l => l.name === lgaName ? { ...l, is_active: !l.is_active } : l)
        };
      }
      return s;
    });
    saveLocationsToStorage(updated);
  };

  const handleAddHub = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHubName.trim()) return;
    const updated = locations.map(s => {
      if (s.state === selectedState.state) {
        return {
          ...s,
          lgas: [...s.lgas, { name: newHubName.trim(), is_active: true, is_commercial_hub: true }]
        };
      }
      return s;
    });
    saveLocationsToStorage(updated);
    setNewHubName('');
  };

  const filteredStates = locations.filter(s => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchState = s.state.toLowerCase().includes(q) || s.capital.toLowerCase().includes(q) || s.zone.toLowerCase().includes(q);
      const matchLga = s.lgas.some(l => l.name.toLowerCase().includes(q));
      if (!matchState && !matchLga) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-black text-slate-900 font-['Plus_Jakarta_Sans'] flex items-center gap-2">
            <MapPin className="w-6 h-6 text-emerald-600" />
            Nigeria Geolocation, States &amp; Commercial Hubs Desk
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Authoritative directory for 36 States + FCT, local government areas, and designated commercial trading zones (Computer Village, Alaba, Wuse 2, Ariaria).
          </p>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[580px]">
        {/* Left: States List */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col overflow-hidden">
          <div className="p-3 border-b border-slate-200 bg-slate-50/70">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search state, capital, or market hub..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 max-h-[560px]">
            {filteredStates.map((s) => {
              const isSelected = selectedState.state === s.state;
              return (
                <div
                  key={s.state}
                  onClick={() => setSelectedState(s)}
                  className={`p-3.5 flex items-center justify-between cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-emerald-50/70 border-l-4 border-emerald-600'
                      : 'hover:bg-slate-50 border-l-4 border-transparent'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-slate-900">{s.state}</span>
                      <span className="text-[10px] text-slate-400 font-medium">({s.capital})</span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{s.zone}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      {s.lgas.length} Hubs
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleState(s.state);
                      }}
                      className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                        s.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {s.is_active ? 'Active' : 'Disabled'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected State LGAs & Hubs */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md">
                  {selectedState.zone} Region
                </span>
                <h3 className="font-extrabold text-base text-slate-900 mt-1">
                  {selectedState.state} State ({selectedState.lgas.length} LGAs &amp; Commercial Hubs)
                </h3>
              </div>

              <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                selectedState.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
              }`}>
                {selectedState.is_active ? 'Marketplace Enabled' : 'Marketplace Disabled'}
              </span>
            </div>

            {/* LGAs list */}
            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
              {selectedState.lgas.map((lga, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between hover:bg-slate-100/70 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <div>
                      <span className="text-xs font-bold text-slate-900">{lga.name}</span>
                      {lga.is_commercial_hub && (
                        <span className="text-[9px] font-black uppercase tracking-wider text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded ml-2">
                          Commercial Hub
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleLga(lga.name)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                      lga.is_active
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                        : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                    }`}
                  >
                    {lga.is_active ? 'Active' : 'Disabled'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Add custom LGA / Commercial Hub */}
          <form onSubmit={handleAddHub} className="pt-4 border-t border-slate-100 space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-slate-600 block">
              Add Commercial Trading Zone to {selectedState.state}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. Alaba International Extension or Trade Fair Complex..."
                value={newHubName}
                onChange={(e) => setNewHubName(e.target.value)}
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500/20"
              />
              <button
                type="submit"
                disabled={!newHubName.trim()}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-4 h-4" /> Add Hub
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
