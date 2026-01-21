import { db } from "@/utils/db";
import { branches } from "@/utils/schema";
import { NextResponse } from "next/server";

export async function GET(request) {
    const result=await db.select().from(branches);
   return NextResponse.json({ result });
}
