"use server";

import { db } from "@/lib/db";
import { sql } from "drizzle-orm";

export async function initRagDatabase() {
  try {
    await db.execute(sql`CREATE EXTENSION IF NOT EXISTS vector;`);

    await db.execute(sql`DROP TABLE IF EXISTS "ai_knowledge";`);

    await db.execute(sql`
      CREATE TABLE "ai_knowledge" (
        "id" serial PRIMARY KEY NOT NULL,
        "content" text NOT NULL,
        "embedding" vector(1536),
        "metadata" jsonb,
        "created_at" timestamp DEFAULT now()
      );
    `);

    await db.execute(sql`
      CREATE INDEX "embedding_index" ON "ai_knowledge" 
      USING hnsw ("embedding" vector_cosine_ops);
    `);

    return { success: true, message: "RAG Database initialized with 1536 dimensions." };
  } catch (error) {
    console.error("DB Init Error:", error);
    return { success: false, error: String(error) };
  }
}
