import { sitemapIndexResponse } from "@/lib/site/sitemaps";

/**
 * 사이트맵 인덱스: /sitemap.xml
 * 네이버·구글에 이미 제출한 주소를 그대로 두고 하위 사이트맵 /sitemap/{id}.xml 을 묶습니다.
 * Next 는 sitemapindex 를 자동으로 만들지 않아 Route Handler 로 직접 씁니다(빌드 시 고정).
 * app/sitemap.ts 는 두지 않습니다. 개발 서버에서 /sitemap.xml 과 겹칩니다(src/lib/site/sitemaps.ts 참고).
 */
export const dynamic = "force-static";

export function GET() {
    return sitemapIndexResponse();
}
