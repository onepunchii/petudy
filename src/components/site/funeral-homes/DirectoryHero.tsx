import { Breadcrumbs, Container } from "../ui";

/**
 * 장례식장 디렉터리 첫 화면(밤). 왼쪽 글자, 오른쪽(lg 미만은 아래, 작게 왼쪽 정렬) 정사각형 대표 이미지.
 * 대표 이미지는 og:image 와 같은 URL 을 <img> 로 둡니다(검색 썸네일 신호). 장례 영역이라 라임 없음.
 * 히어로 글자 요소: H1 + 부제 + 버튼 줄 (+ 선택 meta 한 줄) 까지.
 */
export function DirectoryHero({
    crumbs,
    title,
    subtitle,
    meta,
    actions,
    image,
}: {
    crumbs: { name: string; href: string }[];
    /** H1. 검색어 그대로 (업체명, "{시도} 반려동물 장례식장 N곳") */
    title: React.ReactNode;
    subtitle?: React.ReactNode;
    /** 제목 위 작은 한 줄 (예: "경기 김포시 · 허가 동물장묘업") */
    meta?: React.ReactNode;
    /** 버튼 줄 (a 링크들) */
    actions?: React.ReactNode;
    /** 정사각형 대표 이미지 (1200x1200 PNG) */
    image: { src: string; alt: string };
}) {
    return (
        <section className="relative isolate overflow-hidden bg-night text-star">
            <div className="site-stars -z-10" aria-hidden />
            <Container className="pb-12 pt-5 sm:pb-16">
                <Breadcrumbs items={crumbs} tone="onNight" />
                <div className="mt-8 grid items-center gap-8 sm:gap-10 lg:mt-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] lg:gap-16">
                    <div className="min-w-0">
                        {meta && <p className="mb-4 text-[14px] font-semibold text-star-3">{meta}</p>}
                        <h1 className="text-balance text-[30px] font-extrabold leading-[1.22] tracking-[-0.03em] text-star sm:text-[40px] xl:text-[44px]">{title}</h1>
                        {subtitle && <p className="mt-5 max-w-[40ch] text-pretty text-[16px] leading-[1.7] text-star-2 sm:text-[17px]">{subtitle}</p>}
                        {actions && <div className="mt-8 flex flex-wrap gap-3">{actions}</div>}
                    </div>
                    {/* lg 미만에서는 작게, 글자 칸과 같은 왼쪽 줄에 둡니다(첫 화면에 목차·본문이 보이도록) */}
                    <figure className="w-[200px] sm:w-[240px] lg:w-full lg:max-w-none">
                        {/* og:image 와 같은 URL. next/image 최적화를 거치지 않게 <img> 로 둡니다 */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={image.src}
                            alt={image.alt}
                            width={1200}
                            height={1200}
                            fetchPriority="high"
                            className="aspect-square w-full rounded-[28px] ring-1 ring-white/10"
                        />
                    </figure>
                </div>
            </Container>
        </section>
    );
}
