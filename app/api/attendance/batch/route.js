import { db } from "@/utils/db";
import { attendance } from "@/utils/schema";
import { NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";

export async function POST(req) {
  const data = await req.json();

  try {
    await db.transaction(async (tx) => {
      for (const item of data) {
        const [existing] = await tx
          .select()
          .from(attendance)
          .where(
            and(
              eq(attendance.studentId, item.studentId),
              eq(attendance.date, item.date)
            )
          );

        if (existing) {
          await tx
            .update(attendance)
            .set({ present: item.present })
            .where(eq(attendance.id, existing.id));
        } else {
          await tx.insert(attendance).values(item);
        }
      }
    });

    return NextResponse.json({ message: "Attendance saved successfully" });
  } catch (error) {
    console.error("Attendance Batch POST Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

