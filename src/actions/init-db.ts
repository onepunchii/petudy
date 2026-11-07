"use server";

// 서버 액션은 UI 버튼이 없어도 외부에서 직접 호출할 수 있으므로, DROP TABLE 을 실행하는 이 액션은 운영 환경과 ALLOW_DB_ADMIN=1 이 아닌 환경에서 차단합니다.

import { db } from "@/lib/db";
import { sql } from "drizzle-orm";

export async function initRagDatabase() {
  if (process.env.NODE_ENV === "production" || process.env.ALLOW_DB_ADMIN !== "1") return { success: false, error: "forbidden" };

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
