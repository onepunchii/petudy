import { cn } from "@/lib/utils";

/**
 * 포온 앱 공용 스타일 (docs/BRAND_SPACE_CONCEPT.md 8장).
 * 색은 globals.css 의 사이트 토큰만 씁니다: night/night-2/night-3, star/star-2/star-3,
 * moon/pass/paper-2/line, ink/ink-2/ink-3, pine/pine-soft, lime/lime-2, danger.
 * hex 값, text-white, text-gray-*, bg-[#...] 는 쓰지 않습니다.
 */

/** lucide 선 굵기. 사이트(ICON_STROKE)와 같은 값 */
export const APP_ICON_STROKE = 1.75;

/** 생성한 3D 클레이 아이콘 (흰 바탕). 밝은 카드 위에서는 mix-blend-multiply, 밤 위에서는 Porthole(동그란 창) 안에 */
export const BRAND_ICON = {
    funeral: "/brand/icons/funeral.webp",
    grooming: "/brand/icons/grooming.webp",
    hotel: "/brand/icons/hotel.webp",
    petsitter: "/brand/icons/petsitter.webp",
    "pet-taxi": "/brand/icons/pet-taxi.webp",
    training: "/brand/icons/training.webp",
    memorial: "/brand/icons/memorial.webp",
    mbti: "/brand/icons/mbti.webp",
    ai: "/brand/icons/ai.webp",
} as const;
export type BrandIconName = keyof typeof BRAND_ICON;

export type AppButtonVariant =
    /** 밝은 면 기본 버튼: 남색 알약 */
    | "primary"
    /** 라임 알약. 화면당 한 개까지, 추억상자·장례 화면에서는 쓰지 않음 */
    | "accent"
    /** 밝은 면 보조 버튼: 흰 알약 + 선 */
    | "secondary"
    /** 글자만 */
    | "ghost"
    /** 밤 위 기본 버튼: 흰 알약 */
    | "onNight"
    /** 밤 위 보조 버튼: 선만 */
    | "onNightGhost"
    /** 삭제 등 되돌리기 어려운 행동 */
    | "danger";

export type AppButtonSize = "sm" | "md" | "lg";

/** <button>/<Link>/<a> 에 같은 알약 모양을 입히는 클래스 */
export function appButtonClass({
    variant = "primary",
    size = "md",
    block = false,
    className,
}: { variant?: AppButtonVariant; size?: AppButtonSize; block?: boolean; className?: string } = {}) {
    return cn(
        "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold transition-[background-color,color,box-shadow,transform,opacity] duration-200 active:translate-y-px motion-reduce:transition-none",
        "disabled:pointer-events-none disabled:opacity-40 aria-disabled:pointer-events-none aria-disabled:opacity-40",
        "focus-visible:outline-2 focus-visible:outline-offset-2",
        variant === "onNight" || variant === "onNightGhost" ? "focus-visible:outline-star" : "focus-visible:outline-ink",
        size === "sm" && "h-10 px-4 text-[14px]",
        size === "md" && "h-12 px-6 text-[15px]",
        size === "lg" && "h-14 px-7 text-[16px]",
        variant === "primary" && "bg-night text-star hover:bg-night-3",
        variant === "accent" && "bg-lime text-ink hover:bg-lime-2",
        variant === "secondary" && "bg-pass text-ink ring-1 ring-inset ring-line hover:bg-paper-2",
        variant === "ghost" && "text-ink hover:bg-paper-2",
        variant === "onNight" && "bg-star text-ink hover:bg-white",
        variant === "onNightGhost" && "text-star ring-1 ring-inset ring-white/25 hover:bg-white/[0.08]",
        variant === "danger" && "bg-pass text-danger ring-1 ring-inset ring-danger/30 hover:bg-danger/[0.06]",
        block && "w-full",
        className,
    );
}

/** 뒤로 가기·닫기 같은 동그란 아이콘 버튼 (윗줄 왼쪽). BackButton, AppTopBar 의 backHref/onBack 이 같은 모양을 씁니다 */
export function appBackButtonClass(tone: "onNight" | "onLight" = "onNight", className?: string) {
    return cn(
        "-ml-2 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors active:translate-y-px",
        "focus-visible:outline-2 focus-visible:outline-offset-2",
        tone === "onNight" ? "text-star hover:bg-white/10 focus-visible:outline-star" : "text-ink hover:bg-paper-2 focus-visible:outline-ink",
        className,
    );
}

/** 입력창 (밝은 면). 글자 16px: iOS 확대 방지 */
export const appInputClass =
    "h-12 w-full rounded-xl bg-pass px-4 text-[16px] text-ink ring-1 ring-inset ring-line outline-none transition-shadow placeholder:text-ink-3 focus:ring-2 focus:ring-pine disabled:opacity-50";

export const appTextareaClass =
    "min-h-[128px] w-full resize-none rounded-xl bg-pass px-4 py-3 text-[16px] leading-relaxed text-ink ring-1 ring-inset ring-line outline-none transition-shadow placeholder:text-ink-3 focus:ring-2 focus:ring-pine disabled:opacity-50";

export const appLabelClass = "mb-2 block text-[14px] font-semibold text-ink";

/** 선택 칩·세그먼트. 선택 = 남색 채움 (라임은 하단 탭·진행 표시에만) */
export function appChipClass(selected: boolean, className?: string) {
    return cn(
        "inline-flex h-10 items-center justify-center gap-1.5 rounded-full px-4 text-[14px] font-semibold ring-1 ring-inset transition-colors active:translate-y-px",
        selected ? "bg-night text-star ring-night" : "bg-pass text-ink-2 ring-line hover:text-ink",
        className,
    );
}

/** 큰 선택 카드(성별, 크기 등). 선택 = 남색 테두리 2px + 체크 */
export function appOptionClass(selected: boolean, className?: string) {
    return cn(
        "rounded-[20px] bg-pass p-4 text-left ring-inset transition-shadow active:translate-y-px",
        selected ? "ring-2 ring-night" : "ring-1 ring-line hover:ring-ink/30",
        className,
    );
}

/** 밝은 면 카드. 위계가 있을 때만 (정보 카드는 PassCard 를 우선) */
export const appCardClass = "rounded-[20px] bg-pass ring-1 ring-line/70 shadow-[0_1px_2px_rgb(31_39_66/0.05),0_12px_28px_-16px_rgb(31_39_66/0.18)]";

/** 밤 위 카드 */
export const appNightCardClass = "rounded-[20px] bg-night-2 ring-1 ring-white/10";

/** 아래에서 올라오는 시트 */
export const sheetBackdropClass = "fixed inset-0 z-[60] bg-night/60 backdrop-blur-[2px]";
export const sheetPanelClass =
    "fixed inset-x-0 bottom-0 z-[61] mx-auto w-full max-w-[512px] rounded-t-[28px] bg-moon text-ink shadow-[0_-12px_40px_-12px_rgb(11_16_32/0.35)]";

/** 가운데 뜨는 대화상자 */
export const dialogPanelClass = "w-full max-w-[400px] rounded-[28px] bg-moon p-6 text-ink shadow-[0_24px_60px_-20px_rgb(11_16_32/0.5)]";

/** 불러오는 중 자리 표시 */
export const skeletonClass = "animate-pulse rounded-[20px] bg-paper-2 motion-reduce:animate-none";
