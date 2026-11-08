import type { Metadata } from "next";
import { SITE } from "@/lib/site/config";
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
};

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
            <BottomNav call />
        </div>
    );
}
