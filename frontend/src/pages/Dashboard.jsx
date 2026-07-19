import { useEffect, useState } from 'react';
import client from '../api/client';
import StatCard from '../components/StatCard';
import {
  Users, Wallet, TrendingDown, CalendarDays, Megaphone, Clock4
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, Legend
} from 'recharts';

const PIE_COLORS = ['#B8892B', '#0E2E29', '#6B8F71', '#DBAC53', '#356B5D', '#93B5AC'];

function fmt(n) {
  return new Intl.NumberFormat('en-PK', { maximumFractionDigits: 0 }).format(n || 0);
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [summary, setSummary] = useState(null);
  const [events, setEvents] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    client.get('/dashboard/stats/').then((res) => setStats(res.data));
    client.get('/summary/').then((res) => setSummary(res.data));
    client.get('/events/upcoming/').then((res) => setEvents(res.data));
    client.get('/announcements/?is_active=true').then((res) => setAnnouncements(res.data.results?.slice(0, 4) || []));
  }, []);

  if (!stats) return <div className="text-night-300">Loading dashboard...</div>;

  const prayers = stats.today_prayer;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl text-night-600">As-salamu alaykum, welcome back</h1>
        <p className="text-night-300 mt-1">Here's what's happening at the mosque today.</p>
      </div>

      {/* Today's prayer strip */}
      {prayers && (
        <div className="bg-night-500 bg-star-pattern rounded-2xl px-6 py-5 flex flex-wrap gap-6 justify-between items-center">
          {['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'].map((p) => (
            <div key={p} className="text-center flex-1 min-w-[80px]">
              <p className="text-[11px] uppercase tracking-widest text-brass-300">{p}</p>
              <p className="font-display text-xl text-ivory mt-1">{prayers[p] || '--:--'}</p>
            </div>
          ))}
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 pt-3">
        <StatCard icon={Users} label="Active Members" value={stats.total_members} accent="night" />
        <StatCard icon={Wallet} label="Balance" value={`₨${fmt(stats.balance)}`} accent="brass" />
        <StatCard icon={TrendingDown} label="Expenses (mo.)" value={`₨${fmt(stats.expenses_month)}`} accent="sage" />
        <StatCard icon={Wallet} label="Donations (mo.)" value={`₨${fmt(stats.donations_month)}`} accent="brass" />
        <StatCard icon={CalendarDays} label="Upcoming Events" value={stats.upcoming_events} accent="night" />
        <StatCard icon={Megaphone} label="Announcements" value={stats.active_announcements} accent="sage" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-night-100/60 p-6 shadow-sm">
          <h3 className="font-display text-lg text-night-600 mb-4">Donations vs Expenses — 6 Month Trend</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={stats.monthly_trend}>
              <defs>
                <linearGradient id="don" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#B8892B" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#B8892B" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="exp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0E2E29" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#0E2E29" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8EFED" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#5F8F83' }} />
              <YAxis tick={{ fontSize: 12, fill: '#5F8F83' }} />
              <Tooltip formatter={(v) => `₨${fmt(v)}`} />
              <Area type="monotone" dataKey="donations" stroke="#B8892B" fill="url(#don)" strokeWidth={2} name="Donations" />
              <Area type="monotone" dataKey="expenses" stroke="#0E2E29" fill="url(#exp)" strokeWidth={2} name="Expenses" />
              <Legend />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Donations by category pie */}
        <div className="bg-white rounded-2xl border border-night-100/60 p-6 shadow-sm">
          <h3 className="font-display text-lg text-night-600 mb-4">Donations by Category</h3>
          {summary && (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={summary.donations_by_category}
                  dataKey="total"
                  nameKey="category__name"
                  innerRadius={50}
                  outerRadius={90}
                  paddingAngle={2}
                >
                  {summary.donations_by_category.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => `₨${fmt(v)}`} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming events */}
        <div className="bg-white rounded-2xl border border-night-100/60 p-6 shadow-sm">
          <h3 className="font-display text-lg text-night-600 mb-4">Upcoming Events</h3>
          <div className="space-y-3">
            {events.length === 0 && <p className="text-night-300 text-sm">No upcoming events.</p>}
            {events.map((e) => (
              <div key={e.id} className="flex items-start gap-3 pb-3 border-b border-night-100/60 last:border-0 last:pb-0">
                <div className="w-11 h-11 rounded-lg bg-night-500 flex flex-col items-center justify-center shrink-0">
                  <span className="text-[10px] text-brass-300 leading-none">{new Date(e.start_datetime).toLocaleString('en', { month: 'short' })}</span>
                  <span className="text-sm text-ivory font-semibold leading-none mt-0.5">{new Date(e.start_datetime).getDate()}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-night-600 truncate">{e.title}</p>
                  <p className="text-xs text-night-300">{e.location} · {new Date(e.start_datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Announcements */}
        <div className="bg-white rounded-2xl border border-night-100/60 p-6 shadow-sm">
          <h3 className="font-display text-lg text-night-600 mb-4">Latest Announcements</h3>
          <div className="space-y-3">
            {announcements.length === 0 && <p className="text-night-300 text-sm">No active announcements.</p>}
            {announcements.map((a) => (
              <div key={a.id} className="pb-3 border-b border-night-100/60 last:border-0 last:pb-0">
                <div className="flex items-center gap-2">
                  {a.is_pinned && <span className="text-brass-500 text-xs">📌</span>}
                  <p className="text-sm font-medium text-night-600">{a.title}</p>
                </div>
                <p className="text-xs text-night-300 mt-0.5 line-clamp-1">{a.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
