"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, Home, Sparkles, User } from "lucide-react";
import { APP_ICON_STROKE } from "@/components/app/tokens";
import { cn } from "@/lib/utils";

/**
 * 앱 하단 탭. 사이트 모바일 하단 바(MobileCallBar)와 같은 밤색 플로팅 알약입니다.
 * 활성 탭은 라임 알약 안에 아이콘 (추억상자 화면에서는 라임 대신 흰색: 떠난 뒤의 화면은 차분하게).
 */
const TABS = [
    { name: "홈", href: "/app", icon: Home },
    { name: "내 상담", href: "/booking", icon: CalendarDays },
    { name: "추억상자", href: "/memorial", icon: Sparkles },
    { name: "내 정보", href: "/mypage", icon: User },
] as const;

export function BottomNav() {
    const pathname = usePathname();

    if (pathname.startsWith("/booking/new") || pathname.startsWith("/mbti") || pathname.startsWith("/intro")) return null;

    const calm = pathname.startsWith("/memorial");

    return (
        <nav
            aria-label="앱 메뉴"
            className="pointer-events-none fixed inset-x-0 bottom-0 z-50 px-3"
            style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}
        >
            <ul className="pointer-events-auto mx-auto flex max-w-[480px] items-stretch gap-1 rounded-full bg-night/90 p-1.5 shadow-[0_12px_32px_-8px_rgb(11_16_32/0.5)] ring-1 ring-white/10 backdrop-blur-md">
                {TABS.map((tab) => {
                    // 홈(/app)은 정확히 일치할 때만, 나머지 탭은 하위 경로(/memorial/123 등)에서도 활성
                    const isActive = tab.href === "/app" ? pathname === "/app" : pathname.startsWith(tab.href);
                    return (
                        <li key={tab.href} className="flex-1">
                            <Link
                                href={tab.href}
                                aria-current={isActive ? "page" : undefined}
                                className={cn(
                                    "flex h-14 flex-col items-center justify-center gap-1 rounded-full text-[11px] font-semibold transition-colors active:translate-y-px",
                                    isActive ? "text-star" : "text-star-3 hover:text-star-2",
                                )}
                            >
                                <span
                                    className={cn(
                                        "flex h-7 w-12 items-center justify-center rounded-full transition-colors",
                                        isActive && (calm ? "bg-star text-ink" : "bg-lime text-ink"),
                                    )}
                                >
                                    <tab.icon className="h-[19px] w-[19px]" strokeWidth={isActive ? 2 : APP_ICON_STROKE} aria-hidden />
                                </span>
                                {tab.name}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}
