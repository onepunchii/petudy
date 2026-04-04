"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { db } from "@/lib/db";
import { aiKnowledge } from "@/lib/db/schema";
import { sql } from "drizzle-orm";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);

export async function askAiCounselor(message: string, history: { role: string; content: string }[]) {
    try {
        // 1. 임베딩 생성 (RAG용)
        const embeddingModel = genAI.getGenerativeModel({ model: "text-embedding-004" });
        const embeddingResult = await embeddingModel.embedContent(message);
        const embedding = embeddingResult.embedding.values;

        // 2. 벡터 검색 (가장 유사한 지식 3개 추출)
        // pgvector의 <=> (cosine distance) 사용
        const contextRecords = await db.execute(sql`
          SELECT content 
          FROM ai_knowledge 
          ORDER BY embedding <=> ${JSON.stringify(embedding)}::vector 
          LIMIT 3
        `);

        const context = contextRecords.length > 0
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ? contextRecords.map((r) => (r as any).content as string).join("\n\n")
            : "관련된 전문 지식이 아직 데이터베이스에 없습니다. 일반적인 지식을 바탕으로 답변해 주세요.";

        // 3. 모델 선택 (Gemini 3 Flash 시도 후 1.5로 폴백)
        let model;
        try {
            model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
        } catch (e) {
            console.warn("Gemini 3 Flash not available, falling back to 1.5 Flash");
            model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        }

        const chat = model.startChat({
            history: history.map(h => ({
                role: h.role === "user" ? "user" : "model",
                parts: [{ text: h.content }],
            })),
            generationConfig: {
                maxOutputTokens: 1000,
            },
        });

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

        const result = await chat.sendMessage([
            { text: systemPrompt },
            { text: message }
        ]);

        const response = await result.response;
        return { success: true, answer: response.text() };

    } catch (error: any) {
        console.error("AI Counselor Error:", error);
        // 개발 단계에서는 에러 메시지를 프론트엔드로 전달하여 디버깅 편의성 제공
        return {
            success: false,
            error: error.message || "AI 상담 중 알 수 없는 오류가 발생했습니다.",
            details: JSON.stringify(error)
        };
    }
}
