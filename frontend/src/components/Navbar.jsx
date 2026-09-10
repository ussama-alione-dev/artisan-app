// Navbar.jsx — Sticky glass navbar with Lucide icons
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Wrench, LayoutDashboard, LogOut, User, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  function handleLogout() { logout(); navigate('/'); }

  const active = (path) => location.pathname === path;

  const NavLink = ({ to, children }) => (
    <Link
      to={to}
      className={`text-sm font-medium transition-colors px-3 py-1.5 rounded-lg ${
        active(to)
          ? 'text-indigo-600 bg-indigo-50'
          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
      }`}
    >
      {children}
    </Link>
  );

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center shadow-sm group-hover:bg-indigo-700 transition-colors">
            <Wrench size={16} className="text-white" />
          </div>
          <span className="font-bold text-slate-900">ArtisanPro</span>
        </Link>

        {/* Center nav */}
        <nav className="hidden sm:flex items-center gap-1">
          <NavLink to="/artisans">Browse Artisans</NavLink>
          {user?.role === 'client'  && <NavLink to="/dashboard"><LayoutDashboard size={14} className="inline mr-1"/>My Requests</NavLink>}
          {user?.role === 'artisan' && <NavLink to="/artisan/dashboard"><LayoutDashboard size={14} className="inline mr-1"/>Dashboard</NavLink>}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {!user ? (
            <>
              <Link to="/login" className="hidden sm:block text-sm font-medium text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Get Started
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-200">
                <div className="w-6 h-6 rounded-full bg-indigo-600 text-white text-[11px] font-bold flex items-center justify-center">
                  {user.name?.[0]?.toUpperCase()}
                </div>
                <span className="text-sm font-medium text-slate-700">{user.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="btn btn-ghost btn-sm flex items-center gap-1.5"
              >
                <LogOut size={14} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
