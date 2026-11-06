/**
 * 허가 동물장묘업체 소재 지역 (수도권)
 *
 * 출처: 농림축산식품부 동물보호관리시스템 '동물장묘업 등록(허가) 현황'
 *       https://www.animal.go.kr/front/awtis/shop/undertaker1List.do?menuNo=6000000131
 * 확인일: FACILITY_CHECKED_AT — 분기마다 다시 확인해 숫자와 날짜를 갱신하세요.
 *
 * 좌표는 각 시·군·구청 기준 대략값입니다. 실제 업체 위치와는 차이가 있으므로
 * 화면에는 "시·군청 기준 직선거리"로만 표시합니다.
 */
export const FACILITY_CHECKED_AT = "2026-11-06";
export const FACILITY_REGISTRY_URL = "https://www.animal.go.kr/front/awtis/shop/undertaker1List.do?menuNo=6000000131";
export const NATIONAL_FUNERAL_COUNT = 89;

export interface FacilityArea {
    name: string;
    sido: "경기" | "인천" | "서울";
    count: number;
    lat: number;
    lng: number;
    note?: string;
}

export const FACILITY_AREAS: FacilityArea[] = [
    { name: "경기 광주시", sido: "경기", count: 7, lat: 37.4295, lng: 127.255 },
    { name: "김포시", sido: "경기", count: 5, lat: 37.6152, lng: 126.7156 },
    { name: "화성시", sido: "경기", count: 4, lat: 37.1995, lng: 126.8313 },
    { name: "안산시", sido: "경기", count: 3, lat: 37.3219, lng: 126.8309 },
    { name: "남양주시", sido: "경기", count: 3, lat: 37.636, lng: 127.2165 },
    { name: "용인시", sido: "경기", count: 2, lat: 37.2411, lng: 127.1776 },
    { name: "고양시", sido: "경기", count: 1, lat: 37.6584, lng: 126.832 },
    { name: "파주시", sido: "경기", count: 1, lat: 37.76, lng: 126.78 },
    { name: "이천시", sido: "경기", count: 1, lat: 37.272, lng: 127.435 },
    { name: "안성시", sido: "경기", count: 1, lat: 37.008, lng: 127.2797 },
    { name: "양평군", sido: "경기", count: 1, lat: 37.4917, lng: 127.4876 },
    { name: "양주시", sido: "경기", count: 1, lat: 37.7853, lng: 127.0458 },
    { name: "포천시", sido: "경기", count: 1, lat: 37.8949, lng: 127.2003 },
    { name: "여주시", sido: "경기", count: 1, lat: 37.2983, lng: 127.637, note: "경기도 공공 반려동물 장묘시설 '반려마루' 소재" },
    { name: "인천 서구", sido: "인천", count: 3, lat: 37.5455, lng: 126.676 },
];

export const GYEONGGI_FUNERAL_COUNT = FACILITY_AREAS.filter((f) => f.sido === "경기").reduce((s, f) => s + f.count, 0);
