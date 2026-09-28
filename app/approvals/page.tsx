'use client';
import AppShell from '../../components/AppShell';
import StatusBadge from '../../components/StatusBadge';
import { messages as demoMessages } from '../../lib/data';
import { Check, X, ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Approvals() {
  const [rows, setRows] = useState<any[]>(demoMessages.filter(m => m.approvalStatus === 'pending'));
  const [notice, setNotice] = useState('');
  useEffect(() => { fetch('/api/data').then(r => r.json()).then(d => { if (d.messages) setRows(d.messages.filter((m: any) => (m.approvalStatus ?? m.approval_status) === 'pending')); }).catch(() => {}); }, []);
  async function act(id: string, kind: 'approve' | 'reject') {
    setNotice('Working…');
    const res = await fetch(`/api/${kind === 'approve' ? 'approve-message' : 'reject-message'}?message_id=${encodeURIComponent(id)}`, { method: 'POST' });
    const data = await res.json().catch(() => ({}));
    if (res.ok && data.ok) { setRows(prev => prev.filter(m => String(m.id ?? m._id) !== id)); setNotice(kind === 'approve' ? 'Message approved and queued through n8n.' : 'Message rejected.'); }
    else setNotice(data.message || 'Webhook is not connected yet. Check N8N_BASE_URL.');
  }
  return <AppShell><div className="mx-auto max-w-4xl"><div className="mb-8"><p className="text-sm font-semibold text-teal">Human-in-the-loop</p><h1 className="mt-2 text-3xl font-bold text-ink">Approvals</h1><p className="mt-2 text-slate-500">AI messages never send without staff approval.</p></div>{notice && <div className="mb-5 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">{notice}</div>}{rows.length === 0 ? <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center"><ShieldCheck className="mx-auto text-emerald-600" size={30}/><p className="mt-3 font-semibold text-emerald-800">All caught up</p></div> : <div className="space-y-5">{rows.map(m => { const id = String(m.id ?? m._id); const student = m.student ?? m.student_name ?? 'Student'; return <div key={id} className="rounded-2xl border border-amber-200 bg-white p-5 shadow-soft"><div className="flex items-start justify-between"><div><p className="font-bold text-ink">{student}</p><p className="text-xs text-slate-500">AI generated · {m.created ?? m.created_at ?? 'Now'}</p></div><StatusBadge status="pending"/></div><div className="mt-5 rounded-xl bg-slate-50 p-4 text-sm leading-7 text-slate-700">{m.message}</div><div className="mt-5 flex justify-end gap-3"><button onClick={() => act(id, 'reject')} className="inline-flex items-center gap-2 rounded-xl border border-rose-200 px-4 py-2.5 text-sm font-semibold text-rose-700"><X size={16}/> Reject</button><button onClick={() => act(id, 'approve')} className="inline-flex items-center gap-2 rounded-xl bg-teal px-4 py-2.5 text-sm font-semibold text-white"><Check size={16}/> Approve</button></div></div>; })}</div>}</div></AppShell>;
}
