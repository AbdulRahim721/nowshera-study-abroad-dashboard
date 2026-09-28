import { NextResponse } from 'next/server';
import { mongoDb } from '../../../lib/mongodb';
import { localStore } from '../../../lib/local-store';

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const { name, email, phone, country, marks, ielts, budget } = body;
  if (!name || !phone || !country || marks === undefined) return NextResponse.json({ ok: false, message: 'Name, phone, country and marks are required.' }, { status: 400 });
  try {
    const db = mongoDb();
    const phoneNormalized = String(phone).replace(/\s/g, '');
    const update = { name, email: email || null, phone, phone_normalized: phoneNormalized, country, marks: Number(marks), ielts: ielts === '' || ielts === null ? null : Number(ielts), budget: budget || null, status: 'new', last_reply: new Date().toISOString(), updated_at: new Date() };
    const result = await db.collection('students').findOneAndUpdate({ phone_normalized: phoneNormalized }, { $set: update, $setOnInsert: { created_at: new Date() } }, { upsert: true, returnDocument: 'after' });
    return NextResponse.json({ ok: true, student: result });
  } catch (error) { const phoneNormalized = String(phone).replace(/\s/g, ''); const existing = localStore.students.find(s => (s.phone_normalized ?? String(s.phone).replace(/\s/g, '')) === phoneNormalized); const student = { ...(existing ?? {}), id: existing?.id ?? `local-${Date.now()}`, _id: existing?._id ?? `local-${Date.now()}`, name, email: email || null, phone, phone_normalized: phoneNormalized, country, marks: Number(marks), ielts: ielts === '' || ielts === null ? null : Number(ielts), budget: budget || null, status: 'new', last_reply: 'Today' }; if (existing) Object.assign(existing, student); else localStore.students.push(student); return NextResponse.json({ ok: true, fallback: true, student }); }
}
