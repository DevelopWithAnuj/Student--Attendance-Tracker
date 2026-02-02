import { db } from "@/utils/db";
import { years } from "@/utils/schema";
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
