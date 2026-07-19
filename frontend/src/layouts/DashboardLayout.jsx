import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Users, HandCoins, Receipt, CalendarDays,
  Megaphone, Clock4, Moon, LogOut, ShieldCheck
} from 'lucide-react';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/members', label: 'Members', icon: Users },
  { to: '/donations', label: 'Donations', icon: HandCoins },
  { to: '/expenses', label: 'Expenses', icon: Receipt },
  { to: '/events', label: 'Events', icon: CalendarDays },
  { to: '/announcements', label: 'Announcements', icon: Megaphone },
  { to: '/prayer-times', label: 'Prayer Times', icon: Clock4 },
];

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex bg-ivory">
      {/* Sidebar */}
      <aside className="w-64 bg-night-500 bg-star-pattern flex flex-col shrink-0">
        <div className="px-6 py-7 border-b border-white/10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-brass-500 flex items-center justify-center shrink-0">
            <Moon className="w-5 h-5 text-night-500" strokeWidth={2} />
          </div>
          <div>
            <h1 className="font-display text-xl text-ivory leading-tight">Al-Manarah</h1>
            <p className="text-[10px] text-night-200 uppercase tracking-widest">{user?.mosque_name || 'Mosque System'}</p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-1">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? 'bg-brass-500 text-night-600 shadow-md'
                    : 'text-night-100 hover:bg-white/5 hover:text-ivory'
                }`
              }
            >
              <Icon className="w-4 h-4" strokeWidth={1.75} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-2 py-2 mb-2">
            <div className="w-9 h-9 rounded-full bg-night-300/30 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-brass-300" />
            </div>
            <div className="min-w-0">
              <p className="text-sm text-ivory truncate">{user?.first_name} {user?.last_name}</p>
              <p className="text-[11px] text-night-200 capitalize">{user?.role?.replace('_', ' ')}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-night-100 hover:bg-white/5 hover:text-ivory transition"
          >
            <LogOut className="w-4 h-4" strokeWidth={1.75} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-8 py-8 fade-in">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
