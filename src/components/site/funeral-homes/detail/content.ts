/**
 * 장례식장 상세 페이지 문구 도우미. 모든 문장은 데이터(funeral-homes.json)에 있는 사실만으로 만듭니다.
 * 모르는 값은 "홈페이지 안내 없음"으로 쓰고, 지어내지 않습니다. 긴 줄표, 느낌표, 최상급 표현 금지.
 */
import {
    FUNERAL_REGISTRY_LABEL,
    FUNERAL_REGISTRY_URL,
    FUNERAL_SIDO,
    SERVICE_KEYS,
    facilityTypesShort,
    formatWon,
    placeLabel,
    type FuneralHome,
    type ServiceFact,
    type ServiceStatus,
} from "@/lib/site/funeral-homes";
import { REGIONS, distanceKm, estimateDriveMinutes } from "@/lib/site/regions";
import type { Faq } from "@/lib/site/services";

/** 목차 (h2 id 순서와 같음) */
export const DETAIL_TOC = [
    { id: "summary", label: "한눈에 보기" },
    { id: "services", label: "서비스" },
    { id: "prices", label: "비용" },
    { id: "location", label: "위치·오시는 길" },
    { id: "nearby", label: "가까운 장례식장" },
    { id: "faq", label: "자주 묻는 질문" },
    { id: "sources", label: "출처·정보 수정" },
    { id: "owner", label: "업체 사장님" },
] as const;

export const UNKNOWN_TEXT = "홈페이지 안내 없음";
/** 업체명·소재지·전화·홈페이지는 공식 목록에서 오므로, 없을 때는 이렇게 씁니다 */
export const NOT_LISTED_TEXT = "공식 목록에 기재 없음";

export const STATUS_TEXT: Record<ServiceStatus, string> = {
    yes: "안내 있음",
    no: "하지 않음",
    unknown: UNKNOWN_TEXT,
};

/** "2026-11-07" → "2026.11.07" */
export const dotDate = (iso: string) => iso.replaceAll("-", ".");

/**
 * 같은 이름의 시군구가 여러 시·도에 있거나(인천 서구, 부산 서구, 강원·경남 고성군)
 * 광역시와 헷갈리는 이름(경기 광주시)은 제목에서 시·도를 앞에 붙입니다
 */
const AMBIGUOUS_PLACE = new Set(["중구", "동구", "서구", "남구", "북구", "강서구", "광주시", "고성군"]);

/** title 용 지역 이름: "김포시", "인천 서구", 시군구가 없는 세종은 "세종" */
export function titlePlace(h: FuneralHome) {
    const short = FUNERAL_SIDO[h.sido].short;
    if (!h.sigungu) return short;
    return AMBIGUOUS_PLACE.has(h.sigungu) ? `${short} ${h.sigungu}` : h.sigungu;
}

/** 업체명에 이미 "반려동물 장례식장"이 들어 있으면 같은 말을 되풀이하지 않도록 뒤쪽 말을 바꿉니다(네이버: 제목 키워드 반복 불이익) */
const NAME_HAS_KEYWORD = /반려동물\s?장례식장/;
export const detailTitle = (h: FuneralHome) =>
    `${h.name} | ${titlePlace(h)} ${NAME_HAS_KEYWORD.test(h.name) ? "허가 동물장묘업" : "반려동물 장례식장"}`;

/** 설명에 넣을 서비스 (홈페이지에 안내가 있는 것만) */
const DESC_SERVICES = [
    ["individualCremation", "개별 화장"],
    ["viewing", "참관"],
    ["pickup", "픽업"],
] as const;

export function detailDescription(h: FuneralHome) {
    const topics: string[] = [];
    if (h.hours) topics.push("운영 시간");
    if (h.prices.length) topics.push("공개 가격");
    const svc = DESC_SERVICES.filter(([k]) => h.services[k]?.status === "yes").map(([, label]) => label);
    if (svc.length) topics.push(`${svc.join("·")} 안내`);
    if (h.access.length) topics.push("오시는 길");
    if (!topics.length) topics.push(h.phone ? "소재지와 전화" : "소재지", "가까운 다른 장례식장");
    return `${h.name}: ${placeLabel(h)} 허가 동물장묘업(${facilityTypesShort(h.facilityTypes)}). ${topics.join(", ")}. 확인일 ${dotDate(h.checkedAt)}.`;
}

/** 대표 이미지 alt: 이미지 안 글자를 그대로 풀어 씁니다 */
export const detailImageAlt = (h: FuneralHome) =>
    `${h.name} 안내 카드. ${placeLabel(h)} 허가 동물장묘업, ${facilityTypesShort(h.facilityTypes)}, 확인일 ${dotDate(h.checkedAt)}`;

/** 공식 목록 출처 (업체가 실린 목록 페이지가 있으면 그 주소) */
export function registrySource(h: FuneralHome) {
    const hit = h.sources.find((s) => s.url.includes("animal.go.kr"));
    return {
        label: h.officialListNo ? `${FUNERAL_REGISTRY_LABEL} (목록 번호 ${h.officialListNo})` : FUNERAL_REGISTRY_LABEL,
        url: hit?.url ?? FUNERAL_REGISTRY_URL,
    };
}

/** 이 페이지에서 쓴 업체 홈페이지 주소 (중복 제거, 가나다·알파벳 순) */
export function homepageSourceUrls(h: FuneralHome) {
    const urls = [
        h.hours?.sourceUrl,
        ...h.prices.map((p) => p.sourceUrl),
        ...SERVICE_KEYS.map((k) => h.services[k]?.sourceUrl),
        ...h.extras.map((e) => e.sourceUrl),
        ...h.access.map((a) => a.sourceUrl),
        h.parking?.sourceUrl,
    ].filter((u): u is string => Boolean(u));
    return [...new Set(urls)].sort();
}

/** 지도·블로그·공공기관 주소인지 (업체가 운영하는 사이트가 아닌 출처) */
const isThirdPartySource = (u: string) => {
    try {
        return /(^|\.)(map\.naver\.com|map\.kakao\.com|blog\.naver\.com)$|\.go\.kr$/.test(new URL(u).hostname);
    } catch {
        return true;
    }
};

/** 업체가 운영하는 사이트에서 옮긴 출처 주소만 */
export const businessSiteUrls = (h: FuneralHome) => homepageSourceUrls(h).filter((u) => !isThirdPartySource(u));

/** 공식 목록에 홈페이지가 없지만 상호로 찾은 업체 사이트에서 정보를 옮긴 경우 그 주소 */
export function foundSiteUrl(h: FuneralHome) {
    if (h.website) return null;
    const first = businessSiteUrls(h)[0];
    if (!first) return null;
    try {
        return `${new URL(first).origin}/`; // 사이트 첫 화면 주소로 보여 줍니다
    } catch {
        return first;
    }
}

/** 화면에 보여 줄 짧은 주소: "idreampet.co.kr/page/page49" */
export function prettyUrl(u: string) {
    try {
        const url = new URL(u);
        const host = url.hostname.replace(/^www\./, "");
        const rest = `${url.pathname === "/" ? "" : url.pathname}${url.search}`;
        let text = `${host}${rest}`;
        try {
            text = decodeURI(text);
        } catch {
            /* 잘못 인코딩된 주소는 그대로 */
        }
        return text.replace(/\/$/, "");
    } catch {
        return u;
    }
}

/** 직선거리 표기: 10km 미만은 소수 한 자리 */
export const formatKm = (km: number) => (km < 10 ? km.toFixed(1) : String(Math.round(km)));

/** 포온이 장례를 안내하는 서울·경기 지역 페이지를 함께 보여 주는 시·도 */
export const isCapitalArea = (h: FuneralHome) => h.sido === "seoul" || h.sido === "gyeonggi" || h.sido === "incheon";

/** "가까운 동네"로 부를 수 있는 직선거리 상한(km). 더 먼 곳은 보여 주지 않습니다 */
export const NEAR_REGION_MAX_KM = 25;

/** 업체에서 가까운 포온 안내 지역 (구·시청 기준 직선거리 순, 25km 이내만) */
export function nearestServiceRegions(h: FuneralHome, n = 4) {
    return REGIONS.map((region) => ({ region, km: distanceKm(h, region) }))
        .filter((x) => x.km <= NEAR_REGION_MAX_KM)
        .sort((a, b) => a.km - b.km)
        .slice(0, n)
        .map((x) => ({ ...x, minutes: estimateDriveMinutes(x.km) }));
}

/** 서비스 항목 이름 "화장 참관": 화장시설이 없는 업체는 "장례 참관" */
export const viewingLabel = (h: FuneralHome) => (isCrematorium(h) ? "화장 참관" : "장례 참관");

/* ───────── 자주 묻는 질문 (데이터로만 답합니다) ───────── */

const NO_INFO = "홈페이지에서 확인된 안내가 없어";

/** 전화번호가 없는 업체에는 실제로 확인할 수 있는 길(네이버 지도 업체 정보, 포온 전화 상담)을 알려 줍니다 */
export const NO_PHONE_ROUTE = "공식 목록에 전화번호가 없어, 네이버 지도의 업체 정보로 확인하거나 포온 전화 상담으로 문의하실 수 있어요.";

/** "개별 화장 여부는" 같은 주어를 받아 확인 방법 문장을 만듭니다 */
const askBusiness = (h: FuneralHome, what: string) =>
    h.phone ? `${what} 업체에 전화로 확인하시길 권합니다.` : `${what} 확인이 필요합니다. ${NO_PHONE_ROUTE}`;

/** 화장시설이 없는 업체(건조장 등)인지: 공식 목록의 취급 시설 기준 */
export const isCrematorium = (h: FuneralHome) => h.facilityTypes.includes("화장시설");
const withNote = (base: string, f: ServiceFact) => (f.note ? `${base}(${f.note}).` : `${base}.`);

function serviceAnswer(h: FuneralHome, f: ServiceFact, text: { yes: string; no: string; unknown: string }) {
    if (f.status === "yes") return `네. ${withNote(text.yes, f)}`;
    if (f.status === "no") return withNote(text.no, f);
    return `${NO_INFO} ${askBusiness(h, text.unknown)}`;
}

export function detailFaqs(h: FuneralHome): Faq[] {
    const faqs: Faq[] = [];

    faqs.push({
        q: `${h.name}, 허가 업체인가요?`,
        a: `네. 동물보호관리시스템의 동물장묘업 등록(허가) 현황에 올라 있습니다. 공식 목록의 취급 시설은 ${h.facilityTypes.join(", ")}입니다(확인일 ${dotDate(h.checkedAt)}). 공식 목록에는 영업 상태가 나오지 않아, 방문 전에 업체에 확인하시길 권합니다.`,
    });

    const all = h.services.allDay;
    // hours.text 는 확인한 내용을 정리한 문장이라 따옴표로 인용하지 않고, 조사가 붙지 않는 형태로 씁니다
    const hoursPart = h.hours ? `확인한 운영 시간 정보: ${h.hours.text}.` : "홈페이지에서 확인된 운영 시간 안내가 없습니다.";
    const allDayPart =
        all.status === "yes"
            ? ` 24시간 접수 안내${h.hours ? "도" : "는"} 있습니다${all.note ? `(${all.note})` : ""}.`
            : all.status === "no"
              ? ` 확인한 운영 시간은 24시간이 아닙니다${all.note ? `(${all.note})` : ""}.`
              : ` ${askBusiness(h, "24시간 가능 여부는")}`;
    faqs.push({ q: `${h.name} 운영 시간은 어떻게 되나요?`, a: `${hoursPart}${allDayPart}` });

    if (h.prices.length) {
        const seen = dotDate(h.prices.map((p) => p.seenAt).sort().at(-1) ?? h.checkedAt);
        faqs.push({
            q: `${h.name} 장례 비용은 얼마인가요?`,
            a: h.priceFrom
                ? `홈페이지에 공개된 장례·화장 가격은 ${formatWon(h.priceFrom)}부터입니다(추가 항목과 할인·차감 조건 제외). 홈페이지 가격 ${h.prices.length}개 항목을 이 페이지 비용 표에 정리했습니다(확인일 ${seen}). 가격은 바뀔 수 있어 예약 전에 업체에 확인하시길 권합니다.`
                : `홈페이지에 기본 장례·화장 가격은 공개되어 있지 않습니다. 봉안·추가 비용 등 ${h.prices.length}개 항목은 이 페이지 비용 표에 정리했습니다(확인일 ${seen}). ${askBusiness(h, "기본 장례 비용은")}`,
        });
    } else {
        faqs.push({
            q: `${h.name} 장례 비용은 얼마인가요?`,
            a: `홈페이지에 공개된 가격이 없어 ${askBusiness(h, "비용은")} 체중별 일반적인 비용 구성은 포온 가이드 "반려동물 장례 비용 총정리"에서 볼 수 있습니다.`,
        });
    }

    if (isCrematorium(h)) {
        faqs.push({
            q: `${h.name}에서 개별 화장을 하나요?`,
            a: serviceAnswer(h, h.services.individualCremation, {
                yes: "홈페이지에 개별 화장 안내가 있습니다",
                no: "홈페이지에 개별 화장을 하지 않는다고 안내되어 있습니다",
                unknown: "개별 화장 여부는",
            }),
        });
    } else {
        // 화장시설이 없는 업체: 홈페이지 문장 대신 공식 목록의 시설 종류로 답합니다
        const types = h.facilityTypes.join(", ");
        const how = h.facilityTypes.includes("건조장시설")
            ? "화장 대신 건조장 방식으로 장례를 진행하는 곳입니다."
            : askBusiness(h, "화장을 어디에서 진행하는지는");
        faqs.push({
            q: `${h.name}에서 화장을 하나요?`,
            a: `공식 목록에 등록된 취급 시설은 ${types}이며 화장시설은 없습니다. ${how}`,
        });
    }

    const viewWord = viewingLabel(h).replace(" 참관", "");
    faqs.push({
        q: `${h.name}에서 ${viewWord} 과정을 볼 수 있나요?`,
        a: serviceAnswer(h, h.services.viewing, {
            yes: `홈페이지에 ${viewWord} 참관 안내가 있습니다`,
            no: `홈페이지에 ${viewWord} 참관을 하지 않는다고 안내되어 있습니다`,
            unknown: "참관 가능 여부는",
        }),
    });

    return faqs;
}
