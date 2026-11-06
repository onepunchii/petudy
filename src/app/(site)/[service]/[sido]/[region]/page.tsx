import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, MapPin, Route, TrainFront, Trees } from "lucide-react";
import { REGIONS, SIDO, dongLabel, getRegion } from "@/lib/site/regions";
import { getService, liveServices } from "@/lib/site/services";
import { buildLocal, isIndexable } from "@/lib/site/local";
import { breadcrumbLd, faqLd, serviceLd } from "@/lib/site/schema";
import { FacilityTable } from "@/components/site/FacilityTable";
import { NeighborhoodMap } from "@/components/site/NeighborhoodMap";
import { ServiceHero } from "@/components/site/ServiceHero";
import { ConsultSection, GuideCards, LicenseNote, PriceSection, ProcessSection, guidesBySlugs } from "@/components/site/sections";
import { Container, FaqList, JsonLd, SectionTitle } from "@/components/site/ui";

export const dynamicParams = false;
export const generateStaticParams = () =>
    liveServices().flatMap((s) => REGIONS.map((r) => ({ service: s.slug, sido: r.sido, region: r.slug })));

type Props = { params: Promise<{ service: string; sido: string; region: string }> };

async function load(params: Props["params"]) {
    const { service: sv, sido, region: rg } = await params;
    const service = getService(sv);
    const region = getRegion(sido, rg);
    if (!service || service.status !== "live" || !region) return null;
    return { service, region, c: buildLocal(service, region) };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const d = await load(params);
    if (!d) return {};
    const { service, region, c } = d;
    const path = `/${service.slug}/${region.sido}/${region.slug}`;
    return {
        title: c.title,
        description: c.description,
        keywords: c.keywords,
        alternates: { canonical: path },
        robots: isIndexable(service, region) ? undefined : { index: false, follow: true },
        openGraph: { title: `${c.title} | 포온`, description: c.description, url: path },
    };
}

export default async function LocalServicePage({ params }: Props) {
    const d = await load(params);
    if (!d) notFound();
    const { service, region: r, c } = d;
    const isFuneral = service.slug === "funeral";
    const path = `/${service.slug}/${r.sido}/${r.slug}`;
    const crumbs = [
        { name: "홈", href: "/" },
        { name: service.name, href: `/${service.slug}` },
        { name: SIDO[r.sido].short, href: `/${service.slug}/${r.sido}` },
        { name: r.name, href: path },
    ];
    const faqs = [...c.faqs, ...service.faqs.filter((f) => !c.faqs.some((x) => x.q === f.q)).slice(0, 3)];
    const otherServices = liveServices().filter((s) => s.slug !== service.slug);
    const dongs = r.areas.flatMap((a) => a.dongs);

    return (
        <>
            <JsonLd
                data={[
                    breadcrumbLd(crumbs),
                    serviceLd({ name: `${r.name} ${service.name}`, description: c.description, path, serviceType: service.keyword, areaName: `${SIDO[r.sido].name} ${r.name}` }),
                    faqLd(faqs),
                ]}
            />

            <ServiceHero
                service={service}
                crumbs={crumbs}
                title={
                    <>
                        {c.h1[0]}
                        <br />
                        <span className="opacity-80">{c.h1[1]}</span>
                    </>
                }
                lead={<p>{c.lead}</p>}
                chips={[`${r.name} 전 지역`, ...(isFuneral ? ["24시간 상담", "허가 업체만", "개별 화장·참관", "픽업 상담"] : ["등록 업체만", "1:1 미용 우선", "예약까지 연결"])]}
                aside={
                    <figure className="rounded-[28px] bg-white/95 p-3 shadow-2xl ring-1 ring-white/20">
                        <NeighborhoodMap region={r} className="h-auto w-full" />
                        <figcaption className="px-2 pb-1 pt-3 text-[12.5px] text-ink-3">
                            {r.name} 생활권 안내도 · {r.areas.length}개 생활권 {dongs.length}개 동네
                        </figcaption>
                    </figure>
                }
            />

            {/* 동네 띠 */}
            <div className="border-b border-line bg-white">
                <Container className="flex items-center gap-3 overflow-x-auto py-4 text-[14px] text-ink-2 scrollbar-hide">
                    <MapPin className="h-4 w-4 shrink-0 text-pine" aria-hidden />
                    <p className="whitespace-nowrap">
                        {dongs.map(dongLabel).join(" · ")} <span className="font-semibold text-ink">· {r.name} 전 지역</span>
                    </p>
                </Container>
            </div>

            {/* 상황별 안내 */}
            <section className="py-16 sm:py-20">
                <Container>
                    <SectionTitle eyebrow="상황별 안내" title={`${r.name} 보호자님 상황에 맞춰 안내합니다`} />
                    <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        {c.scenarios.map((s, i) => (
                            <li key={s.title} className="flex flex-col rounded-3xl bg-white p-6 ring-1 ring-line">
                                <span className="text-[13px] font-bold tabular-nums text-ink-3">{String(i + 1).padStart(2, "0")}</span>
                                <p className="mt-2 text-[16.5px] font-bold text-ink">{s.title}</p>
                                <p className="mt-2 text-[14px] leading-relaxed text-ink-2">{s.desc}</p>
                                <a href="#consult" className="mt-auto pt-5 text-[13.5px] font-semibold text-pine">상담하기 →</a>
                            </li>
                        ))}
                    </ul>
                </Container>
            </section>

            {/* 우리 동네 */}
            <section className="bg-white py-16 sm:py-24">
                <Container className="grid gap-12 lg:grid-cols-[1fr_1.1fr]">
                    <div>
                        <SectionTitle eyebrow={`${r.name} 이야기`} title={c.proximityTitle} lead={c.proximityLead} />
                        <p className="mt-6 text-[15px] leading-[1.85] text-ink-2">{c.localStory}</p>
                        <dl className="mt-8 grid gap-4 text-[14.5px]">
                            <div className="flex gap-3">
                                <dt className="flex w-24 shrink-0 items-center gap-1.5 font-semibold text-ink"><TrainFront className="h-4 w-4 text-ink-3" aria-hidden />주요 역</dt>
                                <dd className="text-ink-2">{r.stations.join(", ")}</dd>
                            </div>
                            <div className="flex gap-3">
                                <dt className="flex w-24 shrink-0 items-center gap-1.5 font-semibold text-ink"><Route className="h-4 w-4 text-ink-3" aria-hidden />주요 도로</dt>
                                <dd className="text-ink-2">{r.roads.join(", ")}</dd>
                            </div>
                            <div className="flex gap-3">
                                <dt className="flex w-24 shrink-0 items-center gap-1.5 font-semibold text-ink"><Trees className="h-4 w-4 text-ink-3" aria-hidden />산책 장소</dt>
                                <dd className="text-ink-2">{r.landmarks.join(", ")}</dd>
                            </div>
                        </dl>
                    </div>
                    <ul className="grid content-start gap-3">
                        {r.areas.map((a) => (
                            <li key={a.name} className="rounded-3xl bg-paper p-5">
                                <p className="text-[15.5px] font-bold text-ink">{a.name}</p>
                                <ul className="mt-3 flex flex-wrap gap-2">
                                    {a.dongs.map((dd) => (
                                        <li key={dd} className="rounded-full bg-white px-3 py-1 text-[13.5px] text-ink-2 ring-1 ring-line">
                                            {dongLabel(dd)}
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        ))}
                    </ul>
                </Container>
            </section>

            {/* 가까운 업체 */}
            <section className="py-16 sm:py-20">
                <Container className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
                    <div>
                        <SectionTitle
                            eyebrow={isFuneral ? "가까운 장례식장 방면" : "가까운 미용실"}
                            title={isFuneral ? `${r.name}에서는 어느 방향이 가까울까요` : `${r.name} 생활권 안에서 찾습니다`}
                            lead={
                                isFuneral
                                    ? `${r.name}청을 기준으로 허가 동물장묘업체가 있는 지역까지의 거리를 계산했습니다. 실제로는 출발하는 동네와 시간대에 따라 순서가 바뀔 수 있어, 상담 시 지금 기준으로 다시 확인합니다.`
                                    : `미용은 자주 다니는 곳이라 걸어서 혹은 차로 10~15분 안의 미용실을 우선 추천합니다. ${r.areas.map((a) => a.name).join(", ")} 기준으로 안내합니다.`
                            }
                        />
                        <div className="mt-8">
                            <LicenseNote service={service} />
                        </div>
                    </div>
                    <div className="grid gap-4">
                        {c.partners.length > 0 && (
                            <ul className="grid gap-3">
                                {c.partners.map(({ partner, km, minutes }) => (
                                    <li key={partner.id} className="rounded-3xl bg-white p-5 ring-1 ring-line">
                                        <p className="text-[16px] font-bold text-ink">{partner.name}</p>
                                        <p className="mt-1 text-[13.5px] text-ink-3">{partner.address}</p>
                                        <p className="mt-2 text-[14px] text-ink-2">
                                            {r.name}청 기준 약 {km.toFixed(1)}km · 차량 약 {minutes[0]}~{minutes[1]}분
                                            {partner.registration && ` · ${partner.registration.kind} ${partner.registration.number}`}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        )}
                        {isFuneral ? (
                            <FacilityTable rows={c.facilities} regionName={r.name} />
                        ) : (
                            c.partners.length === 0 && (
                                <div className="rounded-3xl bg-white p-6 ring-1 ring-line">
                                    <p className="text-[16px] font-bold text-ink">{r.name} 제휴 미용실을 확인하고 있어요</p>
                                    <p className="mt-2 text-[14.5px] leading-relaxed text-ink-2">
                                        지금 상담을 남겨주시면 {r.areas[0].name}·{r.areas[r.areas.length - 1].name} 등 계신 생활권 기준으로 예약 가능한 등록 미용실을 직접 찾아 연락드립니다.
                                    </p>
                                    <a href="#consult" className="mt-4 inline-flex items-center gap-1 text-[14px] font-semibold text-clay">
                                        우리 동네 미용실 찾아달라고 하기 <ArrowRight className="h-4 w-4" aria-hidden />
                                    </a>
                                </div>
                            )
                        )}
                    </div>
                </Container>
            </section>

            <ProcessSection service={service} regionName={r.name} />
            <PriceSection service={service} regionName={r.name} />

            <section className="py-16 sm:py-20">
                <Container className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
                    <SectionTitle eyebrow="자주 묻는 질문" title={`${r.name} ${service.short} FAQ`} />
                    <FaqList faqs={faqs} />
                </Container>
            </section>

            {/* 이웃 지역 · 다른 서비스 */}
            <section className="py-16 sm:py-20">
                <Container className="grid gap-10 lg:grid-cols-2">
                    <div>
                        <p className="text-[15px] font-bold text-ink">{r.name}와 맞닿은 지역</p>
                        <ul className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
                            {c.neighbors.map(({ region: n, km }) => (
                                <li key={n.slug}>
                                    <Link href={`/${service.slug}/${n.sido}/${n.slug}`} className="block rounded-2xl bg-white px-4 py-3 ring-1 ring-line hover:ring-ink/25">
                                        <span className="block text-[14.5px] font-semibold text-ink">{n.name} {service.short}</span>
                                        <span className="text-[12.5px] text-ink-3">중심 간 약 {km.toFixed(1)}km</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <p className="text-[15px] font-bold text-ink">{r.name}의 다른 반려동물 서비스</p>
                        <ul className="mt-4 grid gap-2">
                            {otherServices.map((s) => (
                                <li key={s.slug}>
                                    <Link href={`/${s.slug}/${r.sido}/${r.slug}`} className="flex items-center justify-between rounded-2xl bg-white px-4 py-3.5 text-[14.5px] font-semibold text-ink ring-1 ring-line hover:ring-ink/25">
                                        {r.name} {s.keyword} <ArrowRight className="h-4 w-4 text-ink-3" aria-hidden />
                                    </Link>
                                </li>
                            ))}
                            <li>
                                <Link href={`/area/${r.sido}/${r.slug}`} className="flex items-center justify-between rounded-2xl bg-white px-4 py-3.5 text-[14.5px] font-semibold text-ink ring-1 ring-line hover:ring-ink/25">
                                    {r.name} 반려동물 서비스 전체 <ArrowRight className="h-4 w-4 text-ink-3" aria-hidden />
                                </Link>
                            </li>
                        </ul>
                    </div>
                </Container>
            </section>

            <GuideCards guides={guidesBySlugs(service.guideSlugs).slice(0, 3)} title={isFuneral ? "장례 전에 알아두면 좋은 것" : "미용 전에 알아두면 좋은 것"} />

            <ConsultSection
                service={service}
                region={r}
                title={isFuneral ? `${r.name}에서 지금 장례가 필요하신가요?` : `${r.name} 우리 동네 미용실, 대신 찾아드릴게요`}
            />
        </>
    );
}
