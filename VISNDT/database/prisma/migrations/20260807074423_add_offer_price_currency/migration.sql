-- Add price and currency columns to offer table
ALTER TABLE "offer" ADD COLUMN IF NOT EXISTS "price" DECIMAL(12,2);
ALTER TABLE "offer" ADD COLUMN IF NOT EXISTS "currency" TEXT DEFAULT 'CNY';