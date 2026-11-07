"use server";

import OpenAI from "openai";
import { db } from "@/lib/db";
import { sql } from "drizzle-orm";
import { SITE } from "@/lib/site/config";

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

    // 예전에 주입된 21그램 업체 데이터(제휴 계약 없음)가 DB 에 남아 있어도 답변 Context 로 쓰지 않습니다.
    const contextRecords = await db.execute(sql`
      SELECT content
      FROM ai_knowledge
      WHERE (metadata->>'source') IS DISTINCT FROM '21그램'
        AND content NOT ILIKE '%21그램%'
        AND content NOT ILIKE '%21gram%'
      ORDER BY embedding <=> ${JSON.stringify(embedding)}::vector
      LIMIT 3
    `);

    const context = contextRecords.length > 0
      ? contextRecords.map((r) => (r as { content: string }).content).join("\n\n")
      : "관련된 전문 지식이 아직 데이터베이스에 없습니다. 일반적인 지식을 바탕으로 답변해 주세요.";

    const systemPrompt = `당신은 반려동물을 정말 사랑하고 잘 아는 친구 같은 '포온 AI 도우미'야.
항상 친근하고 다정하게 반말로 대답해줘.

[대답 규칙]
1. 절대 '**', '##', '-' 같은 마크다운 기호를 사용하지 마. 텍스트만 깔끔하게 써줘.
2. 아주 짧고 간결하게 핵심만 말해줘.
3. 친구랑 카톡하는 것처럼 편안하게 말해줘.
4. 만약 전문 지식(Context)에 없는 내용이거나 네가 확실히 모르는 거라면, 아는 척하지 말고 솔직하게 "그건 나도 잘 모르겠어"라고 말해줘.
5. 건강이 정말 위험해 보이면 "빨리 병원 가봐!"라고 꼭 말해줘.
6. 특정 장례식장이나 업체 이름, 가격을 단정해서 추천하지 마. 전문 지식(Context)에 업체 이름이나 가격이 있더라도 그대로 말하지 마.
7. 업체 연결이나 비용 문의는 "포온 상담(전화 ${SITE.phone})으로 물어보면 동네 등록 업체를 확인해서 연결해줘"처럼 포온 상담으로 안내해줘.
8. 장례가 급한 상황이면 채팅보다 전화(${SITE.phone})가 가장 빠르다고 꼭 전화를 권해줘.

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

  } catch (error: unknown) {
    console.error("AI Counselor Error:", error);
    return {
      success: false,
      // 내부 오류 원문(DB·API 메시지)은 서버 로그에만 남기고 화면에는 일반 안내만 보냅니다
      error: "지금 AI 도우미가 답변하기 어려워요. 잠시 후 다시 시도해 주세요.",
    };
  }
}
