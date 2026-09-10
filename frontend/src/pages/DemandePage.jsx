// pages/DemandePage.jsx — Client sends a job request to an artisan
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api';

export default function DemandePage() {
  const { artisanId } = useParams();
  const navigate = useNavigate();
  const [artisan, setArtisan] = useState(null);
  const [form, setForm] = useState({ description: '', address: '', urgency: 'normal', desiredDate: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    api.getArtisan(artisanId).then(setArtisan).catch(console.error);
  }, [artisanId]);

  function set(field) {
    return e => setForm({ ...form, [field]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      await api.createDemande({ artisanId, ...form });
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setError(err.message);
    }
  }

  if (success) return (
    <div className="max-w-md mx-auto mt-20 text-center">
      <div className="text-5xl mb-4">✅</div>
      <h2 className="text-xl font-bold text-gray-800 mb-2">Request Sent!</h2>
      <p className="text-gray-500">Redirecting to your dashboard…</p>
    </div>
  );

  return (
    <div className="max-w-lg mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-2 text-gray-800">Send a Job Request</h1>
      {artisan && (
        <p className="text-gray-500 mb-6">To <span className="font-medium text-blue-600">{artisan.name}</span> — {artisan.specialty}</p>
      )}

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">Description *</label>
          <textarea className="w-full border rounded px-3 py-2 h-28 resize-none" required
            placeholder="Describe the problem…"
            value={form.description} onChange={set('description')} />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">Address</label>
          <input className="w-full border rounded px-3 py-2" placeholder="Your address"
            value={form.address} onChange={set('address')} />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">Urgency</label>
          <select className="w-full border rounded px-3 py-2" value={form.urgency} onChange={set('urgency')}>
            <option value="low">Low — no rush</option>
            <option value="normal">Normal</option>
            <option value="high">High — urgent</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">Preferred Date</label>
          <input type="date" className="w-full border rounded px-3 py-2"
            value={form.desiredDate} onChange={set('desiredDate')} />
        </div>
        <button type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-medium">
          Send Request
        </button>
      </form>
    </div>
  );
}
