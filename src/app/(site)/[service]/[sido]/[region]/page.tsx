import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Route, TrainFront, Trees } from "lucide-react";
import { REGIONS, SIDO, dongLabel, getRegion } from "@/lib/site/regions";
import { getService, liveServices } from "@/lib/site/services";
import { FUNERAL_HOMES, FUNERAL_HOMES_CHECKED_AT, funeralHomesPath, nearestFuneralHomes } from "@/lib/site/funeral-homes";
import { listTopics } from "@/components/site/funeral-homes/listing/copy";
import { buildLocal, isIndexable, type LocalContent } from "@/lib/site/local";
import { funeralOgAlt, funeralRegionCard } from "@/lib/site/og-cards-funeral";
import { breadcrumbLd, faqLd, serviceLd } from "@/lib/site/schema";
import { metaWithImage } from "@/lib/site/seo";
import { FacilityTable } from "@/components/site/FacilityTable";
import { FuneralHomeList } from "@/components/site/funeral-homes/FuneralHomeList";
import { MAP_NOTE, NeighborhoodMap } from "@/components/site/NeighborhoodMap";
import { PassCard } from "@/components/site/PassCard";
import { Reveal } from "@/components/site/Reveal";
import { ServiceHero } from "@/components/site/ServiceHero";
import { ConsultSection, GuideCards, LicenseNote, PriceSection, ProcessSection, ScenarioSection, guidesBySlugs } from "@/components/site/sections";
import { Chip, Container, FaqList, ICON_STROKE, JsonLd, SectionTitle } from "@/components/site/ui";
import { cn } from "@/lib/utils";

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
    // 장례: 정사각형 대표 이미지(/og/funeral/{sido}/{region}/square.png). 제목·설명·canonical·noindex 기준은 그대로
    if (service.slug === "funeral") {
        const meta = metaWithImage({
            title: c.title,
            description: c.description,
            keywords: c.keywords,
            path,
            imageAlt: funeralOgAlt(funeralRegionCard(region)),
            noindex: !isIndexable(service, region),
        });
        return { ...meta, openGraph: { ...meta.openGraph, title: `${c.title} | 포온` } };
    }
    return {
        title: c.title,
        description: c.description,
        keywords: c.keywords,
        alternates: { canonical: path },
        robots: isIndexable(service, region) ? undefined : { index: false, follow: true },
        openGraph: { title: `${c.title} | 포온`, description: c.description, url: path },
    };
}

/** 화면 문구 안전장치: 긴 줄표가 섞여 들어와도 쉼표로 바꿔 보여줍니다 */
const noDash = (s: string) => s.replace(/\s*[—–]\s*/g, ", ");

/** 생활권 수별 데스크톱 칸 수 (Tailwind 가 읽을 수 있도록 문자열 그대로) */
const AREA_COLS: Record<number, string> = { 1: "lg:grid-cols-2", 2: "lg:grid-cols-2", 3: "lg:grid-cols-3", 4: "lg:grid-cols-4", 5: "lg:grid-cols-5" };

/** 제휴 업체 탑승권: 본문은 업체, 떼어내는 쪽은 출발지(구·시청) 기준 거리와 시간 */
function PartnerPasses({ partners, from }: { partners: LocalContent["partners"]; from: string }) {
    if (!partners.length) return null;
    return (
        <ul className="grid gap-4">
            {partners.map(({ partner, km, minutes }) => (
                <PassCard
                    key={partner.id}
                    as="li"
                    radius="tile"
                    stub={
                        <div>
                            <p className="text-[12.5px] text-ink-3">{from} 기준</p>
                            <p className="mt-1 text-[22px] font-bold tabular-nums text-ink">약 {km.toFixed(1)}km</p>
                            <p className="mt-0.5 text-[13.5px] tabular-nums text-ink-2">
                                차량 약 {minutes[0]}~{minutes[1]}분
                            </p>
                        </div>
                    }
                >
                    <p className="text-[17px] font-bold text-ink">{partner.name}</p>
                    <p className="mt-1 text-[14px] text-ink-3">{partner.address}</p>
                    {partner.registration && (
                        <p className="mt-3 text-[13.5px] text-ink-2">
                            {partner.registration.kind} {partner.registration.number}
                        </p>
                    )}
                </PassCard>
            ))}
        </ul>
    );
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
    const office = `${r.name}청`;

    /* ───────── 섹션 조각 (서비스마다 순서가 다름) ───────── */

    const scenarios = (
        <ScenarioSection service={service} scenarios={c.scenarios} title={`${r.name} 보호자님 상황에 맞춰 안내합니다`} featured={1} />
    );

    const price = <PriceSection service={service} regionName={r.name} />;

    // 장례: 허가 장묘업체 소재 지역 표 / 미용: 생활권 안 미용실
    const nearby = (
        <Reveal as="section" className="py-16 sm:py-20">
            <Container className="grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-14">
                <div>
                    <SectionTitle
                        title={isFuneral ? `${r.name}에서는 어느 방향이 가까울까요` : `${r.name} 생활권 안에서 찾습니다`}
                        lead={
                            isFuneral
                                ? `${office}을 기준으로 허가 동물장묘업체가 있는 지역까지의 거리를 계산했습니다. 실제로는 출발하는 동네와 시간대에 따라 순서가 바뀔 수 있어, 상담할 때 지금 기준으로 다시 확인합니다.`
                                : `미용은 자주 다니는 곳이라 걸어서 또는 차로 10~15분 안의 미용실을 먼저 추천합니다. ${r.areas.map((a) => a.name).join(", ")} 기준으로 안내합니다.`
                        }
                    />
                    <LicenseNote service={service} className="mt-10 border-t border-line pt-8" />
                </div>
                <div className="grid content-start gap-6">
                    <PartnerPasses partners={c.partners} from={office} />
                    {isFuneral ? (
                        // 전국 목록 링크는 바로 아래 "가까운 장례식장" 섹션에 있어 표에서는 뺍니다
                        <FacilityTable rows={c.facilities} regionName={r.name} directory={false} />
                    ) : (
                        c.partners.length === 0 && (
                            <PassCard radius="tile" mainClassName="p-7 sm:p-9">
                                <p className="text-[18px] font-bold text-ink">{r.name} 제휴 미용실을 확인하고 있어요</p>
                                <p className="mt-2.5 max-w-[52ch] text-[15px] leading-relaxed text-ink-2">
                                    지금 상담을 남겨 주시면 {r.areas[0].name}부터 {r.areas[r.areas.length - 1].name}까지, 계신 생활권 기준으로 예약 가능한 등록
                                    미용실을 직접 찾아 연락드립니다.
                                </p>
                                <a
                                    href="#consult"
                                    className="mt-5 inline-flex items-center gap-1 text-[15px] font-semibold text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink"
                                >
                                    상담 남기기
                                    <ArrowRight className="h-4 w-4" strokeWidth={ICON_STROKE} aria-hidden />
                                </a>
                            </PassCard>
                        )
                    )}
                </div>
            </Container>
        </Reveal>
    );

    // 장례: 지역 중심에서 가까운 실제 허가 업체 4곳 (장례식장 목록 데이터). 위 표는 지역 단위, 여기는 업체 단위입니다
    const nearestHomes = isFuneral ? nearestFuneralHomes(r, 4) : [];
    // 같은 구·시 안의 업체인데 좌표가 시·군청 기준 대략값이면 거리가 0에 가깝게 나와 숫자를 적지 않습니다
    const sameAreaApprox = (h: (typeof nearestHomes)[number]["home"]) => h.geo === "approx" && h.sido === r.sido && h.sigungu === r.name;
    const homeKm = new Map(nearestHomes.filter((n) => !sameAreaApprox(n.home)).map((n) => [n.home.id, n.km]));
    const nearestHomesSection = nearestHomes.length > 0 && (
        <Reveal as="section" className="py-16 sm:py-20">
            <Container className="grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-14">
                <div>
                    <SectionTitle
                        title={`${r.name}에서 가까운 반려동물 장례식장`}
                        lead={`동물보호관리시스템 허가 목록에 있는 업체 중 ${office}에서 직선거리로 가까운 ${nearestHomes.length}곳입니다. 업체를 누르면 ${listTopics(nearestHomes.map((n) => n.home))} 정보를 볼 수 있어요.`}
                    />
                    <p className="mt-6 max-w-[56ch] text-[14px] leading-relaxed text-ink-3">
                        순서는 거리만 기준으로 했습니다. 공식 허가 목록과 각 업체 홈페이지를 정리한 것이며, 포온 제휴 업체 목록이 아닙니다.
                    </p>
                    <Link
                        href={funeralHomesPath()}
                        className="group mt-6 inline-flex items-center gap-1.5 rounded-sm text-[15px] font-semibold text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
                    >
                        <span className="underline decoration-ink/30 underline-offset-4 group-hover:decoration-ink">전국 허가 장례식장 목록</span>
                        <span className="font-normal tabular-nums text-ink-3">{FUNERAL_HOMES.length}곳</span>
                        <ArrowRight
                            className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
                            strokeWidth={ICON_STROKE}
                            aria-hidden
                        />
                    </Link>
                </div>
                <div>
                    <FuneralHomeList homes={nearestHomes.map((n) => n.home)} distances={homeKm} />
                    <p className="mt-3 text-[12.5px] leading-relaxed text-ink-3">
                        거리는 {office} 기준 직선거리(약)입니다. 업체 좌표 대부분이 시·군청 기준 대략값이라 실제 이동 거리와 다릅니다.
                        {homeKm.size < nearestHomes.length && ` ${r.name} 안의 업체 중 좌표가 대략값인 곳은 거리를 적지 않았습니다.`}
                        <span className="whitespace-nowrap">
                            {" "}
                            확인일 <time dateTime={FUNERAL_HOMES_CHECKED_AT}>{FUNERAL_HOMES_CHECKED_AT.replaceAll("-", ".")}</time>
                        </span>
                    </p>
                </div>
            </Container>
        </Reveal>
    );

    // 생활권·지도: 위에서 아래로 쌓는 구성. 별자리 지도는 모바일만 여기서(세로형), 데스크톱은 히어로 오른쪽에서 보여줍니다
    const neighborhood = (
        <Reveal as="section" className="py-16 sm:py-20">
            <Container>
                <SectionTitle title={c.proximityTitle} lead={noDash(c.proximityLead)} />
                <figure className="mt-10 lg:hidden">
                    <NeighborhoodMap region={r} layout="portrait" className="mx-auto h-auto w-full max-w-[440px]" />
                    <figcaption className="mx-auto mt-3 max-w-[440px] text-[13px] leading-relaxed text-ink-3">{MAP_NOTE}</figcaption>
                </figure>
                <ul className={cn("mt-10 grid gap-x-8 gap-y-8 sm:grid-cols-2", AREA_COLS[Math.min(r.areas.length, 5)])}>
                    {r.areas.map((a) => (
                        <li key={a.name}>
                            <h3 className="text-[16px] font-bold text-ink">{a.name}</h3>
                            <ul className="mt-3 flex flex-wrap gap-2">
                                {a.dongs.map((dd) => (
                                    <li key={dd}>
                                        <Chip className="text-[13.5px]">{dongLabel(dd)}</Chip>
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>
                <div className="mt-14 grid gap-10 border-t border-line pt-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-14">
                    <p className="max-w-[62ch] text-[15.5px] leading-[1.85] text-ink-2">{noDash(c.localStory)}</p>
                    <dl className="grid content-start gap-4 text-[15px]">
                        {[
                            { icon: TrainFront, label: "주요 역", value: r.stations.join(", ") },
                            { icon: Route, label: "주요 도로", value: r.roads.join(", ") },
                            { icon: Trees, label: "산책 장소", value: r.landmarks.join(", ") },
                        ].map(({ icon: Icon, label, value }) => (
                            <div key={label} className="flex gap-4">
                                <dt className="flex w-24 shrink-0 items-start gap-2 font-semibold text-ink">
                                    <Icon className="mt-[3px] h-4 w-4 text-ink-3" strokeWidth={ICON_STROKE} aria-hidden />
                                    {label}
                                </dt>
                                <dd className="leading-relaxed text-ink-2">{value}</dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </Container>
        </Reveal>
    );

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
                        {c.h1[1]}
                    </>
                }
                subtitle={noDash(c.subtitle)}
                lead={noDash(c.lead)}
                chips={[`${r.name} 전 지역`, ...(isFuneral ? ["24시간 상담", "허가 업체만", "개별 화장·참관", "픽업 상담"] : ["등록 업체만", "1:1 미용 우선", "예약까지 연결"])]}
                image={null}
                secondary={{ href: "#consult", label: "상담 남기기" }}
                // 별자리 지도는 데스크톱에서만 히어로에(모바일은 생활권 섹션에 세로형). 칸째 숨겨 모바일 빈 여백을 없앱니다
                asideClassName="hidden lg:block"
                aside={
                    <figure>
                        <NeighborhoodMap region={r} className="h-auto w-full" />
                        <figcaption className="mt-3 px-1 text-[13px] leading-relaxed text-star-3">{MAP_NOTE}</figcaption>
                    </figure>
                }
            />

            {/* 장례: 비용 → 허가 업체 표 → 가까운 장례식장 → 상황 → 생활권 / 미용: 상황 → 가격 → 가까운 미용실 → 생활권 */}
            {isFuneral ? (
                <>
                    {price}
                    {nearby}
                    {nearestHomesSection}
                    {scenarios}
                </>
            ) : (
                <>
                    {scenarios}
                    {price}
                    {nearby}
                </>
            )}
            {neighborhood}

            <ProcessSection service={service} regionName={r.name} />

            <Reveal as="section" className="py-16 sm:py-20">
                <Container className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-14">
                    <SectionTitle title={`${r.name} ${service.short} 자주 묻는 질문`} />
                    <FaqList faqs={faqs} />
                </Container>
            </Reveal>

            {/* 이웃 지역 · 다른 서비스 */}
            <Reveal as="section" className="py-16 sm:py-20">
                <Container className="grid gap-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-14">
                    <div>
                        <h2 className="text-[20px] font-bold text-ink">{r.name}와 맞닿은 지역</h2>
                        <ul className="mt-5 grid grid-cols-2 gap-x-5 sm:grid-cols-3">
                            {c.neighbors.map(({ region: n, km }) => (
                                <li key={n.slug}>
                                    <Link
                                        href={`/${service.slug}/${n.sido}/${n.slug}`}
                                        className="block border-t border-line py-3.5 transition-colors hover:border-ink/50 motion-reduce:transition-none"
                                    >
                                        <span className="block text-[15px] font-semibold text-ink">
                                            {n.name} {service.short}
                                        </span>
                                        <span className="text-[12.5px] tabular-nums text-ink-3">중심 간 약 {km.toFixed(1)}km</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h2 className="text-[20px] font-bold text-ink">{r.name}의 다른 반려동물 서비스</h2>
                        <ul className="mt-5">
                            {[
                                ...otherServices.map((s) => ({ href: `/${s.slug}/${r.sido}/${r.slug}`, label: `${r.name} ${s.keyword}` })),
                                { href: `/area/${r.sido}/${r.slug}`, label: `${r.name} 반려동물 서비스 전체` },
                            ].map((l) => (
                                <li key={l.href}>
                                    <Link
                                        href={l.href}
                                        className="group flex items-center justify-between border-t border-line py-4 text-[15px] font-semibold text-ink transition-colors hover:border-ink/50 motion-reduce:transition-none"
                                    >
                                        {l.label}
                                        <ArrowRight
                                            className="h-4 w-4 text-ink-3 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
                                            strokeWidth={ICON_STROKE}
                                            aria-hidden
                                        />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </Container>
            </Reveal>

            <GuideCards guides={guidesBySlugs(service.guideSlugs).slice(0, 3)} title={isFuneral ? "장례 전에 알아두면 좋은 것" : "미용 전에 알아두면 좋은 것"} />

            <ConsultSection
                service={service}
                region={r}
                title={isFuneral ? `${r.name}에서 지금 장례가 필요하신가요?` : `${r.name} 우리 동네 미용실, 대신 찾아드릴게요`}
            />
        </>
    );
}
