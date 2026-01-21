import { db } from "@/utils/db";
import { courses } from "@/utils/schema";
import { NextResponse } from "next/server";

export async function GET() {
    const result=await db.select().from(courses);
    return NextResponse.json({ result });
}
