import { db } from "@/utils/db";
import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // 1. Check if 'status' column exists, if not add it
    // 2. Remove 'present' column if it exists
    // Using a transaction for safety
    await db.execute(sql`
      DO $$ 
      BEGIN 
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='attendance' AND column_name='status') THEN
          ALTER TABLE attendance ADD COLUMN status varchar(20) DEFAULT 'Present' NOT NULL;
        END IF;

        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='attendance' AND column_name='present') THEN
          -- Migrate data: if present was true -> 'Present', if false -> 'Absent'
          UPDATE attendance SET status = 'Present' WHERE present = true;
          UPDATE attendance SET status = 'Absent' WHERE present = false;
          ALTER TABLE attendance DROP COLUMN present;
        END IF;
      END $$;
    `);

    return NextResponse.json({ message: "Database schema updated successfully!" });
  } catch (error) {
    console.error("Migration Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
