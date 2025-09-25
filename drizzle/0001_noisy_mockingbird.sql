CREATE TABLE IF NOT EXISTS "delivery_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"delivery_days" text DEFAULT '["monday","wednesday"]' NOT NULL,
	"weeks_in_advance" integer DEFAULT 4 NOT NULL,
	"cutoff_hours" integer DEFAULT 24 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "delivery_date" timestamp;