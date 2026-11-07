import Image from "next/image";
import { Check } from "lucide-react";
import { REGIONS } from "@/lib/site/regions";
import type { Service, ServiceSlug } from "@/lib/site/services";
import { cn } from "@/lib/utils";
import { RegionPicker } from "./RegionPicker";
import { Breadcrumbs, CallButton, Container, Eyebrow, ICON_STROKE, PillLink } from "./ui";

/** 서비스별 기본 히어로 일러스트 (16:9, 1376x768). 없는 서비스는 별 패턴만 */
const HERO_ART: Partial<Record<ServiceSlug, { src: string; alt: string; position: string }>> = {
    funeral: {
        src: "/brand/hero/funeral.webp",
        alt: "밤하늘의 별빛 길을 따라 걸어가는 강아지와 고양이의 작은 실루엣, 아래로 불 켜진 동네 지붕들",
        position: "50% 42%",
    },
    grooming: {
        src: "/brand/hero/grooming.webp",
        alt: "저녁 무렵 불 켜진 동네 미용실 창가에 앉아 밖을 바라보는 하얀 강아지",
        position: "50% 58%",
    },
};

export const FIND_ANCHOR = "find";

/**
 * 서비스 페이지 첫 화면(밤). 페이지당 테마 전환은 이 히어로(밤) -> 본문(달빛) 한 번뿐입니다.
 *
 * 히어로 안의 글자 요소는 4개 이하: [eyebrow 선택] + H1 + subtitle + CTA 줄. 경로(breadcrumb)는 위의 작은 줄.
 * lead(긴 소개)와 chips(원칙·지표)는 히어로 밖, 바로 아래 밝은 띠에 렌더링됩니다.
 *
 * 일러스트가 있으면(장례·미용 기본값) 데스크톱은 화면 전체 배경 + 왼쪽 가독성 스크림,
 * 모바일은 글자 아래 16:9 그림 띠로 보입니다. 이때 지역 선택기는 그림을 가리지 않도록
 * 히어로 아래 띠(#find)로 내려가고, 히어로에 "우리 동네 찾기" 보조 버튼이 자동으로 붙습니다.
 */
export function ServiceHero({
    service,
    crumbs,
    title,
    subtitle,
    lead,
    chips,
    eyebrow,
    picker = true,
    pickerPlacement,
    aside,
    asideClassName,
    secondary,
    image,
    imageAlt,
    imagePosition,
}: {
    service: Service;
    crumbs: { name: string; href: string }[];
    /** H1. SEO 핵심 검색어 그대로, 데스크톱 2줄 이하 */
    title: React.ReactNode;
    /** 히어로 부제. 한국어 약 40자(20단어) 이하. 여행 은유는 여기서 */
    subtitle?: React.ReactNode;
    /** 긴 소개 문단. 히어로 아래 밝은 띠에 표시 */
    lead?: React.ReactNode;
    /** 원칙·지표 칩. 히어로 아래 밝은 띠에 체크 목록으로 표시 */
    chips?: string[];
    /** 히어로 위 작은 라벨(선택). 쓰면 그 다음 두 섹션은 eyebrow 금지 */
    eyebrow?: string;
    /** 지역 선택기 표시 여부 (aside 를 주면 무시) */
    picker?: boolean;
    /** 지역 선택기 위치. 기본: 일러스트가 있으면 "below", 없으면 "hero" */
    pickerPlacement?: "hero" | "below";
    /** 히어로 오른쪽 칸(데스크톱)/글자 아래(모바일)에 둘 요소. 밤 위에 놓이므로 밤 톤 카드로 */
    aside?: React.ReactNode;
    /** aside 를 감싸는 칸의 클래스. 데스크톱에서만 보일 때 "hidden lg:block" 을 주면 모바일에 빈 칸 여백이 생기지 않습니다 */
    asideClassName?: string;
    /** 보조 CTA. null 이면 숨김. 기본: 선택기가 아래에 있을 때만 "우리 동네 찾기" -> #find */
    secondary?: { href: string; label: string } | null;
    /** 일러스트 경로. 생략하면 서비스 기본값, null 이면 그림 없이 별 패턴 */
    image?: string | null;
    imageAlt?: string;
    /** CSS object-position (예: "50% 40%") */
    imagePosition?: string;
}) {
    const art = HERO_ART[service.slug];
    const src = image === null ? undefined : (image ?? art?.src);
    const alt = imageAlt ?? (image ? "" : (art?.alt ?? ""));
    const position = imagePosition ?? art?.position ?? "50% 50%";
    const hasArt = Boolean(src);

    const isFuneral = service.slug === "funeral";
    const placement = pickerPlacement ?? (hasArt ? "below" : "hero");
    const showPicker = picker && !aside;
    const pickerInHero = showPicker && placement === "hero";
    const pickerBelow = showPicker && placement === "below";
    const heroAside = aside ?? (pickerInHero ? <RegionPicker regions={pickerRegions()} service={service.slug} variant="dark" /> : null);

    const second =
        secondary === null ? null : (secondary ?? (pickerBelow ? { href: `#${FIND_ANCHOR}`, label: "우리 동네 찾기" } : null));

    const hasBand = Boolean(lead || chips?.length || pickerBelow);

    return (
        <>
            <section className="relative isolate overflow-hidden bg-night text-star">
                {!hasArt && <div className="site-stars -z-10" aria-hidden />}

                <Container className="pb-14 pt-5 sm:pb-16 lg:flex lg:min-h-[min(calc(100dvh_-_4rem),680px)] lg:flex-col lg:pb-20">
                    <Breadcrumbs items={crumbs} tone="onNight" />

                    <div
                        className={cn(
                            "mt-10 grid gap-10 lg:mt-0 lg:flex-1 lg:items-center lg:gap-12",
                            heroAside || hasArt ? "lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]" : "lg:grid-cols-[minmax(0,1fr)_minmax(0,0.6fr)]",
                        )}
                    >
                        <div className="lg:py-10">
                            {eyebrow && <Eyebrow onNight className="mb-4">{eyebrow}</Eyebrow>}
                            {/* 제목 칸이 lg 에서 약 490~550px 이므로, 가장 긴 지역 제목(예: "동대문구 반려동물 장례식장, / 가장 가까운 곳에서 마지막 인사를")도 2줄에 들도록 크기를 맞춤 */}
                            <h1 className="text-[28px] font-extrabold leading-[1.22] tracking-[-0.03em] text-star sm:text-[38px] xl:text-[42px]">
                                {title}
                            </h1>
                            {subtitle && <p className="mt-5 max-w-[34ch] text-pretty text-[16px] leading-[1.7] text-star-2 sm:text-[17px]">{subtitle}</p>}
                            <div className="mt-8 flex flex-wrap gap-3">
                                <CallButton tone="onNight" accent={isFuneral ? "white" : "lime"} />
                                {second && (
                                    <PillLink href={second.href} tone="onNight" variant="ghost">
                                        {second.label}
                                    </PillLink>
                                )}
                            </div>
                        </div>

                        {src && (
                            // 모바일: 글자 아래 16:9 그림 띠 / lg: 섹션 전체 배경 (section 이 기준 요소)
                            <div
                                className={cn(
                                    "relative -mx-4 aspect-[16/9] sm:-mx-6 lg:absolute lg:inset-0 lg:-z-10 lg:mx-0 lg:aspect-auto",
                                    !heroAside && "-mb-14 sm:-mb-16 lg:mb-0",
                                )}
                            >
                                <Image src={src} alt={alt} fill preload sizes="100vw" className="object-cover" style={{ objectPosition: position }} />
                                {/* 모바일: 위쪽을 밤색으로 이어 붙임 */}
                                <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-night to-transparent lg:hidden" aria-hidden />
                                {/* lg: 왼쪽 글자 가독성 스크림 (오른쪽 칸에 카드가 있으면 전체를 조금 더 어둡게) */}
                                <div
                                    className={cn(
                                        "absolute inset-0 hidden lg:block",
                                        heroAside
                                            ? "bg-[linear-gradient(90deg,rgb(11_16_32/0.94)_0%,rgb(11_16_32/0.78)_45%,rgb(11_16_32/0.5)_100%)]"
                                            : "bg-[linear-gradient(90deg,rgb(11_16_32/0.92)_0%,rgb(11_16_32/0.72)_36%,rgb(11_16_32/0.15)_68%,transparent_100%)]",
                                    )}
                                    aria-hidden
                                />
                                <div className="absolute inset-x-0 top-0 hidden h-28 bg-gradient-to-b from-night to-transparent lg:block" aria-hidden />
                            </div>
                        )}

                        {heroAside && <div className={cn("min-w-0", asideClassName)}>{heroAside}</div>}
                    </div>
                </Container>
            </section>

            {hasBand && (
                <div className="border-b border-line bg-moon">
                    <Container
                        className={cn(
                            "grid gap-8 py-10 sm:py-12",
                            pickerBelow && "lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-start lg:gap-12",
                        )}
                    >
                        {(lead || chips?.length) && (
                            <div className={cn(pickerBelow && "lg:pt-2", !pickerBelow && "grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:items-start lg:gap-12")}>
                                {lead && <div className="max-w-[62ch] text-[16px] leading-[1.85] text-ink-2">{lead}</div>}
                                {chips && chips.length > 0 && (
                                    <ul aria-label={`${service.name} 연결 원칙`} className={cn("grid gap-x-6 gap-y-2.5 sm:grid-cols-2", lead && pickerBelow && "mt-7")}>
                                        {chips.map((c) => (
                                            <li key={c} className="flex items-start gap-2 text-[15px] font-medium text-ink">
                                                <Check className="mt-[3px] h-4 w-4 shrink-0 text-pine" strokeWidth={ICON_STROKE} aria-hidden />
                                                {c}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        )}
                        {pickerBelow && (
                            <div id={FIND_ANCHOR} className="order-first scroll-mt-24 lg:relative lg:z-[1] lg:order-none lg:-mt-36">
                                <RegionPicker regions={pickerRegions()} service={service.slug} />
                            </div>
                        )}
                    </Container>
                </div>
            )}
        </>
    );
}

function pickerRegions() {
    return REGIONS.map(({ sido, slug, name, lat, lng }) => ({ sido, slug, name, lat, lng }));
}
