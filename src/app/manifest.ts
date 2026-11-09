import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site/config";

/**
 * 홈 화면에 추가(웹 앱). 아이콘은 사이트 로고(별빛 원 + 남색 하트)를 밤색 바탕에 그린 것입니다(public/icons).
 * 시작 화면 색은 사이트 첫 화면(밤 히어로·머리)과 같은 night 입니다.
 * 설치를 권하는 팝업은 띄우지 않습니다(검색으로 온 사람의 본문을 가리지 않음, 장례 화면에서 권하지 않음).
 *
 * display 는 지금 "browser" 입니다. 홈 화면 아이콘이 독립 창(standalone)으로 열리면 아이폰에서 카카오·구글 로그인
 * (PKCE 쿠키)이 Safari 와 쿠키를 나눠 쓰지 못해 끝나지 않을 수 있습니다. DB 복구 뒤 실제 아이폰에서 로그인을 확인하고
 * standalone 으로 바꿉니다(그때 (site)/layout.tsx 의 appleWebApp.capable 도 함께). "browser" 라 안드로이드 크롬의
 * 자동 설치 안내도 뜨지 않습니다.
 */
export default function manifest(): MetadataRoute.Manifest {
    return {
        name: SITE.fullName,
        short_name: SITE.name,
        description: SITE.description,
        lang: "ko",
        start_url: "/",
        scope: "/",
        display: "browser",
        background_color: "#0B1020",
        theme_color: "#0B1020",
        icons: [
            { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
            { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
            { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
    };
}
