ALTER TABLE "students" ALTER COLUMN "name" SET DATA TYPE varchar(20);--> statement-breakpoint
ALTER TABLE "students" ALTER COLUMN "address" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "students" ALTER COLUMN "contact" SET NOT NULL;