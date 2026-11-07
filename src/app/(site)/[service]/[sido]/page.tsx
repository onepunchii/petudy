import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { SIDO, regionsBySido, type SidoSlug } from "@/lib/site/regions";
import { getService, liveServices } from "@/lib/site/services";
import { facilityDistances, isIndexable } from "@/lib/site/local";
import { funeralOgAlt, funeralSidoServiceCard } from "@/lib/site/og-cards-funeral";
import { breadcrumbLd, faqLd, serviceLd } from "@/lib/site/schema";
import { metaWithImage } from "@/lib/site/seo";
import { FacilityTable } from "@/components/site/FacilityTable";
import { Reveal } from "@/components/site/Reveal";
import { ServiceHero } from "@/components/site/ServiceHero";
import { ConsultSection, HUB_SCENARIOS, LicenseNote, PriceSection, ScenarioSection } from "@/components/site/sections";
import { Container, FaqList, ICON_STROKE, JsonLd, SectionTitle } from "@/components/site/ui";

export const dynamicParams = false;
export const generateStaticParams = () =>
    liveServices().flatMap((s) => (["seoul", "gyeonggi"] as const).map((sido) => ({ service: s.slug, sido })));

type Props = { params: Promise<{ service: string; sido: string }> };

const copy = (serviceSlug: string, sido: SidoSlug) => {
    const name = SIDO[sido].short;
    if (serviceSlug === "funeral") {
        return {
            title: `${name} 강아지 장례식장 · 반려동물 장례 지역별 안내`,
            h1: sido === "seoul" ? <>서울 반려동물 장례식장,<br />출발하는 동네부터 정하세요</> : <>경기 반려동물 장례식장,<br />우리 시에서 가까운 곳으로</>,
            // 바로 아래 lead 와 같은 사실을 되풀이하지 않도록, 부제는 여행 은유 한 줄로
            subtitle: "아이가 먼저 떠나는 여행, 가장 편한 길을 함께 찾겠습니다",
            lead:
                sido === "seoul"
                    ? "서울에는 고정식 반려동물 화장 시설이 없어 경기도·인천의 허가 장례식장으로 이동해야 합니다. 서울 동북권은 남양주·경기 광주 방면, 서남권은 김포·인천 서구·안산 방면처럼 출발하는 구에 따라 가까운 곳이 달라집니다."
                    : "경기도에는 수도권 허가 동물장묘업체 대부분이 모여 있습니다. 같은 시 안에 업체가 있는 곳도 있고, 이웃 시로 이동하는 편이 빠른 곳도 있어 시·권역별로 안내합니다.",
            description:
                sido === "seoul"
                    ? "서울 25개 구 반려동물 장례 안내. 서울에는 고정식 화장 시설이 없어 구별로 가까운 경기·인천 허가 장례식장 방면과 이동 시간, 픽업, 비용을 정리했습니다."
                    : "경기 주요 도시 반려동물 장례 안내. 시별로 가까운 허가 장묘업체 소재 지역과 이동 시간, 픽업, 비용을 정리했습니다.",
        };
    }
    return {
        title: `${name} 애견미용 · 지역별 강아지·고양이 미용실 연결`,
        h1: <>{name} 애견미용,<br />우리 동네 미용실 찾기</>,
        subtitle: "자주 다녀야 하는 곳이라, 오가기 편한 곳부터 찾습니다",
        lead: `${SIDO[sido].name} ${regionsBySido(sido).length}개 지역의 생활권·동네 기준으로 가까운 등록 미용업체를 연결합니다.`,
        description: `${SIDO[sido].name} 지역별 애견미용 안내. 구·시를 선택하면 생활권 기준으로 가까운 등록 미용업체를 연결합니다.`,
    };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { service: sv, sido } = await params;
    const service = getService(sv);
    if (!service || !(sido in SIDO)) return {};
    const c = copy(service.slug, sido as SidoSlug);
    const indexable = regionsBySido(sido as SidoSlug).some((r) => isIndexable(service, r));
    // 장례: 정사각형 대표 이미지(/og/funeral/{sido}/square.png). 미용은 그대로
    if (service.slug === "funeral") {
        return metaWithImage({
            title: c.title,
            description: c.description,
            path: `/${service.slug}/${sido}`,
            imageAlt: funeralOgAlt(funeralSidoServiceCard(sido as SidoSlug)),
            noindex: !indexable,
        });
    }
    return {
        title: c.title,
        description: c.description,
        alternates: { canonical: `/${service.slug}/${sido}` },
        robots: indexable ? undefined : { index: false, follow: true },
        openGraph: { title: c.title, url: `/${service.slug}/${sido}` },
    };
}

export default async function SidoHubPage({ params }: Props) {
    const { service: sv, sido: sd } = await params;
    const service = getService(sv);
    if (!service || !(sd in SIDO)) notFound();
    const sido = sd as SidoSlug;
    const c = copy(service.slug, sido);
    const regions = regionsBySido(sido);
    const isFuneral = service.slug === "funeral";
    const crumbs = [
        { name: "홈", href: "/" },
        { name: service.name, href: `/${service.slug}` },
        { name: SIDO[sido].name, href: `/${service.slug}/${sido}` },
    ];
    const faqs = service.faqs.slice(0, 4);

    return (
        <>
            <JsonLd
                data={[
                    breadcrumbLd(crumbs),
                    serviceLd({ name: `${SIDO[sido].short} ${service.name}`, description: c.description, path: `/${service.slug}/${sido}`, serviceType: service.keyword, areaName: SIDO[sido].name }),
                    faqLd(faqs),
                ]}
            />
            <ServiceHero
                service={service}
                crumbs={crumbs}
                title={c.h1}
                subtitle={c.subtitle}
                lead={c.lead}
                picker={false}
                secondary={{ href: "#regions", label: "우리 동네 찾기" }}
            />

            {!isFuneral && <ScenarioSection service={service} scenarios={HUB_SCENARIOS[service.slug] ?? []} title="지금 상황에 맞춰 안내합니다" featured={1} />}

            <PriceSection service={service} showLicense={!isFuneral} />

            {isFuneral && (
                <Reveal as="section" className="py-16 sm:py-20">
                    <Container className="grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-14">
                        <div>
                            <SectionTitle
                                title={sido === "seoul" ? "서울에서 출발하면 경기·인천으로 이동합니다" : "경기도 안에서도 시마다 가까운 곳이 다릅니다"}
                                lead="표는 동물보호관리시스템의 허가 현황을 지역별로 묶은 것입니다. 구·시를 고르면 그 지역 중심에서 가까운 순서로 다시 정리해 보여드립니다."
                            />
                            <LicenseNote service={service} className="mt-10 border-t border-line pt-8" />
                        </div>
                        <FacilityTable className="lg:mt-1" />
                    </Container>
                </Reveal>
            )}

            {/* 출발 안내판: 구·시 목록 */}
            <Reveal as="section" id="regions" className="scroll-mt-20 py-16 sm:py-20">
                <Container>
                    <SectionTitle
                        title={isFuneral ? "출발하는 구·시를 선택하세요" : "우리 동네를 선택하세요"}
                        lead={
                            isFuneral
                                ? `${SIDO[sido].name} ${regions.length}곳. 각 지역 중심에서 가장 가까운 허가 장묘업체 소재 지역을 함께 표시했습니다.`
                                : `${SIDO[sido].name} ${regions.length}곳. 지역을 고르면 생활권과 동네 기준으로 안내합니다.`
                        }
                    />
                    <ul className="mt-10 grid gap-x-12 sm:grid-cols-2">
                        {regions.map((r) => {
                            const near = isFuneral ? facilityDistances(r, 2) : [];
                            return (
                                <li key={r.slug}>
                                    <Link
                                        href={`/${service.slug}/${r.sido}/${r.slug}`}
                                        className="group flex items-start justify-between gap-4 border-t border-line py-4 transition-colors hover:border-ink/50 motion-reduce:transition-none"
                                    >
                                        <span className="min-w-0">
                                            <span className="flex items-center gap-1.5 text-[16.5px] font-bold text-ink">
                                                {r.name} {service.short}
                                                <ArrowRight
                                                    className="h-4 w-4 shrink-0 text-ink-3 opacity-0 transition-opacity group-hover:opacity-100 motion-reduce:transition-none"
                                                    strokeWidth={ICON_STROKE}
                                                    aria-hidden
                                                />
                                            </span>
                                            <span className="mt-1 block text-[13px] leading-relaxed text-ink-3">{r.areas.map((a) => a.name).join(", ")}</span>
                                        </span>
                                        {isFuneral && (
                                            <span className="shrink-0 text-right text-[13px] leading-[1.65] text-ink-2">
                                                <span className="sr-only">가까운 방면: </span>
                                                {near.map((n) => (
                                                    <span key={n.area.name} className="block whitespace-nowrap">
                                                        {n.area.name} <span className="tabular-nums text-ink">{n.sameCity ? "시내" : `약 ${Math.round(n.km)}km`}</span>
                                                    </span>
                                                ))}
                                            </span>
                                        )}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </Container>
            </Reveal>

            <Reveal as="section" className="py-16 sm:py-20">
                <Container className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-14">
                    <SectionTitle title={`${SIDO[sido].short} ${service.short} 자주 묻는 질문`} />
                    <FaqList faqs={faqs} />
                </Container>
            </Reveal>

            <ConsultSection service={service} />
        </>
    );
}
