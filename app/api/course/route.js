import { db } from "@/utils/db";
import { courses } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const result = await db.select().from(courses);
    return NextResponse.json({ result });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to fetch courses",
        details: error.message,
      },
      {
        status: 500,
      },
    );
  }
}

export async function POST(req) {
  try {
    const { name } = await req.json();
    const result = await db.insert(courses).values({ name }).returning();
    return NextResponse.json({ result });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to create course",
        details: error.message,
      },
      {
        status: 500,
      },
    );
  }
}

export async function PUT(req) {
  try {
    const { id, name } = await req.json();
    const result = await db
      .update(courses)
      .set({ name })
      .where(eq(courses.id, id))
      .returning();
    return NextResponse.json({ result });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to update course",
        details: error.message,
      },
      {
        status: 500,
      },
    );
  }
}

export async function DELETE(req) {
  try {
    const { id } = await req.json();
    const result = await db
      .delete(courses)
      .where(eq(courses.id, id))
      .returning();
    return NextResponse.json({ result });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to delete course",
        details: error.message,
      },
      {
        status: 500,
      },
    );
  }
}
