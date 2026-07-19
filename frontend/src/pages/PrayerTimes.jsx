import { useEffect, useState } from 'react';
import client from '../api/client';
import PageHeader from '../components/PageHeader';
import Modal from '../components/Modal';
import { Pencil, Trash2 } from 'lucide-react';

const emptyForm = {
  date: new Date().toISOString().slice(0, 10),
  fajr_adhan: '04:45', fajr_iqamah: '05:05',
  dhuhr_adhan: '12:15', dhuhr_iqamah: '12:45',
  asr_adhan: '16:30', asr_iqamah: '16:50',
  maghrib_adhan: '19:05', maghrib_iqamah: '19:10',
  isha_adhan: '20:30', isha_iqamah: '20:50',
  jummah_khutbah: '13:15', jummah_iqamah: '13:45',
};

const prayers = [
  { key: 'fajr', label: 'Fajr' }, { key: 'dhuhr', label: 'Dhuhr' },
  { key: 'asr', label: 'Asr' }, { key: 'maghrib', label: 'Maghrib' }, { key: 'isha', label: 'Isha' },
];

export default function PrayerTimes() {
  const [timings, setTimings] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = () => client.get('/prayer-timings/', { params: { ordering: '-date' } }).then((res) => setTimings(res.data.results || res.data));
  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (t) => { setEditing(t); setForm(t); setModalOpen(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) await client.patch(`/prayer-timings/${editing.id}/`, form);
      else await client.post('/prayer-timings/', form);
      setModalOpen(false);
      load();
    } catch (err) {
      alert('Failed to save timing — a schedule may already exist for this date.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this prayer schedule?')) return;
    await client.delete(`/prayer-timings/${id}/`);
    load();
  };

  return (
    <div>
      <PageHeader title="Prayer Timings" subtitle="Manage daily adhan and iqamah schedules" actionLabel="Add Schedule" onAction={openCreate} />

      <div className="bg-white rounded-2xl border border-night-100/60 overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-night-50 text-night-400 text-xs uppercase tracking-wider">
            <tr>
              <th className="text-left px-6 py-3 font-medium">Date</th>
              {prayers.map((p) => <th key={p.key} className="text-center px-4 py-3 font-medium">{p.label}</th>)}
              <th className="text-right px-6 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {timings.map((t) => (
              <tr key={t.id} className="border-t border-night-100/60 hover:bg-night-50/50 transition">
                <td className="px-6 py-3.5 font-medium text-night-600">{t.date}</td>
                {prayers.map((p) => (
                  <td key={p.key} className="px-4 py-3.5 text-center text-night-500 font-mono text-xs">
                    {t[`${p.key}_iqamah`]?.slice(0, 5)}
                  </td>
                ))}
                <td className="px-6 py-3.5 text-right">
                  <button onClick={() => openEdit(t)} className="p-2 hover:bg-night-100 rounded-lg text-night-400 hover:text-night-600 transition"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(t.id)} className="p-2 hover:bg-red-50 rounded-lg text-night-400 hover:text-red-600 transition"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
            {timings.length === 0 && <tr><td colSpan={7} className="text-center py-10 text-night-300">No schedules added yet.</td></tr>}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <Modal title={editing ? 'Edit Prayer Schedule' : 'Add Prayer Schedule'} onClose={() => setModalOpen(false)} wide>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-night-400 uppercase tracking-wider mb-1.5">Date</label>
              <input type="date" value={form.date} required onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-night-100 focus:outline-none focus:ring-2 focus:ring-brass-400/40" />
            </div>
            <div className="grid grid-cols-5 gap-3">
              {prayers.map((p) => (
                <div key={p.key}>
                  <p className="text-xs font-medium text-night-500 mb-1.5">{p.label}</p>
                  <label className="text-[10px] text-night-300">Adhan</label>
                  <input type="time" value={form[`${p.key}_adhan`]} onChange={(e) => setForm({ ...form, [`${p.key}_adhan`]: e.target.value })} className="w-full px-2 py-1.5 rounded-md border border-night-100 text-xs mb-1.5 focus:outline-none focus:ring-2 focus:ring-brass-400/40" />
                  <label className="text-[10px] text-night-300">Iqamah</label>
                  <input type="time" value={form[`${p.key}_iqamah`]} onChange={(e) => setForm({ ...form, [`${p.key}_iqamah`]: e.target.value })} className="w-full px-2 py-1.5 rounded-md border border-night-100 text-xs focus:outline-none focus:ring-2 focus:ring-brass-400/40" />
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-night-400 uppercase tracking-wider mb-1.5">Jummah Khutbah</label>
                <input type="time" value={form.jummah_khutbah || ''} onChange={(e) => setForm({ ...form, jummah_khutbah: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-night-100 focus:outline-none focus:ring-2 focus:ring-brass-400/40" />
              </div>
              <div>
                <label className="block text-xs font-medium text-night-400 uppercase tracking-wider mb-1.5">Jummah Iqamah</label>
                <input type="time" value={form.jummah_iqamah || ''} onChange={(e) => setForm({ ...form, jummah_iqamah: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-night-100 focus:outline-none focus:ring-2 focus:ring-brass-400/40" />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-2">
              <button type="button" onClick={() => setModalOpen(false)} className="px-5 py-2.5 rounded-lg border border-night-200 text-night-500 hover:bg-night-50 transition">Cancel</button>
              <button type="submit" disabled={saving} className="px-5 py-2.5 rounded-lg bg-night-500 text-ivory hover:bg-night-600 transition disabled:opacity-60">{saving ? 'Saving...' : 'Save Schedule'}</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
