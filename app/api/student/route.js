import { db } from '@/utils/db';
import { students, branches, courses, years } from '@/utils/schema';
import { eq, and, sql } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const data = await req.json();

    if (!data?.email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // check duplicate email (case-insensitive)
    const [existing] = await db
      .select()
      .from(students)
      .where(eq(sql`lower(${students.email})`, data.email.toLowerCase()));
    if (existing) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 409 });
    }

    const [created] = await db
      .insert(students)
      .values({
        name: data?.name ?? null,
        email: data.email.toLowerCase(),
        phone: data?.phone ?? null,
        courseId: data?.courseId ? Number(data.courseId) : null,
        branchId: data?.branchId ? Number(data.branchId) : null,
        yearId: data?.yearId ? Number(data.yearId) : null,
        address: data?.address ?? null,
      })
      .returning();

    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    // handle Postgres unique-constraint error
    const pgCode = err?.cause?.code || err?.cause?.severity;
    if (err?.cause?.code === '23505' || String(err?.cause?.detail || '').includes('already exists')) {
      return NextResponse.json({ error: 'Duplicate entry' }, { status: 409 });
    }
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const branch = searchParams.get("branch");
  const course = searchParams.get("course");
  const year = searchParams.get("year");

  const conditions = [];
  if (branch) {
    conditions.push(eq(branches.name, branch));
  }
  if (course) {
    conditions.push(eq(courses.name, course));
  }
  if (year) {
    conditions.push(eq(years.value, year));
  }

  const query = db
    .select({
      id: students.id,
      name: students.name,
      email: students.email,
      phone: students.phone,
      address: students.address,
      course: courses.name,
      branch: branches.name,
      year: years.value,
    })
    .from(students)
    .leftJoin(branches, eq(students.branchId, branches.id))
    .leftJoin(courses, eq(students.courseId, courses.id))
    .leftJoin(years, eq(students.yearId, years.id));

  if (conditions.length > 0) {
    query.where(and(...conditions));
  }

  const result = await query;
  return NextResponse.json({ result });
}

export async function DELETE(req){
  const searchParams = req.nextUrl.searchParams;
  const id = searchParams.get('id');

  const result = await db.delete(students)
  .where(eq(students.id, Number(id)));

  return NextResponse.json({ result });
}
