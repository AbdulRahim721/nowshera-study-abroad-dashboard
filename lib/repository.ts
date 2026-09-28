import { mongoDb } from './mongodb';
import { students as demoStudents, universities as demoUniversities, documents as demoDocuments, messages as demoMessages, activities as demoActivities } from './data';
import { localStore } from './local-store';

export async function getOfficeData() {
  try {
    const db = mongoDb();
    const [students, universities, documents, messages] = await Promise.all([
      db.collection('students').find({}).sort({ created_at: -1 }).toArray(),
      db.collection('universities').find({}).sort({ created_at: -1 }).toArray(),
      db.collection('documents').find({}).sort({ uploaded_at: -1 }).toArray(),
      db.collection('messages').find({}).sort({ created_at: -1 }).toArray(),
    ]);
    if (students.length || universities.length || documents.length || messages.length) {
      return { students, universities, documents, messages, activities: demoActivities, source: 'mongodb' as const };
    }
  } catch (error) {
    console.warn('MongoDB unavailable; using demo data:', error instanceof Error ? error.message : 'unknown error');
  }
  return { students: localStore.students.length ? localStore.students : demoStudents, universities: localStore.universities.length ? localStore.universities : demoUniversities, documents: localStore.documents.length ? localStore.documents : demoDocuments, messages: localStore.messages.length ? localStore.messages : demoMessages, activities: demoActivities, source: 'local-fallback' as const };
}
