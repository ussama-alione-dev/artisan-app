// pages/LoginPage.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      const { token, user } = await api.login(form);
      login(token, user);
      navigate(user.role === 'artisan' ? '/artisan/dashboard' : '/dashboard');
    } catch (err) {
      setError(err.message);
    }
  }

  function fillDemo(email) {
    setForm({ email, password: 'password123' });
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>

      {/* Demo quick-fill buttons */}
      <div className="mb-4 flex gap-2">
        <button onClick={() => fillDemo('client@demo.fr')}
          className="flex-1 text-sm bg-blue-50 border border-blue-200 text-blue-700 py-1 rounded hover:bg-blue-100">
          Demo Client
        </button>
        <button onClick={() => fillDemo('plombier@demo.fr')}
          className="flex-1 text-sm bg-green-50 border border-green-200 text-green-700 py-1 rounded hover:bg-green-100">
          Demo Artisan
        </button>
      </div>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          type="email" placeholder="Email" required
          value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
        />
        <input
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          type="password" placeholder="Password" required
          value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
        />
        <button type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-medium">
          Login
        </button>
      </form>

      <p className="text-center text-sm mt-4 text-gray-500">
        No account? <Link to="/register" className="text-blue-600 hover:underline">Register</Link>
      </p>
    </div>
  );
}
