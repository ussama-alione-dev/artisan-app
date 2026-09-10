// ArtisanCard.jsx — Modern card with specialty color, avatar, Lucide icons
import { Link } from 'react-router-dom';
import { MapPin, Clock, Euro, ArrowRight } from 'lucide-react';

const SPECIALTY_META = {
  'Plomberie':     { icon: '🔧', bg: 'bg-blue-50',   text: 'text-blue-700',   border: 'border-blue-100' },
  'Électricité':   { icon: '⚡', bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-100' },
  'Serrurerie':    { icon: '🔑', bg: 'bg-slate-50',  text: 'text-slate-700',  border: 'border-slate-200' },
  'Climatisation': { icon: '❄️', bg: 'bg-cyan-50',   text: 'text-cyan-700',   border: 'border-cyan-100' },
  'Peinture':      { icon: '🎨', bg: 'bg-pink-50',   text: 'text-pink-700',   border: 'border-pink-100' },
  'Menuiserie':    { icon: '🪵', bg: 'bg-amber-50',  text: 'text-amber-700',  border: 'border-amber-100' },
  'Chauffage':     { icon: '🔥', bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-100' },
  'Maçonnerie':    { icon: '🧱', bg: 'bg-red-50',    text: 'text-red-700',    border: 'border-red-100' },
};

export default function ArtisanCard({ artisan }) {
  const { userId, name, specialty, city, description, hourlyRate, available } = artisan;
  const meta = SPECIALTY_META[specialty] || { icon: '🛠️', bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200' };

  return (
    <div className="card p-5 flex flex-col gap-4">
      {/* Top row */}
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className={`w-11 h-11 rounded-2xl ${meta.bg} ${meta.text} font-bold text-lg flex items-center justify-center flex-shrink-0 border ${meta.border}`}>
          {meta.icon}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <p className="font-semibold text-slate-900 leading-tight">{name}</p>
            <span className={`badge ${available ? 'badge-available' : 'badge-busy'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${available ? 'bg-emerald-500' : 'bg-slate-400'}`} />
              {available ? 'Available' : 'Busy'}
            </span>
          </div>
          <p className="text-sm font-medium text-indigo-600 mt-0.5">{specialty}</p>
          <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
            <MapPin size={11} />
            {city}
          </div>
        </div>
      </div>

      {/* Description */}
      {description && (
        <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">{description}</p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        {hourlyRate ? (
          <div className="flex items-center gap-1 text-slate-700">
            <Euro size={14} className="text-slate-400" />
            <span className="font-semibold">{hourlyRate}</span>
            <span className="text-xs text-slate-400">/h</span>
          </div>
        ) : <span />}

        <Link to={`/artisans/${userId}`} className="btn btn-primary btn-sm flex items-center gap-1.5">
          View Profile <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  );
}
