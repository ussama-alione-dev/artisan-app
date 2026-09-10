// pages/RegisterPage.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';

const SPECIALTIES = ['Plomberie', 'Électricité', 'Serrurerie', 'Climatisation', 'Peinture', 'Menuiserie', 'Chauffage', 'Maçonnerie'];

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'client', specialty: '', city: '', phone: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  function set(field) {
    return e => setForm({ ...form, [field]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      const { token, user } = await api.register(form);
      login(token, user);
      // If artisan, save profile fields
      if (user.role === 'artisan') {
        await api.updateProfile({ specialty: form.specialty, city: form.city, phone: form.phone });
        navigate('/artisan/dashboard');
      } else {
        navigate('/artisans');
      }
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-16 p-8 bg-white rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-6 text-center">Create Account</h1>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input className="w-full border rounded px-3 py-2" placeholder="Full Name" required
          value={form.name} onChange={set('name')} />
        <input className="w-full border rounded px-3 py-2" type="email" placeholder="Email" required
          value={form.email} onChange={set('email')} />
        <input className="w-full border rounded px-3 py-2" type="password" placeholder="Password" required
          value={form.password} onChange={set('password')} />

        <div className="flex gap-3">
          {['client', 'artisan'].map(r => (
            <label key={r} className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="role" value={r} checked={form.role === r} onChange={set('role')} />
              <span className="capitalize">{r}</span>
            </label>
          ))}
        </div>

        {form.role === 'artisan' && (
          <>
            <select className="w-full border rounded px-3 py-2" value={form.specialty} onChange={set('specialty')} required>
              <option value="">Select specialty…</option>
              {SPECIALTIES.map(s => <option key={s}>{s}</option>)}
            </select>
            <input className="w-full border rounded px-3 py-2" placeholder="City" required
              value={form.city} onChange={set('city')} />
            <input className="w-full border rounded px-3 py-2" placeholder="Phone" 
              value={form.phone} onChange={set('phone')} />
          </>
        )}

        <button type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-medium">
          Create Account
        </button>
      </form>

      <p className="text-center text-sm mt-4 text-gray-500">
        Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
      </p>
    </div>
  );
}
