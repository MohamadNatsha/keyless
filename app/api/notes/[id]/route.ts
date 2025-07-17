import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '../db';
import { z } from 'zod';

const idSchema = z.object({ id: z.string().regex(/^\d+$/, 'Invalid id') });
const noteSchema = z.object({
  title: z.string(),
  content: z.string(),
});

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const db = await getDb();
  const { id } = await params;
  const parseResult = idSchema.safeParse({ id });
  if (!parseResult.success) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  }
  const note = await db.selectFrom('notes').selectAll().where('id', '=', Number(id)).executeTakeFirst();
  if (!note) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(note);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const db = await getDb();
  const { id } = await params;
  // Validate the id
  const parseId = idSchema.safeParse({ id });
  if (!parseId.success) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  }
  // Validate the body
  const body = await req.json();
  const parseBody = noteSchema.safeParse(body);
  if (!parseBody.success) {
    return NextResponse.json({ error: parseBody.error.flatten() }, { status: 400 });
  }
  const { title, content } = parseBody.data;
  const now = new Date().toISOString();
  await db.updateTable('notes')
    .set({ title, content, updatedAt: now })
    .where('id', '=', Number(id))
    .execute();
  const note = await db.selectFrom('notes').selectAll().where('id', '=', Number(id)).executeTakeFirst();
  return NextResponse.json(note);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const db = await getDb();
  const { id } = await params;
  // Validate the id
  const parseResult = idSchema.safeParse({ id });
  if (!parseResult.success) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  }
  await db.deleteFrom('notes').where('id', '=', Number(id)).execute();
  return NextResponse.json({ success: true });
} 