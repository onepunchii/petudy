import { FUNERAL_HOMES, FUNERAL_HOMES_CHECKED_AT, formatWon, funeralHomePath, funeralHomesPath, shortPlaceLabel, type ServiceKey } from "@/lib/site/funeral-homes";
import { REGIONS, SIDO } from "@/lib/site/regions";
import { cn } from "@/lib/utils";
import { Container } from "../ui";
import { NearestFinder, type FinderHome, type FinderRegion } from "./NearestFinder";

/** 결과 카드에 보여 줄 사실(홈페이지에서 '안내 있음'으로 확인된 것만) */
const FACT_KEYS: { key: ServiceKey; label: string }[] = [
    { key: "allDay", label: "24시간 접수" },
    { key: "individualCremation", label: "개별 화장" },
    { key: "viewing", label: "화장 참관" },
    { key: "pickup", label: "픽업·운구" },
];

/**
 * 화면에 싣는 장례식장 데이터는 필요한 칸만 추립니다(89곳, 가격표·출처 본문은 싣지 않음).
 * 서버에서 한 번 만들어 넘기므로 브라우저는 업체 JSON 전체를 받지 않습니다.
 */
function finderHomes(): FinderHome[] {
    return FUNERAL_HOMES.map((h) => ({
        id: h.id,
        name: h.name,
        place: shortPlaceLabel(h),
        path: funeralHomePath(h),
        phone: h.phone,
        lat: h.lat,
        lng: h.lng,
        facts: FACT_KEYS.filter((f) => h.services[f.key]?.status === "yes").map((f) => f.label),
        priceFrom: h.priceFrom ? `${formatWon(h.priceFrom)}부터` : null,
    }));
}

function finderRegions(): FinderRegion[] {
    return REGIONS.map((r) => ({ id: `${r.sido}/${r.slug}`, name: r.name, group: SIDO[r.sido].name, lat: r.lat, lng: r.lng }));
}

/**
 * "지금 갈 수 있는 가까운 허가 장례식장" 구역. 장례 화면(밤 머리 아래 달빛 본문)에 둡니다.
 * 라임·캐릭터·이모지를 쓰지 않습니다(브랜드 9장, 밤 화면 규칙).
 */
export function NearestFinderSection({ className }: { className?: string }) {
    const checked = FUNERAL_HOMES_CHECKED_AT.replaceAll("-", ".");
    return (
        <section id="nearest" aria-labelledby="nearest-title" className={cn("scroll-mt-20", className)}>
            <Container>
                <div className="rounded-[28px] bg-pass p-5 shadow-[0_24px_48px_-30px_rgb(31_39_66/0.35)] ring-1 ring-line sm:p-8">
                    <h2 id="nearest-title" className="text-[22px] font-bold leading-snug text-ink sm:text-[26px]">
                        지금 갈 수 있는 가까운 허가 장례식장
                    </h2>
                    <p className="mt-2 max-w-[52ch] text-[15.5px] leading-relaxed text-ink-2">
                        위치를 쓰거나 동네를 고르면 가까운 순서로 3곳을 보여 드려요. 장례식장에 바로 전화할 수 있어요.
                    </p>
                    <NearestFinder homes={finderHomes()} regions={finderRegions()} allHref={funeralHomesPath()} checkedAt={checked} />
                </div>
            </Container>
        </section>
    );
}
