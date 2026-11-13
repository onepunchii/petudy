import { squareOg } from "@/lib/site/og";
import { formatWon } from "@/lib/site/funeral-homes";
import { COST_PATH, COST_WEIGHT_KG, costSummary } from "@/lib/site/funeral-cost";

export const dynamic = "force-static";

/** 장례 비용 비교 대표 이미지. 숫자는 데이터에서 계산합니다(지어낸 값 없음) */
export async function GET() {
    const s = costSummary();
    return squareOg({
        kicker: "반려동물 장례 비용",
        place: "전국 허가 장례식장 공개 가격",
        title: `체중 ${COST_WEIGHT_KG}kg 기본 장례 비용 비교`,
        passLabel: "가운데 값",
        passValue: s.median ? formatWon(s.median) : "공개 가격 없음",
        passNote: s.min && s.max ? `${s.compared}곳 비교 · ${formatWon(s.min)}~${formatWon(s.max)}` : undefined,
        stubLabel: "확인일",
        stubValue: s.seenAt ? s.seenAt.replaceAll("-", ".") : "-",
        seed: COST_PATH,
    });
}
