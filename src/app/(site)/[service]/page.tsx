import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { NATIONAL_FUNERAL_COUNT, GYEONGGI_FUNERAL_COUNT } from "@/lib/site/facilities";
import { SIDO } from "@/lib/site/regions";
import { SERVICES, getService } from "@/lib/site/services";
import { breadcrumbLd, faqLd, serviceLd } from "@/lib/site/schema";
import { FacilityTable } from "@/components/site/FacilityTable";
import { LeadForm } from "@/components/site/LeadForm";
import { ServiceHero } from "@/components/site/ServiceHero";
import { ConsultSection, GuideCards, LicenseNote, PriceSection, ProcessSection, RegionLinkGrid, guidesBySlugs } from "@/components/site/sections";
import { Container, FaqList, JsonLd, SectionTitle } from "@/components/site/ui";

export const dynamicParams = false;
export const generateStaticParams = () => SERVICES.map((s) => ({ service: s.slug }));

type Props = { params: Promise<{ service: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const s = getService((await params).service);
    if (!s) return {};
    const title =
        s.slug === "funeral"
            ? "반려동물 장례식장 · 강아지·고양이 장례 24시간 상담 (서울·경기)"
            : s.slug === "grooming"
              ? "애견미용 · 강아지·고양이 미용실 동네별 연결 (서울·경기)"
              : `${s.name} · 오픈 준비중`;
    return {
        title,
        description:
            s.slug === "funeral"
                ? "서울·경기 반려동물 장례식장 24시간 상담. 서울에는 화장 시설이 없어 출발 동네 기준으로 가까운 경기·인천 허가 장례식장, 픽업, 체중별 비용을 먼저 안내합니다."
                : s.slug === "grooming"
                  ? "서울·경기 동네별 애견미용 연결. 산책 동선에서 가까운 등록 미용업체 중 1:1 미용, 예민·노령견, 고양이 미용이 가능한 곳을 골라 예약까지 연결합니다."
                  : s.intro,
        keywords: [s.keyword, ...s.altKeywords],
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
        return (
            <>
                <ServiceHero
                    service={service}
                    crumbs={crumbs}
                    title={<>{service.name}<br /><span className="opacity-70">곧 우리 동네에서 연결합니다</span></>}
                    lead={service.intro}
                    aside={<LeadForm service={service.slug} compact />}
                />
                <ProcessSection service={service} />
                <section className="pb-8">
                    <Container className="grid gap-4 lg:grid-cols-2">
                        <LicenseNote service={service} />
                        <Link href="/partners" className="flex flex-col justify-center rounded-3xl bg-white p-6 ring-1 ring-line hover:ring-ink/20">
                            <p className="text-[15px] font-bold text-ink">{service.short} 업체를 운영하고 계신가요?</p>
                            <p className="mt-1.5 text-[14px] text-ink-2">동네 보호자님과 연결될 제휴 업체를 모집하고 있습니다 →</p>
                        </Link>
                    </Container>
                </section>
            </>
        );
    }

    const isFuneral = service.slug === "funeral";
    const guides = guidesBySlugs(service.guideSlugs);

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
                        <>반려동물 장례식장,<br />우리 동네에서 가장 가까운 곳으로</>
                    ) : (
                        <>애견미용,<br />산책길에서 가까운 미용실로</>
                    )
                }
                lead={service.intro}
                chips={
                    isFuneral
                        ? ["허가 장례식장만", "개별 화장·전 과정 참관", "당일 진행", "픽업(운구) 상담", "상담·연결 무료"]
                        : ["등록 미용업체만", "1:1 미용 우선", "예민·노령견 대응", "고양이 미용", "상담·연결 무료"]
                }
            />

            {isFuneral && (
                <section className="py-16 sm:py-20">
                    <Container className="grid gap-10 lg:grid-cols-[1fr_1.1fr]">
                        <div>
                            <SectionTitle
                                eyebrow="알고 계셨나요"
                                title={<>서울에는 반려동물<br />화장 시설이 없습니다</>}
                                lead={`용도지역·거리 제한 때문에 서울에는 고정식 반려동물 화장 시설이 없습니다. 전국 허가 동물장묘업체 ${NATIONAL_FUNERAL_COUNT}곳 중 ${GYEONGGI_FUNERAL_COUNT}곳이 경기도에 있어, 서울 보호자님 대부분이 경기도·인천으로 이동해 장례를 치릅니다. 그래서 '어디서 출발하느냐'에 따라 가까운 곳이 달라집니다.`}
                            />
                            <div className="mt-8">
                                <LicenseNote service={service} />
                            </div>
                            <Link href="/guide/pet-death-first-steps" className="mt-4 block rounded-3xl bg-dusk-soft p-6 hover:bg-dusk-soft/70">
                                <p className="text-[15px] font-bold text-dusk">방금 아이가 떠났다면</p>
                                <p className="mt-1.5 text-[14px] leading-relaxed text-ink-2">몸을 바르게 눕히고 수건으로 감싼 뒤 시원한 곳에 두세요. 바로 해야 할 일을 순서대로 정리했습니다 →</p>
                            </Link>
                        </div>
                        <FacilityTable />
                    </Container>
                </section>
            )}

            {!isFuneral && (
                <section className="pt-16">
                    <Container>
                        <LicenseNote service={service} />
                    </Container>
                </section>
            )}

            <ProcessSection service={service} />
            <PriceSection service={service} />

            <section id="regions" className="scroll-mt-20 bg-white py-16 sm:py-24">
                <Container>
                    <SectionTitle
                        eyebrow="지역별 안내"
                        title={`우리 동네 ${service.short} 안내`}
                        lead={`구·시를 선택하면 그 지역 생활권과 동네 기준으로 ${isFuneral ? "가까운 허가 장례식장 방면과 이동 방법" : "가까운 미용실"}을 안내합니다.`}
                    />
                    <div className="mt-6 flex flex-wrap gap-2">
                        {(["seoul", "gyeonggi"] as const).map((sido) => (
                            <Link key={sido} href={`/${service.slug}/${sido}`} className="rounded-full bg-paper px-4 py-2 text-[14px] font-semibold text-ink ring-1 ring-line hover:ring-ink/30">
                                {SIDO[sido].short} {service.keyword} 전체 →
                            </Link>
                        ))}
                    </div>
                    <div className="mt-10">
                        <RegionLinkGrid hrefFor={(r) => `/${service.slug}/${r.sido}/${r.slug}`} labelFor={(r) => `${r.name} ${service.short}`} />
                    </div>
                </Container>
            </section>

            <GuideCards guides={guides} title={isFuneral ? "장례를 앞둔 보호자님께" : "미용 전에 알아두세요"} />

            <section className="py-16 sm:py-20">
                <Container className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
                    <SectionTitle eyebrow="자주 묻는 질문" title={`${service.name} FAQ`} />
                    <FaqList faqs={service.faqs} />
                </Container>
            </section>

            <ConsultSection service={service} />
        </>
    );
}
