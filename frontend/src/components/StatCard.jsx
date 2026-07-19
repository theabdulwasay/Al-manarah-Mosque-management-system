export default function StatCard({ icon: Icon, label, value, sub, accent = 'brass' }) {
  const accentClasses = {
    brass: 'bg-brass-500/10 text-brass-600 border-brass-500/20',
    sage: 'bg-sage/10 text-sage border-sage/20',
    night: 'bg-night-500/10 text-night-500 border-night-500/20',
  };
  return (
    <div className="arch-top bg-white border border-night-100/60 px-6 pt-8 pb-5 shadow-sm hover:shadow-md transition relative">
      <div className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center border ${accentClasses[accent]}`}>
        <Icon className="w-5 h-5" strokeWidth={1.75} />
      </div>
      <p className="text-xs uppercase tracking-wider text-night-300 text-center mt-1">{label}</p>
      <p className="font-display text-2xl text-night-600 text-center mt-1">{value}</p>
      {sub && <p className="text-xs text-night-300 text-center mt-1">{sub}</p>}
    </div>
  );
}
