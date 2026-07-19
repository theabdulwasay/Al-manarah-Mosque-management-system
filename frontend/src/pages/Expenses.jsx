import { useEffect, useState } from 'react';
import client from '../api/client';
import PageHeader from '../components/PageHeader';
import Modal from '../components/Modal';
import { Pencil, Trash2 } from 'lucide-react';

const emptyForm = {
  title: '', category: '', amount: '', paid_to: '', approved_by: '',
  date: new Date().toISOString().slice(0, 10), notes: '',
};

function fmt(n) { return new Intl.NumberFormat('en-PK').format(n || 0); }

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = () => {
    client.get('/expenses/').then((res) => setExpenses(res.data.results || res.data));
    client.get('/expense-categories/').then((res) => setCategories(res.data.results || res.data));
  };
  useEffect(() => { load(); }, []);

  const total = expenses.reduce((s, e) => s + parseFloat(e.amount), 0);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (e) => { setEditing(e); setForm({ ...e, category: e.category || '' }); setModalOpen(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, category: form.category || null };
      if (editing) await client.patch(`/expenses/${editing.id}/`, payload);
      else await client.post('/expenses/', payload);
      setModalOpen(false);
      load();
    } catch (err) {
      alert('Failed to save expense.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this expense record?')) return;
    await client.delete(`/expenses/${id}/`);
    load();
  };

  return (
    <div>
      <PageHeader title="Expenses" subtitle={`₨${fmt(total)} spent across ${expenses.length} records`} actionLabel="Record Expense" onAction={openCreate} />

      <div className="bg-white rounded-2xl border border-night-100/60 overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-night-50 text-night-400 text-xs uppercase tracking-wider">
            <tr>
              <th className="text-left px-6 py-3 font-medium">Title</th>
              <th className="text-left px-6 py-3 font-medium">Category</th>
              <th className="text-left px-6 py-3 font-medium">Paid To</th>
              <th className="text-left px-6 py-3 font-medium">Date</th>
              <th className="text-right px-6 py-3 font-medium">Amount</th>
              <th className="text-right px-6 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((x) => (
              <tr key={x.id} className="border-t border-night-100/60 hover:bg-night-50/50 transition">
                <td className="px-6 py-3.5 font-medium text-night-600">{x.title}</td>
                <td className="px-6 py-3.5 text-night-500">{x.category_name || '—'}</td>
                <td className="px-6 py-3.5 text-night-500">{x.paid_to || '—'}</td>
                <td className="px-6 py-3.5 text-night-500">{x.date}</td>
                <td className="px-6 py-3.5 text-right font-mono font-medium text-red-500">-₨{fmt(x.amount)}</td>
                <td className="px-6 py-3.5 text-right">
                  <button onClick={() => openEdit(x)} className="p-2 hover:bg-night-100 rounded-lg text-night-400 hover:text-night-600 transition"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(x.id)} className="p-2 hover:bg-red-50 rounded-lg text-night-400 hover:text-red-600 transition"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
            {expenses.length === 0 && <tr><td colSpan={6} className="text-center py-10 text-night-300">No expenses recorded yet.</td></tr>}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <Modal title={editing ? 'Edit Expense' : 'Record Expense'} onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <TextField label="Title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} required />
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
              <TextField label="Paid To" value={form.paid_to} onChange={(v) => setForm({ ...form, paid_to: v })} />
              <TextField label="Date" value={form.date} onChange={(v) => setForm({ ...form, date: v })} type="date" required />
            </div>
            <TextField label="Approved By" value={form.approved_by} onChange={(v) => setForm({ ...form, approved_by: v })} />
            <div className="flex justify-end gap-3 mt-2">
              <button type="button" onClick={() => setModalOpen(false)} className="px-5 py-2.5 rounded-lg border border-night-200 text-night-500 hover:bg-night-50 transition">Cancel</button>
              <button type="submit" disabled={saving} className="px-5 py-2.5 rounded-lg bg-night-500 text-ivory hover:bg-night-600 transition disabled:opacity-60">{saving ? 'Saving...' : 'Save Expense'}</button>
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
