ALTER TABLE "grades" RENAME COLUMN "name" TO "grade";--> statement-breakpoint
ALTER TABLE "grades" DROP CONSTRAINT "grades_name_unique";--> statement-breakpoint
ALTER TABLE "grades" ADD CONSTRAINT "grades_grade_unique" UNIQUE("grade");