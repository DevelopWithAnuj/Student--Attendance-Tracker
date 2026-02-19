import { db } from "@/utils/db";
import { branches } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const result = await db.select().from(branches);
    return NextResponse.json({ result });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to fetch branches",
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
    const result = await db.insert(branches).values({ name }).returning();
    return NextResponse.json({ result });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to create branch",
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
      .update(branches)
      .set({ name })
      .where(eq(branches.id, id))
      .returning();
    return NextResponse.json({ result });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to update branch",
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
      .delete(branches)
      .where(eq(branches.id, id))
      .returning();
    return NextResponse.json({ result });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to delete branch",
        details: error.message,
      },
      {
        status: 500,
      },
    );
  }
}
