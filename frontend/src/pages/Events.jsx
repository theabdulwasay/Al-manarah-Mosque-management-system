import { useEffect, useState } from 'react';
import client from '../api/client';
import PageHeader from '../components/PageHeader';
import Modal from '../components/Modal';
import Badge from '../components/Badge';
import { Pencil, Trash2, MapPin, User } from 'lucide-react';

const emptyForm = {
  title: '', event_type: 'jummah', description: '', speaker: '', location: 'Main Hall',
  start_datetime: '', is_published: true,
};

const typeLabels = {
  jummah: 'Jummah Khutbah', eid: 'Eid Celebration', lecture: 'Islamic Lecture',
  nikah: 'Nikah Ceremony', funeral: 'Funeral / Janazah', fundraiser: 'Fundraiser',
  ramadan: 'Ramadan Program', class: 'Quran / Islamic Class', other: 'Other',
};

export default function Events() {
  const [events, setEvents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = () => client.get('/events/').then((res) => setEvents(res.data.results || res.data));
  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (ev) => {
    setEditing(ev);
    setForm({ ...ev, start_datetime: ev.start_datetime.slice(0, 16) });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) await client.patch(`/events/${editing.id}/`, form);
      else await client.post('/events/', form);
      setModalOpen(false);
      load();
    } catch (err) {
      alert('Failed to save event.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this event?')) return;
    await client.delete(`/events/${id}/`);
    load();
  };

  return (
    <div>
      <PageHeader title="Events & Programs" subtitle={`${events.length} events scheduled`} actionLabel="Add Event" onAction={openCreate} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {events.map((ev) => {
          const d = new Date(ev.start_datetime);
          return (
            <div key={ev.id} className="bg-white rounded-2xl border border-night-100/60 p-5 shadow-sm flex gap-4">
              <div className="w-16 h-16 rounded-xl bg-night-500 flex flex-col items-center justify-center shrink-0">
                <span className="text-[10px] text-brass-300 leading-none">{d.toLocaleString('en', { month: 'short' }).toUpperCase()}</span>
                <span className="text-2xl text-ivory font-display leading-none mt-1">{d.getDate()}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <Badge tone="normal">{typeLabels[ev.event_type]}</Badge>
                    <h3 className="font-display text-lg text-night-600 mt-1.5">{ev.title}</h3>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button onClick={() => openEdit(ev)} className="p-1.5 hover:bg-night-100 rounded-lg text-night-400 hover:text-night-600 transition"><Pencil className="w-3.5 h-3.5" /></button>
                    <button onClick={() => handleDelete(ev.id)} className="p-1.5 hover:bg-red-50 rounded-lg text-night-400 hover:text-red-600 transition"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
                <p className="text-sm text-night-400 mt-2 line-clamp-2">{ev.description}</p>
                <div className="flex flex-wrap gap-3 mt-3 text-xs text-night-300">
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{ev.location}</span>
                  {ev.speaker && <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" />{ev.speaker}</span>}
                  <span>{d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            </div>
          );
        })}
        {events.length === 0 && <p className="text-night-300 col-span-2 text-center py-10">No events scheduled yet.</p>}
      </div>

      {modalOpen && (
        <Modal title={editing ? 'Edit Event' : 'Add Event'} onClose={() => setModalOpen(false)} wide>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-night-400 uppercase tracking-wider mb-1.5">Title</label>
              <input value={form.title} required onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-night-100 focus:outline-none focus:ring-2 focus:ring-brass-400/40" />
            </div>
            <div>
              <label className="block text-xs font-medium text-night-400 uppercase tracking-wider mb-1.5">Event Type</label>
              <select value={form.event_type} onChange={(e) => setForm({ ...form, event_type: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-night-100 focus:outline-none focus:ring-2 focus:ring-brass-400/40">
                {Object.entries(typeLabels).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-night-400 uppercase tracking-wider mb-1.5">Date & Time</label>
              <input type="datetime-local" value={form.start_datetime} required onChange={(e) => setForm({ ...form, start_datetime: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-night-100 focus:outline-none focus:ring-2 focus:ring-brass-400/40" />
            </div>
            <div>
              <label className="block text-xs font-medium text-night-400 uppercase tracking-wider mb-1.5">Speaker</label>
              <input value={form.speaker} onChange={(e) => setForm({ ...form, speaker: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-night-100 focus:outline-none focus:ring-2 focus:ring-brass-400/40" />
            </div>
            <div>
              <label className="block text-xs font-medium text-night-400 uppercase tracking-wider mb-1.5">Location</label>
              <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-night-100 focus:outline-none focus:ring-2 focus:ring-brass-400/40" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-night-400 uppercase tracking-wider mb-1.5">Description</label>
              <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-night-100 focus:outline-none focus:ring-2 focus:ring-brass-400/40" />
            </div>
            <div className="col-span-2 flex justify-end gap-3 mt-2">
              <button type="button" onClick={() => setModalOpen(false)} className="px-5 py-2.5 rounded-lg border border-night-200 text-night-500 hover:bg-night-50 transition">Cancel</button>
              <button type="submit" disabled={saving} className="px-5 py-2.5 rounded-lg bg-night-500 text-ivory hover:bg-night-600 transition disabled:opacity-60">{saving ? 'Saving...' : 'Save Event'}</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
