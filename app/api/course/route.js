import { db } from "@/utils/db";
import { courses } from "@/utils/schema";
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
