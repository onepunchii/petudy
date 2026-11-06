"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, Phone, X } from "lucide-react";
import { SITE } from "@/lib/site/config";
import { SERVICES } from "@/lib/site/services";
import { cn } from "@/lib/utils";

const NAV = [
    { href: "/funeral", label: "반려동물 장례" },
    { href: "/grooming", label: "애견미용" },
    { href: "/area", label: "지역별 찾기" },
    { href: "/guide", label: "보호자 가이드" },
    { href: "/about", label: "포온 소개" },
];

export function Logo({ className }: { className?: string }) {
    return (
        <Link href="/" className={cn("flex items-center gap-2", className)} aria-label={`${SITE.name} 홈`}>
            <svg viewBox="0 0 32 32" className="h-8 w-8" aria-hidden>
                <circle cx="16" cy="16" r="15" className="fill-pine" />
                <path d="M16 23.5c-4.4-2.9-7-5.6-7-8.7 0-2.2 1.6-3.8 3.6-3.8 1.4 0 2.6.8 3.4 2 .8-1.2 2-2 3.4-2 2 0 3.6 1.6 3.6 3.8 0 3.1-2.6 5.8-7 8.7Z" fill="#F7F5F0" />
            </svg>
            <span className="text-[19px] font-extrabold tracking-tight text-ink">
                {SITE.name}
                <span className="ml-1 text-[12px] font-semibold text-ink-3">{SITE.brand}</span>
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

    return (
        <header className="sticky top-0 z-40 border-b border-line/80 bg-paper/90 backdrop-blur-md">
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
                <Logo />
                <nav aria-label="주요 메뉴" className="hidden lg:block">
                    <ul className="flex items-center gap-1">
                        {NAV.map((n) => (
                            <li key={n.href}>
                                <Link
                                    href={n.href}
                                    className={cn(
                                        "rounded-full px-3.5 py-2 text-[15px] font-medium text-ink-2 hover:bg-paper-2 hover:text-ink",
                                        pathname?.startsWith(n.href) && "text-ink font-semibold",
                                    )}
                                >
                                    {n.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
                <div className="flex items-center gap-2">
                    <a
                        href={SITE.phoneHref}
                        className="hidden sm:inline-flex h-10 items-center gap-2 rounded-full bg-ink px-4 text-[14px] font-semibold text-white hover:bg-pine"
                    >
                        <Phone className="h-4 w-4" aria-hidden />
                        24시간 상담 <span className="tabular-nums">{SITE.phone}</span>
                    </a>
                    <button
                        type="button"
                        onClick={() => setOpen((v) => !v)}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-paper-2 lg:hidden"
                        aria-expanded={open}
                        aria-controls="mobile-menu"
                        aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
                    >
                        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>
            </div>
            {open && (
                <div id="mobile-menu" className="border-t border-line bg-paper lg:hidden">
                    <nav aria-label="모바일 메뉴" className="mx-auto max-w-6xl px-4 py-4">
                        <ul className="grid gap-1">
                            {NAV.map((n) => (
                                <li key={n.href}>
                                    <Link href={n.href} className="block rounded-xl px-3 py-3 text-[16px] font-semibold text-ink hover:bg-paper-2">
                                        {n.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        <p className="mt-4 px-3 text-[12px] font-semibold text-ink-3">준비 중인 서비스</p>
                        <ul className="mt-2 flex flex-wrap gap-2 px-3">
                            {SERVICES.filter((s) => s.status === "soon").map((s) => (
                                <li key={s.slug}>
                                    <Link href={`/${s.slug}`} className="rounded-full border border-line px-3 py-1.5 text-[13px] text-ink-2">
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
