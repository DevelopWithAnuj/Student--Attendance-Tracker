import { db } from "@/utils/db";
import { attendance, students, branches, courses, years } from "@/utils/schema";
import { NextResponse } from "next/server";
import { and, eq, gte, lte, sql } from "drizzle-orm";
import moment from "moment";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const branchParam = searchParams.get("branch");
    const courseParam = searchParams.get("course");
    const yearParam = searchParams.get("year");
    const monthParam = searchParams.get("month");

    if (!monthParam) {
      return NextResponse.json(
        { error: "Month parameter is required" },
        { status: 400 }
      );
    }

    const [m, y] = monthParam.split("/");
    const startDate = moment(`${y}-${m}-01`).format("YYYY-MM-DD");
    const endDate = moment(startDate).endOf("month").format("YYYY-MM-DD");

    const conditions = [
      gte(attendance.date, startDate),
      lte(attendance.date, endDate),
    ];

    const studentConditions = [];
    if (branchParam) studentConditions.push(eq(branches.name, branchParam));
    if (courseParam) studentConditions.push(eq(courses.name, courseParam));
    if (yearParam) studentConditions.push(eq(years.value, yearParam));

    const studentSubQuery = db
      .select({ id: students.id })
      .from(students)
      .leftJoin(branches, eq(branches.id, students.branchId))
      .leftJoin(courses, eq(courses.id, students.courseId))
      .leftJoin(years, eq(years.id, students.yearId))
      .where(and(...studentConditions));

    conditions.push(sql`student_id in ${studentSubQuery}`);

    const dailyAttendance = await db
      .select({
        date: attendance.date,
        presentCount: sql`count(case when present then 1 end)`,
        totalCount: sql`count(*)`,
      })
      .from(attendance)
      .where(and(...conditions))
      .groupBy(attendance.date)
      .orderBy(attendance.date);

    const trendData = dailyAttendance.map((day) => ({
      date: moment(day.date).format("DD"),
      percentage: (day.presentCount / day.totalCount) * 100,
    }));

    return NextResponse.json({ result: trendData });
  } catch (error) {
    console.error("Trend API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
