// pages/ArtisanDetailPage.jsx — Artisan profile + send demande button
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';

export default function ArtisanDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [artisan, setArtisan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getArtisan(id).then(setArtisan).catch(console.error).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="text-center mt-20 text-gray-400">Loading…</p>;
  if (!artisan) return <p className="text-center mt-20 text-red-500">Artisan not found.</p>;

  function buildRoomId(uid1, uid2) {
    return [uid1, uid2].sort().join('_');
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <div className="bg-white rounded-xl shadow p-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{artisan.name}</h1>
            <p className="text-blue-600 font-medium">{artisan.specialty}</p>
            <p className="text-gray-500">📍 {artisan.city}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${artisan.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {artisan.available ? '✅ Available' : '🔴 Busy'}
          </span>
        </div>

        {/* Details */}
        <div className="space-y-3 mb-8">
          {artisan.description && (
            <div>
              <h2 className="font-semibold text-gray-700 mb-1">About</h2>
              <p className="text-gray-600 text-sm">{artisan.description}</p>
            </div>
          )}
          {artisan.phone && (
            <p className="text-sm text-gray-600">📞 {artisan.phone}</p>
          )}
          {artisan.hourlyRate && (
            <p className="text-sm text-gray-700 font-medium">💰 {artisan.hourlyRate}€ / hour</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          {user?.role === 'client' ? (
            <>
              <Link to={`/demande/${artisan.userId}`}
                className="flex-1 text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-medium">
                Send a Request
              </Link>
              <button
                onClick={() => navigate(`/chat/${buildRoomId(user.id, artisan.userId)}`)}
                className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 font-medium">
                💬 Chat
              </button>
            </>
          ) : !user ? (
            <Link to="/login" className="flex-1 text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
              Login to contact
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}
