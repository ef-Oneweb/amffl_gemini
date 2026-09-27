import React from 'react';
import { PlanDuration } from '../../types';
import { Columns3 } from 'lucide-react';

interface DurationSelectorProps {
  duration: PlanDuration;
  onChangeDuration: (duration: PlanDuration) => void;
  onOpenCompare: () => void;
  compareCount: number;
}

export const DurationSelector: React.FC<DurationSelectorProps> = ({
  duration,
  onChangeDuration,
  onOpenCompare,
  compareCount,
}) => {
  const durations: { id: PlanDuration; label: string; badge?: string }[] = [
    { id: '1m', label: '1 Month' },
    { id: '3m', label: '3 Months', badge: 'Save 7%' },
    { id: '6m', label: '6 Months', badge: 'Save 10%' },
    { id: '12m', label: '12 Months', badge: 'Save 17%' },
  ];

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-2.5 rounded-2xl border border-slate-200 shadow-xs mb-8">
      {/* Duration Tabs matching Screenshot 2 */}
      <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto no-scrollbar">
        {durations.map((d) => {
          const isSelected = duration === d.id;
          return (
            <button
              key={d.id}
              type="button"
              onClick={() => onChangeDuration(d.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'bg-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span>{d.label}</span>
              {d.badge && (
                <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                  isSelected ? 'bg-emerald-900 text-emerald-200' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {d.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Compare Button */}
      <button
        type="button"
        onClick={onOpenCompare}
        className="w-full sm:w-auto px-4 py-2 rounded-full border border-slate-300 hover:border-emerald-600 text-slate-700 hover:text-emerald-700 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
      >
        <Columns3 className="w-4 h-4 text-emerald-600" />
        <span>Compare Plans {compareCount > 0 ? `(${compareCount})` : ''}</span>
      </button>
    </div>
  );
};
