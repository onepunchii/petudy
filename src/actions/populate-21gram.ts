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

const gram21Data = [
  {
    content: "21그램 반려동물 장례식장은 반려동물 사체 처리, 장례 절차, 추모 서비스를 제공하는 전문 업체입니다. 서울/경기(경기광주점, 남양주점)와 천안/아산(천안아산점)에 총 3개의 지점이 있습니다. 연락처는 1688-1240입니다.",
    metadata: { category: "기본정보", source: "21그램" },
  },
  {
    content: "21그램 장례 절차는 6단계로 진행됩니다: 1) 담당 장례지도사 상담, 2) 염습, 3) 추모 예식, 4) 화장 및 분골, 5) 봉안 및 인도, 6) 서류 및 안내문 발급. 모든 장례는 개인 공간에서 진행됩니다.",
    metadata: { category: "장례절차", source: "21그램" },
  },
  {
    content: "21그램 기본 장례 비용: 15kg 미만 일반동물 350,000원, 15kg 이상 대형동물 650,000원. 모든 서비스에 염습, 단독추모실, 개별화장, 유골함, 보자기가 포함됩니다. 체중 kg당 추가비용은 없습니다.",
    metadata: { category: "가격", source: "21그램" },
  },
  {
    content: "21그램 요람 장례 비용: 15kg 미만 700,000원, 15kg 이상 1,100,000원. 시그니처 요람 M과 꽃다발 서비스가 포함된 프리미엄 장례입니다.",
    metadata: { category: "가격", source: "21그램" },
  },
  {
    content: "21그램 장례Ⅱ 비용: 일반동물 750,000원, 대형동물 1,200,000원. 고급 오동나무 관, 최고급 수의, 꽃다발 서비스가 포함됩니다.",
    metadata: { category: "가격", source: "21그램" },
  },
  {
    content: "21그램 프리미엄 소풍 장례 비용: 일반동물 1,350,000원. 프리미엄 관, 최고급 수의, 무지개다리, 소풍 가방, 들꽃 바구니가 포함됩니다.",
    metadata: { category: "가격", source: "21그램" },
  },
  {
    content: "21그램 위치: 경기광주점은 경기도 광주시 오포읍 매자리길 185-35, 운영시간은 오전 7시~오전 12시(마지막 예약 오후 9시)입니다. 천안아산점은 충청남도 천안시 동남구 광풍로 1668, 오후 10시까지(마지막 예약 오후 7시)입니다. 남양주점은 경기도 남양주시 화도읍 수레로964번길 86, 오후 10시까지(마지막 예약 오후 7시)입니다.",
    metadata: { category: "위치", source: "21그램" },
  },
  {
    content: "21그램 장례지도사는 1인당 평균 1,000회의 장례 경험이 있으며, 최소 1년의 교육 과정을 수료한 전문가입니다. 모든 장례는 1:1 전담 장례지도사가 처음부터 끝까지 진행합니다.",
    metadata: { category: "전문성", source: "21그램" },
  },
  {
    content: "21그램은 농림축산식품부장관상을 수상한 정식 반려동물 장례식장입니다. 동물복지대상 수상 경력이 있습니다.",
    metadata: { category: "인증", source: "21그램" },
  },
  {
    content: "21그램 장례식장은 보호자의 동선을 고려하여的建筑팀에서 직접 설계한 개인 공간에서 장례를 진행합니다. 남은 보호자가 이별을 방해받지 않고 편안히 인사를 나눌 수 있도록 합니다.",
    metadata: { category: "시설", source: "21그램" },
  },
  {
    content: "21그램의 모든 장례용품은 국내 수작업으로 제작된 오동나무, 면 100% 수의, 당일 수급한 생화를 사용합니다. 화장 후 재가 남지 않는 천연 소재만 사용합니다.",
    metadata: { category: "용품", source: "21그램" },
  },
  {
    content: "반려동물 사후 경직은 평균 24시간 이내에 자연스럽게 풀립니다. 무리하게 마사지하면 2차 부상이 발생할 수 있으므로 21그램 장례지도사의 도움을 받으시는 것을 권장합니다.",
    metadata: { category: "FAQ", source: "21그램" },
  },
  {
    content: "강아지는 안구가 돌출되어 있어 사후에도 눈이 뜨고 있는 것이 자연스러운 현상입니다. 고양이는 안구가 함몰된 구조이므로 억지로 감기지 말고 마사지를 통해 감겨주는 것을 권장합니다. 21그램에서는 인체용 글루를 사용하지 않습니다.",
    metadata: { category: "FAQ", source: "21그램" },
  },
  {
    content: "반려동물 전용 화장기에 물건(장난감, 옷 등)을 함께 태우는 것은 법적으로 불가합니다. 유골에 잔여물이 유착될 수 있으므로 권장하지 않습니다.",
    metadata: { category: "FAQ", source: "21그램" },
  },
  {
    content: "21그램 장례 총 소요시간: 일반동물(15kg 미만) 평균 2~3시간, 대형동물(15kg 이상) 평균 3~4시간. 체격과 보호자님 추모 시간에 따라 달라질 수 있습니다.",
    metadata: { category: "FAQ", source: "21그램" },
  },
  {
    content: "21그램은 모든 장례를 개별 화장으로 진행합니다. 참관실에서 아이가 화장로에 진입하는 모습과 화장 후 유골까지 직접 확인하실 수 있습니다.",
    metadata: { category: "장례절차", source: "21그램" },
  },
  {
    content: "유골함을 자택에서 보관할 때: 온도 21~26도, 습도 60% 미만으로 유지해야 합니다. 베란다, 창문, 화장실, 전자기기 주변 등 온도 변화가 크거나 습도가 높은 곳은 피하세요.",
    metadata: { category: "FAQ", source: "21그램" },
  },
  {
    content: "21그램 운구 서비스: 차량이 없거나 운전이 어려운 경우 21그램이 보호자님과 아이를 안전하게 모시는 서비스입니다. 카카오T펫 또는 고요한M과 함께합니다. 서울/경기 60,000~100,000원, 출발 지역에 따라 다릅니다. 탑승 3시간 전 예약 필요합니다.",
    metadata: { category: "부가서비스", source: "21그램" },
  },
  {
    content: "21그램 꽃다발 서비스: 장례 당일 꽃 농원에서 수급한 생생한 꽃다발을 60,000원에 준비해드립니다. 보호자님께서 직접 꽃장식을 진행하실 수 있도록 꽃가위를 제공합니다. 사전 신청 필수입니다.",
    metadata: { category: "부가서비스", source: "21그램" },
  },
  {
    content: "21그램 냉장 안치 서비스: 사후 바로 장례를 진행하기 어려운 경우, 최대 1주일까지 냉장 안치해드립니다. 1일 35,000원 비용이 발생합니다.",
    metadata: { category: "부가서비스", source: "21그램" },
  },
  {
    content: "21그램 산골 서비스: 장례 후 아이를 자연으로 돌려보내고 싶으신 경우, 산골(散骨)을 대행해드립니다. 비용은 60,000원입니다.",
    metadata: { category: "부가서비스", source: "21그램" },
  },
  {
    content: "21그램 봉안당: 4,200석 규모의 국내 최대 반려동물 봉안당입니다. 적정 온/습도를 유지하며 사계절 안전하게 아이를 모십니다. 봉안당 1은 신규 300,000원/년, 연장 200,000원. 봉안당 2는 신규 500,000원/년, 연장 400,000원입니다.",
    metadata: { category: "부가서비스", source: "21그램" },
  },
  {
    content: "루세떼(Lucete)는 반려동물 유골로 제작하는 추모 보석입니다. 국내 유일 특허 기술(제 10-1124873호)로 저온 용융 공법으로 제작됩니다. 변질/부패 걱정 없이 영원히 보관할 수 있습니다.",
    metadata: { category: "추모상품", source: "21그램" },
  },
  {
    content: "루세떼 보관 시 주의사항: 온/습도에 거의 영향을 받지 않지만, 오랜 시간 물에 닿는 것은 권장하지 않습니다. 강한 충격이나 외부 압력에 깨질 수 있으므로 높은 위치에 보관 시 조심하세요.",
    metadata: { category: "추모상품", source: "21그램" },
  },
  {
    content: "펫츠비아(PetsBea): 아이의 유골분, 털, 발톱에서 추출한 생체원소와 사파이어 보석씨드를 성장시켜 주얼리로 제작합니다. 언제 어디서든 따뜻한 기억을 품고 함께할 수 있습니다.",
    metadata: { category: "추모상품", source: "21그램" },
  },
  {
    content: "21그램 누적 장례 30,000건 이상, 네이버 평점 4.95/5점(3만+ 리뷰), 보호자 만족도 98%입니다.",
    metadata: { category: "인증", source: "21그램" },
  },
  {
    content: "예약 방법: 전화 1688-1240(운영시간 05:00~24:00), 네이버 예약, 24시간 채팅 상담이 가능합니다.",
    metadata: { category: "예약", source: "21그램" },
  },
  {
    content: "21그램은 장례용품 구매를 강요하지 않습니다. 보호자에게 필요한 구성으로 스스로 선택하는 장례를 진행합니다. 모든 비용은 정찰제로 운영됩니다.",
    metadata: { category: "기본철학", source: "21그램" },
  },
  {
    content: "아이가 살아있을 때 미리 장례를 예약하기는 어렵습니다. 아이가 떠난 후 연락주시면 가까운 지점과 방문 편한 시간으로 안내해드립니다. 최대 1주일까지 냉장 안치 서비스를 도와드릴 수 있습니다.",
    metadata: { category: "FAQ", source: "21그램" },
  },
  {
    content: "영정 사진은 별도로 인화해 드리지 않습니다. 예약 확정 시 발송되는 문자(또는 카카오톡)에 아이 사진 5~10장 보내주시면 추모실에서 영상으로 재생해 드립니다.",
    metadata: { category: "FAQ", source: "21그램" },
  },
];

export async function populate21gramData() {
  try {
    const openai = getOpenAIClient();
    console.log(`Populating ${gram21Data.length} knowledge chunks...`);

    for (let i = 0; i < gram21Data.length; i++) {
      const item = gram21Data[i];
      
      const embeddingResponse = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: item.content,
      });
      const embedding = embeddingResponse.data[0].embedding;

      await db.execute(sql`
        INSERT INTO ai_knowledge (content, embedding, metadata)
        VALUES (
          ${item.content},
          ${JSON.stringify(embedding)}::vector,
          ${JSON.stringify(item.metadata)}::jsonb
        )
      `);

      console.log(`[${i + 1}/${gram21Data.length}] Inserted: ${item.content.substring(0, 50)}...`);
    }

    return { success: true, message: `Successfully populated ${gram21Data.length} knowledge chunks.` };
  } catch (error) {
    console.error("Population Error:", error);
    return { success: false, error: String(error) };
  }
}
