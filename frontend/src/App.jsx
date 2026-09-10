// App.jsx — Routes configuration
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ArtisansPage from './pages/ArtisansPage';
import ArtisanDetailPage from './pages/ArtisanDetailPage';
import DemandePage from './pages/DemandePage';
import ClientDashboardPage from './pages/ClientDashboardPage';
import ArtisanDashboardPage from './pages/ArtisanDashboardPage';
import ChatPage from './pages/ChatPage';

function PrivateRoute({ children, role }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <main className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/artisans" element={<ArtisansPage />} />
            <Route path="/artisans/:id" element={<ArtisanDetailPage />} />
            <Route path="/demande/:artisanId" element={
              <PrivateRoute role="client"><DemandePage /></PrivateRoute>
            } />
            <Route path="/dashboard" element={
              <PrivateRoute role="client"><ClientDashboardPage /></PrivateRoute>
            } />
            <Route path="/artisan/dashboard" element={
              <PrivateRoute role="artisan"><ArtisanDashboardPage /></PrivateRoute>
            } />
            <Route path="/chat/:roomId" element={
              <PrivateRoute><ChatPage /></PrivateRoute>
            } />
          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  );
}
