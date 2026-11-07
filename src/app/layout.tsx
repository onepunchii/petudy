import type { Metadata, Viewport } from "next";
import { SITE } from "@/lib/site/config";
import "./globals.css";

export const metadata: Metadata = {
    // 앱·IR 쪽 opengraph-image 의 절대 URL 기준 ((site) 그룹과 같은 값)
    metadataBase: new URL(SITE.url),
    title: SITE.name,
    description: SITE.fullName,
};

// 사이트는 확대를 허용합니다(접근성). 앱 화면의 확대 잠금은 (app)/layout.tsx 에서 따로 지정합니다.
export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ko">
            <head>
                {/* Pretendard (한글 웹폰트, 동적 서브셋). 사이트와 앱이 같은 글꼴을 씁니다 */}
                <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="" />
                <link
                    rel="stylesheet"
                    href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
                />
            </head>
            {/* 로그인·데이터 Provider 는 (app) 그룹에만 둡니다.
                AuthProvider 가 저장소 복원 전까지 null 을 반환하므로, 루트에 두면
                에이전시 사이트의 서버 HTML 본문이 통째로 비어 검색엔진에 노출되지 않습니다. */}
            <body className="antialiased min-h-screen font-sans">{children}</body>
        </html>
    );
}
