import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { SITE } from "@/lib/site/config";
import { ArrowRight } from "lucide-react";
import { NATIONAL_FUNERAL_COUNT, GYEONGGI_FUNERAL_COUNT } from "@/lib/site/facilities";
import { SIDO } from "@/lib/site/regions";
import { SERVICES, getService } from "@/lib/site/services";
import { funeralOgAlt, funeralServiceCard } from "@/lib/site/og-cards-funeral";
import { breadcrumbLd, faqLd, serviceLd } from "@/lib/site/schema";
import { metaWithImage } from "@/lib/site/seo";
import { FacilityTable } from "@/components/site/FacilityTable";
import { LeadForm } from "@/components/site/LeadForm";
import { PassCard } from "@/components/site/PassCard";
import { Reveal } from "@/components/site/Reveal";
import { ServiceHero } from "@/components/site/ServiceHero";
import { NearestFinderSection } from "@/components/site/funeral-homes/NearestFinderSection";
import {
    ConsultSection,
    GuideCards,
    HUB_SCENARIOS,
    LicenseNote,
    PriceSection,
    ProcessSection,
    RegionLinkGrid,
    ScenarioSection,
    guidesBySlugs,
    serviceIconSrc,
} from "@/components/site/sections";
import { Container, FaqList, ICON_STROKE, JsonLd, PillLink, SectionTitle } from "@/components/site/ui";

export const dynamicParams = false;
export const generateStaticParams = () => SERVICES.map((s) => ({ service: s.slug }));

type Props = { params: Promise<{ service: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const s = getService((await params).service);
    if (!s) return {};
    const title =
        s.slug === "funeral"
            ? `반려동물 장례식장 · 강아지·고양이 장례${SITE.open24h ? " 24시간" : ""} 상담 (서울·경기)`
            : s.slug === "grooming"
              ? "애견미용 · 강아지·고양이 미용실 동네별 연결 (서울·경기)"
              : `${s.name} · 오픈 준비중`;
    const description =
        s.slug === "funeral"
            ? `서울·경기 반려동물 장례식장${SITE.open24h ? " 24시간" : ""} 상담. 서울에는 고정식 화장 시설이 없어 출발 동네 기준으로 가까운 경기·인천 허가 장례식장, 픽업, 체중별 비용을 먼저 안내합니다.`
            : s.slug === "grooming"
              ? "서울·경기 동네별 애견미용 연결. 산책 동선에서 가까운 등록 미용업체 중 1:1 미용, 예민·노령견, 고양이 미용이 가능한 곳을 골라 예약까지 연결합니다."
              : s.intro;
    const keywords = [s.keyword, ...s.altKeywords];
    // 장례: 정사각형 대표 이미지(/og/funeral/square.png)로 네이버·구글 썸네일 신호
    if (s.slug === "funeral") {
        return metaWithImage({ title, description, keywords, path: `/${s.slug}`, imageAlt: funeralOgAlt(funeralServiceCard()), noindex: s.status !== "live" });
    }
    return {
        title,
        description,
        keywords,
        alternates: { canonical: `/${s.slug}` },
        robots: s.status === "live" ? undefined : { index: false, follow: true },
        openGraph: { title, url: `/${s.slug}` },
    };
}

export default async function ServiceHubPage({ params }: Props) {
    const service = getService((await params).service);
    if (!service) notFound();

    const crumbs = [
        { name: "홈", href: "/" },
        { name: service.name, href: `/${service.slug}` },
    ];

    if (service.status === "soon") {
        const icon = serviceIconSrc(service.slug);
        return (
            <>
                <ServiceHero
                    service={service}
                    crumbs={crumbs}
                    title={
                        <>
                            {service.name}
                            <br />
                            <span className="text-star-2">곧 우리 동네에서 연결합니다</span>
                        </>
                    }
                    subtitle={service.tagline}
                    lead={service.intro}
                    aside={<LeadForm service={service.slug} compact />}
                />
                <ProcessSection service={service} />
                <Reveal as="section" className="pb-20 sm:pb-24">
                    <Container className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center lg:gap-14">
                        <LicenseNote service={service} />
                        <PassCard
                            href="/partners"
                            radius="tile"
                            stub={
                                icon ? (
                                    <Image src={icon} alt="" width={160} height={160} className="mx-auto h-20 w-20 mix-blend-multiply" />
                                ) : (
                                    <ArrowRight className="mx-auto h-5 w-5 text-ink-3" strokeWidth={ICON_STROKE} aria-hidden />
                                )
                            }
                            stubClassName="items-center"
                        >
                            <p className="text-[17px] font-bold text-ink">{service.short} 업체를 운영하고 계신가요?</p>
                            <p className="mt-2 text-[14.5px] leading-relaxed text-ink-2">동네 보호자님과 연결될 제휴 업체를 모집하고 있습니다.</p>
                            <span className="mt-4 inline-flex items-center gap-1 text-[14.5px] font-semibold text-ink underline decoration-ink/30 underline-offset-4 group-hover:decoration-ink">
                                제휴 안내 보기
                                <ArrowRight className="h-4 w-4" strokeWidth={ICON_STROKE} aria-hidden />
                            </span>
                        </PassCard>
                    </Container>
                </Reveal>
            </>
        );
    }

    const isFuneral = service.slug === "funeral";
    const guides = guidesBySlugs(service.guideSlugs);
    const scenarios = HUB_SCENARIOS[service.slug] ?? [];

    return (
        <>
            <JsonLd
                data={[
                    breadcrumbLd(crumbs),
                    serviceLd({ name: service.name, description: service.intro, path: `/${service.slug}`, serviceType: service.keyword }),
                    faqLd(service.faqs),
                ]}
            />
            <ServiceHero
                service={service}
                crumbs={crumbs}
                title={
                    isFuneral ? (
                        <>
                            반려동물 장례식장,
                            <br />
                            우리 동네에서 가장 가까운 곳으로
                        </>
                    ) : (
                        <>
                            애견미용,
                            <br />
                            산책길에서 가까운 미용실로
                        </>
                    )
                }
                // 미용 부제는 바로 아래 lead(service.intro)의 "견종·성향에 맞춰 예약까지 연결"을 되풀이하지 않도록
                subtitle={isFuneral ? "아이가 먼저 떠나는 여행, 마지막 인사까지 곁에서 함께 준비합니다" : "자주 다녀야 하는 곳이라, 오가기 편한 곳부터 찾습니다"}
                lead={service.intro}
                chips={
                    isFuneral
                        ? ["허가 장례식장만", "개별 화장·전 과정 참관", "당일 진행", "픽업(운구) 상담", "상담·연결 무료"]
                        : ["등록 미용업체만", "1:1 미용 우선", "예민·노령견 대응", "고양이 미용", "상담·연결 무료"]
                }
                // 장례: 급한 보호자가 바로 아래 '가까운 허가 장례식장 찾기'로 내려가도록
                secondary={isFuneral ? { href: "#nearest", label: "가까운 장례식장 찾기" } : undefined}
            />

            {/* 장례: 위치·동네로 가까운 허가 장례식장 3곳과 업체 전화 */}
            {isFuneral && <NearestFinderSection className="pt-14 sm:pt-16" />}

            {/* 미용: 상황 → 가격 / 장례: 비용 → 허가 업체 표 */}
            {!isFuneral && <ScenarioSection service={service} scenarios={scenarios} title="지금 상황에 맞춰 안내합니다" featured={1} />}

            <PriceSection service={service} showLicense={!isFuneral} />

            {isFuneral && (
                <Reveal as="section" className="py-16 sm:py-20">
                    <Container className="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-14">
                        <div>
                            <SectionTitle
                                title={
                                    <>
                                        서울에는 고정식
                                        <br />
                                        반려동물 화장 시설이 없습니다
                                    </>
                                }
                                lead={`용도지역·거리 제한 때문에 서울에는 고정식 반려동물 화장 시설이 없습니다. 전국 허가 동물장묘업체 ${NATIONAL_FUNERAL_COUNT}곳 중 ${GYEONGGI_FUNERAL_COUNT}곳이 경기도에 있어, 서울 보호자님 대부분이 경기도·인천으로 이동해 장례를 치릅니다. 그래서 어디서 출발하느냐에 따라 가까운 곳이 달라집니다.`}
                            />
                            <LicenseNote service={service} className="mt-10 border-t border-line pt-8" />
                            <PassCard href="/guide/pet-death-first-steps" className="mt-10">
                                <p className="text-[17px] font-bold text-ink">방금 아이가 떠났다면</p>
                                <p className="mt-2 text-[14.5px] leading-relaxed text-ink-2">
                                    몸을 바르게 눕히고 수건으로 감싼 뒤 시원한 곳에 두세요. 바로 해야 할 일을 순서대로 정리했습니다.
                                </p>
                                <span className="mt-4 inline-flex items-center gap-1 text-[14.5px] font-semibold text-ink underline decoration-ink/30 underline-offset-4 group-hover:decoration-ink">
                                    순서대로 보기
                                    <ArrowRight className="h-4 w-4" strokeWidth={ICON_STROKE} aria-hidden />
                                </span>
                            </PassCard>
                        </div>
                        <FacilityTable className="lg:mt-1" />
                    </Container>
                </Reveal>
            )}

            <ProcessSection service={service} />

            <Reveal as="section" id="regions" className="scroll-mt-20 py-16 sm:py-20">
                <Container>
                    <SectionTitle
                        title={`우리 동네 ${service.short} 안내`}
                        lead={`구·시를 선택하면 그 지역 생활권과 동네 기준으로 ${isFuneral ? "가까운 허가 장례식장 방면과 이동 방법" : "가까운 미용실"}을 안내합니다.`}
                    />
                    <div className="mt-6 flex flex-wrap gap-2.5">
                        {(["seoul", "gyeonggi"] as const).map((sido) => (
                            <PillLink key={sido} href={`/${service.slug}/${sido}`} size="sm">
                                {SIDO[sido].short} {service.keyword} 전체
                                <ArrowRight className="h-3.5 w-3.5" strokeWidth={ICON_STROKE} aria-hidden />
                            </PillLink>
                        ))}
                    </div>
                    <div className="mt-12">
                        <RegionLinkGrid hrefFor={(r) => `/${service.slug}/${r.sido}/${r.slug}`} labelFor={(r) => `${r.name} ${service.short}`} />
                    </div>
                </Container>
            </Reveal>

            <GuideCards guides={guides} title={isFuneral ? "장례를 앞둔 보호자님께" : "미용 전에 알아두세요"} />

            <Reveal as="section" className="py-16 sm:py-20">
                <Container className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-14">
                    <SectionTitle title={`${service.name} 자주 묻는 질문`} />
                    <FaqList faqs={service.faqs} />
                </Container>
            </Reveal>

            <ConsultSection service={service} />
        </>
    );
}
