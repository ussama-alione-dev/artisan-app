// RegisterPage.jsx — Modern register form with role cards
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    User,
    Mail,
    Lock,
    Briefcase,
    MapPin,
    Phone,
    ArrowRight,
    UserCheck,
    Wrench,
} from "lucide-react";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";

const SPECIALTIES = [
    "Plomberie",
    "Électricité",
    "Serrurerie",
    "Climatisation",
    "Peinture",
    "Menuiserie",
    "Chauffage",
    "Maçonnerie",
];

import RegisterFormField from "../components/RegisterFormField";

export default function RegisterPage() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        role: "client",
        specialty: "",
        city: "",
        phone: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const set = (f) => (e) =>
        setForm((prev) => ({ ...prev, [f]: e.target.value }));

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const { token, user } = await api.register(form);
            login(token, user);
            if (user.role === "artisan") {
                await api.updateProfile({
                    specialty: form.specialty,
                    city: form.city,
                    phone: form.phone,
                });
                navigate("/artisan/dashboard");
            } else {
                navigate("/artisans");
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-6 bg-slate-50">
            <div className="w-full max-w-md animate-slide-up">
                {/* Card */}
                <div className="card p-8">
                    <h1 className="text-2xl font-bold text-slate-900 mb-1">
                        Create Account
                    </h1>
                    <p className="text-slate-500 text-sm mb-7">
                        Join thousands of clients and artisans
                    </p>

                    {error && (
                        <div className="mb-5 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                            ⚠ {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <RegisterFormField
                            icon={User}
                            label="Full Name"
                            placeholder="Jean Dupont"
                            required
                            value={form.name}
                            onChange={set("name")}
                        />
                        <RegisterFormField
                            icon={Mail}
                            label="Email"
                            type="email"
                            placeholder="you@example.com"
                            required
                            value={form.email}
                            onChange={set("email")}
                        />
                        <RegisterFormField
                            icon={Lock}
                            label="Password"
                            type="password"
                            placeholder="At least 8 characters"
                            required
                            value={form.password}
                            onChange={set("password")}
                        />

                        {/* Role selector */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                I am a…
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    {
                                        value: "client",
                                        icon: UserCheck,
                                        label: "Client",
                                        sub: "I need a professional",
                                    },
                                    {
                                        value: "artisan",
                                        icon: Wrench,
                                        label: "Artisan",
                                        sub: "I offer my services",
                                    },
                                ].map(({ value, icon: Icon, label, sub }) => (
                                    <button
                                        key={value}
                                        type="button"
                                        onClick={() =>
                                            setForm((prev) => ({
                                                ...prev,
                                                role: value,
                                            }))
                                        }
                                        className={`p-3.5 rounded-xl border-2 text-left transition-all ${
                                            form.role === value
                                                ? "border-indigo-500 bg-indigo-50"
                                                : "border-slate-200 bg-white hover:border-slate-300"
                                        }`}
                                    >
                                        <Icon
                                            size={18}
                                            className={
                                                form.role === value
                                                    ? "text-indigo-600"
                                                    : "text-slate-500"
                                            }
                                        />
                                        <p
                                            className={`text-sm font-semibold mt-1.5 ${form.role === value ? "text-indigo-700" : "text-slate-700"}`}
                                        >
                                            {label}
                                        </p>
                                        <p className="text-xs text-slate-500 mt-0.5">
                                            {sub}
                                        </p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Artisan extra fields */}
                        {form.role === "artisan" && (
                            <div className="space-y-4 pt-2 border-t border-slate-100 mt-2">
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                    Artisan Details
                                </p>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                        Specialty *
                                    </label>
                                    <div className="relative">
                                        <Briefcase
                                            size={16}
                                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                                        />
                                        <select
                                            className="input pl-10 appearance-none"
                                            value={form.specialty}
                                            onChange={set("specialty")}
                                            required
                                        >
                                            <option value="">
                                                Choose your specialty…
                                            </option>
                                            {SPECIALTIES.map((s) => (
                                                <option key={s}>{s}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <Field
                                    icon={MapPin}
                                    label="City *"
                                    placeholder="Paris"
                                    required
                                    value={form.city}
                                    onChange={set("city")}
                                />
                                <Field
                                    icon={Phone}
                                    label="Phone"
                                    placeholder="06 12 34 56 78"
                                    value={form.phone}
                                    onChange={set("phone")}
                                />
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary w-full mt-2"
                        >
                            {loading ? (
                                "Creating account…"
                            ) : (
                                <>
                                    <span>Create Account</span>
                                    <ArrowRight size={15} />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <p className="text-center text-sm text-slate-500 mt-5">
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        className="font-semibold text-indigo-600 hover:text-indigo-700"
                    >
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
