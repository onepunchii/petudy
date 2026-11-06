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
        sitemap: absoluteUrl("/sitemap.xml"),
        host: absoluteUrl("/"),
    };
}
