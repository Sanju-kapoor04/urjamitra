import mongoose from 'mongoose';
import { db, initDb } from './database.js';

let isMongoConnected = false;

export async function connectDatabase() {
  // Always initialize SQLite for zero-config offline reliability
  initDb();

  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/urjamitra';
  try {
    // Attempt Mongoose connection with 2s timeout
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 2000 });
    isMongoConnected = true;
    console.log('[UrjaMitra Database] Connected to MongoDB database at:', mongoUri);
  } catch (err: any) {
    isMongoConnected = false;
    console.warn('[UrjaMitra Database] MongoDB service unavailable, utilizing embedded database engine.');
  }
}

export function getStorageMode(): 'mongodb' | 'sqlite' {
  return isMongoConnected ? 'mongodb' : 'sqlite';
}
