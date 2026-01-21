-- Add billing tracking fields to order_payment_groups
ALTER TABLE "order_payment_groups" ADD COLUMN IF NOT EXISTS "bill_created" boolean DEFAULT false NOT NULL;
ALTER TABLE "order_payment_groups" ADD COLUMN IF NOT EXISTS "bill_created_at" timestamp;
ALTER TABLE "order_payment_groups" ADD COLUMN IF NOT EXISTS "bill_sent" boolean DEFAULT false NOT NULL;
ALTER TABLE "order_payment_groups" ADD COLUMN IF NOT EXISTS "bill_sent_at" timestamp;
ALTER TABLE "order_payment_groups" ADD COLUMN IF NOT EXISTS "bill_number" varchar(50);
ALTER TABLE "order_payment_groups" ADD COLUMN IF NOT EXISTS "bill_notes" text;
