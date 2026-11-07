/**
 * 장례식장 상세 페이지(/funeral-homes/[sido]/[slug])의 경로와 구조화 데이터(JSON-LD).
 *
 * - LocalBusiness: 화장시설이 있으면 ["LocalBusiness","Crematorium"] (schema.org 에 FuneralHome 타입은 없음).
 *   좌표는 대부분 시·군청 기준 대략값이라 geo 를 넣지 않습니다. 별점, 가격대도 넣지 않습니다.
 * - url 은 우리 페이지, 업체 홈페이지는 sameAs 로만 둡니다. 여러 지점이 같은 브랜드 사이트를 쓰면(포포즈, 21그램 등)
 *   지점들이 한 업체로 합쳐 읽히지 않도록 sameAs 를 넣지 않습니다.
 * - image / primaryImageOfPage 는 og:image 와 같은 정사각형 이미지 URL 입니다.
 */
import { SITE, absoluteUrl } from "./config";
import { FUNERAL_HOMES, FUNERAL_SIDO, funeralHomePath, funeralHomesPath, funeralSidoPath, ogImagePath, telE164, type FuneralHome } from "./funeral-homes";
import { breadcrumbLd } from "./schema";

/** 화면 경로 표시: 홈 › 반려동물 장례식장 찾기 › 시·도 › 업체 */
export function funeralHomeCrumbs(h: FuneralHome) {
    return [
        { name: "홈", href: "/" },
        { name: "반려동물 장례식장 찾기", href: funeralHomesPath() },
        { name: FUNERAL_SIDO[h.sido].short, href: funeralSidoPath(h.sido) },
        { name: h.name, href: funeralHomePath(h) },
    ];
}

/** 정사각형 대표 이미지 (페이지 상대 경로와 절대 URL). og:image, 본문 <img>, JSON-LD 가 같은 주소를 씁니다 */
export function funeralHomeImage(h: FuneralHome) {
    const path = ogImagePath(funeralHomePath(h), "square");
    return { path, url: absoluteUrl(path) };
}

/** 홈페이지 주소별 업체 수 (끝의 / 와 www. 차이는 같은 주소로 봅니다) */
const siteKey = (u: string) => u.trim().toLowerCase().replace(/^https?:\/\/(www\.)?/, "").replace(/\/+$/, "");
const SITE_COUNT = FUNERAL_HOMES.reduce((m, h) => (h.website ? m.set(siteKey(h.website), (m.get(siteKey(h.website)) ?? 0) + 1) : m), new Map<string, number>());
/** 이 업체만 쓰는 홈페이지일 때만 sameAs 로 씁니다 */
const ownWebsite = (h: FuneralHome) => (h.website && SITE_COUNT.get(siteKey(h.website)) === 1 ? h.website : null);

const businessId = (h: FuneralHome) => absoluteUrl(`${funeralHomePath(h)}#business`);

/** JSON-LD 경로의 첫 항목은 "홈" 대신 사이트 이름을 씁니다(네이버 가이드: 일반 단어 금지). 화면 표시는 그대로 */
export const funeralHomeBreadcrumbLd = (h: FuneralHome) =>
    breadcrumbLd(funeralHomeCrumbs(h).map((c, i) => (i === 0 ? { ...c, name: SITE.name } : c)));

export function funeralHomeBusinessLd(h: FuneralHome) {
    const locality = [h.sigungu, h.district].filter(Boolean).join(" ") || h.sidoName;
    return {
        "@context": "https://schema.org",
        "@type": h.facilityTypes.includes("화장시설") ? ["LocalBusiness", "Crematorium"] : "LocalBusiness",
        "@id": businessId(h),
        name: h.name,
        address: {
            "@type": "PostalAddress",
            streetAddress: h.address,
            addressLocality: locality,
            addressRegion: h.sidoName,
            addressCountry: "KR",
        },
        ...(h.phone ? { telephone: telE164(h.phone) } : {}),
        url: absoluteUrl(funeralHomePath(h)),
        image: funeralHomeImage(h).url,
        ...(ownWebsite(h) ? { sameAs: [ownWebsite(h)] } : {}),
    };
}

export function funeralHomeWebPageLd(h: FuneralHome, opts: { title: string; description: string; imageAlt: string }) {
    const url = absoluteUrl(funeralHomePath(h));
    const image = funeralHomeImage(h).url;
    return {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: opts.title,
        description: opts.description,
        inLanguage: "ko-KR",
        dateModified: h.checkedAt,
        isPartOf: { "@id": absoluteUrl("/#website") },
        about: { "@id": businessId(h) },
        primaryImageOfPage: {
            "@type": "ImageObject",
            url: image,
            contentUrl: image,
            width: 1200,
            height: 1200,
            caption: opts.imageAlt,
        },
    };
}
