-- ============================================
-- Migration 011: Vector Index Foundation
-- ============================================
-- Purpose: Establish pgvector IVFFlat indexes and
--          cosine similarity query infrastructure
--          for M21.4 Semantic Layer.
--
-- Indexes:
--   1. idx_content_embedding     — IVFFlat on content.embedding
--   2. idx_product_embedding     — IVFFlat on product.embedding
--   3. idx_content_chunk_embedding — IVFFlat on content_chunk.embedding
--
-- Function:
--   1. cosine_similarity(vector, vector) → float8
--      Wraps pgvector <=> operator.
--      Returns similarity in [0, 1] range (1 = identical).
--      Formula: 1 - (vector1 <=> vector2)
--
-- Rollback:
--   DROP FUNCTION IF EXISTS cosine_similarity CASCADE;
--   DROP INDEX IF EXISTS idx_content_chunk_embedding;
--   DROP INDEX IF EXISTS idx_product_embedding;
--   DROP INDEX IF EXISTS idx_content_embedding;
-- ============================================

-- --------------------------------------------
-- 1. Vector Indexes (IVFFlat)
-- --------------------------------------------
-- IVFFlat divides the vector space into `lists` clusters.
-- Suitable for datasets up to ~100K rows.
-- `lists = 100` is optimal for ~1K-10K documents.
-- Can be increased via REINDEX if data grows beyond 100K.

CREATE INDEX IF NOT EXISTS idx_content_embedding
ON content
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

CREATE INDEX IF NOT EXISTS idx_product_embedding
ON product
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

CREATE INDEX IF NOT EXISTS idx_content_chunk_embedding
ON content_chunk
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- --------------------------------------------
-- 2. Cosine Similarity Function
-- --------------------------------------------
-- pgvector provides the <=> operator (cosine distance).
-- This function wraps it to return similarity (higher = more similar).
-- Usage:
--   SELECT * FROM content
--   ORDER BY cosine_similarity(embedding, query_vector) DESC
--   LIMIT 10;

CREATE OR REPLACE FUNCTION cosine_similarity(
  a vector,
  b vector
) RETURNS float8
LANGUAGE plpgsql
IMMUTABLE
STRICT
PARALLEL SAFE
AS $$
BEGIN
  RETURN 1 - (a <=> b);
END;
$$;