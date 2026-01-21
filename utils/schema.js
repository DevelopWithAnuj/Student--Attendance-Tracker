import { int } from "drizzle-orm/mysql-core";
import { pgTable, serial, text, varchar, integer, length, boolean, timestamp, date, PgInteger } from "drizzle-orm/pg-core";

// students table
export const students = pgTable("students", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 50 }).notNull(),
  email: varchar("email", { length: 100 }).notNull().unique(),
  phone: varchar("phone", { length: 15 }).notNull(),
  courseId: integer("course_id").references(() => courses.id),
  branchId: integer("branch_id").references(() => branches.id),
  yearId: integer("year_id").references(() => years.id),
  address: text("address").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }),
});

// attendance table
export const attendance = pgTable("attendance", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").references(() => students.id, { onDelete: "cascade" }),
  day: integer("day").notNull(),
  date: date("date").notNull(),
  present: boolean("present").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }),
});

// // users table
// export const users = pgTable('users', {
//   id: serial('id').primaryKey(),
//   fullName: text('full_name'),
//   phone: varchar('phone', { length: 10 }).notNull().unique(),
// });

// courses table
export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 50 }).notNull().unique(),
});

// branches table
export const branches = pgTable("branches", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 50 }).notNull().unique(),
});

// years table
export const years = pgTable("years", {
  id: serial("id").primaryKey(),
  value: varchar("value", { length: 10 }).notNull().unique(),
});
