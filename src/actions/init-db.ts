"use server";

import { db } from "@/lib/db";
import { sql } from "drizzle-orm";

export async function initRagDatabase() {
    try {
        console.log("Initializing RAG database from server...");

        // 1. pgvector 확장 활성화
        await db.execute(sql`CREATE EXTENSION IF NOT EXISTS vector;`);
        console.log("✅ pgvector extension enabled.");

        // 2. ai_knowledge 테이블 생성
        await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "ai_knowledge" (
          "id" serial PRIMARY KEY NOT NULL,
          "content" text NOT NULL,
          "embedding" vector(768),
          "metadata" jsonb,
          "created_at" timestamp DEFAULT now()
      );
    `);
        console.log("✅ ai_knowledge table created.");

        // 3. 인덱스 생성
        await db.execute(sql`
      CREATE INDEX IF NOT EXISTS "embedding_index" ON "ai_knowledge" 
      USING hnsw ("embedding" vector_cosine_ops);
    `);
        console.log("✅ embedding index created.");

        return { success: true, message: "RAG Database initialized successfully." };
    } catch (error) {
        console.error("DB Init Error:", error);
        return { success: false, error: String(error) };
    }
}
