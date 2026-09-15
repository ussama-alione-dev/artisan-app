// ArtisanDetailPage.jsx — Artisan profile page
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
    MapPin,
    Phone,
    Euro,
    MessageCircle,
    Send,
    ChevronLeft,
    Loader2,
    Star,
} from "lucide-react";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";

const SPECIALTY_META = {
    Plomberie: { icon: "🔧", bg: "bg-blue-50", text: "text-blue-700" },
    Électricité: { icon: "⚡", bg: "bg-yellow-50", text: "text-yellow-700" },
    Serrurerie: { icon: "🔑", bg: "bg-slate-50", text: "text-slate-700" },
    Climatisation: { icon: "❄️", bg: "bg-cyan-50", text: "text-cyan-700" },
    Peinture: { icon: "🎨", bg: "bg-pink-50", text: "text-pink-700" },
    Menuiserie: { icon: "🪵", bg: "bg-amber-50", text: "text-amber-700" },
    Chauffage: { icon: "🔥", bg: "bg-orange-50", text: "text-orange-700" },
    Maçonnerie: { icon: "🧱", bg: "bg-red-50", text: "text-red-700" },
};

export default function ArtisanDetailPage() {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [artisan, setArtisan] = useState(null);
    const [loading, setLoading] = useState(true);

    console.log(artisan);

    useEffect(() => {
        api.getArtisan(id)
            .then(setArtisan)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [id]);

    if (loading)
        return (
            <div className="flex items-center justify-center h-64 text-slate-400">
                <Loader2 size={24} className="animate-spin mr-2" /> Loading…
            </div>
        );
    if (!artisan)
        return (
            <div className="text-center py-20 text-slate-500">
                Artisan not found.
            </div>
        );

    const meta = SPECIALTY_META[artisan.specialty] || {
        icon: "🛠️",
        bg: "bg-slate-50",
        text: "text-slate-700",
    };
    const roomId = user ? [user.id, artisan.userId].sort().join("_") : null;

    return (
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 animate-fade-in">
            {/* Back */}
            <Link
                to="/artisans"
                className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-6 transition-colors"
            >
                <ChevronLeft size={16} /> Back to artisans
            </Link>

            {/* Profile card */}
            <div className="card overflow-hidden">
                {/* Header banner */}
                <div className="h-24 bg-gradient-to-r from-indigo-500 to-violet-500" />

                <div className="px-6 pb-6">
                    {/* Avatar */}
                    <div
                        className={`-mt-10 w-20 h-20 rounded-2xl ${meta.bg} ${meta.text} text-3xl flex items-center justify-center border-4 border-white shadow-sm mb-4`}
                    >
                        {meta.icon}
                    </div>

                    <div className="flex items-start justify-between flex-wrap gap-3 mb-5">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">
                                {artisan.name}
                            </h1>
                            <p className="text-indigo-600 font-semibold mt-0.5">
                                {artisan.specialty}
                            </p>
                        </div>
                        <span
                            className={`badge ${artisan.available ? "badge-available" : "badge-busy"} text-sm`}
                        >
                            <span
                                className={`w-2 h-2 rounded-full ${artisan.available ? "bg-emerald-500" : "bg-slate-400"}`}
                            />
                            {artisan.available ? "Available" : "Currently Busy"}
                        </span>
                    </div>

                    {/* Info row */}
                    <div className="flex flex-wrap gap-4 mb-6 text-sm text-slate-600">
                        {artisan.city && (
                            <span className="flex items-center gap-1.5">
                                <MapPin size={15} className="text-slate-400" />{" "}
                                {artisan.city}
                            </span>
                        )}
                        {artisan.phone && (
                            <span className="flex items-center gap-1.5">
                                <Phone size={15} className="text-slate-400" />{" "}
                                {artisan.phone}
                            </span>
                        )}
                        {artisan.hourlyRate && (
                            <span className="flex items-center gap-1.5 font-semibold text-slate-800">
                                <Euro size={15} className="text-slate-400" />{" "}
                                {artisan.hourlyRate} / hour
                            </span>
                        )}
                    </div>

                    {/* Description */}
                    {artisan.description && (
                        <div className="bg-slate-50 rounded-xl p-4 mb-6">
                            <p className="text-sm font-medium text-slate-700 mb-1">
                                About
                            </p>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                {artisan.description}
                            </p>
                        </div>
                    )}

                    {/* Actions */}
                    {user?.role === "client" ? (
                        <div className="flex gap-3">
                            <Link
                                to={`/demande/${artisan.userId}`}
                                className="btn btn-primary flex-1 justify-center"
                            >
                                <Send size={15} /> Send a Request
                            </Link>
                            <button
                                onClick={() => navigate(`/chat/${roomId}`)}
                                className="btn btn-secondary flex-1"
                            >
                                <MessageCircle size={15} /> Chat
                            </button>
                        </div>
                    ) : !user ? (
                        <Link
                            to="/login"
                            className="btn btn-primary w-full justify-center"
                        >
                            Login to contact this artisan
                        </Link>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
