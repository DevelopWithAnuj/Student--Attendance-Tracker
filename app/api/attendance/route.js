import { db } from "@/utils/db";
import { attendance, branches, courses, students, years } from "@/utils/schema";
import { NextResponse } from "next/server";
import { eq, and, gte, lte } from "drizzle-orm";
import moment from "moment";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const branchParam = searchParams.get("branch");
    const courseParam = searchParams.get("course");
    const yearParam = searchParams.get("year");
    const monthParam = searchParams.get("month");

    const conditions = [];

    if (branchParam) conditions.push(eq(branches.name, branchParam));
    if (courseParam) conditions.push(eq(courses.name, courseParam));
    if (yearParam) conditions.push(eq(years.value, yearParam));

    if (monthParam) {
      const [m, y] = monthParam.split("/");
      const startDate = moment(`${y}-${m}-01`).format("YYYY-MM-DD");
      const endDate = moment(startDate).endOf("month").format("YYYY-MM-DD");
      conditions.push(
        and(gte(attendance.date, startDate), lte(attendance.date, endDate))
      );
    }

    const query = db
      .select({
        students: {
          id: students.id,
          name: students.name,
          email: students.email,
          phone: students.phone,
          address: students.address,
          course: courses.name,
          branch: branches.name,
          year: years.value,
        },
        attendance: {
          id: attendance.id,
          date: attendance.date,
          present: attendance.present,
        },
      })
      .from(attendance)
      .innerJoin(students, eq(students.id, attendance.studentId))
      .leftJoin(branches, eq(branches.id, students.branchId))
      .leftJoin(courses, eq(courses.id, students.courseId))
      .leftJoin(years, eq(years.id, students.yearId));

    if (conditions.length > 0) {
      query.where(and(...conditions));
    }

    const attendances = await query;

    return NextResponse.json({ result: attendances });
  } catch (error) {
    console.error("Attendance API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  const data = await req.json();

  try {
    const [existing] = await db
      .select()
      .from(attendance)
      .where(
        and(
          eq(attendance.studentId, data.studentId),
          eq(attendance.date, data.date)
        )
      );

    if (existing) {
      const [updated] = await db
        .update(attendance)
        .set({ present: data.present })
        .where(eq(attendance.id, existing.id))
        .returning();
      return NextResponse.json({ data: updated });
    }

    const [created] = await db.insert(attendance).values(data).returning();
    return NextResponse.json({ data: created }, { status: 201 });
  } catch (error) {
    console.error("Attendance POST Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
