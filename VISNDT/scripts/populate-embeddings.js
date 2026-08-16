// ============================================
// M21.4.2 Embedding Data Population Script
// Direct generation via Prisma + OpenAI/OpenRouter
// ============================================

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Configuration
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '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';
const OPENAI_BASE_URL = process.env.OPENAI_BASE_URL || 'https://openrouter.ai/api/v1/embeddings';
const EMBEDDING_MODEL = process.env.OPENAI_EMBEDDING_MODEL || 'openai/text-embedding-3-small';

async function generateEmbedding(text) {
  const response = await fetch(OPENAI_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'HTTP-Referer': 'https://visndt.dev',
      'X-Title': 'VISNDT AI Data Preparation',
    },
    body: JSON.stringify({
      model: EMBEDDING_MODEL,
      input: text.slice(0, 8000),
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`API error ${response.status}: ${err}`);
  }

  const data = await response.json();
  return data.data[0].embedding;
}

async function generateEmbeddings(texts) {
  const response = await fetch(OPENAI_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'HTTP-Referer': 'https://visndt.dev',
      'X-Title': 'VISNDT AI Data Preparation',
    },
    body: JSON.stringify({
      model: EMBEDDING_MODEL,
      input: texts.map(t => t.slice(0, 8000)),
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`API error ${response.status}: ${err}`);
  }

  const data = await response.json();
  return data.data.map(d => d.embedding);
}

// ============================================
// Content Embedding
// ============================================
async function generateContentEmbeddings() {
  console.log('\n=== Content Embedding ===');

  const contents = await prisma.$queryRawUnsafe(
    `SELECT id, title, summary, content FROM content WHERE status = 'PUBLISHED' AND embedding IS NULL`
  );

  console.log(`Pending: ${contents.length} PUBLISHED Content without embedding`);

  let generated = 0;
  let failed = 0;

  for (const c of contents) {
    try {
      const text = [c.title, c.summary, c.content].filter(Boolean).join('\n').slice(0, 8000);
      const embedding = await generateEmbedding(text);
      const vectorStr = `[${embedding.join(',')}]`;

      await prisma.$executeRawUnsafe(
        `UPDATE content SET embedding = $1::vector WHERE id = $2::uuid`,
        vectorStr,
        c.id,
      );

      generated++;
      console.log(`  [${generated}/${contents.length}] Content ${c.id.slice(0, 8)}... "${c.title?.slice(0, 40)}"`);
    } catch (error) {
      failed++;
      console.error(`  [FAIL] Content ${c.id.slice(0, 8)}... : ${error.message?.slice(0, 100)}`);
    }
  }

  console.log(`Content Result: ${generated} generated, ${failed} failed`);
  return { generated, failed };
}

// ============================================
// Product Embedding
// ============================================
async function generateProductEmbeddings() {
  console.log('\n=== Product Embedding ===');

  const products = await prisma.$queryRawUnsafe(
    `SELECT p.id, p.name, p.model, p.description
     FROM product p
     WHERE p.status != 'ARCHIVED' AND p.embedding IS NULL`
  );

  console.log(`Pending: ${products.length} Active Products without embedding`);

  let generated = 0;
  let failed = 0;

  for (const p of products) {
    try {
      // Get parameter values
      const params = await prisma.$queryRawUnsafe(
        `SELECT pd.name, pd.value_unit as unit, ppv.value
         FROM product_parameter_value ppv
         JOIN parameter_definition pd ON ppv.parameter_definition_id = pd.id
         WHERE ppv.product_id = $1::uuid`,
        p.id,
      );

      const paramText = params
        .map(pv => `${pv.name}: ${pv.value}${pv.unit ? ' ' + pv.unit : ''}`)
        .join('; ');

      const text = [p.name, p.model, p.description, paramText]
        .filter(Boolean)
        .join('\n')
        .slice(0, 8000);

      const embedding = await generateEmbedding(text);
      const vectorStr = `[${embedding.join(',')}]`;

      await prisma.$executeRawUnsafe(
        `UPDATE product SET embedding = $1::vector WHERE id = $2::uuid`,
        vectorStr,
        p.id,
      );

      generated++;
      console.log(`  [${generated}/${products.length}] Product ${p.id.slice(0, 8)}... "${p.name?.slice(0, 40)}"`);
    } catch (error) {
      failed++;
      console.error(`  [FAIL] Product ${p.id.slice(0, 8)}... : ${error.message?.slice(0, 100)}`);
    }
  }

  console.log(`Product Result: ${generated} generated, ${failed} failed`);
  return { generated, failed };
}

// ============================================
// Content Chunk
// ============================================
async function generateContentChunks() {
  console.log('\n=== Content Chunk ===');

  const contents = await prisma.$queryRawUnsafe(
    `SELECT c.id, c.content FROM content c
     WHERE c.status = 'PUBLISHED'
     AND c.id NOT IN (SELECT DISTINCT content_id FROM content_chunk)`
  );

  console.log(`Pending: ${contents.length} PUBLISHED Content without chunks`);

  let processed = 0;
  let failed = 0;
  let totalChunks = 0;

  for (const c of contents) {
    try {
      if (!c.content) {
        console.log(`  [SKIP] Content ${c.id.slice(0, 8)}... : no content body`);
        continue;
      }

      // Simple chunking: split by paragraphs, merge short ones
      const paragraphs = c.content
        .split(/\n\n+/)
        .map(p => p.trim())
        .filter(p => p.length > 0);

      const maxChunkSize = 1000;
      const chunks = [];
      let currentChunk = '';

      for (const paragraph of paragraphs) {
        if (currentChunk.length + paragraph.length > maxChunkSize && currentChunk.length > 0) {
          chunks.push(currentChunk.trim());
          currentChunk = paragraph;
        } else {
          currentChunk = currentChunk ? `${currentChunk}\n\n${paragraph}` : paragraph;
        }
      }
      if (currentChunk.trim()) {
        chunks.push(currentChunk.trim());
      }

      if (chunks.length === 0) {
        console.log(`  [SKIP] Content ${c.id.slice(0, 8)}... : no paragraphs found`);
        continue;
      }

      // Generate embeddings for all chunks
      const texts = chunks.map(ch => ch.slice(0, 8000));
      const embeddings = await generateEmbeddings(texts);

      // Save chunks
      for (let i = 0; i < chunks.length; i++) {
        const vectorStr = `[${embeddings[i].join(',')}]`;
        await prisma.$executeRawUnsafe(
          `INSERT INTO content_chunk (id, content_id, chunk_index, text, embedding, created_at, updated_at)
           VALUES (gen_random_uuid(), $1::uuid, $2::int, $3::text, $4::vector, NOW(), NOW())`,
          c.id,
          i,
          texts[i],
          vectorStr,
        );
      }

      totalChunks += chunks.length;
      processed++;
      console.log(`  [${processed}/${contents.length}] Content ${c.id.slice(0, 8)}... : ${chunks.length} chunks`);
    } catch (error) {
      failed++;
      console.error(`  [FAIL] Content ${c.id.slice(0, 8)}... : ${error.message?.slice(0, 100)}`);
    }
  }

  console.log(`Chunk Result: ${processed} content, ${totalChunks} chunks, ${failed} failed`);
  return { processed, totalChunks, failed };
}

// ============================================
// Main
// ============================================
async function main() {
  console.log('=== VISNDT M21.4.2 Embedding Data Population ===');
  console.log(`Provider: ${EMBEDDING_MODEL}`);
  console.log(`Endpoint: ${OPENAI_BASE_URL}`);
  console.log(`API Key: ${OPENAI_API_KEY ? 'configured' : 'MISSING'}`);

  if (!OPENAI_API_KEY) {
    console.error('ERROR: OPENAI_API_KEY not configured. Aborting.');
    process.exit(1);
  }

  const startTime = Date.now();

  // 1. Content Embeddings
  const contentResult = await generateContentEmbeddings();

  // 2. Product Embeddings
  const productResult = await generateProductEmbeddings();

  // 3. Content Chunks
  const chunkResult = await generateContentChunks();

  // 4. Coverage Report
  console.log('\n=== Coverage Report ===');
  const coverage = await prisma.$queryRawUnsafe(
    `SELECT
      (SELECT COUNT(*) FROM content WHERE status = 'PUBLISHED') AS total_content,
      (SELECT COUNT(*) FROM content WHERE status = 'PUBLISHED' AND embedding IS NOT NULL) AS content_with_embedding,
      (SELECT COUNT(*) FROM product WHERE status != 'ARCHIVED') AS total_product,
      (SELECT COUNT(*) FROM product WHERE status != 'ARCHIVED' AND embedding IS NOT NULL) AS product_with_embedding,
      (SELECT COUNT(*) FROM content_chunk) AS total_chunks,
      (SELECT COUNT(DISTINCT content_id) FROM content_chunk) AS content_with_chunks`
  );

  console.log(JSON.stringify(coverage[0], null, 2));

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\nTotal time: ${elapsed}s`);

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error('FATAL:', e);
  prisma.$disconnect();
  process.exit(1);
});