import { db } from "@/utils/db";
import { attendance, branches, courses, students, years } from "@/utils/schema";
import { NextResponse } from "next/server";
import { eq, and, gte, lte } from "drizzle-orm";
import moment from "moment";
import Papa from "papaparse";

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
        studentName: students.name,
        studentEmail: students.email,
        studentPhone: students.phone,
        course: courses.name,
        branch: branches.name,
        year: years.value,
        date: attendance.date,
        present: attendance.present,
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

    const csv = Papa.unparse(attendances);

    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": "attachment; filename=attendance.csv",
      },
    });
  } catch (error) {
    console.error("CSV Export Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
