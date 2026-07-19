import { Plus } from 'lucide-react';

export default function PageHeader({ title, subtitle, actionLabel, onAction }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="font-display text-3xl text-night-600">{title}</h1>
        {subtitle && <p className="text-night-300 mt-1">{subtitle}</p>}
      </div>
      {onAction && (
        <button
          onClick={onAction}
          className="flex items-center gap-2 bg-brass-500 hover:bg-brass-600 text-night-600 font-medium px-5 py-2.5 rounded-lg transition shadow-sm"
        >
          <Plus className="w-4 h-4" strokeWidth={2.5} />
          {actionLabel}
        </button>
      )}
    </div>
  );
}
