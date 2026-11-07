import Image from "next/image";
import Link from "next/link";
import { Award, Car, ChevronRight, Flower2, Hand, Home, Phone, Scissors } from "lucide-react";
import { SITE } from "@/lib/site/config";
import type { Faq, Service } from "@/lib/site/services";
import { cn } from "@/lib/utils";

/** lucide 아이콘 선 굵기는 사이트 전체에서 1.75 로 통일합니다 */
export const ICON_STROKE = 1.75;

export function ServiceIcon({ icon, className }: { icon: Service["icon"]; className?: string }) {
    const C = { flower: Flower2, scissors: Scissors, home: Home, hand: Hand, car: Car, award: Award }[icon];
    return <C className={className} strokeWidth={ICON_STROKE} aria-hidden />;
}

export function Container({ className, children }: { className?: string; children: React.ReactNode }) {
    return <div className={cn("mx-auto w-full max-w-6xl px-4 sm:px-6", className)}>{children}</div>;
}

/** 섹션 위 작은 라벨. 세 섹션에 하나까지만 씁니다(히어로 포함). 기본은 쓰지 않는 것 */
export function Eyebrow({ children, className, onNight }: { children: React.ReactNode; className?: string; onNight?: boolean }) {
    return <p className={cn("text-[13px] font-semibold", onNight ? "text-star-3" : "text-ink-3", className)}>{children}</p>;
}

export function SectionTitle({
    eyebrow,
    title,
    lead,
    className,
    as: Heading = "h2",
    id,
}: {
    /** 선택값. 기본 미사용 전제(세 섹션에 하나). */
    eyebrow?: string;
    title: React.ReactNode;
    lead?: React.ReactNode;
    className?: string;
    as?: "h2" | "h3";
    id?: string;
}) {
    return (
        <div className={cn("max-w-2xl", className)}>
            {eyebrow && <Eyebrow className="mb-3">{eyebrow}</Eyebrow>}
            <Heading id={id} className={cn("font-bold leading-[1.28] text-ink", Heading === "h2" ? "text-[26px] sm:text-[32px]" : "text-[21px] sm:text-[24px]")}>
                {title}
            </Heading>
            {lead && <p className="mt-3 max-w-[62ch] text-[15px] leading-relaxed text-ink-2 sm:text-base">{lead}</p>}
        </div>
    );
}

/* ───────── 알약형(pill) 버튼 ─────────
   한 의도 한 라벨: 전화 = "전화 상담"(+번호), 폼 = "상담 남기기", 지역 = "우리 동네 찾기", 앱 = "포온 앱" */

export type PillTone = "onLight" | "onNight";
export type PillVariant = "solid" | "ghost";
export type PillAccent = "white" | "lime";

/** 버튼·링크에 같은 알약 모양을 입히는 클래스. <button> 등 직접 만들 때 사용 */
export function pillClass({
    tone = "onLight",
    variant = "solid",
    accent = "white",
    size = "md",
}: { tone?: PillTone; variant?: PillVariant; accent?: PillAccent; size?: "sm" | "md" } = {}) {
    return cn(
        "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold transition-[background-color,color,box-shadow,transform] duration-200 active:translate-y-px motion-reduce:transition-none",
        // 키보드 초점: 밝은 면은 ink, 밤 위는 star 테두리(배경과 대비 3:1 이상)
        "focus-visible:outline-2 focus-visible:outline-offset-2",
        tone === "onNight" ? "focus-visible:outline-star" : "focus-visible:outline-ink",
        size === "md" ? "h-12 px-6 text-[15px]" : "h-10 px-4 text-[14px]",
        tone === "onLight" && variant === "solid" && "bg-ink text-white hover:bg-night-3",
        tone === "onLight" && variant === "ghost" && "bg-transparent text-ink ring-1 ring-inset ring-ink/20 hover:bg-paper-2",
        tone === "onNight" && variant === "solid" && accent === "white" && "bg-star text-ink hover:bg-white",
        tone === "onNight" && variant === "solid" && accent === "lime" && "bg-lime text-ink hover:bg-lime-2",
        tone === "onNight" && variant === "ghost" && "bg-transparent text-star ring-1 ring-inset ring-white/25 hover:bg-white/[0.08]",
    );
}

/**
 * 전화 상담 버튼 (tel: 링크). 라벨 기본 "전화 상담" + 번호.
 * - tone="onLight": ink 알약 (밝은 면)
 * - tone="onNight": 흰 알약, accent="lime" 이면 라임 알약 (장례·가이드 페이지는 lime 금지)
 * 이전 값 tone="dark"(=onLight) / "light"(=onNight 흰색) 도 당분간 받습니다.
 */
export function CallButton({
    className,
    label = "전화 상담",
    tone = "onLight",
    accent = "white",
    size = "md",
    showNumber = true,
}: {
    className?: string;
    label?: string;
    tone?: PillTone | "dark" | "light";
    accent?: PillAccent;
    size?: "sm" | "md";
    showNumber?: boolean;
}) {
    const t: PillTone = tone === "onNight" || tone === "light" ? "onNight" : "onLight";
    return (
        <a href={SITE.phoneHref} className={cn(pillClass({ tone: t, variant: "solid", accent, size }), className)}>
            <Phone className="h-4 w-4 shrink-0" strokeWidth={ICON_STROKE} aria-hidden />
            {label}
            {showNumber && <span className="tabular-nums">{SITE.phone}</span>}
        </a>
    );
}

/** 내부 이동용 알약 링크 ("상담 남기기", "우리 동네 찾기" 등). 해시(#find)도 가능 */
export function PillLink({
    href,
    children,
    tone = "onLight",
    variant = "ghost",
    accent = "white",
    size = "md",
    className,
}: {
    href: string;
    children: React.ReactNode;
    tone?: PillTone;
    variant?: PillVariant;
    accent?: PillAccent;
    size?: "sm" | "md";
    className?: string;
}) {
    return (
        <Link href={href} className={cn(pillClass({ tone, variant, accent, size }), className)}>
            {children}
        </Link>
    );
}

export function FaqList({ faqs }: { faqs: Faq[] }) {
    return (
        <div className="divide-y divide-line border-y border-line">
            {faqs.map((f) => (
                <details key={f.q} className="group py-5">
                    <summary className="flex cursor-pointer items-start justify-between gap-6 text-[16px] font-semibold text-ink">
                        <span className="flex gap-3">
                            <span className="text-pine">Q.</span>
                            {f.q}
                        </span>
                        <ChevronRight
                            className="mt-1 h-4 w-4 shrink-0 text-ink-3 transition-transform group-open:rotate-90 motion-reduce:transition-none"
                            strokeWidth={ICON_STROKE}
                            aria-hidden
                        />
                    </summary>
                    <p className="mt-3 max-w-[68ch] pl-7 text-[15px] leading-[1.8] text-ink-2">{f.a}</p>
                </details>
            ))}
        </div>
    );
}

export function Breadcrumbs({ items, tone = "onLight" }: { items: { name: string; href: string }[]; tone?: PillTone }) {
    const night = tone === "onNight";
    return (
        <nav aria-label="현재 위치" className={cn("text-[13px]", night ? "text-star-3" : "text-ink-3")}>
            <ol className="flex flex-wrap items-center gap-1">
                {items.map((it, i) => (
                    // 같은 href 가 두 번 나올 수 있어(예: 지역 허브의 "지역별 찾기"와 시·도) 순서를 키에 함께 씁니다
                    <li key={`${i}:${it.href}`} className="flex items-center gap-1">
                        {i > 0 && <ChevronRight className="h-3 w-3" strokeWidth={ICON_STROKE} aria-hidden />}
                        {i === items.length - 1 ? (
                            <span aria-current="page" className={night ? "text-star-2" : "text-ink-2"}>
                                {it.name}
                            </span>
                        ) : (
                            <Link href={it.href} className={night ? "hover:text-star" : "hover:text-ink"}>
                                {it.name}
                            </Link>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
}

export function JsonLd({ data }: { data: object | object[] }) {
    return (
        <script
            type="application/ld+json"
            // JSON.stringify 결과의 '<' 를 이스케이프해 </script> 주입을 막습니다
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
        />
    );
}

export function Chip({ children, className, onNight }: { children: React.ReactNode; className?: string; onNight?: boolean }) {
    return (
        <span
            className={cn(
                "inline-flex items-center rounded-full px-3 py-1 text-[13px]",
                onNight ? "bg-night-3 text-star-2" : "bg-pass text-ink-2 ring-1 ring-inset ring-line",
                className,
            )}
        >
            {children}
        </span>
    );
}

/**
 * 3D 서비스 아이콘(/brand/icons/*.webp, 흰 바탕)을 담는 동그란 "창".
 * 밤 위에서는 반드시 이 창 안에 넣습니다. 장례 페이지에는 쓰지 않습니다(홈 타일만).
 */
export function Porthole({
    src,
    alt = "",
    size = 88,
    className,
}: {
    src: string;
    alt?: string;
    /** 창 지름(px) */
    size?: number;
    className?: string;
}) {
    return (
        <span
            className={cn("relative inline-flex shrink-0 overflow-hidden rounded-full bg-white ring-4 ring-white/10", className)}
            style={{ width: size, height: size }}
        >
            <Image src={src} alt={alt} fill sizes={`${size * 2}px`} className="object-contain p-[8%]" />
        </span>
    );
}
