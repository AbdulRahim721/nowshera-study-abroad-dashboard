import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { mongoDb } from '../../../../lib/mongodb';

export async function POST(request: Request) {
  if (process.env.N8N_SHARED_SECRET && request.headers.get('x-n8n-secret') !== process.env.N8N_SHARED_SECRET) return NextResponse.json({ ok: false, message: 'Unauthorized' }, { status: 401 });
  const { message_id } = await request.json().catch(() => ({}));
  if (!ObjectId.isValid(message_id)) return NextResponse.json({ ok: false, message: 'Invalid message_id' }, { status: 400 });
  try {
    const result = await mongoDb().collection('messages').findOneAndUpdate(
      { _id: new ObjectId(message_id), approval_status: 'pending' },
      { $set: { approval_status: 'sent', sent_at: new Date(), approved_at: new Date() } },
      { returnDocument: 'after' },
    );
    if (!result) return NextResponse.json({ ok: false, message: 'Message already processed or not found' }, { status: 409 });
    return NextResponse.json({ ok: true, message: result });
  } catch (error) {
    console.error('Approval integration failed', error instanceof Error ? error.message : 'unknown');
    return NextResponse.json({ ok: false, message: 'MongoDB connection failed' }, { status: 503 });
  }
}
