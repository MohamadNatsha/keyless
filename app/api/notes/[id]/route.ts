import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '../db';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const db = await getDb();
  const note = await db.selectFrom('notes').selectAll().where('id', '=', Number(params.id)).executeTakeFirst();
  if (!note) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(note);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const db = await getDb();
  const { title, content } = await req.json();
  const now = new Date().toISOString();
  await db.updateTable('notes')
    .set({ title, content, updatedAt: now })
    .where('id', '=', Number(params.id))
    .execute();
  const note = await db.selectFrom('notes').selectAll().where('id', '=', Number(params.id)).executeTakeFirst();
  return NextResponse.json(note);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const db = await getDb();
  await db.deleteFrom('notes').where('id', '=', Number(params.id)).execute();
  return NextResponse.json({ success: true });
} 