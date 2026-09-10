// HomePage.jsx — Modern hero + services grid + how it works
import { Link } from 'react-router-dom';
import { Search, Send, CheckCircle, ArrowRight, Star, Shield, Zap } from 'lucide-react';

const SPECIALTIES = [
  { icon: '🔧', label: 'Plomberie',     color: 'bg-blue-50   hover:bg-blue-100   text-blue-700   border-blue-100' },
  { icon: '⚡', label: 'Électricité',   color: 'bg-yellow-50 hover:bg-yellow-100 text-yellow-700 border-yellow-100' },
  { icon: '🔑', label: 'Serrurerie',    color: 'bg-slate-50  hover:bg-slate-100  text-slate-700  border-slate-200' },
  { icon: '❄️', label: 'Climatisation', color: 'bg-cyan-50   hover:bg-cyan-100   text-cyan-700   border-cyan-100' },
  { icon: '🎨', label: 'Peinture',      color: 'bg-pink-50   hover:bg-pink-100   text-pink-700   border-pink-100' },
  { icon: '🪵', label: 'Menuiserie',    color: 'bg-amber-50  hover:bg-amber-100  text-amber-700  border-amber-100' },
  { icon: '🔥', label: 'Chauffage',     color: 'bg-orange-50 hover:bg-orange-100 text-orange-700 border-orange-100' },
  { icon: '🧱', label: 'Maçonnerie',    color: 'bg-red-50    hover:bg-red-100    text-red-700    border-red-100' },
];

const STEPS = [
  { icon: Search,      num: '01', title: 'Search',  desc: 'Filter artisans by specialty, city, and availability.' },
  { icon: Send,        num: '02', title: 'Request',  desc: 'Send a job request in under 60 seconds.' },
  { icon: CheckCircle, num: '03', title: 'Done',     desc: 'Chat with your artisan and track the job live.' },
];

const TRUST = [
  { icon: Star,   label: 'Rated Professionals', sub: 'Vetted & reviewed artisans' },
  { icon: Zap,    label: 'Fast Response',         sub: 'Average reply in < 2h' },
  { icon: Shield, label: 'Guaranteed Work',        sub: 'Satisfaction or refund' },
];

export default function HomePage() {
  return (
    <div className="animate-fade-in">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-700 text-white">
        {/* subtle grid bg */}
        <div className="absolute inset-0 opacity-10" style={{backgroundImage:'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23fff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'}} />
        <div className="relative max-w-6xl mx-auto px-6 py-24 text-center">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-sm font-medium mb-6 border border-white/20">
            <Zap size={14} /> Trusted by 10 000+ clients
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-5 leading-tight tracking-tight">
            Find a Trusted Artisan<br />
            <span className="text-indigo-200">Near You, Right Now</span>
          </h1>
          <p className="text-indigo-100 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            Connect instantly with qualified local professionals — plumbing, electricity, locksmith and more.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/artisans" className="btn btn-primary" style={{background:'#fff',color:'#4f46e5',boxShadow:'0 2px 8px rgba(0,0,0,.15)'}}>
              Browse Artisans <ArrowRight size={16} />
            </Link>
            <Link to="/register" className="btn" style={{background:'rgba(255,255,255,0.12)',color:'#fff',border:'1px solid rgba(255,255,255,0.25)'}}>
              Join as Artisan
            </Link>
          </div>
        </div>
      </section>

      {/* ── Trust strip ── */}
      <section className="border-b border-slate-100 bg-white">
        <div className="max-w-5xl mx-auto px-6 py-8 grid sm:grid-cols-3 gap-6">
          {TRUST.map(({ icon: Icon, label, sub }) => (
            <div key={label} className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
                <Icon size={18} className="text-indigo-600" />
              </div>
              <div>
                <p className="font-semibold text-slate-800 text-sm">{label}</p>
                <p className="text-xs text-slate-500">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Services grid ── */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-slate-900">Our Services</h2>
          <p className="text-slate-500 mt-2">Click a category to find available professionals</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {SPECIALTIES.map(({ icon, label, color }) => (
            <Link
              key={label}
              to={`/artisans?specialty=${label}`}
              className={`flex flex-col items-center gap-2.5 p-5 rounded-2xl border font-medium text-sm transition-all duration-150 ${color}`}
            >
              <span className="text-3xl">{icon}</span>
              <span>{label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="bg-slate-50 border-y border-slate-100">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-slate-900">How it works</h2>
            <p className="text-slate-500 mt-2">Three simple steps to solve your problem</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {STEPS.map(({ icon: Icon, num, title, desc }) => (
              <div key={title} className="card p-6 flex flex-col items-start gap-4">
                <div className="flex items-center justify-between w-full">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center">
                    <Icon size={18} className="text-white" />
                  </div>
                  <span className="text-3xl font-black text-slate-100">{num}</span>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">{title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="max-w-3xl mx-auto px-6 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-3">Ready to get started?</h2>
        <p className="text-slate-500 mb-8">Create a free account and find your artisan in minutes.</p>
        <Link to="/register" className="btn btn-primary">
          Create Free Account <ArrowRight size={16} />
        </Link>
      </section>
    </div>
  );
}
