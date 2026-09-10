// pages/HomePage.jsx — Landing page
import { Link } from 'react-router-dom';

const SPECIALTIES = [
  { icon: '🔧', label: 'Plomberie' },
  { icon: '⚡', label: 'Électricité' },
  { icon: '🔑', label: 'Serrurerie' },
  { icon: '❄️', label: 'Climatisation' },
  { icon: '🎨', label: 'Peinture' },
  { icon: '🪵', label: 'Menuiserie' },
  { icon: '🔥', label: 'Chauffage' },
  { icon: '🧱', label: 'Maçonnerie' },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-blue-600 text-white py-20 px-6 text-center">
        <h1 className="text-4xl font-bold mb-4">Find a Trusted Artisan Near You</h1>
        <p className="text-blue-100 text-lg mb-8">
          Connect instantly with qualified local professionals
        </p>
        <Link to="/artisans"
          className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-blue-50 text-lg">
          Browse Artisans
        </Link>
      </section>

      {/* Specialties */}
      <section className="max-w-4xl mx-auto py-16 px-6">
        <h2 className="text-2xl font-bold text-center mb-10 text-gray-800">Our Services</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {SPECIALTIES.map(({ icon, label }) => (
            <Link key={label} to={`/artisans?specialty=${label}`}
              className="flex flex-col items-center p-5 bg-white rounded-xl shadow hover:shadow-md transition border border-gray-100">
              <span className="text-4xl mb-2">{icon}</span>
              <span className="text-sm font-medium text-gray-700">{label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-gray-100 py-16 px-6">
        <h2 className="text-2xl font-bold text-center mb-10 text-gray-800">How it works</h2>
        <div className="max-w-3xl mx-auto grid sm:grid-cols-3 gap-6 text-center">
          {[
            { step: '1', title: 'Search', desc: 'Find an artisan by specialty and city' },
            { step: '2', title: 'Request', desc: 'Send a job request with your details' },
            { step: '3', title: 'Done', desc: 'Chat with your artisan and track the job' },
          ].map(({ step, title, desc }) => (
            <div key={step} className="bg-white p-6 rounded-xl shadow">
              <div className="text-3xl font-bold text-blue-600 mb-2">{step}</div>
              <h3 className="font-semibold text-lg mb-1">{title}</h3>
              <p className="text-gray-500 text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
