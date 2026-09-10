// ArtisanDashboardPage.jsx — Artisan manages requests + profile
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, X, Flag, MessageCircle, Settings, ToggleLeft, ToggleRight, Loader2, ClipboardList, Save } from 'lucide-react';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';

const STATUS_CFG = {
  pending:  { badge: 'badge-pending',  label: 'Pending' },
  accepted: { badge: 'badge-accepted', label: 'Accepted' },
  refused:  { badge: 'badge-refused',  label: 'Refused' },
  done:     { badge: 'badge-done',     label: 'Done' },
};

const SPECIALTIES = ['Plomberie','Électricité','Serrurerie','Climatisation','Peinture','Menuiserie','Chauffage','Maçonnerie'];
const TABS = [{ id: 'requests', label: 'Requests', icon: ClipboardList }, { id: 'profile', label: 'My Profile', icon: Settings }];

export default function ArtisanDashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('requests');
  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({ specialty:'', city:'', phone:'', description:'', hourlyRate:'', available: true });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.getMyDemandes().then(setDemandes).catch(console.error).finally(() => setLoading(false));
    api.getArtisan(user.id).then(p => { if (p) setProfile(prev => ({ ...prev, ...p })); }).catch(() => {});
  }, [user.id]);

  async function updateStatus(id, status) {
    const updated = await api.updateDemande(id, { status });
    setDemandes(prev => prev.map(d => d.id === id ? { ...d, ...updated } : d));
  }

  async function saveProfile(e) {
    e.preventDefault();
    setSaving(true);
    try { await api.updateProfile(profile); } catch (err) { alert(err.message); } finally { setSaving(false); }
  }

  const pending = demandes.filter(d => d.status === 'pending').length;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 mt-1">Welcome, <span className="font-medium text-slate-700">{user?.name}</span></p>
        </div>
        {pending > 0 && (
          <span className="badge badge-pending text-sm px-3 py-1.5">
            {pending} pending request{pending > 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit mb-8">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id} onClick={() => setTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Icon size={15} /> {label}
          </button>
        ))}
      </div>

      {/* ── REQUESTS TAB ── */}
      {tab === 'requests' && (
        loading ? (
          <div className="flex items-center justify-center py-20 text-slate-400">
            <Loader2 size={24} className="animate-spin mr-2" /> Loading…
          </div>
        ) : demandes.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ClipboardList size={28} className="text-slate-400" />
            </div>
            <p className="font-semibold text-slate-700">No requests yet</p>
            <p className="text-slate-500 text-sm mt-1">Share your profile to start receiving requests</p>
          </div>
        ) : (
          <div className="space-y-4">
            {demandes.map(d => {
              const cfg = STATUS_CFG[d.status] || STATUS_CFG.pending;
              const roomId = [user.id, d.clientId].sort().join('_');
              return (
                <div key={d.id} className="card p-5">
                  <div className="flex items-start justify-between gap-3 mb-3 flex-wrap">
                    <div>
                      <p className="font-semibold text-slate-900">{d.clientName}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{new Date(d.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span className={`badge ${cfg.badge}`}>{cfg.label}</span>
                  </div>
                  <p className="text-sm text-slate-600 mb-1.5">{d.description}</p>
                  {d.address && <p className="text-xs text-slate-500 mb-4">📍 {d.address}</p>}

                  <div className="flex gap-2 flex-wrap pt-3 border-t border-slate-100">
                    {d.status === 'pending' && (
                      <>
                        <button onClick={() => updateStatus(d.id, 'accepted')} className="btn btn-success btn-sm">
                          <Check size={13} /> Accept
                        </button>
                        <button onClick={() => updateStatus(d.id, 'refused')} className="btn btn-danger btn-sm">
                          <X size={13} /> Refuse
                        </button>
                      </>
                    )}
                    {d.status === 'accepted' && (
                      <button onClick={() => updateStatus(d.id, 'done')} className="btn btn-sm" style={{background:'#6366f1',color:'#fff'}}>
                        <Flag size={13} /> Mark as Done
                      </button>
                    )}
                    <button onClick={() => navigate(`/chat/${roomId}`)} className="btn btn-secondary btn-sm ml-auto">
                      <MessageCircle size={13} /> Chat
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}

      {/* ── PROFILE TAB ── */}
      {tab === 'profile' && (
        <form onSubmit={saveProfile} className="card p-6 space-y-5">
          {/* Availability toggle */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <p className="font-semibold text-slate-800">Availability</p>
              <p className="text-sm text-slate-500">{profile.available ? 'You are visible to clients' : 'You appear as busy'}</p>
            </div>
            <button type="button" onClick={() => setProfile(p => ({ ...p, available: !p.available }))}>
              {profile.available
                ? <ToggleRight size={36} className="text-indigo-600" />
                : <ToggleLeft  size={36} className="text-slate-400" />
              }
            </button>
          </div>

          {/* Fields */}
          {[
            { field: 'specialty', label: 'Specialty', type: 'select' },
            { field: 'city',        label: 'City',      placeholder: 'Paris' },
            { field: 'phone',       label: 'Phone',     placeholder: '06 12 34 56 78' },
            { field: 'hourlyRate',  label: 'Hourly Rate (€)', placeholder: '65' },
            { field: 'description', label: 'About you', type: 'textarea', placeholder: 'Describe your services…' },
          ].map(({ field, label, type, placeholder }) => (
            <div key={field}>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
              {type === 'select' ? (
                <select className="input" value={profile[field] || ''} onChange={e => setProfile(p => ({ ...p, [field]: e.target.value }))}>
                  <option value="">Choose…</option>
                  {SPECIALTIES.map(s => <option key={s}>{s}</option>)}
                </select>
              ) : type === 'textarea' ? (
                <textarea className="input h-24 resize-none" placeholder={placeholder}
                  value={profile[field] || ''} onChange={e => setProfile(p => ({ ...p, [field]: e.target.value }))} />
              ) : (
                <input className="input" placeholder={placeholder}
                  value={profile[field] || ''} onChange={e => setProfile(p => ({ ...p, [field]: e.target.value }))} />
              )}
            </div>
          ))}

          <button type="submit" disabled={saving} className="btn btn-primary">
            {saving ? <><Loader2 size={14} className="animate-spin" /> Saving…</> : <><Save size={14} /> Save Profile</>}
          </button>
        </form>
      )}
    </div>
  );
}
