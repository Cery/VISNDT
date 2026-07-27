-- Migration: add_demand_category_relation
-- Formalizes the demand.category_id column that was previously managed via raw SQL.
-- The column may already exist from previous ALTER TABLE operations; this migration
-- ensures it exists and adds the proper index.

-- Add category_id column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'demand' AND column_name = 'category_id'
  ) THEN
    ALTER TABLE "demand" ADD COLUMN "category_id" UUID;
  END IF;
END $$;

-- Add foreign key constraint if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'demand' AND constraint_name = 'demand_category_id_fkey'
  ) THEN
    ALTER TABLE "demand" ADD CONSTRAINT "demand_category_id_fkey"
      FOREIGN KEY ("category_id") REFERENCES "product_category"("id")
      ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

-- Create index if it doesn't exist
CREATE INDEX IF NOT EXISTS "demand_category_id_idx" ON "demand"("category_id");