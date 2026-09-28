import { students as seedStudents, universities as seedUniversities, documents as seedDocuments, messages as seedMessages } from './data';
type Store = { students: any[]; universities: any[]; documents: any[]; messages: any[] };
const root = globalThis as unknown as { copyDownloadLocalStore?: Store };
export const localStore: Store = root.copyDownloadLocalStore ?? { students: seedStudents.map(x => ({ ...x, _id: x.id })), universities: seedUniversities.map(x => ({ ...x, _id: x.id })), documents: seedDocuments.map(x => ({ ...x, _id: x.id })), messages: seedMessages.map(x => ({ ...x, _id: x.id })) };
if (!root.copyDownloadLocalStore) root.copyDownloadLocalStore = localStore;
