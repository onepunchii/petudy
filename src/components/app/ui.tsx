import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { BackButton } from "./BackButton";
import { APP_ICON_STROKE, appBackButtonClass, appButtonClass, sheetPanelClass, type AppButtonSize, type AppButtonVariant } from "./tokens";

/*
 * 포온 앱 공용 부품. 화면 구성은 사이트와 같습니다: 위쪽 밤 -> 아래 달빛 본문 (한 번만 전환).
 *  - 탭 첫 화면(홈, 내 상담, 추억상자, 내 정보): <AppHero> (큰 제목 + 부제, 별)
 *  - 하위 화면·입력 흐름: <AppTopBar> (뒤로 가기 + 제목, 화면 위에 붙음)
 * 이 파일은 "use client" 가 없어 서버·클라이언트 페이지 어디서나 쓸 수 있습니다.
 */

export { BackButton } from "./BackButton";
export * from "./tokens";

/** 탭 첫 화면의 밤 머리. 제목은 2줄 이하, 부제는 약 40자 이하 */
export function AppHero({
    title,
    subtitle,
    back,
    top,
    action,
    children,
    className,
}: {
    title: React.ReactNode;
    subtitle?: React.ReactNode;
    /** 뒤로 가기 버튼. true 면 history.back(없으면 /), 문자열이면 그 경로를 fallback 으로 */
    back?: boolean | string;
    /** 제목 위 한 줄 (로고, 사이트 링크 등). back 과 함께 쓰면 back 오른쪽에 붙습니다 */
    top?: React.ReactNode;
    /** 오른쪽 위 버튼 자리 (아이 선택, 추가 등) */
    action?: React.ReactNode;
    /** 제목 아래 추가 요소 (아이 선택 줄, 요약 수치 등). 밤 위이므로 star 계열 글자로 */
    children?: React.ReactNode;
    className?: string;
}) {
    return (
        <header
            className={cn("relative isolate overflow-hidden rounded-b-[28px] bg-night px-5 pb-8 text-star", className)}
            style={{ paddingTop: "max(20px, env(safe-area-inset-top))" }}
        >
            <div className="site-stars -z-10" aria-hidden />
            {((back !== undefined && back !== false) || top) && (
                <div className="mb-6 flex min-h-10 items-center gap-2">
                    {back !== undefined && back !== false && <BackButton fallbackHref={typeof back === "string" ? back : "/"} />}
                    {top && <div className="flex min-w-0 flex-1 items-center justify-between gap-3">{top}</div>}
                </div>
            )}
            <div className="flex items-end justify-between gap-4">
                <div className="min-w-0">
                    <h1 className="text-[26px] font-extrabold leading-[1.28] tracking-[-0.03em] text-star">{title}</h1>
                    {subtitle && <p className="mt-2 max-w-[30ch] text-pretty text-[15px] leading-[1.65] text-star-2">{subtitle}</p>}
                </div>
                {action && <div className="shrink-0">{action}</div>}
            </div>
            {children && <div className="mt-6">{children}</div>}
        </header>
    );
}

/**
 * 하위 화면·입력 흐름의 밤색 윗줄. 스크롤해도 화면 위에 붙어 있습니다.
 * 왼쪽 버튼은 하나만 정해집니다. 우선순위: leading > onBack > backHref > back
 *  - back: true 면 history.back(기록이 없으면 /), 문자열이면 그 경로를 fallback 으로, false 면 숨김
 *  - backHref: 항상 그 경로로 가는 링크 (예전부터 고정 링크였던 화면)
 *  - onBack: 단계 이동처럼 화면이 직접 처리하는 뒤로 가기
 *  - leading: 닫기(X) 링크 등 완전히 다른 버튼 (appBackButtonClass 로 같은 모양을 입히세요)
 */
export function AppTopBar({
    title,
    titleAs: Title = "h1",
    back = true,
    backHref,
    onBack,
    backLabel = "뒤로 가기",
    leading,
    action,
    children,
    className,
}: {
    title?: React.ReactNode;
    /** 본문에 이미 h1 이 있는 화면은 "p" */
    titleAs?: "h1" | "p";
    back?: boolean | string;
    backHref?: string;
    onBack?: () => void;
    /** backHref, onBack 버튼의 읽기 이름 */
    backLabel?: string;
    leading?: React.ReactNode;
    action?: React.ReactNode;
    /** 윗줄 아래에 붙는 요소 (진행 표시줄, 안내 줄 등) */
    children?: React.ReactNode;
    className?: string;
}) {
    let left: React.ReactNode;
    if (leading) left = leading;
    else if (onBack)
        left = (
            <button type="button" onClick={onBack} aria-label={backLabel} className={appBackButtonClass("onNight", "ml-0")}>
                <ChevronLeft className="h-6 w-6" strokeWidth={APP_ICON_STROKE} aria-hidden />
            </button>
        );
    else if (backHref)
        left = (
            <Link href={backHref} aria-label={backLabel} className={appBackButtonClass("onNight", "ml-0")}>
                <ChevronLeft className="h-6 w-6" strokeWidth={APP_ICON_STROKE} aria-hidden />
            </Link>
        );
    else if (back !== false) left = <BackButton fallbackHref={typeof back === "string" ? back : "/"} className="ml-0" />;
    else left = <span className="w-2" />;

    return (
        <header className={cn("sticky top-0 z-30 bg-night/95 text-star backdrop-blur-md", className)} style={{ paddingTop: "env(safe-area-inset-top)" }}>
            <div className="flex h-14 items-center gap-1 px-3">
                {left}
                {title ? <Title className="min-w-0 flex-1 truncate text-[17px] font-bold text-star">{title}</Title> : <span className="flex-1" />}
                {action && <div className="flex shrink-0 items-center gap-1">{action}</div>}
            </div>
            {children}
        </header>
    );
}

/**
 * AppTopBar 바로 아래로 이어지는 밤 소개 (윗줄과 한 덩어리, 아래 모서리 28px). 이 아래부터 달빛 본문입니다.
 * 긴 안내 화면(펫보험, 펫여행, 상조)처럼 윗줄은 붙어 있고 큰 제목은 함께 스크롤돼야 할 때 씁니다.
 * 이때 AppTopBar 에는 className="bg-night" 를 주어 소개와 같은 불투명 밤색으로 맞춥니다.
 */
export function AppIntro({
    eyebrow,
    title,
    subtitle,
    icon,
    className,
}: {
    eyebrow?: string;
    /** h2 (윗줄 제목이 h1) */
    title: React.ReactNode;
    subtitle?: React.ReactNode;
    /** 오른쪽 동그란 아이콘 (lucide 요소) */
    icon?: React.ReactNode;
    className?: string;
}) {
    return (
        <div className={cn("relative isolate overflow-hidden rounded-b-[28px] bg-night px-5 pb-8 pt-3 text-star", className)}>
            <div className="site-stars -z-10" aria-hidden />
            <div className="flex items-end justify-between gap-4">
                <div className="min-w-0">
                    {eyebrow && <p className="mb-2 text-[13px] font-semibold text-star-3">{eyebrow}</p>}
                    <h2 className="text-[26px] font-extrabold leading-[1.28] tracking-[-0.03em] text-star">{title}</h2>
                    {subtitle && <p className="mt-2 max-w-[32ch] text-pretty text-[15px] leading-[1.65] text-star-2">{subtitle}</p>}
                </div>
                {icon && (
                    <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-night-3 text-star-2 ring-1 ring-white/10" aria-hidden>
                        {icon}
                    </span>
                )}
            </div>
        </div>
    );
}

/**
 * 입력 흐름 진행 표시 (AppTopBar children 으로).
 * tone="lime"(기본): 라임 막대. tone="star": 흰 막대 (장례·추억상자처럼 라임을 쓰지 않는 흐름)
 */
export function AppProgress({ value, label, tone = "lime" }: { value: number; label?: string; tone?: "lime" | "star" }) {
    const pct = Math.max(0, Math.min(100, Math.round(value * 100)));
    return (
        <div className="px-5 pb-3">
            <div className="h-1 overflow-hidden rounded-full bg-white/10" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={label ?? "진행 상황"}>
                <div
                    className={cn("h-full rounded-full transition-[width] duration-500 motion-reduce:transition-none", tone === "star" ? "bg-star" : "bg-lime")}
                    style={{ width: `${pct}%` }}
                />
            </div>
        </div>
    );
}

/** 달빛 본문 영역 */
export function AppBody({ children, className }: { children: React.ReactNode; className?: string }) {
    return <div className={cn("px-5 py-6", className)}>{children}</div>;
}

/** 본문 소제목 + 오른쪽 링크. 섹션 위 작은 라벨(eyebrow)은 쓰지 않습니다 */
export function AppSection({
    title,
    action,
    children,
    className,
    id,
}: {
    title?: React.ReactNode;
    action?: React.ReactNode;
    children: React.ReactNode;
    className?: string;
    id?: string;
}) {
    return (
        <section aria-labelledby={id && title ? id : undefined} className={cn("mt-8 first:mt-0", className)}>
            {(title || action) && (
                <div className="mb-3 flex items-end justify-between gap-3">
                    {title && (
                        <h2 id={id} className="text-[18px] font-bold leading-snug text-ink">
                            {title}
                        </h2>
                    )}
                    {action}
                </div>
            )}
            {children}
        </section>
    );
}

/** 알약 버튼 */
export function AppButton({
    variant,
    size,
    block,
    className,
    type = "button",
    ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: AppButtonVariant; size?: AppButtonSize; block?: boolean }) {
    return <button type={type} className={appButtonClass({ variant, size, block, className })} {...rest} />;
}

/** 알약 모양 링크 */
export function AppLinkButton({
    href,
    variant,
    size,
    block,
    className,
    children,
}: {
    href: string;
    variant?: AppButtonVariant;
    size?: AppButtonSize;
    block?: boolean;
    className?: string;
    children: React.ReactNode;
}) {
    return (
        <Link href={href} className={appButtonClass({ variant, size, block, className })}>
            {children}
        </Link>
    );
}

/** 화면 아래에 붙는 주 행동 버튼 자리 (입력 흐름의 "다음", "저장" 등). 하단 탭이 없는 화면에서 씁니다 */
export function AppBottomAction({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <div
            className={cn("sticky bottom-0 z-20 bg-gradient-to-t from-moon via-moon/95 to-moon/0 px-5 pt-6", className)}
            style={{ paddingBottom: "max(16px, env(safe-area-inset-bottom))" }}
        >
            {children}
        </div>
    );
}

/** 흰 목록 묶음 (설정, 메뉴) */
export function AppList({ children, className, "aria-label": ariaLabel }: { children: React.ReactNode; className?: string; "aria-label"?: string }) {
    return (
        <ul aria-label={ariaLabel} className={cn("divide-y divide-line overflow-hidden rounded-[20px] bg-pass ring-1 ring-line/70", className)}>
            {children}
        </ul>
    );
}

/** 목록 한 줄. href 가 있으면 링크, onClick 이 있으면 버튼, 둘 다 없으면 정보 줄 */
export function AppListItem({
    href,
    onClick,
    icon,
    label,
    detail,
    trailing,
    external,
    className,
}: {
    href?: string;
    onClick?: () => void;
    /** lucide 아이콘 요소 (h-5 w-5, strokeWidth APP_ICON_STROKE) */
    icon?: React.ReactNode;
    label: React.ReactNode;
    detail?: React.ReactNode;
    /** 오른쪽 끝 (기본: 링크·버튼이면 꺾쇠) */
    trailing?: React.ReactNode;
    external?: boolean;
    className?: string;
}) {
    const interactive = Boolean(href || onClick);
    const inner = (
        <>
            {icon && <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-paper-2 text-ink-2">{icon}</span>}
            <span className="min-w-0 flex-1">
                <span className="block text-[15.5px] font-semibold text-ink">{label}</span>
                {detail && <span className="mt-0.5 block text-[13px] leading-snug text-ink-3">{detail}</span>}
            </span>
            {trailing ?? (interactive && <ChevronRight className="h-4 w-4 shrink-0 text-ink-3" strokeWidth={APP_ICON_STROKE} aria-hidden />)}
        </>
    );
    const rowClass = cn("flex min-h-[56px] w-full items-center gap-3 px-4 py-3 text-left", interactive && "transition-colors hover:bg-paper-2/70 active:bg-paper-2", className);
    return (
        <li>
            {href ? (
                external ? (
                    <a href={href} className={rowClass} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noopener noreferrer" : undefined}>
                        {inner}
                    </a>
                ) : (
                    <Link href={href} className={rowClass}>
                        {inner}
                    </Link>
                )
            ) : onClick ? (
                <button type="button" onClick={onClick} className={rowClass}>
                    {inner}
                </button>
            ) : (
                <div className={rowClass}>{inner}</div>
            )}
        </li>
    );
}

/** 3D 클레이 아이콘 (흰 바탕 그림). 밝은 카드 위 */
export function BrandIcon({ src, size = 56, className }: { src: string; size?: number; className?: string }) {
    return <Image src={src} alt="" width={size * 2} height={size * 2} className={cn("shrink-0 mix-blend-multiply", className)} style={{ width: size, height: size }} />;
}

/** 비어 있는 화면. 다음에 할 일을 하나 알려 줍니다 */
export function AppEmpty({
    icon,
    title,
    description,
    action,
    className,
}: {
    /** 3D 아이콘 경로(BRAND_ICON.x) 또는 lucide 아이콘 요소 */
    icon?: string | React.ReactNode;
    title: React.ReactNode;
    description?: React.ReactNode;
    action?: React.ReactNode;
    className?: string;
}) {
    return (
        <div className={cn("flex flex-col items-center rounded-[28px] bg-pass px-6 py-10 text-center ring-1 ring-line/70", className)}>
            {typeof icon === "string" ? (
                <BrandIcon src={icon} size={80} />
            ) : icon ? (
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-paper-2 text-ink-2">{icon}</span>
            ) : null}
            <p className={cn("text-[17px] font-bold text-ink", icon && "mt-4")}>{title}</p>
            {description && <p className="mt-2 max-w-[28ch] text-[14.5px] leading-relaxed text-ink-2">{description}</p>}
            {action && <div className="mt-6">{action}</div>}
        </div>
    );
}

/** 시트 위쪽 손잡이 + 제목 줄 */
export function SheetHeader({ title, onClose, closeLabel = "닫기" }: { title?: React.ReactNode; onClose?: () => void; closeLabel?: string }) {
    return (
        <div className="px-5 pt-3">
            <div className="mx-auto h-1.5 w-10 rounded-full bg-line" aria-hidden />
            {(title || onClose) && (
                <div className="mt-4 flex items-center justify-between gap-3">
                    {title && <h2 className="text-[18px] font-bold text-ink">{title}</h2>}
                    {onClose && (
                        <button type="button" onClick={onClose} className="-mr-2 h-10 rounded-full px-3 text-[14px] font-semibold text-ink-2 hover:bg-paper-2">
                            {closeLabel}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}

/** 시트 패널 클래스를 쓰는 기본 래퍼 (열고 닫는 상태·애니메이션은 쓰는 쪽에서) */
export function SheetPanel({ children, className, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div role="dialog" aria-modal="true" className={cn(sheetPanelClass, className)} {...rest}>
            {children}
            <div style={{ height: "max(16px, env(safe-area-inset-bottom))" }} aria-hidden />
        </div>
    );
}
