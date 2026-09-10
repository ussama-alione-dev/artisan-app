// components/ArtisanCard.jsx
import { Link } from 'react-router-dom';

const STATUS_COLORS = {
  true: 'bg-green-100 text-green-700',
  false: 'bg-red-100 text-red-700',
};

export default function ArtisanCard({ artisan }) {
  const { userId, name, specialty, city, description, hourlyRate, available } = artisan;

  return (
    <div className="bg-white rounded-xl shadow p-5 flex flex-col gap-3 hover:shadow-md transition">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-bold text-lg text-gray-800">{name}</h3>
          <p className="text-blue-600 font-medium text-sm">{specialty}</p>
          <p className="text-gray-500 text-sm">📍 {city}</p>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[available]}`}>
          {available ? 'Available' : 'Busy'}
        </span>
      </div>

      {description && (
        <p className="text-gray-600 text-sm line-clamp-2">{description}</p>
      )}

      <div className="flex items-center justify-between mt-auto">
        {hourlyRate && (
          <span className="text-gray-700 text-sm font-medium">{hourlyRate}€/h</span>
        )}
        <Link to={`/artisans/${userId}`}
          className="ml-auto bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-blue-700">
          View Profile
        </Link>
      </div>
    </div>
  );
}
