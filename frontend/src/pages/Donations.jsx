import { useEffect, useState } from 'react';
import client from '../api/client';
import PageHeader from '../components/PageHeader';
import Modal from '../components/Modal';
import { Pencil, Trash2 } from 'lucide-react';

const emptyForm = {
  donor_name: '', category: '', amount: '', payment_method: 'cash',
  receipt_number: '', date: new Date().toISOString().slice(0, 10), notes: '',
};

function fmt(n) { return new Intl.NumberFormat('en-PK').format(n || 0); }

export default function Donations() {
  const [donations, setDonations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = () => {
    client.get('/donations/').then((res) => setDonations(res.data.results || res.data));
    client.get('/donation-categories/').then((res) => setCategories(res.data.results || res.data));
  };
  useEffect(() => { load(); }, []);

  const total = donations.reduce((s, d) => s + parseFloat(d.amount), 0);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (d) => { setEditing(d); setForm({ ...d, category: d.category || '' }); setModalOpen(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, category: form.category || null };
      if (editing) await client.patch(`/donations/${editing.id}/`, payload);
      else await client.post('/donations/', payload);
      setModalOpen(false);
      load();
    } catch (err) {
      alert('Failed to save donation.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this donation record?')) return;
    await client.delete(`/donations/${id}/`);
    load();
  };

  return (
    <div>
      <PageHeader title="Donations" subtitle={`₨${fmt(total)} raised across ${donations.length} donations`} actionLabel="Record Donation" onAction={openCreate} />

      <div className="bg-white rounded-2xl border border-night-100/60 overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-night-50 text-night-400 text-xs uppercase tracking-wider">
            <tr>
              <th className="text-left px-6 py-3 font-medium">Donor</th>
              <th className="text-left px-6 py-3 font-medium">Category</th>
              <th className="text-left px-6 py-3 font-medium">Method</th>
              <th className="text-left px-6 py-3 font-medium">Date</th>
              <th className="text-right px-6 py-3 font-medium">Amount</th>
              <th className="text-right px-6 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {donations.map((d) => (
              <tr key={d.id} className="border-t border-night-100/60 hover:bg-night-50/50 transition">
                <td className="px-6 py-3.5 font-medium text-night-600">{d.is_anonymous ? 'Anonymous' : d.donor_name}</td>
                <td className="px-6 py-3.5 text-night-500">{d.category_name || '—'}</td>
                <td className="px-6 py-3.5 text-night-500 capitalize">{d.payment_method.replace('_', ' ')}</td>
                <td className="px-6 py-3.5 text-night-500">{d.date}</td>
                <td className="px-6 py-3.5 text-right font-mono font-medium text-sage">+₨{fmt(d.amount)}</td>
                <td className="px-6 py-3.5 text-right">
                  <button onClick={() => openEdit(d)} className="p-2 hover:bg-night-100 rounded-lg text-night-400 hover:text-night-600 transition"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(d.id)} className="p-2 hover:bg-red-50 rounded-lg text-night-400 hover:text-red-600 transition"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
            {donations.length === 0 && <tr><td colSpan={6} className="text-center py-10 text-night-300">No donations recorded yet.</td></tr>}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <Modal title={editing ? 'Edit Donation' : 'Record Donation'} onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <TextField label="Donor Name" value={form.donor_name} onChange={(v) => setForm({ ...form, donor_name: v })} required />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-night-400 uppercase tracking-wider mb-1.5">Category</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-night-100 focus:outline-none focus:ring-2 focus:ring-brass-400/40">
                  <option value="">Select category</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <TextField label="Amount (₨)" value={form.amount} onChange={(v) => setForm({ ...form, amount: v })} type="number" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-night-400 uppercase tracking-wider mb-1.5">Payment Method</label>
                <select value={form.payment_method} onChange={(e) => setForm({ ...form, payment_method: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-night-100 focus:outline-none focus:ring-2 focus:ring-brass-400/40">
                  <option value="cash">Cash</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="online">Online Payment</option>
                  <option value="cheque">Cheque</option>
                </select>
              </div>
              <TextField label="Date" value={form.date} onChange={(v) => setForm({ ...form, date: v })} type="date" required />
            </div>
            <TextField label="Receipt Number" value={form.receipt_number} onChange={(v) => setForm({ ...form, receipt_number: v })} />
            <div className="flex justify-end gap-3 mt-2">
              <button type="button" onClick={() => setModalOpen(false)} className="px-5 py-2.5 rounded-lg border border-night-200 text-night-500 hover:bg-night-50 transition">Cancel</button>
              <button type="submit" disabled={saving} className="px-5 py-2.5 rounded-lg bg-night-500 text-ivory hover:bg-night-600 transition disabled:opacity-60">{saving ? 'Saving...' : 'Save Donation'}</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

function TextField({ label, value, onChange, type = 'text', required }) {
  return (
    <div>
      <label className="block text-xs font-medium text-night-400 uppercase tracking-wider mb-1.5">{label}</label>
      <input type={type} value={value || ''} required={required} onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2.5 rounded-lg border border-night-100 focus:outline-none focus:ring-2 focus:ring-brass-400/40" />
    </div>
  );
}
