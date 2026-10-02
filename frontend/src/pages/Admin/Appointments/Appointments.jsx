import { useEffect, useMemo, useState } from 'react';
import { FaMagnifyingGlass, FaRotate, FaTrash, FaXmark, FaEnvelope } from 'react-icons/fa6';
import { listAppointments, listContent, removeAppointment, updateAppointment, resendAppointmentStatusEmail } from '@/services/cms';

const statuses = [
  ['pending', 'Pending'],
  ['confirmed', 'Confirmed'],
  ['rescheduled', 'Rescheduled'],
  ['completed', 'Completed'],
  ['cancelled', 'Cancelled'],
  ['no_show', 'No show'],
];

function formatDate(value) {
  if (!value) return '—';
  return new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(`${value}T00:00:00`));
}

export default function AdminAppointments() {
  const [items, setItems] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [selected, setSelected] = useState(null);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [department, setDepartment] = useState('all');
  const [date, setDate] = useState('');
  const [error, setError] = useState('');

  const refresh = async () => {
    setLoading(true);
    setError('');
    try {
      const [appointments, doctorList] = await Promise.all([
        listAppointments(),
        listContent('doctors', { includeDrafts: true }),
      ]);
      setItems(appointments);
      setDoctors(doctorList);
    } catch (err) {
      setError(err.message || 'Unable to load appointments.');
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const departments = useMemo(() => [...new Set(items.map((item) => item.department).filter(Boolean))].sort(), [items]);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return [...items]
      .filter((item) => status === 'all' || item.status === status)
      .filter((item) => department === 'all' || item.department === department)
      .filter((item) => !date || item.appointment_date === date)
      .filter((item) => !normalized || [item.patient_name, item.phone, item.email, item.department].filter(Boolean).some((value) => value.toLowerCase().includes(normalized)))
      .sort((a, b) => `${a.appointment_date} ${a.appointment_time || ''}`.localeCompare(`${b.appointment_date} ${b.appointment_time || ''}`));
  }, [items, query, status, department, date]);

  const change = async (id, changes) => {
    setSavingId(id);
    setError('');
    try {
      const updated = await updateAppointment(id, changes);
      setItems((prev) => prev.map((item) => item.id === id ? updated : item));
      setSelected((prev) => prev?.id === id ? updated : prev);
    } catch (err) {
      setError(err.message || 'Unable to update appointment.');
    } finally {
      setSavingId(null);
    }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this appointment request? This cannot be undone.')) return;
    setSavingId(id);
    try {
      await removeAppointment(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
      setSelected(null);
    } catch (err) {
      setError(err.message || 'Unable to delete appointment.');
    } finally {
      setSavingId(null);
    }
  };

  const resendEmail = async (id) => {
    setSavingId(id);
    setError('');
    try {
      const result = await resendAppointmentStatusEmail(id);
      setError(result.status === 'sent' ? 'Appointment email sent successfully.' : (result.message || 'Email was not sent.'));
    } catch (err) {
      setError(err.message || 'Unable to send appointment email.');
    } finally {
      setSavingId(null);
    }
  };

  return (
    <section>
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[.2em] text-[hsl(var(--primary))]">Patient requests</p>
          <h2 className="mt-2 font-display text-5xl">Appointments</h2>
          <p className="mt-3 text-sm text-muted-foreground">Review, filter, update and manage patient appointment requests.</p>
        </div>
        <button onClick={refresh} disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold disabled:opacity-50"><FaRotate className={loading ? 'animate-spin' : ''} /> Refresh</button>
      </div>

      {error && <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <div className="mb-5 grid gap-3 rounded-2xl border bg-card p-4 md:grid-cols-2 xl:grid-cols-4">
        <label className="relative block text-xs font-semibold md:col-span-2 xl:col-span-1">
          Search
          <FaMagnifyingGlass className="absolute left-3 top-9 text-muted-foreground" size={13} />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Patient, phone, email..." className="mt-2 w-full rounded-xl border bg-background py-2.5 pl-9 pr-3 text-sm font-normal outline-none focus:ring-2 focus:ring-[hsl(var(--primary)/.25)]" />
        </label>
        <label className="text-xs font-semibold">Status<select value={status} onChange={(e) => setStatus(e.target.value)} className="mt-2 w-full rounded-xl border bg-background px-3 py-2.5 text-sm font-normal"><option value="all">All statuses</option>{statuses.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
        <label className="text-xs font-semibold">Department<select value={department} onChange={(e) => setDepartment(e.target.value)} className="mt-2 w-full rounded-xl border bg-background px-3 py-2.5 text-sm font-normal"><option value="all">All departments</option>{departments.map((value) => <option key={value} value={value}>{value}</option>)}</select></label>
        <label className="text-xs font-semibold">Appointment date<input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-2 w-full rounded-xl border bg-background px-3 py-2.5 text-sm font-normal" /></label>
      </div>

      <div className="mb-4 flex items-center justify-between text-xs text-muted-foreground"><span>{filtered.length} request{filtered.length === 1 ? '' : 's'}</span><button onClick={() => { setQuery(''); setStatus('all'); setDepartment('all'); setDate(''); }} className="font-semibold text-[hsl(var(--primary))]">Clear filters</button></div>

      <div className="overflow-hidden rounded-2xl border bg-card">
        <div className="overflow-x-auto"><table className="w-full min-w-[1120px] text-left text-sm"><thead className="bg-muted/60 text-xs uppercase tracking-wider"><tr><th className="p-4">Patient</th><th className="p-4">Department / doctor</th><th className="p-4">Appointment</th><th className="p-4">Contact</th><th className="p-4">Status</th><th className="p-4">Actions</th></tr></thead><tbody>
          {!loading && filtered.map((item) => {
            const doctor = doctors.find((entry) => entry.id === item.doctor_id);
            return <tr key={item.id} className="border-t align-top hover:bg-muted/20">
              <td className="p-4"><button onClick={() => setSelected(item)} className="text-left"><strong className="hover:text-[hsl(var(--primary))]">{item.patient_name}</strong><div className="mt-1 max-w-[220px] text-xs text-muted-foreground">{item.notes || 'No patient note.'}</div></button></td>
              <td className="p-4"><div>{item.department || 'General care'}</div><div className="mt-1 text-xs text-muted-foreground">{doctor?.name || 'Doctor not assigned'}</div></td>
              <td className="p-4 whitespace-nowrap"><strong>{formatDate(item.appointment_date)}</strong>{item.appointment_time ? <div className="text-xs text-muted-foreground">{item.appointment_time}</div> : null}</td>
              <td className="p-4"><a className="block font-semibold text-[hsl(var(--primary))]" href={`tel:${item.phone}`}>{item.phone}</a>{item.email && <a className="mt-1 block text-xs text-[hsl(var(--primary))]" href={`mailto:${item.email}`}>{item.email}</a>}</td>
              <td className="p-4"><select disabled={savingId === item.id} value={item.status} onChange={(e) => change(item.id, { status: e.target.value })} className="rounded-lg border bg-background px-3 py-2 text-xs"><option value="pending">Pending</option><option value="confirmed">Confirmed</option><option value="rescheduled">Rescheduled</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option><option value="no_show">No show</option></select></td>
              <td className="p-4"><div className="flex gap-2"><button onClick={() => setSelected(item)} className="rounded-lg border px-3 py-2 text-xs font-semibold">View</button><button disabled={savingId === item.id} onClick={() => remove(item.id)} className="rounded-lg border px-3 py-2 text-xs font-semibold text-red-600 disabled:opacity-50"><FaTrash /></button></div></td>
            </tr>;
          })}
          {loading && <tr><td colSpan="6" className="p-12 text-center text-muted-foreground">Loading appointments...</td></tr>}
          {!loading && !filtered.length && <tr><td colSpan="6" className="p-12 text-center text-muted-foreground">No appointment requests match these filters.</td></tr>}
        </tbody></table></div>
      </div>

      {selected && <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 p-4" onMouseDown={(e) => e.target === e.currentTarget && setSelected(null)}>
        <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border bg-card shadow-2xl">
          <div className="flex items-start justify-between border-b p-5"><div><p className="font-mono text-[10px] uppercase tracking-[.2em] text-[hsl(var(--primary))]">Appointment details</p><h3 className="mt-2 text-2xl font-bold">{selected.patient_name}</h3></div><button onClick={() => setSelected(null)} className="rounded-full p-2 hover:bg-muted"><FaXmark /></button></div>
          <div className="grid gap-4 p-5 sm:grid-cols-2">
            <div><p className="text-xs text-muted-foreground">Phone</p><a href={`tel:${selected.phone}`} className="font-semibold text-[hsl(var(--primary))]">{selected.phone}</a></div>
            <div><p className="text-xs text-muted-foreground">Email</p><p className="font-semibold">{selected.email || '—'}</p></div>
            <div><p className="text-xs text-muted-foreground">Department</p><p className="font-semibold">{selected.department || 'General care'}</p></div>
            <div><p className="text-xs text-muted-foreground">Appointment</p><p className="font-semibold">{formatDate(selected.appointment_date)}{selected.appointment_time ? ` · ${selected.appointment_time}` : ''}</p></div>
            <div className="sm:col-span-2"><p className="text-xs text-muted-foreground">Patient note</p><p className="mt-1 rounded-xl bg-muted/60 p-3 text-sm">{selected.notes || 'No patient note.'}</p></div>
            <label className="text-sm font-semibold sm:col-span-2">Internal note<textarea value={selected.admin_notes || ''} onChange={(e) => setSelected((prev) => ({ ...prev, admin_notes: e.target.value }))} onBlur={(e) => change(selected.id, { admin_notes: e.target.value })} rows={4} placeholder="Visible only to authorized staff" className="mt-2 w-full rounded-xl border bg-background p-3 text-sm font-normal" /></label>
            <label className="text-sm font-semibold">Status<select value={selected.status} onChange={(e) => change(selected.id, { status: e.target.value })} className="mt-2 w-full rounded-xl border bg-background px-3 py-2 text-sm font-normal"><option value="pending">Pending</option><option value="confirmed">Confirmed</option><option value="rescheduled">Rescheduled</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option><option value="no_show">No show</option></select></label>
          </div>
          <div className="flex flex-wrap justify-between gap-2 border-t p-5"><div className="flex gap-2"><button disabled={savingId === selected.id || !selected.email} onClick={() => resendEmail(selected.id)} className="rounded-full border px-4 py-2 text-sm font-semibold disabled:opacity-50"><FaEnvelope /> Email patient</button><button onClick={() => remove(selected.id)} className="rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-600">Delete appointment</button><button onClick={() => setSelected(null)} className="rounded-full bg-[hsl(var(--primary))] px-5 py-2 text-sm font-bold text-white">Close</button></div>
        </div>
      </div>}
    </section>
  );
}
