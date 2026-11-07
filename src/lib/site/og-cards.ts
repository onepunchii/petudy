/**
 * 페이지 종류별 대표 이미지 내용. 이미지 경로 규칙: /og + 페이지 경로 + /square.png (또는 /wide.png)
 */
import {
    FUNERAL_HOMES,
    FUNERAL_HOMES_CHECKED_AT,
    FUNERAL_SIDO,
    facilityTypesShort,
    funeralHomePath,
    funeralHomesBySido,
    funeralSidoList,
    funeralSidoPath,
    placeLabel,
    serviceHighlights,
    sigunguGroups,
    type FuneralHome,
    type FuneralSidoSlug,
} from "./funeral-homes";
import type { OgCard } from "./og";

const dot = (iso: string) => iso.replaceAll("-", ".");

export function funeralHomeCard(h: FuneralHome): OgCard {
    const hl = serviceHighlights(h, 3);
    return {
        kicker: "반려동물 장례식장",
        place: placeLabel(h),
        title: h.name,
        passLabel: "허가 동물장묘업 · 공식 목록",
        passValue: facilityTypesShort(h.facilityTypes),
        passNote: hl.length ? `홈페이지 안내 ${hl.join(" · ")}` : "운영 정보는 업체에 확인",
        stubLabel: "확인일",
        stubValue: dot(h.checkedAt),
        seed: funeralHomePath(h),
    };
}

export function funeralSidoCard(sido: FuneralSidoSlug): OgCard {
    const homes = funeralHomesBySido(sido);
    // 페이지 목록과 같은 순서(업체 많은 시군구 먼저, 같으면 가나다)
    const towns = sigunguGroups(sido)
        .filter((g) => g.homes[0]?.sigungu != null)
        .map((g) => g.name);
    return {
        kicker: "허가 업체 목록",
        place: FUNERAL_SIDO[sido].name,
        title: `${FUNERAL_SIDO[sido].short} 반려동물 장례식장 ${homes.length}곳`,
        passLabel: "공식 목록 기준 소재 시·군",
        passValue: towns.length ? `${towns.slice(0, 3).join(" · ")}${towns.length > 3 ? ` 외 ${towns.length - 3}개 지역` : ""}` : FUNERAL_SIDO[sido].short,
        passNote: ["주소", homes.some((h) => h.phone) && "전화", homes.some((h) => h.hours) && "운영 시간", homes.some((h) => h.prices.length > 0) && "공개 가격"]
            .filter(Boolean)
            .join(", "),
        stubLabel: "확인일",
        stubValue: dot(FUNERAL_HOMES_CHECKED_AT),
        seed: funeralSidoPath(sido),
    };
}

export function funeralHubCard(): OgCard {
    const list = funeralSidoList();
    return {
        kicker: "전국 허가 업체",
        title: `전국 반려동물 장례식장 ${FUNERAL_HOMES.length}곳`,
        passLabel: "시·도별 업체 수",
        passValue: list.slice(0, 3).map((s) => `${s.short} ${s.count}`).join(" · "),
        passNote: `${list.length}개 시·도, 공식 허가 목록 기준`,
        stubLabel: "확인일",
        stubValue: dot(FUNERAL_HOMES_CHECKED_AT),
        seed: "/funeral-homes",
    };
}
