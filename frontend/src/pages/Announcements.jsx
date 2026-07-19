import { useEffect, useState } from 'react';
import client from '../api/client';
import PageHeader from '../components/PageHeader';
import Modal from '../components/Modal';
import Badge from '../components/Badge';
import { Pencil, Trash2, Pin } from 'lucide-react';

const emptyForm = { title: '', content: '', priority: 'normal', is_pinned: false, is_active: true, posted_by: '' };

export default function Announcements() {
  const [items, setItems] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = () => client.get('/announcements/').then((res) => setItems(res.data.results || res.data));
  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (a) => { setEditing(a); setForm(a); setModalOpen(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) await client.patch(`/announcements/${editing.id}/`, form);
      else await client.post('/announcements/', form);
      setModalOpen(false);
      load();
    } catch (err) {
      alert('Failed to save announcement.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this announcement?')) return;
    await client.delete(`/announcements/${id}/`);
    load();
  };

  return (
    <div>
      <PageHeader title="Announcements" subtitle={`${items.length} notices`} actionLabel="New Announcement" onAction={openCreate} />

      <div className="space-y-4">
        {items.map((a) => (
          <div key={a.id} className="bg-white rounded-2xl border border-night-100/60 p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                {a.is_pinned && <Pin className="w-4 h-4 text-brass-500" />}
                <h3 className="font-display text-lg text-night-600">{a.title}</h3>
                <Badge tone={a.priority}>{a.priority}</Badge>
                {!a.is_active && <Badge tone="inactive">inactive</Badge>}
              </div>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => openEdit(a)} className="p-1.5 hover:bg-night-100 rounded-lg text-night-400 hover:text-night-600 transition"><Pencil className="w-3.5 h-3.5" /></button>
                <button onClick={() => handleDelete(a.id)} className="p-1.5 hover:bg-red-50 rounded-lg text-night-400 hover:text-red-600 transition"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
            <p className="text-sm text-night-500 mt-2">{a.content}</p>
            <p className="text-xs text-night-300 mt-2">Posted by {a.posted_by || 'Admin Office'}</p>
          </div>
        ))}
        {items.length === 0 && <p className="text-night-300 text-center py-10">No announcements yet.</p>}
      </div>

      {modalOpen && (
        <Modal title={editing ? 'Edit Announcement' : 'New Announcement'} onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-night-400 uppercase tracking-wider mb-1.5">Title</label>
              <input value={form.title} required onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-night-100 focus:outline-none focus:ring-2 focus:ring-brass-400/40" />
            </div>
            <div>
              <label className="block text-xs font-medium text-night-400 uppercase tracking-wider mb-1.5">Content</label>
              <textarea rows={4} value={form.content} required onChange={(e) => setForm({ ...form, content: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-night-100 focus:outline-none focus:ring-2 focus:ring-brass-400/40" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-night-400 uppercase tracking-wider mb-1.5">Priority</label>
                <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-night-100 focus:outline-none focus:ring-2 focus:ring-brass-400/40">
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-night-400 uppercase tracking-wider mb-1.5">Posted By</label>
                <input value={form.posted_by} onChange={(e) => setForm({ ...form, posted_by: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-night-100 focus:outline-none focus:ring-2 focus:ring-brass-400/40" />
              </div>
            </div>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 text-sm text-night-500">
                <input type="checkbox" checked={form.is_pinned} onChange={(e) => setForm({ ...form, is_pinned: e.target.checked })} className="rounded" /> Pin to top
              </label>
              <label className="flex items-center gap-2 text-sm text-night-500">
                <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="rounded" /> Active
              </label>
            </div>
            <div className="flex justify-end gap-3 mt-2">
              <button type="button" onClick={() => setModalOpen(false)} className="px-5 py-2.5 rounded-lg border border-night-200 text-night-500 hover:bg-night-50 transition">Cancel</button>
              <button type="submit" disabled={saving} className="px-5 py-2.5 rounded-lg bg-night-500 text-ivory hover:bg-night-600 transition disabled:opacity-60">{saving ? 'Saving...' : 'Publish'}</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
