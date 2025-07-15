import { NextRequest, NextResponse } from 'next/server';
import { db, DatabaseSchema } from './db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search');

  let query = db.selectFrom('notes').selectAll();
  if (search) {
    // Assuming db is Kysely or similar, and supports ilike for case-insensitive search
    query = query.where(q =>
      q.or([
        q('title', 'like', `%${search}%`),
        q('content', 'like', `%${search}%`)
      ])
    );
  }
  const notes = await query.orderBy('updatedAt', 'desc').execute();
  return NextResponse.json(notes);
}

export async function POST(req: NextRequest) {
  const { title, content, themeColor } = await req.json();
  const now = new Date().toISOString();
  const insertResult = await db.insertInto('notes')
    .values({ title, content, themeColor, createdAt: now, updatedAt: now })
    .returningAll()
    .executeTakeFirst();
  return NextResponse.json(insertResult, { status: 201 });
} 