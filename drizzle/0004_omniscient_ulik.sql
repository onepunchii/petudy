CREATE TABLE "ai_knowledge" (
	"id" serial PRIMARY KEY NOT NULL,
	"content" text NOT NULL,
	"embedding" vector(768),
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE INDEX "embedding_index" ON "ai_knowledge" USING hnsw ("embedding" vector_cosine_ops);