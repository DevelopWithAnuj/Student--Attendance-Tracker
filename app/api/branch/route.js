import { db } from "@/utils/db";
import { branches } from "@/utils/schema";
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
