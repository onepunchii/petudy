import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, ExternalLink, Info } from "lucide-react";
import { SITE } from "@/lib/site/config";
import { FUNERAL_HOMES, funeralHomesPath } from "@/lib/site/funeral-homes";
import { GUIDES, getGuide, guideCover, type Block } from "@/lib/site/guides";
import { getService } from "@/lib/site/services";
import { articleLd, breadcrumbLd, faqLd } from "@/lib/site/schema";
import { PassCard } from "@/components/site/PassCard";
import { ConsultSection } from "@/components/site/sections";
import { CallButton, Container, FaqList, ICON_STROKE, JsonLd } from "@/components/site/ui";
import { PageHero } from "../../_components/PageHero";
import { ShareButton } from "@/components/site/ShareButton";

export const dynamicParams = false;
export const generateStaticParams = () => GUIDES.map((g) => ({ slug: g.slug }));

type Props = { params: Promise<{ slug: string }> };

/** 가이드 표지(public/brand/guides/{slug}.webp) 크기. 12장 모두 같습니다 */
const COVER_SIZE = { width: 1200, height: 896 };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const g = getGuide((await params).slug);
    if (!g) return {};
    const path = `/guide/${g.slug}`;
    const cover = guideCover(g.slug);
    // 메타데이터는 얕은 병합이라 openGraph 를 쓰면 layout 의 type/locale/siteName 이 사라집니다. 여기서 다시 넣습니다
    return {
        title: g.title,
        description: g.description,
        keywords: g.keywords,
        alternates: { canonical: path },
        robots: { index: true, follow: true, "max-image-preview": "large" },
        openGraph: {
            type: "article",
            locale: "ko_KR",
            siteName: SITE.fullName,
            url: path,
            title: g.title,
            description: g.description,
            modifiedTime: g.updated,
            images: [{ url: cover.src, ...COVER_SIZE, alt: cover.alt || g.title, type: "image/webp" }],
        },
        twitter: { card: "summary_large_image", title: g.title, description: g.description, images: [cover.src] },
    };
}

/* 본문은 밝은 면 읽기 기준: 17px, 행간 1.88, 최대 폭 약 40em */
function renderBlock(b: Block, i: number) {
    if ("h2" in b)
        return (
            <h2 key={i} className="mt-14 text-[22px] font-bold leading-[1.4] text-ink first:mt-0 sm:text-[24px]">
                {b.h2}
            </h2>
        );
    if ("h3" in b)
        return (
            <h3 key={i} className="mt-9 text-[18px] font-bold leading-[1.45] text-ink sm:text-[19px]">
                {b.h3}
            </h3>
        );
    if ("p" in b)
        return (
            <p key={i} className="mt-4 first:mt-0">
                {b.p}
            </p>
        );
    if ("ul" in b)
        return (
            <ul key={i} className="mt-4 list-disc space-y-2 pl-5 marker:text-ink-3">
                {b.ul.map((x) => (
                    <li key={x} className="pl-1">
                        {x}
                    </li>
                ))}
            </ul>
        );
    if ("ol" in b)
        return (
            <ol key={i} className="mt-4 list-decimal space-y-2 pl-5 marker:font-semibold marker:text-ink-3">
                {b.ol.map((x) => (
                    <li key={x} className="pl-1">
                        {x}
                    </li>
                ))}
            </ol>
        );
    if ("note" in b)
        return (
            <div key={i} className="my-8 flex gap-3 rounded-[20px] bg-pine-soft p-5 text-[16px] leading-[1.75] text-ink sm:p-6">
                <Info className="mt-1 h-5 w-5 shrink-0 text-pine" strokeWidth={ICON_STROKE} aria-hidden />
                <p>{b.note}</p>
            </div>
        );
    return (
        <div key={i} className="my-8 overflow-x-auto rounded-[20px] bg-pass ring-1 ring-line">
            <table className="w-full min-w-[480px] text-left text-[15px] leading-[1.6]">
                <thead className="bg-paper-2 text-[13px] text-ink-2">
                    <tr>
                        {b.table.head.map((h) => (
                            <th key={h} scope="col" className="px-4 py-3 font-semibold">
                                {h}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-line">
                    {b.table.rows.map((row) => (
                        <tr key={row.join("|")}>
                            {row.map((cell, j) =>
                                j === 0 ? (
                                    <th key={j} scope="row" className="px-4 py-3.5 align-top font-semibold text-ink">
                                        {cell}
                                    </th>
                                ) : (
                                    <td key={j} className="px-4 py-3.5 align-top text-ink-2">
                                        {cell}
                                    </td>
                                ),
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default async function GuidePage({ params }: Props) {
    const g = getGuide((await params).slug);
    if (!g) notFound();
    const service = getService(g.service)!;
    const path = `/guide/${g.slug}`;
    const crumbs = [
        { name: "홈", href: "/" },
        { name: "보호자 가이드", href: "/guide" },
        { name: g.title, href: path },
    ];
    const related = GUIDES.filter((x) => x.service === g.service && x.slug !== g.slug).slice(0, 4);
    const cover = guideCover(g.slug);
    const licensed = service.license.type === "허가" ? "허가" : "등록";

    return (
        <>
            <JsonLd
                data={[
                    breadcrumbLd(crumbs),
                    articleLd({ title: g.title, description: g.description, path, updated: g.updated, image: cover.src }),
                    ...(g.faqs ? [faqLd(g.faqs)] : []),
                ]}
            />

            <PageHero
                size="compact"
                crumbs={crumbs}
                eyebrow={`${service.name} 가이드`}
                title={g.title}
                // 표지 옆 제목 칸(lg 약 490~550px)에서 긴 가이드 제목도 2줄에 들도록 xl 부터 40px
                titleClassName="leading-[1.3] sm:text-[36px] xl:text-[40px]"
                // 가족·친구에게 글을 보내는 버튼(휴대폰 공유창 또는 링크 복사)
                actions={<ShareButton tone="onNight" size="sm" title={g.title} text={g.description} path={path} />}
                aside={
                    <figure className="relative aspect-[4/3] overflow-hidden rounded-[28px] bg-night-2 ring-1 ring-white/10 lg:ml-auto lg:max-w-[480px]">
                        <Image src={cover.src} alt={cover.alt} fill preload sizes="(min-width: 1024px) 480px, 100vw" className="object-cover" />
                    </figure>
                }
            />

            <div className="py-12 sm:py-16">
                <Container className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-16">
                    <article className="min-w-0">
                        <PassCard
                            as="section"
                            aria-label="핵심 요약"
                            className="max-w-[40em]"
                            stub={
                                <dl className="grid gap-3 text-[13px] leading-snug">
                                    <div>
                                        <dt className="text-ink-3">업데이트</dt>
                                        <dd className="mt-0.5 font-semibold tabular-nums text-ink">
                                            <time dateTime={g.updated}>{g.updated.replaceAll("-", ".")}</time>
                                        </dd>
                                    </div>
                                    {g.sources && (
                                        <div>
                                            <dt className="text-ink-3">근거 자료</dt>
                                            <dd className="mt-0.5">
                                                <a href="#sources" className="font-semibold text-pine underline-offset-4 hover:underline">
                                                    {g.sources.length}건 보기
                                                </a>
                                            </dd>
                                        </div>
                                    )}
                                    <div>
                                        <dt className="text-ink-3">작성</dt>
                                        <dd className="mt-0.5 font-semibold text-ink">포온 편집팀</dd>
                                    </div>
                                </dl>
                            }
                        >
                            <h2 className="text-[15px] font-bold text-ink">핵심 요약</h2>
                            <ul className="mt-4 space-y-3 text-[16px] leading-[1.7] text-ink">
                                {g.summary.map((s) => (
                                    <li key={s} className="flex gap-3">
                                        <Check className="mt-[5px] h-4 w-4 shrink-0 text-pine" strokeWidth={ICON_STROKE} aria-hidden />
                                        {s}
                                    </li>
                                ))}
                            </ul>
                        </PassCard>

                        <div className="mt-12 max-w-[40em] text-[17px] leading-[1.88] text-ink-2">{g.body.map(renderBlock)}</div>

                        {g.faqs && (
                            <section aria-labelledby="guide-faq" className="mt-16 max-w-[40em]">
                                <h2 id="guide-faq" className="text-[22px] font-bold text-ink sm:text-[24px]">
                                    자주 묻는 질문
                                </h2>
                                <div className="mt-5">
                                    <FaqList faqs={g.faqs} />
                                </div>
                            </section>
                        )}

                        {g.service === "funeral" && (
                            <section aria-labelledby="guide-directory" className="mt-12 max-w-[40em] border-t border-line pt-8">
                                <h2 id="guide-directory" className="text-[18px] font-bold text-ink">
                                    허가 장례식장 찾아보기
                                </h2>
                                <p className="mt-2 text-[15px] leading-[1.7] text-ink-2">
                                    동물보호관리시스템 공식 목록에 오른 {FUNERAL_HOMES.length}곳을 시·도별로 정리했습니다.
                                </p>
                                <Link
                                    href={funeralHomesPath()}
                                    className="mt-4 inline-flex items-center gap-1.5 text-[15px] font-semibold text-pine underline-offset-4 hover:underline"
                                >
                                    전국 허가 반려동물 장례식장 목록
                                    <ArrowRight className="h-4 w-4" strokeWidth={ICON_STROKE} aria-hidden />
                                </Link>
                            </section>
                        )}

                        {g.sources && (
                            <section id="sources" aria-labelledby="guide-sources" className="mt-12 max-w-[40em] scroll-mt-24 border-t border-line pt-6">
                                <h2 id="guide-sources" className="text-[14px] font-bold text-ink-2">
                                    참고 자료
                                </h2>
                                <ul className="mt-3 space-y-2 text-[14px] text-ink-3">
                                    {g.sources.map((s) => (
                                        <li key={s.url}>
                                            <a href={s.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-ink">
                                                {s.label}
                                                <ExternalLink className="h-3.5 w-3.5" strokeWidth={ICON_STROKE} aria-hidden />
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}

                        {related.length > 0 && (
                            <nav aria-labelledby="guide-related" className="mt-16 border-t border-line pt-10">
                                <h2 id="guide-related" className="text-[18px] font-bold text-ink">
                                    함께 읽으면 좋은 글
                                </h2>
                                <ul className="mt-6 grid gap-x-8 gap-y-6 sm:grid-cols-2">
                                    {related.map((x) => {
                                        const c = guideCover(x.slug);
                                        return (
                                            <li key={x.slug}>
                                                <Link href={`/guide/${x.slug}`} className="group grid grid-cols-[96px_minmax(0,1fr)] items-center gap-4">
                                                    <span className="relative aspect-[4/3] overflow-hidden rounded-xl bg-night-2">
                                                        <Image
                                                            src={c.src}
                                                            alt=""
                                                            fill
                                                            sizes="96px"
                                                            className="object-cover transition-transform duration-500 group-hover:scale-[1.05] motion-reduce:transition-none"
                                                        />
                                                    </span>
                                                    <span className="text-[15px] font-semibold leading-snug text-ink group-hover:text-pine">{x.title}</span>
                                                </Link>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </nav>
                        )}
                    </article>

                    {/* 본문 속 예외 밤 카드 한 장. 모바일은 하단 플로팅 바가 같은 역할을 하므로 숨깁니다 */}
                    <aside aria-label={`${service.short} 상담`} className="hidden lg:block">
                        <div className="lg:sticky lg:top-24">
                            <PassCard
                                tone="night"
                                stubPosition="bottom"
                                mainClassName="p-6"
                                stubClassName="p-5"
                                stub={<CallButton tone="onNight" size="sm" className="w-full" fallbackHref={`/contact?service=${service.slug}`} />}
                            >
                                <p className="text-[17px] font-bold leading-snug text-star">
                                    {service.available24h ? "지금 도움이 필요하신가요?" : "우리 동네에서 찾고 계신가요?"}
                                </p>
                                <p className="mt-2 text-[14.5px] leading-[1.7] text-star-2">
                                    계신 동네를 알려 주시면 가까운 {licensed} 업체와 비용을 먼저 확인해 드립니다.
                                </p>
                                <Link
                                    href={`/${service.slug}#regions`}
                                    className="mt-4 inline-flex items-center gap-1.5 text-[14px] font-semibold text-star underline-offset-4 hover:underline"
                                >
                                    우리 동네 찾기
                                    <ArrowRight className="h-4 w-4" strokeWidth={ICON_STROKE} aria-hidden />
                                </Link>
                            </PassCard>
                        </div>
                    </aside>
                </Container>
            </div>

            <ConsultSection service={service} />
        </>
    );
}
