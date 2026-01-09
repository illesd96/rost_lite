CREATE TABLE IF NOT EXISTS "modern_shop_orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"order_number" varchar(50) NOT NULL,
	"quantity" integer NOT NULL,
	"unit_price" integer NOT NULL,
	"shipping_fee" integer DEFAULT 0 NOT NULL,
	"total_amount" integer NOT NULL,
	"delivery_schedule" jsonb NOT NULL,
	"delivery_dates_count" integer NOT NULL,
	"payment_plan" varchar(20) NOT NULL,
	"payment_method" varchar(20) NOT NULL,
	"applied_coupon" varchar(50),
	"discount_amount" integer DEFAULT 0,
	"billing_data" jsonb NOT NULL,
	"status" varchar(20) DEFAULT 'pending',
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"confirmed_at" timestamp,
	"delivered_at" timestamp,
	CONSTRAINT "modern_shop_orders_order_number_unique" UNIQUE("order_number")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "order_delivery_schedule" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"delivery_date" date NOT NULL,
	"delivery_index" integer NOT NULL,
	"is_monday" boolean DEFAULT true NOT NULL,
	"quantity" integer NOT NULL,
	"package_number" integer NOT NULL,
	"total_packages" integer NOT NULL,
	"status" varchar(20) DEFAULT 'scheduled',
	"delivery_notes" text,
	"delivered_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "order_payment_groups" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"group_number" integer NOT NULL,
	"amount" integer NOT NULL,
	"due_date" date NOT NULL,
	"status" varchar(20) DEFAULT 'pending',
	"description" text,
	"paid_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_billing_data" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"data" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "modern_shop_orders" ADD CONSTRAINT "modern_shop_orders_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "order_delivery_schedule" ADD CONSTRAINT "order_delivery_schedule_order_id_modern_shop_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."modern_shop_orders"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "order_payment_groups" ADD CONSTRAINT "order_payment_groups_order_id_modern_shop_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."modern_shop_orders"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_billing_data" ADD CONSTRAINT "user_billing_data_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
