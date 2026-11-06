import { distanceKm, estimateDriveMinutes, type Region } from "./regions";
import type { ServiceSlug } from "./services";

/**
 * 제휴 업체 목록.
 *
 * ⚠️ 실제 계약된 업체만 넣으세요. 이 배열이 비어 있으면 지역 페이지는
 *    "제휴 시설 거리" 대신 "연결 가능 범위·이동 경로" 안내만 보여줍니다.
 *    (존재하지 않는 업체·거리를 표시하면 표시광고법 위반 소지가 있습니다)
 *
 * 장례(funeral) 업체는 동물보호법상 '동물장묘업' 등록번호를 반드시 기입하고,
 * 미용(grooming)은 '동물미용업' 등록번호를 기입합니다.
 */
export interface Partner {
    id: string;
    name: string;
    services: ServiceSlug[];
    address: string;
    lat: number;
    lng: number;
    /** 예: { kind: "동물장묘업", number: "제0000-00호" } */
    registration?: { kind: string; number: string };
    hours?: string;
    /** 픽업(운구) 가능 여부 */
    pickup?: boolean;
    features?: string[];
}

export const PARTNERS: Partner[] = [
    // 예시 형식 (실제 업체로 교체 후 주석 해제)
    // {
    //     id: "partner-001",
    //     name: "○○ 반려동물 장례식장",
    //     services: ["funeral"],
    //     address: "경기도 ○○시 ○○로 00",
    //     lat: 37.0, lng: 127.0,
    //     registration: { kind: "동물장묘업", number: "제0000-00호" },
    //     hours: "24시간",
    //     pickup: true,
    //     features: ["개별 추모실", "전 과정 참관"],
    // },
];

export function nearestPartners(region: Region, service: ServiceSlug, limit = 3) {
    return PARTNERS.filter((p) => p.services.includes(service))
        .map((p) => {
            const km = distanceKm(region, p);
            return { partner: p, km, minutes: estimateDriveMinutes(km) };
        })
        .sort((a, b) => a.km - b.km)
        .slice(0, limit);
}
