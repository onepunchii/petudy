import type { Metadata, Viewport } from "next";
import { SITE } from "@/lib/site/config";
import { GUIDES } from "@/lib/site/guides";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { BottomNav } from "@/components/shared/BottomNav";

export const metadata: Metadata = {
    metadataBase: new URL(SITE.url),
    title: {
        default: `${SITE.fullName} | 반려동물 장례·애견미용 우리 동네 가까운 곳 연결`,
        template: `%s | ${SITE.name}`,
    },
    description: SITE.description,
    applicationName: SITE.fullName,
    openGraph: {
        type: "website",
        locale: "ko_KR",
        siteName: SITE.fullName,
    },
    twitter: { card: "summary_large_image" },
    verification: {
        google: SITE.verification.google || undefined,
        other: SITE.verification.naver ? { "naver-site-verification": SITE.verification.naver } : undefined,
    },
    formatDetection: { telephone: true },
    // 홈 화면에 추가했을 때 아이콘 아래 이름은 '포온'. 독립 창(capable)은 아이폰 로그인 확인 뒤 켭니다(src/app/manifest.ts).
    // Next 는 capable 을 빼면 true 로 채우므로 false 를 꼭 적습니다
    appleWebApp: { capable: false, title: SITE.name },
};

/**
 * 휴대폰 브라우저 위쪽(상태 표시줄) 색. 지금은 모든 사이트 화면이 밤색 머리로 시작해 night 하나입니다.
 * 낮 화면에 밝은 머리가 생기면(2단계) 그 화면만 밝은 색으로 바꿉니다.
 */
export const viewport: Viewport = {
    themeColor: "#0B1020",
};

/** 하단 '상담 남기기'가 가이드 글에서 그 글의 서비스를 넘기도록 쓰는 짧은 표(글 주소 → 서비스). 화면 코드에 가이드 본문을 싣지 않습니다 */
const GUIDE_SERVICES: Record<string, string> = Object.fromEntries(GUIDES.map((g) => [g.slug, g.service]));

export default function SiteLayout({ children }: { children: React.ReactNode }) {
    return (
        // site-grain: 화면 고정 가상요소 한 장으로 종이 결을 얹습니다(globals.css)
        <div className="site site-grain min-h-dvh">
            <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-star focus:px-4 focus:py-2 focus:font-semibold focus:text-ink">
                본문 바로가기
            </a>
            <SiteHeader />
            <main id="main">{children}</main>
            {/* 모바일 하단 탭(앱과 같은 탭) + 전화·상담 버튼. 탭에 가리지 않도록 푸터 아래 여백은 SiteFooter 가 줍니다 */}
            <SiteFooter />
            <BottomNav call guideServices={GUIDE_SERVICES} />
        </div>
    );
}
