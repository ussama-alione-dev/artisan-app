// Navbar.jsx — Top navigation bar
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <nav className="bg-blue-600 text-white px-6 py-3 flex items-center justify-between shadow">
      <Link to="/" className="text-xl font-bold">🛠️ ArtisanPro</Link>

      <div className="flex items-center gap-4 text-sm">
        <Link to="/artisans" className="hover:underline">Artisans</Link>

        {!user ? (
          <>
            <Link to="/login" className="hover:underline">Login</Link>
            <Link to="/register" className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-blue-50">
              Register
            </Link>
          </>
        ) : (
          <>
            {user.role === 'client' && (
              <Link to="/dashboard" className="hover:underline">My Requests</Link>
            )}
            {user.role === 'artisan' && (
              <Link to="/artisan/dashboard" className="hover:underline">Dashboard</Link>
            )}
            <span className="text-blue-200">{user.name}</span>
            <button onClick={handleLogout} className="hover:underline text-blue-100">Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}
