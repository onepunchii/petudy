import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { REGIONS, SIDO, dongLabel, getRegion, type Region } from "@/lib/site/regions";
import { SERVICES, liveServicesEverydayFirst, type Service } from "@/lib/site/services";
import { buildAreaHub, facilityDistances, neighborsOf } from "@/lib/site/local";
import { breadcrumbLd } from "@/lib/site/schema";
import { MAP_NOTE, NeighborhoodMap } from "@/components/site/NeighborhoodMap";
import { PassCard } from "@/components/site/PassCard";
import { Reveal } from "@/components/site/Reveal";
import { ConsultSection } from "@/components/site/sections";
import { CallButton, Container, ICON_STROKE, JsonLd, SectionTitle } from "@/components/site/ui";
import { PageHero } from "../../../_components/PageHero";

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

/** 탑승권 오른쪽(모바일은 아래) 떼어내는 칸: 서비스별로 그 지역에서 확인할 수 있는 사실만 */
function ServiceStub({ service, region }: { service: Service; region: Region }) {
    if (service.slug === "funeral") {
        const fac = facilityDistances(region, 2);
        return (
            <>
                <p className="text-[12px] font-semibold text-ink-3">가까운 허가 장묘업체 방면</p>
                <ul className="mt-2 space-y-1">
                    {fac.map((f) => (
                        <li key={f.area.name} className="text-[16px] font-bold text-ink">
                            {f.area.name}{" "}
                            <span className="text-[14px] font-medium tabular-nums text-ink-2">{f.sameCity ? "(시내)" : `약 ${Math.round(f.km)}km`}</span>
                        </li>
                    ))}
                </ul>
                <p className="mt-2 text-[12px] leading-snug text-ink-3">시·군·구청 기준 직선거리</p>
            </>
        );
    }
    if (service.slug === "grooming") {
        // 밝은 면 위 3D 아이콘은 흰 바탕을 곱하기로 지웁니다 (장례 카드에는 쓰지 않음)
        return (
            <>
                <Image src="/brand/icons/grooming.webp" alt="" width={72} height={72} className="mix-blend-multiply" />
                <p className="mt-2 text-[12px] font-semibold text-ink-3">연결 기준</p>
                <p className="mt-1 text-[15px] font-bold leading-snug text-ink">{region.areas.length}개 생활권, 등록 미용업체</p>
            </>
        );
    }
    return (
        <p className="text-[14px] font-semibold text-ink">
            {service.license.kind} {service.license.type} 업체
        </p>
    );
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
    const soon = SERVICES.filter((s) => s.status === "soon");
    const neighbors = neighborsOf(r);

    return (
        <>
            <JsonLd data={breadcrumbLd(crumbs)} />

            <PageHero
                crumbs={crumbs}
                title={`${r.name} 반려동물 서비스`}
                subtitle={h.subtitle}
                actions={<CallButton tone="onNight" />}
                aside={
                    // 동네 별자리 지도는 자체 밤 배경을 가지므로 밤 히어로 위에 그대로 둡니다
                    <figure className="lg:ml-auto lg:max-w-[540px]">
                        <NeighborhoodMap region={r} className="h-auto w-full" />
                        <figcaption className="mt-3 px-1 text-[13px] leading-relaxed text-star-3">{MAP_NOTE}</figcaption>
                    </figure>
                }
            />

            {/* 히어로 아래 밝은 띠: 지역 소개 + 생활권별 동네 */}
            <section aria-label={`${r.name} 생활권`} className="border-b border-line">
                <Container className="grid gap-10 py-12 sm:py-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-12">
                    <p className="max-w-[62ch] text-[17px] leading-[1.85] text-ink-2">{h.lead}</p>
                    <dl className="grid content-start gap-x-8 gap-y-5 sm:grid-cols-2">
                        {r.areas.map((a) => (
                            <div key={a.name}>
                                <dt className="text-[13px] font-semibold text-ink-3">{a.name}</dt>
                                <dd className="mt-1 text-[15px] leading-relaxed text-ink">{a.dongs.map(dongLabel).join(", ")}</dd>
                            </div>
                        ))}
                    </dl>
                </Container>
            </section>

            <Reveal as="section" className="py-14 sm:py-20">
                <Container>
                    <SectionTitle id="area-services" title={`${r.name}에서 필요한 서비스`} />
                    {/* 서비스가 정해지지 않은 동네 안내라 일상 서비스(미용)를 먼저, 장례를 뒤에 둡니다 */}
                    <ul aria-labelledby="area-services" className="mt-10 grid gap-5">
                        {liveServicesEverydayFirst().map((s) => (
                            <li key={s.slug}>
                                <PassCard
                                    href={`/${s.slug}/${r.sido}/${r.slug}`}
                                    radius="tile"
                                    mainClassName="p-6 sm:p-8"
                                    stubClassName="p-6 sm:w-[16.5rem] sm:p-7"
                                    stub={<ServiceStub service={s} region={r} />}
                                >
                                    <p className="text-[13px] font-semibold text-ink-3">{s.available24h ? "24시간 상담" : `${s.license.kind} ${s.license.type} 업체만 연결`}</p>
                                    <h3 className="mt-2 text-[22px] font-bold leading-snug text-ink sm:text-[26px]">
                                        {r.name} {s.keyword}
                                    </h3>
                                    <p className="mt-2 max-w-[44ch] text-[15.5px] leading-[1.7] text-ink-2">{s.tagline}</p>
                                    <span className="mt-6 inline-flex items-center gap-1.5 text-[14.5px] font-semibold text-pine">
                                        자세히 보기
                                        <ArrowRight
                                            className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
                                            strokeWidth={ICON_STROKE}
                                            aria-hidden
                                        />
                                    </span>
                                </PassCard>
                            </li>
                        ))}
                    </ul>

                    {soon.length > 0 && (
                        <div className="mt-8 flex flex-wrap items-center gap-2">
                            <p className="mr-2 text-[13px] font-semibold text-ink-3">곧 연결할 서비스</p>
                            <ul className="contents">
                                {soon.map((s) => (
                                    <li key={s.slug}>
                                        <Link
                                            href={`/${s.slug}`}
                                            className="inline-flex h-9 items-center rounded-full bg-pass px-4 text-[14px] text-ink-2 ring-1 ring-inset ring-line transition-colors hover:text-ink hover:ring-ink/25"
                                        >
                                            {s.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </Container>
            </Reveal>

            {neighbors.length > 0 && (
                <section aria-labelledby="area-neighbors" className="pb-16 sm:pb-20">
                    <Container>
                        <h2 id="area-neighbors" className="text-[18px] font-bold text-ink">
                            {r.name}와 맞닿은 지역
                        </h2>
                        <ul className="mt-4 flex flex-wrap gap-2">
                            {neighbors.map(({ region: n }) => (
                                <li key={n.slug}>
                                    <Link
                                        href={`/area/${n.sido}/${n.slug}`}
                                        className="inline-flex h-10 items-center rounded-full bg-pass px-4 text-[14.5px] font-semibold text-ink ring-1 ring-inset ring-line transition-colors hover:ring-ink/25"
                                    >
                                        {n.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </Container>
                </section>
            )}

            <ConsultSection region={r} />
        </>
    );
}
