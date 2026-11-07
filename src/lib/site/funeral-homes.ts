/**
 * 전국 허가 반려동물 장례식장(동물장묘업) 데이터와 도우미 함수.
 *
 * 데이터: src/lib/site/data/funeral-homes.json (scripts/funeral-homes/build.mjs 로 생성)
 *  - 업체 목록·주소·전화·시설 종류: 동물보호관리시스템 '동물장묘업 등록(허가) 현황' (공식)
 *  - 서비스·운영 시간·가격: 각 업체 홈페이지에서 확인한 사실 (항목마다 출처 URL)
 *  - 좌표: 대부분 시·군청 또는 읍·면 기준 대략값(geo: "approx"). 거리는 "약"으로만 표시합니다.
 * 지어낸 정보는 넣지 않습니다. 모르는 값은 null / status "unknown" 입니다.
 */
import raw from "./data/funeral-homes.json";
import { distanceKm, estimateDriveMinutes } from "./regions";

export const FUNERAL_HOMES_CHECKED_AT = "2026-11-07";
export const FUNERAL_REGISTRY_URL = "https://www.animal.go.kr/front/awtis/shop/undertaker1List.do?menuNo=6000000131";
export const FUNERAL_REGISTRY_LABEL = "동물보호관리시스템 동물장묘업 등록(허가) 현황";

export const FUNERAL_SIDO = {
    seoul: { name: "서울특별시", short: "서울" },
    gyeonggi: { name: "경기도", short: "경기" },
    incheon: { name: "인천광역시", short: "인천" },
    gangwon: { name: "강원특별자치도", short: "강원" },
    chungbuk: { name: "충청북도", short: "충북" },
    chungnam: { name: "충청남도", short: "충남" },
    sejong: { name: "세종특별자치시", short: "세종" },
    jeonbuk: { name: "전북특별자치도", short: "전북" },
    "jeonnam-gwangju": { name: "전남광주통합특별시", short: "전남·광주" },
    gyeongbuk: { name: "경상북도", short: "경북" },
    daegu: { name: "대구광역시", short: "대구" },
    gyeongnam: { name: "경상남도", short: "경남" },
    busan: { name: "부산광역시", short: "부산" },
    ulsan: { name: "울산광역시", short: "울산" },
} as const;
export type FuneralSidoSlug = keyof typeof FUNERAL_SIDO;
/** 목록 순서 (수도권 먼저, 이후 지리 순) */
export const FUNERAL_SIDO_ORDER = Object.keys(FUNERAL_SIDO) as FuneralSidoSlug[];

export const SERVICE_KEYS = [
    "individualCremation",
    "viewing",
    "allDay",
    "pickup",
    "yeomseup",
    "columbarium",
    "treeBurial",
    "memorialStone",
    "largeDog",
    "catSmall",
    "groupCremation",
] as const;
export type ServiceKey = (typeof SERVICE_KEYS)[number];

export const SERVICE_LABEL: Record<ServiceKey, string> = {
    individualCremation: "개별 화장",
    viewing: "화장 참관",
    allDay: "24시간 접수",
    pickup: "픽업·운구",
    yeomseup: "염습·수의",
    columbarium: "봉안당",
    treeBurial: "수목장",
    memorialStone: "메모리얼 스톤",
    largeDog: "대형견 장례",
    catSmall: "고양이·소동물",
    groupCremation: "합동 화장",
};

export type ServiceStatus = "yes" | "no" | "unknown";
export interface ServiceFact {
    status: ServiceStatus;
    note: string | null;
    sourceUrl: string | null;
}
export interface SourcedText {
    text: string;
    sourceUrl: string;
}
export interface PriceRow {
    label: string;
    amount: string;
    includes: string | null;
    sourceUrl: string;
    seenAt: string;
}

export interface FuneralHome {
    id: string;
    slug: string;
    sido: FuneralSidoSlug;
    sidoName: string;
    sigungu: string | null;
    sigunguSlug: string;
    district: string | null;
    /** 공식 목록의 업체명 그대로 */
    name: string;
    /** 공식 목록의 소재지 (번지가 없는 경우가 많음) */
    address: string;
    addressComplete: boolean;
    phone: string | null;
    website: string | null;
    /** 공식 목록의 취급 시설: 장례식장, 화장시설, 건조장시설, 수분해장시설, 봉안시설 */
    facilityTypes: string[];
    lat: number;
    lng: number;
    /** address: 주소 수준 좌표 / approx: 시·군청·읍면 기준 대략 좌표 */
    geo: "address" | "approx";
    officialListNo: number | null;
    services: Record<ServiceKey, ServiceFact>;
    extras: { label: string; note: string; sourceUrl: string }[];
    hours: SourcedText | null;
    prices: PriceRow[];
    priceFrom: number | null;
    parking: SourcedText | null;
    access: SourcedText[];
    summary: string | null;
    cautions: string[];
    checkedAt: string;
    sources: { label: string; url: string }[];
}

export const FUNERAL_HOMES = raw as unknown as FuneralHome[];

const bySlug = new Map(FUNERAL_HOMES.map((h) => [`${h.sido}/${h.slug}`, h]));

export const getFuneralHome = (sido: string, slug: string) => bySlug.get(`${sido}/${slug}`);
export const isFuneralSido = (s: string): s is FuneralSidoSlug => s in FUNERAL_SIDO;
export const funeralHomesBySido = (sido: FuneralSidoSlug) => FUNERAL_HOMES.filter((h) => h.sido === sido);

/** 시도별 업체 수 (업체가 있는 시도만, FUNERAL_SIDO_ORDER 순) */
export function funeralSidoList() {
    return FUNERAL_SIDO_ORDER.map((slug) => ({ slug, ...FUNERAL_SIDO[slug], count: funeralHomesBySido(slug).length })).filter((s) => s.count > 0);
}

/** 시도 안에서 시군구별 묶음 (업체 수 많은 순, 같으면 가나다) */
export function sigunguGroups(sido: FuneralSidoSlug) {
    const groups = new Map<string, FuneralHome[]>();
    for (const h of funeralHomesBySido(sido)) {
        const key = h.sigungu ?? FUNERAL_SIDO[sido].short;
        groups.set(key, [...(groups.get(key) ?? []), h]);
    }
    return [...groups.entries()]
        .map(([name, homes]) => ({ name, slug: homes[0].sigunguSlug, homes }))
        .sort((a, b) => b.homes.length - a.homes.length || a.name.localeCompare(b.name, "ko"));
}

/** "경기도 김포시", 세종처럼 시군구가 없으면 시도만 */
export const placeLabel = (h: Pick<FuneralHome, "sidoName" | "sigungu">) => (h.sigungu ? `${h.sidoName} ${h.sigungu}` : h.sidoName);
/** "경기 김포시" */
export const shortPlaceLabel = (h: Pick<FuneralHome, "sido" | "sigungu">) =>
    h.sigungu ? `${FUNERAL_SIDO[h.sido].short} ${h.sigungu}` : FUNERAL_SIDO[h.sido].short;

export const funeralHomesPath = () => "/funeral-homes";
export const funeralSidoPath = (sido: FuneralSidoSlug) => `/funeral-homes/${sido}`;
export const funeralHomePath = (h: Pick<FuneralHome, "sido" | "slug">) => `/funeral-homes/${h.sido}/${h.slug}`;

/** 정사각형(1200x1200) / 와이드(1200x630) 대표 이미지 경로. 페이지 경로 앞에 /og, 뒤에 /square.png */
export const ogImagePath = (pagePath: string, kind: "square" | "wide" = "square") =>
    `/og${pagePath === "/" ? "" : pagePath}/${kind}.png`;

/** 지도 앱 검색 링크 (좌표가 대략값이라 업체명+주소 검색으로 엽니다) */
export const naverMapUrl = (h: Pick<FuneralHome, "name" | "address">) => `https://map.naver.com/p/search/${encodeURIComponent(`${h.name} ${h.address}`)}`;
export const kakaoMapUrl = (h: Pick<FuneralHome, "name" | "address">) => `https://map.kakao.com/link/search/${encodeURIComponent(`${h.name} ${h.address}`)}`;

/** tel: 링크 (+82 국가번호 형식은 JSON-LD 용으로 따로) */
export const telHref = (phone: string) => `tel:${phone.replace(/[^0-9+]/g, "")}`;
export function telE164(phone: string) {
    const d = phone.replace(/[^0-9]/g, "");
    if (d.startsWith("15") || d.startsWith("16") || d.startsWith("18")) return `+82-${d}`; // 대표번호
    return `+82-${d.replace(/^0/, "")}`;
}

/** 목록 카드에 붙일 짧은 확인 항목 (홈페이지에서 확인된 것만, 최대 n개) */
export function serviceHighlights(h: FuneralHome, n = 3) {
    const order: ServiceKey[] = ["allDay", "individualCremation", "viewing", "pickup", "columbarium", "treeBurial", "largeDog"];
    // 화장시설이 없는 업체(건조장 등)의 참관은 "장례 참관"
    const label = (k: ServiceKey) => (k === "viewing" && !h.facilityTypes.includes("화장시설") ? "장례 참관" : SERVICE_LABEL[k]);
    return order.filter((k) => h.services[k]?.status === "yes").slice(0, n).map(label);
}

export const confirmedServiceCount = (h: FuneralHome) => SERVICE_KEYS.filter((k) => h.services[k]?.status === "yes").length;

/** 원 단위 → "25만 원" / "25만 5천 원" */
export function formatWon(n: number) {
    const man = Math.floor(n / 10000);
    const rest = Math.round((n % 10000) / 1000);
    if (man === 0) return `${n.toLocaleString("ko-KR")}원`;
    return rest ? `${man}만 ${rest}천 원` : `${man}만 원`;
}

/** 시설 종류를 짧게: "장례식장·화장·봉안" */
export const facilityTypesShort = (types: string[]) => types.map((t) => t.replace(/시설$/, "").replace("건조장", "건조").replace("수분해장", "수분해")).join("·");

/** 가까운 다른 장례식장 (직선거리 순) */
export function nearestFuneralHomes(pos: { lat: number; lng: number }, n = 4, excludeId?: string) {
    return FUNERAL_HOMES.filter((h) => h.id !== excludeId)
        .map((h) => ({ home: h, km: distanceKm(pos, h) }))
        .sort((a, b) => a.km - b.km)
        .slice(0, n)
        .map((x) => ({ ...x, minutes: estimateDriveMinutes(x.km) }));
}
