// ArtisansPage.jsx — Browse and filter artisans
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, Loader2 } from "lucide-react";
import { api } from "../api";
import ArtisanCard from "../components/ArtisanCard";

const SPECIALTIES = [
    "",
    "Plomberie",
    "Électricité",
    "Serrurerie",
    "Climatisation",
    "Peinture",
    "Menuiserie",
    "Chauffage",
    "Maçonnerie",
];

export default function ArtisansPage() {
    const [searchParams] = useSearchParams();
    const [artisans, setArtisans] = useState([]);
    const [loading, setLoading] = useState(true);

    const [specialty, setSpecialty] = useState(
        searchParams.get("specialty") || "",
    );
    const [city, setCity] = useState("");
    const [availableOnly, setAvailableOnly] = useState(false);

    async function fetch() {
        setLoading(true);
        try {
            const params = {};
            if (specialty) params.specialty = specialty;
            if (city.trim()) params.city = city.trim();
            if (availableOnly) params.available = "true";
            setArtisans(await api.getArtisans(params));
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetch();
    }, [specialty, city, availableOnly]);

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 animate-fade-in">
            {/* Page header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900">
                    Browse Artisans
                </h1>
                <p className="text-slate-500 mt-1">
                    {loading
                        ? "…"
                        : `${artisans.length} professional${artisans.length !== 1 ? "s" : ""} found`}
                </p>
            </div>

            {/* Filter bar */}
            <div className="card p-4 mb-8 flex flex-wrap items-center gap-3">
                <SlidersHorizontal
                    size={16}
                    className="text-slate-400 hidden sm:block"
                />

                <select
                    className="input"
                    style={{ width: "auto", minWidth: "160px" }}
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                >
                    {SPECIALTIES.map((s) => (
                        <option key={s} value={s}>
                            {s || "All specialties"}
                        </option>
                    ))}
                </select>

                <div className="relative">
                    <Search
                        size={15}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                        className="input pl-9"
                        style={{ minWidth: "180px" }}
                        placeholder="Filter by city…"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                    />
                </div>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                    <div
                        onClick={() => setAvailableOnly((v) => !v)}
                        className={`relative w-9 h-5 rounded-full transition-colors ${availableOnly ? "bg-indigo-600" : "bg-slate-200"}`}
                    >
                        <div
                            className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${availableOnly ? "translate-x-4" : ""}`}
                        />
                    </div>
                    <span className="text-sm font-medium text-slate-700">
                        Available only
                    </span>
                </label>
            </div>

            {/* Results */}
            {loading ? (
                <div className="flex items-center justify-center py-24 text-slate-400">
                    <Loader2 size={28} className="animate-spin mr-3" /> Loading
                    artisans…
                </div>
            ) : artisans.length === 0 ? (
                <div className="text-center py-24">
                    <p className="text-4xl mb-3">🔍</p>
                    <p className="font-semibold text-slate-700 text-lg">
                        No artisans found
                    </p>
                    <p className="text-slate-500 text-sm mt-1">
                        Try adjusting your filters
                    </p>
                </div>
            ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {artisans.map((a) => (
                        <ArtisanCard key={a.userId} artisan={a} />
                    ))}
                </div>
            )}
        </div>
    );
}
