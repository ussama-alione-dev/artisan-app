// pages/ClientDashboardPage.jsx — Client sees their job requests
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

export default function ClientDashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getMyDemandes().then(setDemandes).catch(console.error).finally(() => setLoading(false));
  }, []);

  function buildRoomId(uid1, uid2) {
    return [uid1, uid2].sort().join('_');
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-2 text-gray-800">My Requests</h1>
      <p className="text-gray-500 mb-8">Welcome, {user?.name}</p>

      {loading ? (
        <p className="text-gray-400 text-center">Loading…</p>
      ) : demandes.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">📋</p>
          <p>No requests yet. <a href="/artisans" className="text-blue-600 hover:underline">Find an artisan</a></p>
        </div>
      ) : (
        <div className="space-y-4">
          {demandes.map(d => {
            const { label, cls } = STATUS_STYLES[d.status] || STATUS_STYLES.pending;
            return (
              <div key={d.id} className="bg-white rounded-xl shadow p-5">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold text-gray-800">{d.artisanName}</p>
                    <p className="text-sm text-gray-500">{new Date(d.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${cls}`}>{label}</span>
                </div>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{d.description}</p>
                <button
                  onClick={() => navigate(`/chat/${buildRoomId(user.id, d.artisanId)}`)}
                  className="text-sm text-blue-600 hover:underline">
                  💬 Chat with artisan
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
