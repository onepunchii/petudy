import { GoogleGenerativeAI } from "@google/generative-ai";
import * as fs from 'fs';
import * as path from 'path';
import 'dotenv/config';
import { db } from '../src/lib/db';
import { aiKnowledge } from '../src/lib/db/schema';

// Gemini API 설정
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);
const embeddingModel = genAI.getGenerativeModel({ model: "text-embedding-004" });

async function ingestData() {
    const dataDir = path.join(__dirname, '../data/ai-hub');

    if (!fs.existsSync(dataDir)) {
        console.error("데이터 디렉토리가 없습니다. 먼저 다운로드 하세요.");
        return;
    }

    // TODO: AI Hub 데이터 형식에 맞게 파싱 로직 구현
    // 예: 질병 관련 말뭉치 JSON 파일 순회
    const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'));

    for (const file of files) {
        const rawData = fs.readFileSync(path.join(dataDir, file), 'utf-8');
        const records = JSON.parse(rawData);

        for (const record of records) {
            // 1. 컨텐츠 추출 (질문 + 답변 등)
            const content = `질문: ${record.question}\n답변: ${record.answer}`;

            // 2. 임베딩 생성
            const result = await embeddingModel.embedContent(content);
            const embedding = result.embedding.values;

            // 3. DB 저장
            await db.insert(aiKnowledge).values({
                content,
                embedding,
                metadata: { source: 'AI_HUB_71879', original_id: record.id },
            });

            console.log(`Ingested: ${record.id}`);
        }
    }
}

// ingestData().catch(console.error);
