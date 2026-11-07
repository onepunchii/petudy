/**
 * 사이트맵 (색인시킬 페이지만 넣습니다. noindex 페이지는 제외).
 *
 * 구조
 *  - /sitemap.xml          사이트맵 인덱스 (src/app/sitemap.xml/route.ts)
 *  - /sitemap/{id}.xml     하위 사이트맵 (src/app/sitemap/{id}.xml/route.ts, id 마다 폴더 하나)
 *      pages          홈, 소개, 문의, 제휴
 *      services       /[service], /[service]/[sido], /[service]/[sido]/[region]
 *      areas          /area, /area/[sido]/[region]
 *      guides         /guide, /guide/[slug] (+ 표지 이미지)
 *      funeral-homes  /funeral-homes, /funeral-homes/[sido], /funeral-homes/[sido]/[slug] (+ 정사각형 대표 이미지)
 *  - id 를 늘리면 SITEMAP_IDS 와 src/app/sitemap/{id}.xml/route.ts 를 함께 추가합니다.
 *
 * 왜 app/sitemap.ts(generateSitemaps)를 쓰지 않나요?
 *  Next 16 개발 서버는 app/sitemap.ts 를 generateSitemaps 가 있어도 /sitemap.xml 에 함께 등록합니다.
 *  그래서 인덱스 라우트(app/sitemap.xml/route.ts)와 겹쳐 /sitemap.xml 이 500 이 됩니다(2026-11-07 확인).
 *  XML 은 여기서 직접 만들고, 값은 모두 escape 합니다.
 *
 * lastmod 는 요청 시각이 아니라 실제 콘텐츠 수정일(YYYY-MM-DD)입니다.
 *  - 지역·서비스 데이터를 고치면 아래 날짜 상수를 함께 갱신하세요.
 *  - 가이드는 guides.ts 의 updated, 장례식장은 데이터의 checkedAt 을 그대로 씁니다.
 *
 * 등록: 네이버 서치어드바이저 / 구글 서치콘솔에는 인덱스 {SITE_URL}/sitemap.xml 하나만 제출합니다.
 */
import { absoluteUrl } from "./config";
import {
    FUNERAL_HOMES,
    FUNERAL_HOMES_CHECKED_AT,
    funeralHomePath,
    funeralHomesPath,
    funeralSidoList,
    funeralSidoPath,
    ogImagePath,
    type FuneralHome,
} from "./funeral-homes";
import { GUIDES, guideCover } from "./guides";
import { isIndexable } from "./local";
import { REGIONS, regionsBySido } from "./regions";
import { liveServices, type ServiceSlug } from "./services";

export const SITEMAP_IDS = ["pages", "services", "areas", "guides", "funeral-homes"] as const;
export type SitemapId = (typeof SITEMAP_IDS)[number];
export const isSitemapId = (s: string): s is SitemapId => (SITEMAP_IDS as readonly string[]).includes(s);

/** 홈·소개·문의·제휴, 지역(/area) 페이지의 마지막 콘텐츠 수정일 */
const SITE_CONTENT_UPDATED = "2026-11-06";
/** 서비스 페이지 마지막 수정일. 장례는 허가 장례식장 목록 연결을 넣은 날입니다 */
const SERVICE_PAGES_UPDATED: Partial<Record<ServiceSlug, string>> = {
    funeral: "2026-11-07",
};
/** /guide 목록에 장례식장 목록 링크를 넣은 날 */
const GUIDE_INDEX_UPDATED = "2026-11-07";

type ChangeFrequency = "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
export interface SitemapEntry {
    /** 절대 URL (escape 전) */
    url: string;
    /** YYYY-MM-DD */
    lastModified: string;
    changeFrequency?: ChangeFrequency;
    priority?: number;
    /** 절대 URL (escape 전) */
    images?: string[];
}

const XML_ENTITIES: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" };
export const xmlEscape = (s: string) => s.replace(/[&<>"']/g, (c) => XML_ENTITIES[c]);
/** ASCII 밖 글자(한글 경로 등)는 percent-encode 하고(이미 인코딩된 %xx 는 그대로), XML escape */
const xmlUrl = (url: string) => xmlEscape(url.replace(/[^\x21-\x7E]+/g, (run) => encodeURI(run)));

const entry = (
    path: string,
    priority: number,
    changeFrequency: ChangeFrequency = "weekly",
    lastModified = SITE_CONTENT_UPDATED,
    images?: string[],
): SitemapEntry => ({
    url: absoluteUrl(path),
    lastModified,
    changeFrequency,
    priority,
    ...(images?.length ? { images: images.map((src) => (/^https?:\/\//.test(src) ? src : absoluteUrl(src))) } : {}),
});

function pagesSitemap(): SitemapEntry[] {
    return [entry("/", 1, "daily"), entry("/about", 0.3, "monthly"), entry("/contact", 0.3, "monthly"), entry("/partners", 0.3, "monthly")];
}

function servicesSitemap(): SitemapEntry[] {
    const live = liveServices();
    const updated = (s: ServiceSlug) => SERVICE_PAGES_UPDATED[s] ?? SITE_CONTENT_UPDATED;
    return [
        ...live.map((s) => entry(`/${s.slug}`, 0.9, "weekly", updated(s.slug))),
        ...live.flatMap((s) =>
            (["seoul", "gyeonggi"] as const)
                .filter((sido) => regionsBySido(sido).some((r) => isIndexable(s, r)))
                .map((sido) => entry(`/${s.slug}/${sido}`, 0.8, "weekly", updated(s.slug))),
        ),
        ...live.flatMap((s) =>
            REGIONS.filter((r) => isIndexable(s, r)).map((r) => entry(`/${s.slug}/${r.sido}/${r.slug}`, 0.7, "weekly", updated(s.slug))),
        ),
    ];
}

function areasSitemap(): SitemapEntry[] {
    return [entry("/area", 0.6), ...REGIONS.map((r) => entry(`/area/${r.sido}/${r.slug}`, 0.5, "monthly"))];
}

function guidesSitemap(): SitemapEntry[] {
    const latest = GUIDES.reduce((d, g) => (g.updated > d ? g.updated : d), GUIDE_INDEX_UPDATED);
    return [
        entry("/guide", 0.6, "weekly", latest),
        ...GUIDES.map((g) => entry(`/guide/${g.slug}`, 0.6, "monthly", g.updated, [guideCover(g.slug).src])),
    ];
}

function funeralHomesSitemap(): SitemapEntry[] {
    // 확인일이 빠진 기록이 있어도 데이터 전체 확인일로 받칩니다
    const checkedAt = (h: FuneralHome) => h.checkedAt || FUNERAL_HOMES_CHECKED_AT;
    const latestOf = (dates: string[]) => dates.reduce((a, b) => (b > a ? b : a), "") || FUNERAL_HOMES_CHECKED_AT;
    const hub = funeralHomesPath();
    return [
        entry(hub, 0.8, "weekly", latestOf(FUNERAL_HOMES.map(checkedAt)), [ogImagePath(hub)]),
        ...funeralSidoList().map((s) => {
            const path = funeralSidoPath(s.slug);
            const checked = latestOf(FUNERAL_HOMES.filter((h) => h.sido === s.slug).map(checkedAt));
            return entry(path, 0.7, "monthly", checked, [ogImagePath(path)]);
        }),
        ...FUNERAL_HOMES.map((h) => {
            const path = funeralHomePath(h);
            return entry(path, 0.6, "monthly", checkedAt(h), [ogImagePath(path)]);
        }),
    ];
}

const BUILDERS: Record<SitemapId, () => SitemapEntry[]> = {
    pages: pagesSitemap,
    services: servicesSitemap,
    areas: areasSitemap,
    guides: guidesSitemap,
    "funeral-homes": funeralHomesSitemap,
};

export const buildSitemap = (id: SitemapId): SitemapEntry[] => BUILDERS[id]();

/** 하위 사이트맵의 lastmod: 그 안 항목 중 가장 최근 수정일 */
export const sectionLastModified = (id: SitemapId) =>
    buildSitemap(id).reduce((d, e) => (e.lastModified > d ? e.lastModified : d), SITE_CONTENT_UPDATED);

const XML_HEAD = '<?xml version="1.0" encoding="UTF-8"?>';
const NS_SITEMAP = "http://www.sitemaps.org/schemas/sitemap/0.9";
const NS_IMAGE = "http://www.google.com/schemas/sitemap-image/1.1";

/** /sitemap/{id}.xml 본문 (urlset, 이미지가 있으면 image 확장) */
export function sitemapXml(id: SitemapId) {
    const entries = buildSitemap(id);
    const hasImages = entries.some((e) => e.images?.length);
    const urls = entries.map((e) =>
        [
            "<url>",
            `<loc>${xmlUrl(e.url)}</loc>`,
            `<lastmod>${xmlEscape(e.lastModified)}</lastmod>`,
            e.changeFrequency ? `<changefreq>${e.changeFrequency}</changefreq>` : "",
            typeof e.priority === "number" ? `<priority>${e.priority}</priority>` : "",
            ...(e.images ?? []).map((src) => `<image:image><image:loc>${xmlUrl(src)}</image:loc></image:image>`),
            "</url>",
        ]
            .filter(Boolean)
            .join("\n"),
    );
    const ns = `xmlns="${NS_SITEMAP}"${hasImages ? ` xmlns:image="${NS_IMAGE}"` : ""}`;
    return `${XML_HEAD}\n<urlset ${ns}>\n${urls.join("\n")}\n</urlset>\n`;
}

/** /sitemap.xml 인덱스 본문 */
export function sitemapIndexXml() {
    const items = SITEMAP_IDS.map(
        (id) => `<sitemap>\n<loc>${xmlUrl(absoluteUrl(`/sitemap/${id}.xml`))}</loc>\n<lastmod>${xmlEscape(sectionLastModified(id))}</lastmod>\n</sitemap>`,
    );
    return `${XML_HEAD}\n<sitemapindex xmlns="${NS_SITEMAP}">\n${items.join("\n")}\n</sitemapindex>\n`;
}

const XML_HEADERS = { "Content-Type": "application/xml; charset=utf-8" };
/** Route Handler 응답 (각 라우트는 force-static 이라 빌드 시 고정됩니다) */
export const sitemapResponse = (id: SitemapId) => new Response(sitemapXml(id), { headers: XML_HEADERS });
export const sitemapIndexResponse = () => new Response(sitemapIndexXml(), { headers: XML_HEADERS });
