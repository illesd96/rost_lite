CREATE TABLE IF NOT EXISTS "user_addresses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"type" text NOT NULL,
	"is_default" boolean DEFAULT false NOT NULL,
	"is_company" boolean DEFAULT false NOT NULL,
	"company_name" text,
	"contact_person" text,
	"tax_number" text,
	"vat_number" text,
	"registration_number" text,
	"full_name" text NOT NULL,
	"email" text,
	"phone" text,
	"country" text DEFAULT 'Hungary' NOT NULL,
	"postal_code" text NOT NULL,
	"city" text NOT NULL,
	"district" text,
	"street_address" text NOT NULL,
	"house_number" text,
	"floor" text,
	"door" text,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_addresses" ADD CONSTRAINT "user_addresses_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
