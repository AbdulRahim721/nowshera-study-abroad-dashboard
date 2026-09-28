import { NextResponse } from 'next/server';
import { mongoDb } from '../../../lib/mongodb';
import { students, universities, documents, messages } from '../../../lib/data';

export async function POST(request: Request) {
  if (request.headers.get('x-seed-secret') !== process.env.SEED_SECRET) return NextResponse.json({ ok: false, message: 'Unauthorized' }, { status: 401 });
  try {
    const db = mongoDb();
    const existing = await db.collection('students').countDocuments();
    if (existing) return NextResponse.json({ ok: true, seeded: false, message: 'Database already has student records' });
    const studentDocs = students.map(s => ({ ...s, phone_normalized: s.phone.replace(/\s/g, ''), created_at: new Date() }));
    const insertedStudents = await db.collection('students').insertMany(studentDocs);
    const studentByName = new Map(students.map((s, i) => [s.name, insertedStudents.insertedIds[i]]));
    await db.collection('universities').insertMany(universities.map(u => ({ ...u, created_at: new Date() })));
    await db.collection('documents').insertMany(documents.map(d => ({ ...d, student_id: studentByName.get(d.student), uploaded_at: new Date(d.uploaded) })));
    await db.collection('messages').insertMany(messages.map(m => ({ ...m, student_id: studentByName.get(m.student), created_at: new Date() })));
    return NextResponse.json({ ok: true, seeded: true, students: students.length, universities: universities.length });
  } catch (error) { return NextResponse.json({ ok: false, message: error instanceof Error ? error.message : 'Seed failed' }, { status: 503 }); }
}
