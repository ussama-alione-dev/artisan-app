// LoginPage.jsx — Modern split-layout login
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Wrench, ArrowRight, Zap } from 'lucide-react';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';

const DEMOS = [
  { label: 'Demo Client',  email: 'client@demo.fr',   color: 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100' },
  { label: 'Demo Artisan', email: 'plombier@demo.fr', color: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' },
];

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const { token, user } = await api.login(form);
      login(token, user);
      navigate(user.role === 'artisan' ? '/artisan/dashboard' : '/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-[420px] bg-gradient-to-br from-indigo-600 to-violet-700 text-white p-10 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
            <Wrench size={16} />
          </div>
          <span className="font-bold text-lg">ArtisanPro</span>
        </div>
        <div>
          <p className="text-3xl font-bold leading-tight mb-4">
            Connect with skilled<br />local professionals
          </p>
          <p className="text-indigo-200 text-sm leading-relaxed">
            Thousands of verified artisans ready to help with your home projects.
          </p>
        </div>
        <div className="text-xs text-indigo-300">© 2026 ArtisanPro</div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm animate-slide-up">
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Welcome back</h1>
          <p className="text-slate-500 text-sm mb-7">Sign in to your account</p>

          {/* Quick-fill demos */}
          <div className="flex gap-2 mb-6">
            {DEMOS.map(d => (
              <button
                key={d.email}
                onClick={() => setForm({ email: d.email, password: 'password123' })}
                className={`flex-1 text-xs font-semibold py-2 px-3 rounded-xl border transition-colors ${d.color}`}
              >
                <Zap size={12} className="inline mr-1" />{d.label}
              </button>
            ))}
          </div>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
              <span>⚠</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  className="input pl-10"
                  type="email" placeholder="you@example.com" required
                  value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  className="input pl-10"
                  type="password" placeholder="••••••••" required
                  value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                />
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary w-full mt-2">
              {loading ? 'Signing in…' : <><span>Sign In</span><ArrowRight size={15} /></>}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            No account?{' '}
            <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-700">
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
