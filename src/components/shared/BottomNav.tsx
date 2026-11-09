"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Moon, Phone, Scissors, Sparkles, User } from "lucide-react";
import { APP_ICON_STROKE } from "@/components/app/tokens";
import { SITE } from "@/lib/site/config";
import { cn } from "@/lib/utils";

/**
 * 포온 하단 탭. 사이트와 앱 화면 모두에 같은 밤색 플로팅 알약을 띄웁니다(lg 이상은 헤더 메뉴를 쓰므로 숨김).
 * 활성 탭은 라임 알약 안에 아이콘. 장례·추억상자 화면에서는 라임 대신 흰색(떠남과 관련된 화면은 차분하게).
 * call: 사이트 화면에서 탭 위에 전화 상담·상담 남기기 버튼을 함께 띄웁니다.
 */
const TABS = [
    {
        name: "홈",
        href: "/",
        icon: Home,
        match: (p: string) => p === "/",
    },
    {
        name: "장례",
        href: "/funeral",
        icon: Moon,
        match: (p: string) => p === "/funeral" || p.startsWith("/funeral/") || p.startsWith("/funeral-homes"),
    },
    {
        name: "미용",
        href: "/grooming",
        icon: Scissors,
        match: (p: string) => p.startsWith("/grooming"),
    },
    {
        name: "추억상자",
        href: "/memorial",
        icon: Sparkles,
        match: (p: string) => p.startsWith("/memorial") && !p.startsWith("/memorial-shared"),
    },
    {
        name: "내 정보",
        href: "/mypage",
        icon: User,
        match: (p: string) => ["/mypage", "/booking", "/settings", "/profile"].some((prefix) => p.startsWith(prefix)),
    },
] as const;

/**
 * 하단 '상담 남기기'가 보던 서비스를 들고 갑니다(/contact?service=…). 미용 화면에서 눌렀는데 장례로 접수되지 않게.
 * 가이드 글은 그 글의 서비스(guideServices: 글 주소 → 서비스, 사이트 레이아웃이 서버에서 만들어 넘김)를 씁니다.
 * 서비스를 알 수 없는 화면은 /contact 로 가고, 폼에서 '아직 모르겠어요'로 시작합니다.
 */
function contactHref(p: string, guideServices?: Record<string, string>) {
    if (p === "/funeral" || p.startsWith("/funeral/") || p.startsWith("/funeral-homes")) return "/contact?service=funeral";
    if (p === "/grooming" || p.startsWith("/grooming/")) return "/contact?service=grooming";
    const guide = p.match(/^\/guide\/([^/?#]+)/)?.[1];
    const service = guide ? guideServices?.[guide] : undefined;
    return service ? `/contact?service=${service}` : "/contact";
}

export function BottomNav({ call = false, guideServices }: { call?: boolean; guideServices?: Record<string, string> }) {
    const pathname = usePathname() ?? "/";

    if (pathname.startsWith("/booking/new") || pathname.startsWith("/mbti") || pathname.startsWith("/intro")) return null;
    // 지인이 받은 공개 부고장에는 하단 탭(미용·내 정보 등)을 띄우지 않습니다
    if (/^\/memorial\/[^/]+\/obituary\/[^/]+/.test(pathname)) return null;

    // 장례·추억상자 화면에서는 라임을 쓰지 않습니다
    const calm = pathname.startsWith("/funeral") || pathname.startsWith("/memorial");

    return (
        <nav
            aria-label="하단 메뉴"
            className="pointer-events-none fixed inset-x-0 bottom-0 z-50 px-3 lg:hidden"
            style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}
        >
            <div className="mx-auto max-w-[480px]">
                {call && (
                    <div className="mb-2 flex justify-end gap-2">
                        <a
                            href={SITE.phoneHref}
                            className="pointer-events-auto inline-flex h-10 items-center gap-1.5 whitespace-nowrap rounded-full bg-star px-4 text-[14px] font-semibold text-ink shadow-[0_8px_24px_-8px_rgb(11_16_32/0.45)] active:translate-y-px"
                        >
                            <Phone className="h-4 w-4 shrink-0" strokeWidth={APP_ICON_STROKE} aria-hidden />
                            전화 상담 <span className="tabular-nums max-[359px]:hidden">{SITE.phone}</span>
                        </a>
                        <Link
                            href={contactHref(pathname, guideServices)}
                            className="pointer-events-auto inline-flex h-10 items-center whitespace-nowrap rounded-full bg-night/90 px-4 text-[14px] font-semibold text-star shadow-[0_8px_24px_-8px_rgb(11_16_32/0.45)] ring-1 ring-white/20 backdrop-blur-md active:translate-y-px"
                        >
                            상담 남기기
                        </Link>
                    </div>
                )}
                <ul className="pointer-events-auto flex items-stretch gap-0.5 rounded-full bg-night/90 p-1.5 shadow-[0_12px_32px_-8px_rgb(11_16_32/0.5)] ring-1 ring-white/10 backdrop-blur-md min-[360px]:gap-1">
                    {TABS.map((tab) => {
                        const isActive = tab.match(pathname);
                        return (
                            <li key={tab.href} className="min-w-0 flex-1">
                                <Link
                                    href={tab.href}
                                    aria-current={isActive ? "page" : undefined}
                                    className={cn(
                                        "flex h-14 flex-col items-center justify-center gap-1 whitespace-nowrap rounded-full text-[11px] font-semibold transition-colors active:translate-y-px",
                                        isActive ? "text-star" : "text-star-3 hover:text-star-2",
                                    )}
                                >
                                    <span
                                        className={cn(
                                            "flex h-7 w-11 items-center justify-center rounded-full transition-colors min-[360px]:w-12",
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
            </div>
        </nav>
    );
}
