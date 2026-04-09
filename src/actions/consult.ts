"use server";

import OpenAI from "openai";
import { db } from "@/lib/db";
import { aiKnowledge } from "@/lib/db/schema";
import { sql } from "drizzle-orm";

function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("Missing OPENAI_API_KEY environment variable");
  }

  return new OpenAI({ apiKey });
}

export async function askAiCounselor(message: string, history: { role: string; content: string }[]) {
  try {
    const openai = getOpenAIClient();
    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: message,
    });
    const embedding = embeddingResponse.data[0].embedding;

    const contextRecords = await db.execute(sql`
      SELECT content 
      FROM ai_knowledge 
      ORDER BY embedding <=> ${JSON.stringify(embedding)}::vector 
      LIMIT 3
    `);

    const context = contextRecords.length > 0
      ? contextRecords.map((r) => (r as { content: string }).content).join("\n\n")
      : "관련된 전문 지식이 아직 데이터베이스에 없습니다. 일반적인 지식을 바탕으로 답변해 주세요.";

    const systemPrompt = `당신은 반려동물을 정말 사랑하고 잘 아는 친구 같은 '펫터디 AI 매니저'야. 
항상 친근하고 다정하게 반말로 대답해줘.

[대답 규칙]
1. 절대 '**', '##', '-' 같은 마크다운 기호를 사용하지 마. 텍스트만 깔끔하게 써줘.
2. 아주 짧고 간결하게 핵심만 말해줘.
3. 친구랑 카톡하는 것처럼 편안하게 말해줘.
4. 만약 전문 지식(Context)에 없는 내용이거나 네가 확실히 모르는 거라면, 아는 척하지 말고 솔직하게 "그건 나도 잘 모르겠어"라고 말해줘.
5. 건강이 정말 위험해 보이면 "빨리 병원 가봐!"라고 꼭 말해줘.

[전문 지식]
${context}

친구에게 말하듯이 한국어로 자연스럽게 대답해줘.`;

    const chatMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: "system", content: systemPrompt },
      ...history.map(h => ({
        role: h.role === "user" ? "user" as const : "assistant" as const,
        content: h.content,
      })),
      { role: "user", content: message },
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4.5-nano",
      messages: chatMessages,
      max_tokens: 1000,
      temperature: 0.7,
    });

    const answer = completion.choices[0]?.message?.content || "죄송합니다. 답변을 생성하지 못했습니다.";

    return { success: true, answer };

  } catch (error: any) {
    console.error("AI Counselor Error:", error);
    return {
      success: false,
      error: error.message || "AI 상담 중 알 수 없는 오류가 발생했습니다.",
      details: JSON.stringify(error),
    };
  }
}
