import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { funeralHomesPath } from "@/lib/site/funeral-homes";
import { GUIDES, guideCover, type Guide } from "@/lib/site/guides";
import { liveServices } from "@/lib/site/services";
import { breadcrumbLd } from "@/lib/site/schema";
import { Reveal } from "@/components/site/Reveal";
import { Container, ICON_STROKE, JsonLd, SectionTitle } from "@/components/site/ui";
import { cn } from "@/lib/utils";
import { PageHero } from "../_components/PageHero";

export const metadata: Metadata = {
    title: "보호자 가이드 · 반려동물 장례·미용 알아두면 좋은 것",
    description: "강아지·고양이가 떠났을 때 해야 할 일, 장례 비용, 합법 장례식장 확인법, 유골 모시는 방법, 미용 주기와 가격까지. 보호자가 처음 겪는 순간을 위한 가이드.",
    alternates: { canonical: "/guide" },
};

/** 히어로에 세우는 "먼저 읽을 글" */
const FEATURED = "pet-death-first-steps";

const SERVICE_LEAD: Record<string, string> = {
    funeral: "떠나는 날 앞뒤로 보호자가 알아야 할 절차와 비용, 법을 차례대로 정리했습니다.",
    grooming: "함께 사는 동안 자주 찾게 되는 미용 주기와 가격, 고양이 미용을 모았습니다.",
};

/** 표지 + 제목 + 요약 두 줄. 목록용 가로형 */
function GuideRow({ g, size = "sm" }: { g: Guide; size?: "sm" | "md" }) {
    const c = guideCover(g.slug);
    return (
        <Link
            href={`/guide/${g.slug}`}
            className={cn("group grid items-start gap-4 sm:gap-5", size === "md" ? "grid-cols-[132px_minmax(0,1fr)] sm:grid-cols-[176px_minmax(0,1fr)]" : "grid-cols-[112px_minmax(0,1fr)] sm:grid-cols-[148px_minmax(0,1fr)]")}
        >
            <span className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-night-2">
                <Image
                    src={c.src}
                    alt=""
                    fill
                    sizes={size === "md" ? "176px" : "148px"}
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.04] motion-reduce:transition-none"
                />
            </span>
            <span className="min-w-0">
                <span className="block text-[16.5px] font-bold leading-snug text-ink group-hover:text-pine sm:text-[17px]">{g.title}</span>
                <span className="mt-2 line-clamp-2 text-[14.5px] leading-relaxed text-ink-2">{g.description}</span>
            </span>
        </Link>
    );
}

export default function GuideIndexPage() {
    const crumbs = [
        { name: "홈", href: "/" },
        { name: "보호자 가이드", href: "/guide" },
    ];
    const featured = GUIDES.find((g) => g.slug === FEATURED) ?? GUIDES[0];
    const fc = guideCover(featured.slug);

    return (
        <>
            <JsonLd data={breadcrumbLd(crumbs)} />

            <PageHero
                size="compact"
                crumbs={crumbs}
                title={
                    <>
                        반려동물 장례·미용
                        <br />
                        보호자 가이드
                    </>
                }
                subtitle="처음 겪는 순간에 펼쳐 보는 안내서. 법령과 공식 자료를 근거로 썼습니다."
                aside={
                    <Link href={`/guide/${featured.slug}`} className="group block lg:ml-auto lg:max-w-[480px]">
                        <span className="relative block aspect-[4/3] overflow-hidden rounded-[28px] bg-night-2 ring-1 ring-white/10">
                            <Image
                                src={fc.src}
                                alt={fc.alt}
                                fill
                                preload
                                sizes="(min-width: 1024px) 480px, 100vw"
                                className="object-cover transition-transform duration-700 group-hover:scale-[1.03] motion-reduce:transition-none"
                            />
                        </span>
                        <span className="mt-4 block text-[13px] font-semibold text-star-3">먼저 읽어 보세요</span>
                        <span className="mt-1 block text-[17px] font-bold leading-snug text-star underline-offset-4 group-hover:underline">{featured.title}</span>
                    </Link>
                }
            />

            {liveServices().map((s, i) => {
                const list = GUIDES.filter((g) => g.service === s.slug && g.slug !== featured.slug);
                if (!list.length) return null;
                const id = `guide-${s.slug}`;
                // 글이 많은 장례는 두 줄 목록, 적은 미용은 큰 표지 하나 + 옆 목록으로 모양을 나눕니다
                const [lead, ...rest] = list;
                const big = list.length <= 4;
                const lc = guideCover(lead.slug);
                return (
                    <Reveal key={s.slug} as="section" className={cn("py-14 sm:py-20", i > 0 && "border-t border-line")}>
                        <Container>
                            <SectionTitle id={id} title={s.name} lead={SERVICE_LEAD[s.slug]} />
                            {big ? (
                                <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-12">
                                    <Link href={`/guide/${lead.slug}`} className="group block">
                                        <span className="relative block aspect-[4/3] overflow-hidden rounded-[28px] bg-night-2">
                                            <Image
                                                src={lc.src}
                                                alt=""
                                                fill
                                                sizes="(min-width: 1024px) 560px, 100vw"
                                                className="object-cover transition-transform duration-700 group-hover:scale-[1.03] motion-reduce:transition-none"
                                            />
                                        </span>
                                        <span className="mt-5 block text-[20px] font-bold leading-snug text-ink group-hover:text-pine sm:text-[22px]">{lead.title}</span>
                                        <span className="mt-2 block max-w-[52ch] text-[15px] leading-relaxed text-ink-2">{lead.description}</span>
                                    </Link>
                                    <ul aria-labelledby={id} className="grid content-start gap-8">
                                        {rest.map((g) => (
                                            <li key={g.slug}>
                                                <GuideRow g={g} size="md" />
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ) : (
                                <ul aria-labelledby={id} className="mt-10 grid gap-x-12 gap-y-9 md:grid-cols-2">
                                    {list.map((g) => (
                                        <li key={g.slug}>
                                            <GuideRow g={g} />
                                        </li>
                                    ))}
                                </ul>
                            )}
                            {s.slug === "funeral" && (
                                <p className="mt-12 border-t border-line pt-6">
                                    <Link
                                        href={funeralHomesPath()}
                                        className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-pine underline-offset-4 hover:underline"
                                    >
                                        전국 허가 반려동물 장례식장 목록
                                        <ArrowRight className="h-4 w-4" strokeWidth={ICON_STROKE} aria-hidden />
                                    </Link>
                                </p>
                            )}
                        </Container>
                    </Reveal>
                );
            })}
        </>
    );
}
