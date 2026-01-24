import { db } from "@/utils/db";
import { attendance, students, branches, courses, years } from "@/utils/schema";
import { NextResponse } from "next/server";
import { eq, and, count, gte, lte } from "drizzle-orm";
import moment from "moment";

export async function GET(req) {
    const searchParams = req.nextUrl.searchParams;
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

    try {
        const summary = await db
            .select({
                totalAttendanceRecords: count(attendance.id),
                totalPresentMarks: count(eq(attendance.present, true)),
                totalAbsentMarks: count(eq(attendance.present, false)),
            })
            .from(attendance)
            .leftJoin(students, eq(students.id, attendance.studentId))
            .leftJoin(branches, eq(branches.id, students.branchId))
            .leftJoin(courses, eq(courses.id, students.courseId))
            .leftJoin(years, eq(years.id, students.yearId))
            .where(conditions.length > 0 ? and(...conditions) : undefined);

        return NextResponse.json({ result: summary[0] || {} });
    } catch (error) {
        console.error("Dashboard API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}