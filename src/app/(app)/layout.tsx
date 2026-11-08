import type { Metadata, Viewport } from "next";
import AuthProvider from "@/components/providers/AuthProvider";
import QueryProvider from "@/components/providers/QueryProvider";
import { SiteHeader } from "@/components/site/SiteHeader";

// 서버 컴포넌트 ("use client" 금지 — metadata/viewport export 가 필요합니다)
export const metadata: Metadata = {
    title: {
        default: "포온",
        template: "%s | 포온",
    },
    // 내 아이·추억상자 같은 화면은 로그인·개인 기록 중심이라 검색 색인에서 제외 (링크는 따라감)
    robots: {
        index: false,
        follow: true,
    },
};

// 이 화면들은 네이티브 앱처럼 확대를 잠급니다. (사이트는 루트 layout 에서 확대 허용)
export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    themeColor: "#0B1020", // 사이트와 같은 밤(night)
};

export default function AppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <QueryProvider>
        <AuthProvider>
        {/* .app: 사이트와 같은 글꼴·토큰·탑승권 카드 범위 (globals.css).
            데스크톱(lg 이상)에서는 사이트와 같은 헤더를 위에 두고, 밤하늘 위에 휴대폰 폭 화면을 띄웁니다.
            모바일은 헤더 없이 화면 전체 + 하단 탭(BottomNav) */}
        <div className="app relative isolate flex min-h-[100dvh] w-full flex-col overflow-hidden bg-night">
            <div className="site-stars -z-10 hidden lg:block" aria-hidden />

            <div className="relative z-20 hidden lg:block">
                <SiteHeader />
            </div>

            <div className="flex w-full flex-1 justify-center">
                {/* main 에 z-index 를 주지 않습니다: 안의 시트·모달(fixed)이 데스크톱 헤더 위로 덮이도록 */}
                <main className="scrollbar-hide relative h-[100dvh] w-full max-w-[512px] overflow-y-auto overflow-x-hidden bg-moon lg:h-[calc(100dvh-4rem)] lg:shadow-[0_0_0_1px_rgb(238_241_246/0.08),0_40px_120px_-30px_rgb(0_0_0/0.6)]">
                    {children}
                </main>
            </div>
        </div>
        </AuthProvider>
        </QueryProvider>
    );
}
