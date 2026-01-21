import { db } from "@/utils/db";
import { years } from "@/utils/schema";
import { NextResponse } from "next/server";

export async function GET(request) {
    const result=await db.select().from(years);
    return NextResponse.json({ result });
}
