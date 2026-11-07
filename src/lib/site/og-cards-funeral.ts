/**
 * 장례 안내 페이지(/funeral, /funeral/[sido], /funeral/[sido]/[region]) 대표 이미지 내용.
 * 이미지 경로 규칙은 장례식장 목록과 같습니다: /og + 페이지 경로 + /square.png
 *
 * 그 페이지 본문이 보여 주는 사실만 씁니다. 지역 이름, 허가 업체 소재 지역과 수, 구·시청 기준 직선거리.
 * 거리·소재 지역은 본문의 허가 업체 표(FacilityTable, facilityDistances)와 같은 출처를 써서 이미지와 본문이 어긋나지 않게 합니다.
 */
import { FACILITY_AREAS, FACILITY_CHECKED_AT, GYEONGGI_FUNERAL_COUNT, NATIONAL_FUNERAL_COUNT } from "./facilities";
import { facilityDistances, type FacilityDistance } from "./local";
import type { OgCard } from "./og";
import { REGIONS, SIDO, regionsBySido, type Region, type SidoSlug } from "./regions";

const dot = (iso: string) => iso.replaceAll("-", ".");
const unitOf = (sido: SidoSlug) => (sido === "seoul" ? "구" : "도시");
const officeOf = (sido: SidoSlug) => (sido === "seoul" ? "구청" : "시청");
/** 본문 표와 같은 표기: 같은 시면 "시내", 아니면 "약 N km" */
const distanceText = (f: FacilityDistance) => `${f.area.name} ${f.sameCity ? "시내" : `약 ${Math.round(f.km)}km`}`;

/** /funeral: 전국·경기 업체 수와 업체가 많은 지역 */
export function funeralServiceCard(): OgCard {
    const top = [...FACILITY_AREAS].sort((a, b) => b.count - a.count).slice(0, 3);
    return {
        kicker: "반려동물 장례",
        place: `서울 ${regionsBySido("seoul").length}개 구 · 경기 ${regionsBySido("gyeonggi").length}개 도시 지역별 안내`,
        title: "서울·경기 반려동물 장례식장",
        passLabel: "허가 동물장묘업체 (공식 목록)",
        passValue: `전국 ${NATIONAL_FUNERAL_COUNT}곳 중 경기 ${GYEONGGI_FUNERAL_COUNT}곳`,
        passNote: top.map((a) => `${a.name} ${a.count}곳`).join(" · "),
        stubLabel: "확인일",
        stubValue: dot(FACILITY_CHECKED_AT),
        seed: "/funeral",
    };
}

/** /funeral/[sido]: 구·시마다 가장 가까운 허가 업체 소재 지역을 세어 많이 겹치는 순 */
export function funeralSidoServiceCard(sido: SidoSlug): OgCard {
    const regions = regionsBySido(sido);
    const freq = new Map<string, number>();
    for (const r of regions) {
        const nearest = facilityDistances(r, 1)[0];
        if (nearest) freq.set(nearest.area.name, (freq.get(nearest.area.name) ?? 0) + 1);
    }
    const top = [...freq.entries()]
        .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "ko"))
        .slice(0, 3)
        .map(([name]) => name);
    return {
        kicker: "반려동물 장례",
        place: SIDO[sido].name,
        title: `${SIDO[sido].short} ${regions.length}개 ${unitOf(sido)} 반려동물 장례`,
        passLabel: `${officeOf(sido)} 기준 가장 가까운 허가 업체 지역`,
        passValue: top.join(" · "),
        passNote: `${SIDO[sido].short} ${regions.length}개 ${unitOf(sido)} 기준, 직선거리`,
        stubLabel: "확인일",
        stubValue: dot(FACILITY_CHECKED_AT),
        seed: `/funeral/${sido}`,
    };
}

/** /funeral/[sido]/[region]: 구·시청 기준 가장 가까운 허가 업체 소재 지역 3곳 */
export function funeralRegionCard(r: Region): OgCard {
    const [first, ...rest] = facilityDistances(r, 3);
    return {
        kicker: "반려동물 장례",
        place: `${SIDO[r.sido].name} ${r.name}`,
        title: `${r.name} 반려동물 장례식장`,
        passLabel: `${r.name}청 기준 가장 가까운 허가 업체 지역`,
        passValue: distanceText(first),
        passNote: rest.length ? `다음 ${rest.map((f) => f.area.name).join(" · ")} (직선거리)` : "직선거리 기준",
        stubLabel: "확인일",
        stubValue: dot(FACILITY_CHECKED_AT),
        seed: `/funeral/${r.sido}/${r.slug}`,
    };
}

/** 대표 이미지 alt: 이미지에 적힌 글자와 같은 내용 */
export const funeralOgAlt = (card: OgCard) => `${card.title} 안내 이미지. ${card.passLabel}: ${card.passValue}`;

/** 정적 생성용 매개변수 */
export const funeralSidoParams = () => (Object.keys(SIDO) as SidoSlug[]).map((sido) => ({ sido }));
export const funeralRegionParams = () => REGIONS.map((r) => ({ sido: r.sido, region: r.slug }));
