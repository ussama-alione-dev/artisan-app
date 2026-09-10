// pages/ArtisanDashboardPage.jsx — Artisan manages incoming requests + profile
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';

const STATUS_STYLES = {
  pending:  { label: '🟡 Pending',  cls: 'bg-yellow-100 text-yellow-700' },
  accepted: { label: '🟢 Accepted', cls: 'bg-green-100 text-green-700' },
  refused:  { label: '🔴 Refused',  cls: 'bg-red-100 text-red-700' },
  done:     { label: '🔵 Done',     cls: 'bg-blue-100 text-blue-700' },
};

export default function ArtisanDashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({ specialty: '', city: '', phone: '', description: '', hourlyRate: '', available: true });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.getMyDemandes().then(setDemandes).catch(console.error).finally(() => setLoading(false));
    api.getArtisan(user.id).then(p => {
      if (p) setProfile(prev => ({ ...prev, ...p }));
    }).catch(() => {});
  }, [user.id]);

  async function updateStatus(id, status) {
    const updated = await api.updateDemande(id, { status });
    setDemandes(prev => prev.map(d => d.id === id ? { ...d, ...updated } : d));
  }

  async function saveProfile(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await api.updateProfile(profile);
      alert('Profile saved!');
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  }

  function buildRoomId(uid1, uid2) {
    return [uid1, uid2].sort().join('_');
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-10">
      <h1 className="text-2xl font-bold text-gray-800">Artisan Dashboard</h1>

      {/* Requests */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Incoming Requests</h2>
        {loading ? (
          <p className="text-gray-400">Loading…</p>
        ) : demandes.length === 0 ? (
          <p className="text-gray-400">No requests yet.</p>
        ) : (
          <div className="space-y-4">
            {demandes.map(d => {
              const { label, cls } = STATUS_STYLES[d.status] || STATUS_STYLES.pending;
              return (
                <div key={d.id} className="bg-white rounded-xl shadow p-5">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-gray-800">{d.clientName}</p>
                      <p className="text-sm text-gray-500">{new Date(d.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${cls}`}>{label}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{d.description}</p>
                  {d.address && <p className="text-sm text-gray-500 mb-3">📍 {d.address}</p>}

                  <div className="flex gap-2 flex-wrap">
                    {d.status === 'pending' && (
                      <>
                        <button onClick={() => updateStatus(d.id, 'accepted')}
                          className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700">
                          Accept
                        </button>
                        <button onClick={() => updateStatus(d.id, 'refused')}
                          className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600">
                          Refuse
                        </button>
                      </>
                    )}
                    {d.status === 'accepted' && (
                      <button onClick={() => updateStatus(d.id, 'done')}
                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                        Mark as Done
                      </button>
                    )}
                    <button onClick={() => navigate(`/chat/${buildRoomId(user.id, d.clientId)}`)}
                      className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
                      💬 Chat
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Profile */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-gray-700">My Profile</h2>
        <form onSubmit={saveProfile} className="bg-white rounded-xl shadow p-6 space-y-4">
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-700">Available</label>
            <input type="checkbox" checked={!!profile.available}
              onChange={e => setProfile({ ...profile, available: e.target.checked })} />
          </div>
          {['specialty', 'city', 'phone', 'description', 'hourlyRate'].map(field => (
            <div key={field}>
              <label className="text-sm font-medium text-gray-700 block mb-1 capitalize">{field}</label>
              <input className="w-full border rounded px-3 py-2 text-sm"
                value={profile[field] || ''}
                onChange={e => setProfile({ ...profile, [field]: e.target.value })} />
            </div>
          ))}
          <button type="submit" disabled={saving}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium disabled:opacity-60">
            {saving ? 'Saving…' : 'Save Profile'}
          </button>
        </form>
      </section>
    </div>
  );
}
