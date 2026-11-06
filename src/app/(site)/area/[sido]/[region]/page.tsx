import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { REGIONS, SIDO, dongLabel, getRegion } from "@/lib/site/regions";
import { SERVICES, TONE, liveServices } from "@/lib/site/services";
import { buildAreaHub, facilityDistances, neighborsOf } from "@/lib/site/local";
import { breadcrumbLd } from "@/lib/site/schema";
import { NeighborhoodMap } from "@/components/site/NeighborhoodMap";
import { ConsultSection } from "@/components/site/sections";
import { Breadcrumbs, Container, JsonLd, SectionTitle, ServiceIcon } from "@/components/site/ui";
import { cn } from "@/lib/utils";

export const dynamicParams = false;
export const generateStaticParams = () => REGIONS.map((r) => ({ sido: r.sido, region: r.slug }));

type Props = { params: Promise<{ sido: string; region: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { sido, region } = await params;
    const r = getRegion(sido, region);
    if (!r) return {};
    const h = buildAreaHub(r);
    return { title: h.title, description: h.description, alternates: { canonical: `/area/${r.sido}/${r.slug}` } };
}

export default async function AreaHubPage({ params }: Props) {
    const { sido, region } = await params;
    const r = getRegion(sido, region);
    if (!r) notFound();
    const h = buildAreaHub(r);
    const crumbs = [
        { name: "홈", href: "/" },
        { name: "지역별 찾기", href: "/area" },
        { name: SIDO[r.sido].short, href: "/area" },
        { name: r.name, href: `/area/${r.sido}/${r.slug}` },
    ];
    const fac = facilityDistances(r, 2);
    const soon = SERVICES.filter((s) => s.status === "soon");

    return (
        <>
            <JsonLd data={breadcrumbLd(crumbs)} />
            <Container className="pt-6">
                <Breadcrumbs items={crumbs} />
            </Container>
            <section className="py-10 sm:py-14">
                <Container className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
                    <div>
                        <p className="text-[14px] font-semibold text-pine">{SIDO[r.sido].name}</p>
                        <h1 className="mt-3 text-[34px] font-extrabold leading-[1.2] text-ink sm:text-[46px]">
                            {r.name} 반려동물 서비스
                        </h1>
                        <p className="mt-5 text-[16px] leading-[1.85] text-ink-2">{h.lead}</p>
                        <p className="mt-5 text-[14px] leading-relaxed text-ink-3">{r.areas.flatMap((a) => a.dongs).map(dongLabel).join(" · ")}</p>
                    </div>
                    <NeighborhoodMap region={r} className="h-auto w-full" />
                </Container>
            </section>

            <section className="py-10">
                <Container>
                    <SectionTitle eyebrow="서비스 선택" title={`${r.name}에서 필요한 서비스`} />
                    <div className="mt-8 grid gap-4 md:grid-cols-2">
                        {liveServices().map((s) => (
                            <Link key={s.slug} href={`/${s.slug}/${r.sido}/${r.slug}`} className={cn("group flex flex-col rounded-[28px] p-7 text-white", TONE[s.tone].bg)}>
                                <ServiceIcon icon={s.icon} className="h-7 w-7" />
                                <p className="mt-5 text-[24px] font-bold">{r.name} {s.keyword}</p>
                                <p className="mt-2 text-[14.5px] leading-relaxed text-white/80">
                                    {s.slug === "funeral"
                                        ? `가까운 허가 장묘업체 방면: ${fac.map((f) => (f.sameCity ? `${f.area.name}(시내)` : `${f.area.name} 약 ${Math.round(f.km)}km`)).join(", ")}`
                                        : s.tagline}
                                </p>
                                <span className="mt-6 inline-flex items-center gap-2 text-[14.5px] font-semibold">
                                    자세히 보기 <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
                                </span>
                            </Link>
                        ))}
                    </div>
                    <ul className="mt-4 flex flex-wrap gap-2">
                        {soon.map((s) => (
                            <li key={s.slug}>
                                <Link href={`/${s.slug}`} className="inline-flex rounded-full bg-white px-4 py-2 text-[13.5px] text-ink-2 ring-1 ring-line hover:ring-ink/25">
                                    {r.short} {s.short} <span className="ml-1 text-ink-3">· 오픈 준비중</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </Container>
            </section>

            <section className="py-12">
                <Container>
                    <p className="text-[15px] font-bold text-ink">{r.name}와 맞닿은 지역</p>
                    <ul className="mt-4 flex flex-wrap gap-2">
                        {neighborsOf(r).map(({ region: n }) => (
                            <li key={n.slug}>
                                <Link href={`/area/${n.sido}/${n.slug}`} className="inline-flex rounded-full bg-white px-4 py-2 text-[14px] font-semibold text-ink ring-1 ring-line hover:ring-ink/25">
                                    {n.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </Container>
            </section>

            <ConsultSection region={r} />
        </>
    );
}
