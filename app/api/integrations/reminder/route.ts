import { NextResponse } from 'next/server';
import { mongoDb } from '../../../../lib/mongodb';
import { localStore } from '../../../../lib/local-store';

export async function POST(request: Request) {
  if (process.env.N8N_SHARED_SECRET && request.headers.get('x-n8n-secret') !== process.env.N8N_SHARED_SECRET) return NextResponse.json({ ok: false, message: 'Unauthorized' }, { status: 401 });
  try {
    const db = mongoDb();
    const quiet = await db.collection('students').findOne({ phone: '0346 2223344' });
    if (!quiet) return NextResponse.json({ ok: false, message: 'Hamza test student not found' }, { status: 404 });
    const existing = await db.collection('messages').findOne({ student_id: quiet._id, approval_status: 'pending', type: 'follow_up' });
    if (existing) return NextResponse.json({ ok: true, created: false, message: existing });
    const message = { student_id: quiet._id, student: quiet.name, sender: 'ai', type: 'follow_up', message: 'Assalam-o-alaikum Hamza, aap ka follow-up due hai. Kya aap apne IELTS test ki date confirm kar sakte hain?', approval_status: 'pending', created_at: new Date() };
    const inserted = await db.collection('messages').insertOne(message);
    return NextResponse.json({ ok: true, created: true, message: { ...message, _id: inserted.insertedId } });
  } catch (error) { const quiet = localStore.students.find(s => s.name === 'Hamza Iqbal'); if (!quiet) return NextResponse.json({ ok: false, message: 'Hamza test student not found' }, { status: 404 }); const existing = localStore.messages.find(m => m.student === quiet.name && (m.approvalStatus ?? m.approval_status) === 'pending' && m.type === 'follow_up'); if (existing) return NextResponse.json({ ok: true, created: false, fallback: true, message: existing }); const message = { id: `local-reminder-${Date.now()}`, _id: `local-reminder-${Date.now()}`, student: quiet.name, sender: 'ai', type: 'follow_up', message: 'Assalam-o-alaikum Hamza, aap ka follow-up due hai. Kya aap apne IELTS test ki date confirm kar sakte hain?', approvalStatus: 'pending', approval_status: 'pending', created: 'Just now', created_at: new Date() }; localStore.messages.unshift(message); return NextResponse.json({ ok: true, created: true, fallback: true, message }); }
}
