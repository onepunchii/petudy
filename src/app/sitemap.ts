import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site/config";
import { GUIDES } from "@/lib/site/guides";
import { isIndexable } from "@/lib/site/local";
import { REGIONS, regionsBySido } from "@/lib/site/regions";
import { liveServices } from "@/lib/site/services";

/**
 * 사이트맵 — 색인시킬 페이지만 넣습니다 (noindex 페이지는 제외).
 * lastModified 는 매 요청 시각이 아니라 실제 콘텐츠 수정일을 씁니다.
 * 지역·서비스 데이터를 고치면 SITE_CONTENT_UPDATED 를 함께 갱신하세요.
 *
 * 등록: 네이버 서치어드바이저 / 구글 서치콘솔 → {SITE_URL}/sitemap.xml 제출
 */
const SITE_CONTENT_UPDATED = "2026-11-06";

export default function sitemap(): MetadataRoute.Sitemap {
    const updated = new Date(SITE_CONTENT_UPDATED);
    const entry = (path: string, priority: number, changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] = "weekly", lastModified = updated) => ({
        url: absoluteUrl(path),
        lastModified,
        changeFrequency,
        priority,
    });

    const live = liveServices();
    return [
        entry("/", 1, "daily"),
        ...live.map((s) => entry(`/${s.slug}`, 0.9)),
        ...live.flatMap((s) =>
            (["seoul", "gyeonggi"] as const)
                .filter((sido) => regionsBySido(sido).some((r) => isIndexable(s, r)))
                .map((sido) => entry(`/${s.slug}/${sido}`, 0.8)),
        ),
        ...live.flatMap((s) => REGIONS.filter((r) => isIndexable(s, r)).map((r) => entry(`/${s.slug}/${r.sido}/${r.slug}`, 0.7))),
        entry("/area", 0.6),
        ...REGIONS.map((r) => entry(`/area/${r.sido}/${r.slug}`, 0.5, "monthly")),
        entry("/guide", 0.6),
        ...GUIDES.map((g) => entry(`/guide/${g.slug}`, 0.6, "monthly", new Date(g.updated))),
        entry("/about", 0.3, "monthly"),
        entry("/contact", 0.3, "monthly"),
        entry("/partners", 0.3, "monthly"),
    ];
}
