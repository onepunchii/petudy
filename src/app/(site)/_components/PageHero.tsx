import Image from "next/image";
import { Breadcrumbs, Container, Eyebrow } from "@/components/site/ui";
import { cn } from "@/lib/utils";

/**
 * 서비스 페이지가 아닌 곳(가이드, 지역, 소개, 상담, 제휴, 개인정보)의 첫 화면(밤).
 * ServiceHero 와 같은 규칙을 따릅니다.
 *
 * - 페이지당 테마 전환은 이 히어로(밤) -> 본문(달빛) 한 번뿐입니다.
 * - 히어로 글자 요소는 4개 이하: [eyebrow 선택] + H1 + subtitle + actions. 경로(breadcrumb)는 위의 작은 줄.
 * - art 가 있으면 lg 에서는 섹션 전체 배경 + 왼쪽 가독성 스크림, 모바일에서는 글자 아래 16:9 그림 띠입니다.
 *   art 가 없으면 .site-stars 별 레이어를 씁니다.
 * - overlap: 본문 첫 카드(상담 폼 등)가 lg 에서 히어로 아래쪽에 걸치도록 아래 여백을 늘립니다.
 *   걸치는 쪽 요소에는 `lg:relative lg:z-[1] lg:-mt-48` 를 주고 본문 컨테이너 위 여백은 pt-12 로 맞춥니다.
 */
export function PageHero({
    crumbs,
    title,
    subtitle,
    eyebrow,
    actions,
    aside,
    art,
    size = "default",
    overlap = false,
    titleClassName,
}: {
    crumbs: { name: string; href: string }[];
    /** H1. 검색어 그대로, 데스크톱 2줄 이하 */
    title: React.ReactNode;
    /** 부제. 한국어 약 40자 이하. 여행·배웅 은유는 여기서 */
    subtitle?: React.ReactNode;
    /** 선택. 쓰면 그다음 두 섹션은 eyebrow 를 쓰지 않습니다 */
    eyebrow?: string;
    /** CTA 줄 (주 1개 + 보조 1개까지) */
    actions?: React.ReactNode;
    /** 오른쪽 칸(데스크톱) / 글자 아래(모바일). 밤 위에 놓입니다 */
    aside?: React.ReactNode;
    /** 히어로 일러스트 (16:9). 장례 쪽 페이지에는 캐릭터 그림을 쓰지 않습니다 */
    art?: { src: string; alt: string; position?: string };
    /** default: 첫 화면 높이(최대 640px) / compact: 내용 높이만큼 */
    size?: "default" | "compact";
    overlap?: boolean;
    titleClassName?: string;
}) {
    const tall = size === "default";
    const split = Boolean(aside || art);

    return (
        <section className="relative isolate overflow-hidden bg-night text-star">
            {!art && <div className="site-stars -z-10" aria-hidden />}

            <Container
                className={cn(
                    "pt-5",
                    tall ? "pb-14 sm:pb-16 lg:flex lg:min-h-[min(calc(100dvh_-_4rem),640px)] lg:flex-col lg:pb-20" : "pb-14 sm:pb-16",
                    overlap && "lg:pb-40",
                )}
            >
                <Breadcrumbs items={crumbs} tone="onNight" />

                <div
                    className={cn(
                        "mt-10 grid gap-10 lg:items-center lg:gap-12",
                        tall && "lg:mt-0 lg:flex-1",
                        !tall && "sm:mt-12",
                        split ? "lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]" : "lg:grid-cols-[minmax(0,1fr)_minmax(0,0.6fr)]",
                    )}
                >
                    <div className={cn(tall && "lg:py-10")}>
                        {eyebrow && (
                            <Eyebrow onNight className="mb-4">
                                {eyebrow}
                            </Eyebrow>
                        )}
                        <h1
                            className={cn(
                                // ServiceHero 와 같은 제목 크기 단계(28 / 38 / 42)
                                "text-balance text-[28px] font-extrabold leading-[1.22] tracking-[-0.03em] text-star sm:text-[38px] xl:text-[42px]",
                                titleClassName,
                            )}
                        >
                            {title}
                        </h1>
                        {subtitle && <p className="mt-5 max-w-[34ch] text-pretty text-[16px] leading-[1.7] text-star-2 sm:text-[17px]">{subtitle}</p>}
                        {actions && <div className="mt-8 flex flex-wrap gap-3">{actions}</div>}
                    </div>

                    {art && (
                        // 모바일: 글자 아래 16:9 그림 띠 / lg: 섹션 전체 배경 (section 이 기준 요소)
                        <div
                            className={cn(
                                "relative -mx-4 aspect-[16/9] sm:-mx-6 lg:absolute lg:inset-0 lg:-z-10 lg:mx-0 lg:aspect-auto",
                                !aside && "-mb-14 sm:-mb-16 lg:mb-0",
                            )}
                        >
                            <Image
                                src={art.src}
                                alt={art.alt}
                                fill
                                preload
                                sizes="100vw"
                                className="object-cover"
                                style={{ objectPosition: art.position ?? "50% 50%" }}
                            />
                            {/* 모바일: 위쪽을 밤색으로 이어 붙임 */}
                            <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-night to-transparent lg:hidden" aria-hidden />
                            {/* lg: 왼쪽 글자 가독성 스크림 */}
                            <div
                                className="absolute inset-0 hidden bg-[linear-gradient(90deg,rgb(11_16_32/0.9)_0%,rgb(11_16_32/0.66)_38%,rgb(11_16_32/0.12)_70%,transparent_100%)] lg:block"
                                aria-hidden
                            />
                            <div className="absolute inset-x-0 top-0 hidden h-28 bg-gradient-to-b from-night to-transparent lg:block" aria-hidden />
                        </div>
                    )}

                    {aside && <div className="min-w-0">{aside}</div>}
                </div>
            </Container>
        </section>
    );
}
