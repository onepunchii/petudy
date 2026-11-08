import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site/config";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                // API·인증 콜백은 막습니다. 로그인·내 정보·등록·상담 내역은 하단 탭으로 모든 페이지에서 링크되므로
                // 막지 않고 각 페이지의 noindex(앱 레이아웃)를 검색엔진이 읽게 둡니다 (막으면 noindex 를 못 읽어 주소만 색인될 수 있음)
                disallow: ["/api/", "/auth/", "/settings/", "/profile/"],
            },
        ],
        // 사이트맵 인덱스 한 줄. 하위 사이트맵(/sitemap/{id}.xml)은 인덱스가 묶습니다
        sitemap: absoluteUrl("/sitemap.xml"),
        host: absoluteUrl("/"),
    };
}
