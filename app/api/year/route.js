import { db } from "@/utils/db";
import { years } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const result = await db.select().from(years);
    return NextResponse.json({ result });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to fetch years",
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
    const { value } = await req.json();
    const result = await db.insert(years).values({ value }).returning();
    return NextResponse.json({ result });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to create year",
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
    const { id, value } = await req.json();
    const result = await db
      .update(years)
      .set({ value })
      .where(eq(years.id, id))
      .returning();
    return NextResponse.json({ result });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to update year",
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
      .delete(years)
      .where(eq(years.id, id))
      .returning();
    return NextResponse.json({ result });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to delete year",
        details: error.message,
      },
      {
        status: 500,
      },
    );
  }
}
