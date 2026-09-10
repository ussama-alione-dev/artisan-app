// ClientDashboardPage.jsx — Client's request tracking
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ClipboardList, MessageCircle, Clock, Search, Loader2 } from 'lucide-react';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';

const STATUS_CFG = {
  pending:  { badge: 'badge-pending',  icon: '🟡', label: 'Pending' },
  accepted: { badge: 'badge-accepted', icon: '🟢', label: 'Accepted' },
  refused:  { badge: 'badge-refused',  icon: '🔴', label: 'Refused' },
  done:     { badge: 'badge-done',     icon: '🔵', label: 'Done' },
};

export default function ClientDashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getMyDemandes().then(setDemandes).catch(console.error).finally(() => setLoading(false));
  }, []);

  const counts = Object.fromEntries(
    Object.keys(STATUS_CFG).map(s => [s, demandes.filter(d => d.status === s).length])
  );

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Requests</h1>
          <p className="text-slate-500 mt-1">Welcome back, <span className="font-medium text-slate-700">{user?.name}</span></p>
        </div>
        <Link to="/artisans" className="btn btn-primary btn-sm">
          <Search size={14} /> Find Artisan
        </Link>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-3 mb-8">
        {Object.entries(STATUS_CFG).map(([key, { label, badge }]) => (
          <div key={key} className="card p-4 text-center">
            <p className="text-2xl font-bold text-slate-900">{counts[key] || 0}</p>
            <span className={`badge ${badge} mt-1.5`}>{label}</span>
          </div>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-slate-400">
          <Loader2 size={24} className="animate-spin mr-2" /> Loading…
        </div>
      ) : demandes.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ClipboardList size={28} className="text-indigo-400" />
          </div>
          <p className="font-semibold text-slate-700">No requests yet</p>
          <p className="text-slate-500 text-sm mt-1 mb-5">Find an artisan and send your first request</p>
          <Link to="/artisans" className="btn btn-primary btn-sm">Browse Artisans</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {demandes.map(d => {
            const cfg = STATUS_CFG[d.status] || STATUS_CFG.pending;
            const roomId = [user.id, d.artisanId].sort().join('_');
            return (
              <div key={d.id} className="card p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-lg flex-shrink-0">
                  {cfg.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 flex-wrap mb-1">
                    <p className="font-semibold text-slate-800">{d.artisanName}</p>
                    <span className={`badge ${cfg.badge}`}>{cfg.label}</span>
                  </div>
                  <p className="text-sm text-slate-600 line-clamp-2 mb-2">{d.description}</p>
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1"><Clock size={11} />{new Date(d.createdAt).toLocaleDateString()}</span>
                    <button onClick={() => navigate(`/chat/${roomId}`)}
                      className="flex items-center gap-1 text-indigo-600 font-medium hover:text-indigo-700 transition-colors">
                      <MessageCircle size={12} /> Chat
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
