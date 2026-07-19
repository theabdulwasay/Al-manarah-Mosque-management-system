import { X } from 'lucide-react';

export default function Modal({ title, onClose, children, wide }) {
  return (
    <div className="fixed inset-0 bg-night-600/50 backdrop-blur-sm z-50 flex items-center justify-center px-4" onClick={onClose}>
      <div
        className={`bg-white rounded-2xl shadow-2xl w-full ${wide ? 'max-w-2xl' : 'max-w-md'} max-h-[90vh] overflow-y-auto fade-in`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-night-100/60 sticky top-0 bg-white z-10">
          <h3 className="font-display text-xl text-night-600">{title}</h3>
          <button onClick={onClose} className="text-night-300 hover:text-night-600 transition">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
