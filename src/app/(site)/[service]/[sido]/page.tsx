import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SIDO, regionsBySido, type SidoSlug } from "@/lib/site/regions";
import { getService, liveServices } from "@/lib/site/services";
import { facilityDistances, isIndexable } from "@/lib/site/local";
import { breadcrumbLd, faqLd, serviceLd } from "@/lib/site/schema";
import { FacilityTable } from "@/components/site/FacilityTable";
import { ServiceHero } from "@/components/site/ServiceHero";
import { ConsultSection, PriceSection } from "@/components/site/sections";
import { Container, FaqList, JsonLd, SectionTitle } from "@/components/site/ui";

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
            lead:
                sido === "seoul"
                    ? "서울에는 고정식 반려동물 화장 시설이 없어 경기도·인천의 허가 장례식장으로 이동해야 합니다. 서울 동북권은 남양주·경기 광주 방면, 서남권은 김포·인천 서구·안산 방면처럼 출발하는 구에 따라 가까운 곳이 달라집니다."
                    : "경기도에는 수도권 허가 동물장묘업체 대부분이 모여 있습니다. 같은 시 안에 업체가 있는 곳도 있고, 이웃 시로 이동하는 편이 빠른 곳도 있어 시·권역별로 안내합니다.",
            description:
                sido === "seoul"
                    ? "서울 25개 구 반려동물 장례 안내. 서울에는 화장 시설이 없어 구별로 가까운 경기·인천 허가 장례식장 방면과 이동 시간, 픽업, 비용을 정리했습니다."
                    : "경기 주요 도시 반려동물 장례 안내. 시별로 가까운 허가 장묘업체 소재 지역과 이동 시간, 픽업, 비용을 정리했습니다.",
        };
    }
    return {
        title: `${name} 애견미용 · 지역별 강아지·고양이 미용실 연결`,
        h1: <>{name} 애견미용,<br />우리 동네 미용실 찾기</>,
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
            <ServiceHero service={service} crumbs={crumbs} title={c.h1} lead={c.lead} />

            <section className="py-16 sm:py-20">
                <Container>
                    <SectionTitle
                        eyebrow={`${SIDO[sido].name} ${regions.length}곳`}
                        title={isFuneral ? "출발하는 구·시를 선택하세요" : "우리 동네를 선택하세요"}
                        lead={isFuneral ? "각 지역 중심에서 가장 가까운 허가 장묘업체 소재 지역을 함께 표시했습니다." : undefined}
                    />
                    <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {regions.map((r) => {
                            const near = isFuneral ? facilityDistances(r, 2) : [];
                            return (
                                <li key={r.slug}>
                                    <Link href={`/${service.slug}/${r.sido}/${r.slug}`} className="flex h-full flex-col rounded-3xl bg-white p-5 ring-1 ring-line transition hover:-translate-y-0.5 hover:ring-ink/25">
                                        <p className="text-[17px] font-bold text-ink">{r.name} {service.short}</p>
                                        <p className="mt-1 text-[13px] text-ink-3">{r.areas.map((a) => a.name).join(" · ")}</p>
                                        {isFuneral && (
                                            <p className="mt-3 text-[13.5px] text-ink-2">
                                                가까운 방면:{" "}
                                                {near.map((n) => (n.sameCity ? `${n.area.name}(시내)` : `${n.area.name} 약 ${Math.round(n.km)}km`)).join(", ")}
                                            </p>
                                        )}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </Container>
            </section>

            {isFuneral && (
                <section className="pb-4">
                    <Container>
                        <FacilityTable />
                    </Container>
                </section>
            )}

            <PriceSection service={service} />

            <section className="py-16 sm:py-20">
                <Container className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
                    <SectionTitle eyebrow="자주 묻는 질문" title={`${SIDO[sido].short} ${service.short} FAQ`} />
                    <FaqList faqs={faqs} />
                </Container>
            </section>

            <ConsultSection service={service} />
        </>
    );
}
