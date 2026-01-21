CREATE TABLE "courses" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(50) NOT NULL,
	CONSTRAINT "courses_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "years" (
	"id" serial PRIMARY KEY NOT NULL,
	"value" varchar(10) NOT NULL,
	CONSTRAINT "years_value_unique" UNIQUE("value")
);
--> statement-breakpoint
ALTER TABLE "attendance" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "users" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "attendance" CASCADE;--> statement-breakpoint
DROP TABLE "users" CASCADE;--> statement-breakpoint
ALTER TABLE "grades" RENAME TO "branches";--> statement-breakpoint
ALTER TABLE "branches" RENAME COLUMN "grade" TO "name";--> statement-breakpoint
ALTER TABLE "students" RENAME COLUMN "grade_id" TO "email";--> statement-breakpoint
ALTER TABLE "students" RENAME COLUMN "contact" TO "phone";--> statement-breakpoint
ALTER TABLE "branches" DROP CONSTRAINT "grades_grade_unique";--> statement-breakpoint
ALTER TABLE "students" DROP CONSTRAINT "students_grade_id_grades_id_fk";
--> statement-breakpoint
ALTER TABLE "students" ALTER COLUMN "name" SET DATA TYPE varchar(50);--> statement-breakpoint
ALTER TABLE "students" ADD COLUMN "course_id" integer;--> statement-breakpoint
ALTER TABLE "students" ADD COLUMN "branch_id" integer;--> statement-breakpoint
ALTER TABLE "students" ADD COLUMN "year_id" integer;--> statement-breakpoint
ALTER TABLE "students" ADD CONSTRAINT "students_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "students" ADD CONSTRAINT "students_branch_id_branches_id_fk" FOREIGN KEY ("branch_id") REFERENCES "public"."branches"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "students" ADD CONSTRAINT "students_year_id_years_id_fk" FOREIGN KEY ("year_id") REFERENCES "public"."years"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "branches" ADD CONSTRAINT "branches_name_unique" UNIQUE("name");--> statement-breakpoint
ALTER TABLE "students" ADD CONSTRAINT "students_email_unique" UNIQUE("email");