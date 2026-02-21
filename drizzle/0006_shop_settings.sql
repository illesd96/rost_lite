-- Shop settings table for feature toggles
CREATE TABLE IF NOT EXISTS "shop_settings" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "key" varchar(100) UNIQUE NOT NULL,
  "value" text NOT NULL,
  "label" text,
  "description" text,
  "updated_at" timestamp DEFAULT now() NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL
);

-- Insert default settings
INSERT INTO "shop_settings" ("key", "value", "label", "description")
VALUES (
  'allow_private_billing',
  'false',
  'Magánszemély számlázás',
  'Engedélyezi a magánszemély típusú számlázási opciót a rendelési folyamatban.'
)
ON CONFLICT ("key") DO NOTHING;

INSERT INTO "shop_settings" ("key", "value", "label", "description")
VALUES (
  'stripe_enabled',
  'true',
  'Stripe kártyás fizetés',
  'Online kártyás fizetés engedélyezése Stripe-on keresztül. Kikapcsolás esetén a rendelés gomb nem működik.'
)
ON CONFLICT ("key") DO NOTHING;
