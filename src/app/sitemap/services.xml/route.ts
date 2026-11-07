import { sitemapResponse } from "@/lib/site/sitemaps";

/** 하위 사이트맵 /sitemap/services.xml (항목과 수정일은 src/lib/site/sitemaps.ts) */
export const dynamic = "force-static";

export function GET() {
    return sitemapResponse("services");
}
