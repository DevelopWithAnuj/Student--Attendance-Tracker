ALTER TABLE "attendance" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "attendance" ALTER COLUMN "created_at" DROP DEFAULT;