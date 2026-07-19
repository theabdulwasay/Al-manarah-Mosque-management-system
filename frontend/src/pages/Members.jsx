import { useEffect, useState } from 'react';
import client from '../api/client';
import PageHeader from '../components/PageHeader';
import Modal from '../components/Modal';
import Badge from '../components/Badge';
import { Search, Pencil, Trash2, Phone, Mail } from 'lucide-react';

const emptyForm = {
  full_name: '', father_name: '', phone: '', email: '', address: '',
  membership_type: 'regular', status: 'active', family_members_count: 1, occupation: '',
};

const statusTone = { active: 'active', inactive: 'inactive', suspended: 'suspended' };

export default function Members() {
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = () => {
    client.get('/members/', { params: { search } }).then((res) => setMembers(res.data.results || res.data));
  };

  useEffect(() => { load(); }, [search]);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (m) => { setEditing(m); setForm(m); setModalOpen(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await client.patch(`/members/${editing.id}/`, form);
      } else {
        await client.post('/members/', form);
      }
      setModalOpen(false);
      load();
    } catch (err) {
      alert('Failed to save member. Please check the fields.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Remove this member from the congregation registry?')) return;
    await client.delete(`/members/${id}/`);
    load();
  };

  return (
    <div>
      <PageHeader title="Congregation Members" subtitle={`${members.length} members registered`} actionLabel="Add Member" onAction={openCreate} />

      <div className="relative mb-5 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-night-300" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, phone, CNIC..."
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-night-100 bg-white focus:outline-none focus:ring-2 focus:ring-brass-400/40"
        />
      </div>

      <div className="bg-white rounded-2xl border border-night-100/60 overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-night-50 text-night-400 text-xs uppercase tracking-wider">
            <tr>
              <th className="text-left px-6 py-3 font-medium">Name</th>
              <th className="text-left px-6 py-3 font-medium">Contact</th>
              <th className="text-left px-6 py-3 font-medium">Membership</th>
              <th className="text-left px-6 py-3 font-medium">Status</th>
              <th className="text-left px-6 py-3 font-medium">Family Size</th>
              <th className="text-right px-6 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.id} className="border-t border-night-100/60 hover:bg-night-50/50 transition">
                <td className="px-6 py-3.5">
                  <p className="font-medium text-night-600">{m.full_name}</p>
                  <p className="text-xs text-night-300">{m.occupation}</p>
                </td>
                <td className="px-6 py-3.5">
                  <p className="flex items-center gap-1.5 text-night-500"><Phone className="w-3.5 h-3.5" />{m.phone}</p>
                  {m.email && <p className="flex items-center gap-1.5 text-night-300 text-xs mt-0.5"><Mail className="w-3 h-3" />{m.email}</p>}
                </td>
                <td className="px-6 py-3.5 capitalize text-night-500">{m.membership_type}</td>
                <td className="px-6 py-3.5"><Badge tone={statusTone[m.status]}>{m.status}</Badge></td>
                <td className="px-6 py-3.5 text-night-500">{m.family_members_count}</td>
                <td className="px-6 py-3.5 text-right">
                  <button onClick={() => openEdit(m)} className="p-2 hover:bg-night-100 rounded-lg text-night-400 hover:text-night-600 transition">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(m.id)} className="p-2 hover:bg-red-50 rounded-lg text-night-400 hover:text-red-600 transition">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {members.length === 0 && (
              <tr><td colSpan={6} className="text-center py-10 text-night-300">No members found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <Modal title={editing ? 'Edit Member' : 'Add New Member'} onClose={() => setModalOpen(false)} wide>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <Field label="Full Name" value={form.full_name} onChange={(v) => setForm({ ...form, full_name: v })} required span2 />
            <Field label="Father's Name" value={form.father_name} onChange={(v) => setForm({ ...form, father_name: v })} />
            <Field label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} required />
            <Field label="Email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} type="email" />
            <Field label="Occupation" value={form.occupation} onChange={(v) => setForm({ ...form, occupation: v })} />
            <Field label="Family Members" value={form.family_members_count} onChange={(v) => setForm({ ...form, family_members_count: v })} type="number" />
            <div>
              <label className="block text-xs font-medium text-night-400 uppercase tracking-wider mb-1.5">Membership Type</label>
              <select value={form.membership_type} onChange={(e) => setForm({ ...form, membership_type: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-night-100 focus:outline-none focus:ring-2 focus:ring-brass-400/40">
                <option value="regular">Regular</option>
                <option value="family">Family</option>
                <option value="lifetime">Lifetime</option>
                <option value="honorary">Honorary</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-night-400 uppercase tracking-wider mb-1.5">Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-night-100 focus:outline-none focus:ring-2 focus:ring-brass-400/40">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
            <Field label="Address" value={form.address} onChange={(v) => setForm({ ...form, address: v })} span2 />
            <div className="col-span-2 flex justify-end gap-3 mt-2">
              <button type="button" onClick={() => setModalOpen(false)} className="px-5 py-2.5 rounded-lg border border-night-200 text-night-500 hover:bg-night-50 transition">Cancel</button>
              <button type="submit" disabled={saving} className="px-5 py-2.5 rounded-lg bg-night-500 text-ivory hover:bg-night-600 transition disabled:opacity-60">
                {saving ? 'Saving...' : 'Save Member'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

function Field({ label, value, onChange, type = 'text', required, span2 }) {
  return (
    <div className={span2 ? 'col-span-2' : ''}>
      <label className="block text-xs font-medium text-night-400 uppercase tracking-wider mb-1.5">{label}</label>
      <input
        type={type}
        value={value || ''}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2.5 rounded-lg border border-night-100 focus:outline-none focus:ring-2 focus:ring-brass-400/40"
      />
    </div>
  );
}
