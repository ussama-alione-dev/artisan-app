// pages/ArtisansPage.jsx — Browse and filter artisans
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../api';
import ArtisanCard from '../components/ArtisanCard';

const SPECIALTIES = ['', 'Plomberie', 'Électricité', 'Serrurerie', 'Climatisation', 'Peinture', 'Menuiserie', 'Chauffage', 'Maçonnerie'];

export default function ArtisansPage() {
  const [searchParams] = useSearchParams();
  const [artisans, setArtisans] = useState([]);
  const [loading, setLoading] = useState(true);

  const [specialty, setSpecialty] = useState(searchParams.get('specialty') || '');
  const [city, setCity] = useState('');
  const [availableOnly, setAvailableOnly] = useState(false);

  async function fetchArtisans() {
    setLoading(true);
    try {
      const params = {};
      if (specialty) params.specialty = specialty;
      if (city) params.city = city;
      if (availableOnly) params.available = 'true';
      const data = await api.getArtisans(params);
      setArtisans(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchArtisans(); }, [specialty, city, availableOnly]);

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Browse Artisans</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-8 bg-white p-4 rounded-xl shadow">
        <select className="border rounded px-3 py-2 text-sm"
          value={specialty} onChange={e => setSpecialty(e.target.value)}>
          {SPECIALTIES.map(s => <option key={s} value={s}>{s || 'All specialties'}</option>)}
        </select>
        <input className="border rounded px-3 py-2 text-sm" placeholder="City…"
          value={city} onChange={e => setCity(e.target.value)} />
        <label className="flex items-center gap-2 text-sm text-gray-600">
          <input type="checkbox" checked={availableOnly} onChange={e => setAvailableOnly(e.target.checked)} />
          Available only
        </label>
      </div>

      {loading ? (
        <p className="text-center text-gray-400">Loading…</p>
      ) : artisans.length === 0 ? (
        <p className="text-center text-gray-400">No artisans found for these filters.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {artisans.map(a => <ArtisanCard key={a.userId} artisan={a} />)}
        </div>
      )}
    </div>
  );
}
