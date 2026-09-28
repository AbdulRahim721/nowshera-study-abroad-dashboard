import { NextResponse } from 'next/server';
import { localStore } from '../../../lib/local-store';
function validId(id: string) { return /^[a-f\d]{24}$/i.test(id) || id.startsWith('local-'); }
function markLocal(id: string) { const row = localStore.messages.find(m => String(m.id ?? m._id) === id); if (row && (row.approvalStatus ?? row.approval_status) === 'pending') { row.approvalStatus = 'sent'; row.approval_status = 'sent'; row.sent_at = new Date(); return true; } return false; }
export async function POST(request: Request) {
  const id = new URL(request.url).searchParams.get('message_id') || '';
  if (!validId(id)) return NextResponse.json({ ok: false, message: 'Invalid message_id.' }, { status: 400 });
  const base = process.env.N8N_BASE_URL?.replace(/\/$/, '');
  try {
    if (base) { const response = await fetch(`${base}/webhook/approve-message?message_id=${encodeURIComponent(id)}`, { method: 'GET', cache: 'no-store' }); const text = await response.text(); let body: unknown; try { body = JSON.parse(text); } catch { body = { raw: text }; } if (response.ok) { markLocal(id); return NextResponse.json({ ok: true, status: response.status, result: body }); } }
    if (markLocal(id)) return NextResponse.json({ ok: true, fallback: true, message: 'Approved once locally because n8n was unavailable.' });
    return NextResponse.json({ ok: false, message: 'Could not reach n8n approval webhook.' }, { status: 502 });
  } catch { if (markLocal(id)) return NextResponse.json({ ok: true, fallback: true, message: 'Approved once locally because n8n was unavailable.' }); return NextResponse.json({ ok: false, message: 'Could not reach n8n approval webhook.' }, { status: 502 }); }
}
