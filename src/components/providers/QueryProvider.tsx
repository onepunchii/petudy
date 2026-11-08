"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

/**
 * 브라우저에서는 QueryClient 를 하나만 만들어 계속 씁니다.
 * 사이트 화면(홈·장례·미용)과 앱 화면(추억상자·내 정보)을 오가면 (app) 레이아웃이 다시 그려지는데,
 * 그때마다 새로 만들면 아이 목록 같은 캐시가 버려져 다시 불러옵니다. 서버에서는 요청마다 새로 만듭니다.
 */
let browserClient: QueryClient | undefined;

function makeQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: {
                // SSR 직후 곧바로 다시 불러오지 않도록 약간의 staleTime
                staleTime: 60 * 1000,
            },
        },
    });
}

function getQueryClient() {
    if (typeof window === "undefined") return makeQueryClient();
    return (browserClient ??= makeQueryClient());
}

export default function QueryProvider({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={getQueryClient()}>{children}</QueryClientProvider>;
}
