import { db } from '@/utils/db';
import { sql } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    // This is a dangerous operation, should be protected in a real app
    const result = await db.execute(sql`SELECT setval(pg_get_serial_sequence('students', 'id'), COALESCE((SELECT MAX(id)+1 FROM students), 1), false)`);
    return NextResponse.json({ message: 'Sequence synchronized successfully', result });
  } catch (error) {
    console.error('Error synchronizing sequence:', error);
    return NextResponse.json({ error: 'Failed to synchronize sequence', details: error.message }, { status: 500 });
  }
}
