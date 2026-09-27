import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Car, Building2, ShoppingBag, Sparkles, Boxes, ChevronRight } from 'lucide-react';
import { MembershipFamily } from '../../types';

interface MembershipCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  families: MembershipFamily[];
}

const ICON_MAP: Record<string, React.ReactNode> = {
  'Car': <Car className="w-5 h-5 text-emerald-600" />,
  'Building2': <Building2 className="w-5 h-5 text-amber-600" />,
  'ShoppingBag': <ShoppingBag className="w-5 h-5 text-blue-600" />,
  'Sparkles': <Sparkles className="w-5 h-5 text-pink-600" />,
  'Boxes': <Boxes className="w-5 h-5 text-purple-600" />,
};

export const MembershipCategoryModal: React.FC<MembershipCategoryModalProps> = ({
  isOpen,
  onClose,
  families,
}) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSelect = (slug: string) => {
    onClose();
    navigate(`/membership/${slug}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
        {/* Modal Header */}
        <div className="p-6 pb-4 border-b border-slate-100 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 font-['Plus_Jakarta_Sans']">
              Choose a Membership Category
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Select the membership that best matches the types of listings you want to promote.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Categories List matching Screenshot 1 */}
        <div className="p-6 space-y-2.5">
          {families.map((fam) => {
            const icon = ICON_MAP[fam.icon_name] || <Car className="w-5 h-5 text-emerald-600" />;
            return (
              <button
                key={fam.id}
                type="button"
                onClick={() => handleSelect(fam.slug)}
                className="w-full text-left p-3.5 rounded-2xl border border-slate-200/90 hover:border-emerald-500 hover:bg-emerald-50/40 transition-all flex items-center justify-between group active:scale-[0.99]"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-xs"
                    style={{ backgroundColor: fam.icon_bg }}
                  >
                    {icon}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-slate-900 group-hover:text-emerald-800">
                        {fam.name}
                      </span>
                      {fam.slug === 'all-in-one' && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                          All-in-one
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 truncate max-w-sm mt-0.5">
                      {fam.description}
                    </p>
                  </div>
                </div>

                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all shrink-0 ml-2" />
              </button>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-500">
            Need custom enterprise quota?{' '}
            <a href="tel:0800-AMFFL-NG" className="text-emerald-700 font-bold hover:underline">
              Contact our sales desk
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
