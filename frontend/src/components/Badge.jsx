const palettes = {
  active: 'bg-sage/10 text-sage border-sage/20',
  inactive: 'bg-night-100 text-night-400 border-night-200',
  suspended: 'bg-red-50 text-red-600 border-red-200',
  urgent: 'bg-red-50 text-red-600 border-red-200',
  high: 'bg-brass-500/10 text-brass-600 border-brass-500/20',
  normal: 'bg-night-500/10 text-night-500 border-night-500/20',
  low: 'bg-night-100 text-night-400 border-night-200',
  default: 'bg-night-100 text-night-500 border-night-200',
};

export default function Badge({ children, tone = 'default' }) {
  const cls = palettes[tone] || palettes.default;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${cls}`}>
      {children}
    </span>
  );
}
