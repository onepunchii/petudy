import type { Metadata } from "next";
import { SITE } from "@/lib/site/config";
import { SiteHeader } from "@/components/site/SiteHeader";
import { MobileCallBar, SiteFooter } from "@/components/site/SiteFooter";

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
        <div className="site min-h-screen">
            {/* Pretendard (한글 웹폰트, 동적 서브셋) */}
            <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="" />
            <link
                rel="stylesheet"
                href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
            />
            <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-ink focus:px-4 focus:py-2 focus:text-white">
                본문 바로가기
            </a>
            <SiteHeader />
            <main id="main">{children}</main>
            <SiteFooter />
            <MobileCallBar />
        </div>
    );
}
