CREATE TABLE IF NOT EXISTS "shop_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" varchar(100) NOT NULL,
	"value" text NOT NULL,
	"label" text,
	"description" text,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "shop_settings_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "waitlist_applications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_name" text NOT NULL,
	"contact_name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"delivery_address" text,
	"office_headcount" integer,
	"quantity_min" integer,
	"quantity_max" integer,
	"accepted_terms" boolean DEFAULT false NOT NULL,
	"status" varchar(20) DEFAULT 'pending',
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "order_payment_groups" ADD COLUMN "bill_created" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "order_payment_groups" ADD COLUMN "bill_created_at" timestamp;--> statement-breakpoint
ALTER TABLE "order_payment_groups" ADD COLUMN "bill_sent" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "order_payment_groups" ADD COLUMN "bill_sent_at" timestamp;--> statement-breakpoint
ALTER TABLE "order_payment_groups" ADD COLUMN "bill_number" varchar(50);--> statement-breakpoint
ALTER TABLE "order_payment_groups" ADD COLUMN "bill_notes" text;