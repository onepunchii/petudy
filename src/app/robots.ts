import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site/config";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                // 로그인·개인 영역(모바일 앱)과 API 는 검색 대상에서 제외
                disallow: ["/api/", "/auth/", "/login", "/mypage", "/settings/", "/register", "/booking", "/profile/"],
            },
        ],
        // 사이트맵 인덱스 한 줄. 하위 사이트맵(/sitemap/{id}.xml)은 인덱스가 묶습니다
        sitemap: absoluteUrl("/sitemap.xml"),
        host: absoluteUrl("/"),
    };
}
