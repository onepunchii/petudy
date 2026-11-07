/** 장례식장 목록 페이지 구조화 데이터 (BreadcrumbList, CollectionPage + ItemList) */
import { SITE, absoluteUrl } from "@/lib/site/config";
import { FUNERAL_HOMES_CHECKED_AT, ogImagePath } from "@/lib/site/funeral-homes";
import { breadcrumbLd } from "@/lib/site/schema";

type Crumb = { name: string; href: string };

/** 네이버 가이드: BreadcrumbList 이름에 "홈" 같은 일반 단어를 쓰지 않으므로 첫 항목은 사이트 이름으로. 화면 경로는 그대로 둡니다 */
export const listingBreadcrumbLd = (crumbs: Crumb[]) => breadcrumbLd(crumbs.map((c, i) => (i === 0 && c.name === "홈" ? { ...c, name: SITE.name } : c)));

/**
 * 목록 페이지. 대표 이미지는 og:image 와 같은 정사각형 URL(primaryImageOfPage).
 * ItemList 는 url 만 넣고 image 는 넣지 않습니다(업체 실사 사진이 없어 캐러셀 대상이 아님).
 */
export function collectionPageLd({ path, name, description, itemPaths }: { path: string; name: string; description: string; itemPaths: string[] }) {
    const url = absoluteUrl(path);
    return {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "@id": `${url}#page`,
        url,
        name,
        description,
        inLanguage: "ko-KR",
        isPartOf: { "@id": absoluteUrl("/#website") },
        dateModified: FUNERAL_HOMES_CHECKED_AT,
        primaryImageOfPage: { "@type": "ImageObject", url: absoluteUrl(ogImagePath(path, "square")), width: 1200, height: 1200 },
        mainEntity: {
            "@type": "ItemList",
            numberOfItems: itemPaths.length,
            itemListElement: itemPaths.map((p, i) => ({ "@type": "ListItem", position: i + 1, url: absoluteUrl(p) })),
        },
    };
}
