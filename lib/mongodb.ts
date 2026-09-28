import { MongoClient } from 'mongodb';

const globalForMongo = globalThis as unknown as { mongoClient?: MongoClient };
export function mongoDb() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI is not configured');
  const client = globalForMongo.mongoClient ?? new MongoClient(uri);
  if (process.env.NODE_ENV !== 'production') globalForMongo.mongoClient = client;
  return client.db(process.env.MONGODB_DB || 'copydownload');
}
