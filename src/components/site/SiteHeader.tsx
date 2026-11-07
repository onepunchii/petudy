"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ArrowUpRight, Menu, Phone, X } from "lucide-react";
import { SITE } from "@/lib/site/config";
import { SERVICES } from "@/lib/site/services";
import { cn } from "@/lib/utils";

const NAV = [
    { href: "/funeral", label: "반려동물 장례" },
    // 허가 장례식장 디렉터리 (/funeral-homes). "/funeral" 활성 표시와 겹치지 않습니다(isActive 는 "/funeral/" 접두만 봄)
    { href: "/funeral-homes", label: "장례식장 찾기" },
    { href: "/grooming", label: "애견미용" },
    { href: "/area", label: "지역별 찾기" },
    { href: "/guide", label: "보호자 가이드" },
    { href: "/about", label: "포온 소개" },
];

const STROKE = 1.75;

/** 하트 마크 + 이름. onNight: 흰 원 안에 남색 하트 / onLight: 남색 원 안에 흰 하트 */
export function Logo({ className, tone = "onNight" }: { className?: string; tone?: "onNight" | "onLight" }) {
    const night = tone === "onNight";
    return (
        <Link href="/" className={cn("flex items-center gap-2", className)} aria-label={`${SITE.name} 홈`}>
            <svg viewBox="0 0 32 32" className="h-8 w-8" aria-hidden>
                <circle cx="16" cy="16" r="15" className={night ? "fill-star" : "fill-night"} />
                <path
                    d="M16 23.5c-4.4-2.9-7-5.6-7-8.7 0-2.2 1.6-3.8 3.6-3.8 1.4 0 2.6.8 3.4 2 .8-1.2 2-2 3.4-2 2 0 3.6 1.6 3.6 3.8 0 3.1-2.6 5.8-7 8.7Z"
                    className={night ? "fill-night" : "fill-star"}
                />
            </svg>
            <span className={cn("text-[19px] font-extrabold tracking-tight", night ? "text-star" : "text-ink")}>
                {SITE.name}
                <span className={cn("ml-1 text-[12px] font-semibold", night ? "text-star-3" : "text-ink-3")}>{SITE.brand}</span>
            </span>
        </Link>
    );
}

export function SiteHeader() {
    const pathname = usePathname();
    // 메뉴를 연 경로를 기억해, 다른 페이지로 이동하면 자동으로 닫히게 합니다
    const [openedAt, setOpenedAt] = useState<string | null>(null);
    const open = openedAt !== null && openedAt === pathname;
    const setOpen = (fn: (v: boolean) => boolean) => setOpenedAt(fn(open) ? pathname : null);
    const isActive = (href: string) => pathname === href || pathname?.startsWith(`${href}/`);

    return (
        <header className="sticky top-0 z-40 bg-night text-star">
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
                <Logo />
                <nav aria-label="주요 메뉴" className="hidden lg:block">
                    <ul className="flex items-center gap-0.5">
                        {NAV.map((n) => (
                            <li key={n.href}>
                                <Link
                                    href={n.href}
                                    aria-current={isActive(n.href) ? "page" : undefined}
                                    className={cn(
                                        "whitespace-nowrap rounded-full px-3 py-2 text-[15px] font-medium text-star-2 transition-colors hover:text-star",
                                        isActive(n.href) && "bg-white/[0.08] font-semibold text-star",
                                    )}
                                >
                                    {n.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
                <div className="flex items-center gap-1.5">
                    <Link
                        href="/app"
                        className="hidden h-10 items-center gap-1 whitespace-nowrap rounded-full px-3 text-[14px] font-semibold text-star-2 transition-colors hover:text-star sm:inline-flex lg:hidden xl:inline-flex"
                        title="내 아이 기록·추억상자 (포온 앱에서 열려요)"
                    >
                        포온 앱 <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={STROKE} aria-hidden />
                    </Link>
                    <a
                        href={SITE.phoneHref}
                        className="hidden h-10 items-center gap-2 whitespace-nowrap rounded-full bg-star px-4 text-[14px] font-semibold text-ink transition-colors hover:bg-white active:translate-y-px sm:inline-flex"
                    >
                        <Phone className="h-4 w-4" strokeWidth={STROKE} aria-hidden />
                        전화 상담 <span className="tabular-nums">{SITE.phone}</span>
                    </a>
                    <button
                        type="button"
                        onClick={() => setOpen((v) => !v)}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full text-star transition-colors hover:bg-white/10 lg:hidden"
                        aria-expanded={open}
                        aria-controls="mobile-menu"
                        aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
                    >
                        {open ? <X className="h-5 w-5" strokeWidth={STROKE} /> : <Menu className="h-5 w-5" strokeWidth={STROKE} />}
                    </button>
                </div>
            </div>
            {open && (
                <div id="mobile-menu" className="max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-white/10 bg-night lg:hidden">
                    <nav aria-label="모바일 메뉴" className="mx-auto max-w-6xl px-4 pb-6 pt-3">
                        <ul className="grid gap-0.5">
                            {NAV.map((n) => (
                                <li key={n.href}>
                                    <Link
                                        href={n.href}
                                        aria-current={isActive(n.href) ? "page" : undefined}
                                        className={cn(
                                            "block rounded-xl px-3 py-3 text-[16px] font-semibold text-star hover:bg-white/[0.06]",
                                            isActive(n.href) && "bg-white/[0.08]",
                                        )}
                                    >
                                        {n.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        <p className="mt-5 px-3 text-[12px] font-semibold text-star-3">보호자 공간 (포온 앱에서 열려요)</p>
                        <ul className="mt-2 grid grid-cols-2 gap-2 px-3">
                            <li>
                                <Link href="/app" className="flex h-11 items-center justify-center gap-1 rounded-full bg-night-3 text-[14px] font-semibold text-star hover:bg-night-2">
                                    포온 앱 <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={STROKE} aria-hidden />
                                </Link>
                            </li>
                            <li>
                                <Link href="/mbti" className="flex h-11 items-center justify-center gap-1 rounded-full bg-night-3 text-[14px] font-semibold text-star hover:bg-night-2">
                                    멍BTI 검사 <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={STROKE} aria-hidden />
                                </Link>
                            </li>
                        </ul>
                        <p className="mt-5 px-3 text-[12px] font-semibold text-star-3">준비 중인 서비스</p>
                        <ul className="mt-2 flex flex-wrap gap-2 px-3">
                            {SERVICES.filter((s) => s.status === "soon").map((s) => (
                                <li key={s.slug}>
                                    <Link href={`/${s.slug}`} className="inline-flex rounded-full px-3 py-1.5 text-[13px] text-star-2 ring-1 ring-inset ring-white/15 hover:text-star">
                                        {s.short}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            )}
        </header>
    );
}
