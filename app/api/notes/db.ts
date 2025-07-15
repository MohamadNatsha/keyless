import { Kysely, SqliteDialect } from 'kysely';
import Database from 'better-sqlite3';
import path from 'path';

// Define the shape of the notes table
export interface NoteTable {
  id?: number; // Make id optional for insert
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface DatabaseSchema {
  notes: NoteTable;
}

const sqliteDb = new Database(path.resolve(process.cwd(), 'notes.db'));

export const db = new Kysely<DatabaseSchema>({
  dialect: new SqliteDialect({ database: sqliteDb }),
});

// Ensure the notes table exists on app start
async function ensureNotesTable() {
  await db.schema
    .createTable('notes')
    .ifNotExists()
    .addColumn('id', 'integer', col => col.primaryKey().autoIncrement())
    .addColumn('title', 'text', col => col.notNull())
    .addColumn('content', 'text', col => col.notNull())
    .addColumn('createdAt', 'text', col => col.notNull())
    .addColumn('updatedAt', 'text', col => col.notNull())
    .execute();
  
  console.log('Tables setup completed');
}

// Immediately invoke the function
ensureNotesTable().catch(console.error); 