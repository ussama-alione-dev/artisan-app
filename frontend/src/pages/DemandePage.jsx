// DemandePage.jsx — Job request form
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
    FileText,
    MapPin,
    Flame,
    Calendar,
    ChevronLeft,
    CheckCircle2,
    Loader2,
} from "lucide-react";
import { api } from "../api";

const URGENCY = [
    {
        value: "low",
        label: "Low",
        sub: "Within the week",
        color: "border-slate-200 bg-white",
    },
    {
        value: "normal",
        label: "Normal",
        sub: "Within 48 hours",
        color: "border-slate-200 bg-white",
    },
    {
        value: "high",
        label: "Urgent",
        sub: "As soon as possible",
        color: "border-slate-200 bg-white",
    },
];

export default function DemandePage() {
    const { artisanId } = useParams();
    const navigate = useNavigate();
    const [artisan, setArtisan] = useState(null);
    const [form, setForm] = useState({
        description: "",
        address: "",
        urgency: "normal",
        desiredDate: "",
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    console.log(artisanId);

    useEffect(() => {
        api.getArtisan(artisanId).then(setArtisan).catch(console.error);
    }, [artisanId]);

    const set = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await api.createDemande({ artisanId, ...form });
            setSuccess(true);
            setTimeout(() => navigate("/dashboard"), 2500);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    if (success)
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 animate-fade-in">
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                    <CheckCircle2 size={32} className="text-emerald-600" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">
                    Request Sent!
                </h2>
                <p className="text-slate-500 text-sm mb-1">
                    The artisan will be notified shortly.
                </p>
                <p className="text-slate-400 text-xs">
                    Redirecting to your dashboard…
                </p>
            </div>
        );

    return (
        <div className="max-w-lg mx-auto px-4 sm:px-6 py-10 animate-fade-in">
            <Link
                to={`/artisans/${artisanId}`}
                className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-6 transition-colors"
            >
                <ChevronLeft size={16} /> Back to profile
            </Link>

            <h1 className="text-2xl font-bold text-slate-900 mb-1">
                Send a Job Request
            </h1>
            {artisan && (
                <p className="text-slate-500 text-sm mb-7">
                    To{" "}
                    <span className="font-semibold text-indigo-600">
                        {artisan.name}
                    </span>{" "}
                    · {artisan.specialty}
                </p>
            )}

            {error && (
                <div className="mb-5 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                    ⚠ {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="card p-6 space-y-5">
                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        <FileText
                            size={14}
                            className="inline mr-1.5 text-slate-400"
                        />
                        Describe the problem *
                    </label>
                    <textarea
                        className="input h-28 resize-none"
                        placeholder="Leaky faucet in the kitchen, water damage on the ceiling…"
                        required
                        value={form.description}
                        onChange={set("description")}
                    />
                </div>

                {/* Address */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        <MapPin
                            size={14}
                            className="inline mr-1.5 text-slate-400"
                        />
                        Address
                    </label>
                    <input
                        className="input"
                        placeholder="12 Rue de la Paix, Paris"
                        value={form.address}
                        onChange={set("address")}
                    />
                </div>

                {/* Urgency */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        <Flame
                            size={14}
                            className="inline mr-1.5 text-slate-400"
                        />
                        Urgency
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                        {URGENCY.map((u) => (
                            <button
                                key={u.value}
                                type="button"
                                onClick={() =>
                                    setForm((p) => ({ ...p, urgency: u.value }))
                                }
                                className={`p-3 rounded-xl border-2 text-left transition-all ${
                                    form.urgency === u.value
                                        ? "border-indigo-500 bg-indigo-50"
                                        : "border-slate-200 bg-white hover:border-slate-300"
                                }`}
                            >
                                <p
                                    className={`text-sm font-semibold ${form.urgency === u.value ? "text-indigo-700" : "text-slate-700"}`}
                                >
                                    {u.label}
                                </p>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    {u.sub}
                                </p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Date */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        <Calendar
                            size={14}
                            className="inline mr-1.5 text-slate-400"
                        />
                        Preferred Date
                    </label>
                    <input
                        type="date"
                        className="input"
                        value={form.desiredDate}
                        onChange={set("desiredDate")}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary w-full justify-center"
                >
                    {loading ? (
                        <>
                            <Loader2 size={15} className="animate-spin" />{" "}
                            Sending…
                        </>
                    ) : (
                        "Send Request"
                    )}
                </button>
            </form>
        </div>
    );
}
