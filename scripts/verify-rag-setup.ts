import { db } from '../src/lib/db';
import { sql } from 'drizzle-orm';
import 'dotenv/config';

async function verifyRagSetup() {
    try {
        console.log("Checking pgvector extension...");
        await db.execute(sql`CREATE EXTENSION IF NOT EXISTS vector;`);
        console.log("✅ pgvector extension is ready.");

        console.log("Checking ai_knowledge table...");
        await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "ai_knowledge" (
          "id" serial PRIMARY KEY NOT NULL,
          "content" text NOT NULL,
          "embedding" vector(768),
          "metadata" jsonb,
          "created_at" timestamp DEFAULT now()
      );
    `);
        console.log("✅ ai_knowledge table is ready.");

        console.log("Checking embedding index...");
        await db.execute(sql`
      CREATE INDEX IF NOT EXISTS "embedding_index" ON "ai_knowledge" 
      USING hnsw ("embedding" vector_cosine_ops);
    `);
        console.log("✅ embedding index is ready.");

        process.exit(0);
    } catch (error) {
        console.error("❌ RAG Setup verification failed:", error);
        process.exit(1);
    }
}

verifyRagSetup();
