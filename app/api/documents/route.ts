import { NextResponse } from 'next/server';
import { mongoDb } from '../../../lib/mongodb';
import { localStore } from '../../../lib/local-store';

export async function POST(request: Request) {
  const { testType = 'passport-expired' } = await request.json().catch(() => ({}));
  const cases: Record<string, { student: string; type: string; issue: string; status: string; details: string }> = {
    'passport-ok': { student: 'Ali Khan', type: 'Passport A (fake test)', issue: '', status: 'approved', details: 'Expires 10 Mar 2030' },
    'passport-expired': { student: 'Ali Khan', type: 'Passport B (fake test)', issue: 'expired', status: 'problem', details: 'Expired on 1 Jan 2025' },
    'transcript-mismatch': { student: 'Ali Khan', type: 'Transcript (fake test)', issue: 'name does not match Ali Khan', status: 'problem', details: 'Name on document: Ali Ahmed; marks 78%' },
    'ielts-ok': { student: 'Ayesha Noor', type: 'IELTS result (fake test)', issue: '', status: 'approved', details: 'Overall score 7.0' },
  };
  const test = cases[testType] ?? cases['passport-expired'];
  try { const db = mongoDb(); const student = await db.collection('students').findOne({ name: test.student }); if (!student) return NextResponse.json({ ok: false, message: 'Student not found' }, { status: 404 }); const doc = { student_id: student._id, student: test.student, type: test.type, details: test.details, status: test.status, issue: test.issue, uploaded_at: new Date() }; const inserted = await db.collection('documents').insertOne(doc); return NextResponse.json({ ok: true, document: { ...doc, _id: inserted.insertedId } }); } catch (error) { const doc = { id: `local-doc-${Date.now()}`, _id: `local-doc-${Date.now()}`, student: test.student, type: test.type, details: test.details, status: test.status, issue: test.issue, uploaded: 'Just now', uploaded_at: new Date() }; localStore.documents.unshift(doc); return NextResponse.json({ ok: true, fallback: true, document: doc }); }
}
