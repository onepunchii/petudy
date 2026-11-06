import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SITE } from "@/lib/site/config";
import { FACILITY_AREAS, FACILITY_CHECKED_AT } from "@/lib/site/facilities";
import { GUIDES } from "@/lib/site/guides";
import { REGIONS, getRegion } from "@/lib/site/regions";
import { SERVICES, TONE, liveServices } from "@/lib/site/services";
import { faqLd, organizationLd, websiteLd } from "@/lib/site/schema";
import { NeighborhoodMap } from "@/components/site/NeighborhoodMap";
import { RegionPicker } from "@/components/site/RegionPicker";
import { ConsultSection, GuideCards, RegionLinkGrid } from "@/components/site/sections";
import { CallButton, Chip, Container, FaqList, JsonLd, SectionTitle, ServiceIcon } from "@/components/site/ui";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
    title: { absolute: `${SITE.fullName} | 반려동물 장례·애견미용, 우리 동네 가까운 곳 연결` },
    description: SITE.description,
    alternates: { canonical: "/" },
    openGraph: { title: `${SITE.fullName} | 우리 동네 가까운 반려동물 서비스`, description: SITE.description, url: "/" },
};

const HOME_FAQS = [
    { q: "포온은 장례식장·미용실을 직접 운영하나요?", a: "아니요. 포온은 반려동물 서비스 에이전시입니다. 보호자님 동네와 상황을 확인해 동물보호법에 따라 허가·등록된 업체 중 가장 적합한 곳을 연결하고, 서비스는 해당 업체가 직접 제공합니다." },
    { q: "상담이나 연결에 비용이 드나요?", a: "상담과 연결은 무료입니다. 서비스 비용은 연결된 업체에 직접 결제하며, 연결 전에 예상 총액을 먼저 안내합니다." },
    { q: "어느 지역까지 가능한가요?", a: `서울 25개 구 전체와 경기 ${REGIONS.filter((r) => r.sido === "gyeonggi").length}개 주요 도시에서 상담할 수 있습니다. 그 밖의 지역도 전화로 문의 주시면 가능한 방법을 찾아드립니다.` },
    { q: "업체는 어떤 기준으로 고르나요?", a: "허가·등록 여부를 먼저 확인하고, 보호자님 출발 위치에서의 이동 시간, 당일 진행 가능 여부, 가격 투명성, 참관·1:1 진행 같은 서비스 원칙을 기준으로 추천합니다." },
];

export default function HomePage() {
    const live = liveServices();
    const soon = SERVICES.filter((s) => s.status === "soon");
    const pickerRegions = REGIONS.map(({ sido, slug, name, lat, lng }) => ({ sido, slug, name, lat, lng }));
    const metroCount = FACILITY_AREAS.reduce((s, f) => s + f.count, 0);
    const heroRegion = getRegion("seoul", "gwangjin")!;

    return (
        <>
            <JsonLd data={[organizationLd(), websiteLd(), faqLd(HOME_FAQS)]} />

            {/* ───────── Hero ───────── */}
            <section className="relative overflow-hidden">
                <NeighborhoodMap region={heroRegion} className="pointer-events-none absolute -right-40 top-10 hidden w-[760px] opacity-[0.35] lg:block" label="" />
                <Container className="relative grid gap-10 pb-16 pt-12 sm:pt-16 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:pb-24 lg:pt-20">
                    <div>
                        <Chip className="border-pine/20 bg-pine-soft/60 font-semibold text-pine">서울·경기 반려동물 서비스 에이전시</Chip>
                        <h1 className="mt-6 text-[36px] font-extrabold leading-[1.18] text-ink sm:text-[52px] lg:text-[58px]">
                            우리 동네에서
                            <br />
                            가장 가까운 곳으로
                            <br />
                            <span className="text-pine">연결해 드릴게요</span>
                        </h1>
                        <p className="mt-6 max-w-xl text-[16px] leading-[1.8] text-ink-2 sm:text-[17px]">
                            장례가 급한 새벽에도, 미용실을 찾는 평일 오후에도. 포온이 보호자님이 계신 동네에서 이동이 편한 <strong className="text-ink">허가·등록 업체</strong>를 확인하고, 예상 비용까지 먼저 안내합니다.
                        </p>
                        <div className="mt-8 flex flex-wrap gap-3">
                            <CallButton label="24시간 상담" />
                            <Link href="#consult" className="inline-flex h-12 items-center rounded-full border border-ink/15 bg-white px-5 text-[15px] font-semibold text-ink hover:border-ink/40">
                                상담 남기기
                            </Link>
                        </div>
                        <ul className="mt-10 grid max-w-xl grid-cols-3 gap-4 border-t border-line pt-6">
                            <li>
                                <p className="text-[22px] font-extrabold tabular-nums text-ink sm:text-[26px]">{REGIONS.length}<span className="text-[15px]">개 지역</span></p>
                                <p className="mt-1 text-[12.5px] leading-snug text-ink-3">서울 25개 구 + 경기 주요 시</p>
                            </li>
                            <li>
                                <p className="text-[22px] font-extrabold tabular-nums text-ink sm:text-[26px]">24<span className="text-[15px]">시간</span></p>
                                <p className="mt-1 text-[12.5px] leading-snug text-ink-3">장례 상담 연중무휴</p>
                            </li>
                            <li>
                                <p className="text-[22px] font-extrabold tabular-nums text-ink sm:text-[26px]">{metroCount}<span className="text-[15px]">곳</span></p>
                                <p className="mt-1 text-[12.5px] leading-snug text-ink-3">수도권 허가 장묘업체 확인 ({FACILITY_CHECKED_AT.slice(0, 7).replace("-", ".")})</p>
                            </li>
                        </ul>
                    </div>
                    <RegionPicker regions={pickerRegions} services={live.map((s) => ({ slug: s.slug, short: s.name }))} />
                </Container>
            </section>

            {/* ───────── Services ───────── */}
            <section className="py-16 sm:py-20">
                <Container>
                    <SectionTitle eyebrow="연결하는 서비스" title="필요한 순간, 필요한 곳으로" lead="포온이 직접 확인한 원칙(허가·등록, 가격 공개, 보호자 참관)을 지키는 업체만 연결합니다." />
                    <div className="mt-10 grid gap-4 lg:grid-cols-2">
                        {live.map((s) => {
                            const t = TONE[s.tone];
                            return (
                                <Link key={s.slug} href={`/${s.slug}`} className={cn("group relative flex min-h-[300px] flex-col overflow-hidden rounded-[28px] p-7 text-white sm:p-9", t.bg)}>
                                    <ServiceIcon icon={s.icon} className="h-8 w-8 opacity-90" />
                                    <p className="mt-6 text-[13px] font-semibold text-white/70">{s.available24h ? "24시간 상담" : "예약 연결"}</p>
                                    <h3 className="mt-1 text-[28px] font-bold leading-tight sm:text-[32px]">{s.name}</h3>
                                    <p className="mt-3 max-w-md text-[15px] leading-relaxed text-white/80">{s.tagline}</p>
                                    <span className="mt-auto inline-flex items-center gap-2 pt-8 text-[15px] font-semibold">
                                        지역별 {s.short} 안내 보기 <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
                                    </span>
                                    <svg viewBox="0 0 200 200" className="absolute -bottom-16 -right-16 h-64 w-64 opacity-[0.12]" aria-hidden>
                                        <circle cx="100" cy="100" r="98" fill="none" stroke="white" strokeWidth="2" />
                                        <circle cx="100" cy="100" r="64" fill="none" stroke="white" strokeWidth="2" />
                                        <circle cx="100" cy="100" r="30" fill="none" stroke="white" strokeWidth="2" />
                                    </svg>
                                </Link>
                            );
                        })}
                    </div>
                    <ul className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
                        {soon.map((s) => (
                            <li key={s.slug}>
                                <Link href={`/${s.slug}`} className="flex h-full flex-col rounded-3xl bg-white p-5 ring-1 ring-line hover:ring-ink/20">
                                    <div className="flex items-center justify-between">
                                        <ServiceIcon icon={s.icon} className="h-6 w-6 text-pine" />
                                        <span className="rounded-full bg-paper-2 px-2 py-0.5 text-[11.5px] font-semibold text-ink-3">오픈 준비중</span>
                                    </div>
                                    <p className="mt-4 text-[16px] font-bold text-ink">{s.name}</p>
                                    <p className="mt-1 text-[13px] leading-snug text-ink-3">{s.tagline}</p>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </Container>
            </section>

            {/* ───────── How it works ───────── */}
            <section className="bg-white py-16 sm:py-24">
                <Container className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
                    <SectionTitle
                        eyebrow="포온이 일하는 방식"
                        title={<>검색 대신,<br />동네를 아는 사람에게 물어보듯</>}
                        lead="급할수록 '가장 가까운 곳'이 '가장 좋은 곳'은 아닐 수 있습니다. 지금 시간에 실제로 이동이 편한지, 당일 가능한지, 비용이 투명한지를 함께 봅니다."
                    />
                    <ol className="grid gap-4">
                        {[
                            { t: "동네와 상황을 알려주세요", d: "계신 동네(동 단위), 아이 정보, 원하는 시간만 알려주시면 됩니다." },
                            { t: "가까운 정식 업체를 비교합니다", d: "허가·등록 여부를 먼저 확인하고, 이동 시간·당일 가능 여부·가격을 비교합니다." },
                            { t: "총액을 먼저 안내하고 연결합니다", d: "선택하신 업체와 시간·픽업을 확정하고, 현장 추가 비용이 없도록 견적을 먼저 공유합니다." },
                        ].map((s, i) => (
                            <li key={s.t} className="flex gap-5 rounded-3xl bg-paper p-6">
                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink text-[15px] font-bold text-white">{i + 1}</span>
                                <div>
                                    <p className="text-[17px] font-bold text-ink">{s.t}</p>
                                    <p className="mt-1.5 text-[14.5px] leading-relaxed text-ink-2">{s.d}</p>
                                </div>
                            </li>
                        ))}
                    </ol>
                </Container>
            </section>

            {/* ───────── Regions ───────── */}
            <section className="py-16 sm:py-24">
                <Container>
                    <SectionTitle
                        eyebrow="우리 동네에서 찾기"
                        title="서울 25개 구, 경기 주요 도시의 생활권까지"
                        lead="같은 구 안에서도 생활권에 따라 편한 길이 다릅니다. 동네를 선택하면 그 지역 기준으로 안내합니다."
                    />
                    <div className="mt-10">
                        <RegionLinkGrid hrefFor={(r) => `/area/${r.sido}/${r.slug}`} />
                    </div>
                </Container>
            </section>

            <GuideCards
                guides={[...GUIDES.filter((g) => g.service === "funeral").slice(0, 4), ...GUIDES.filter((g) => g.service === "grooming").slice(0, 2)]}
                title="처음 겪는 일이라면, 먼저 읽어보세요"
            />

            <section className="py-16 sm:py-20">
                <Container className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
                    <SectionTitle eyebrow="자주 묻는 질문" title="포온에 대해 궁금한 점" />
                    <FaqList faqs={HOME_FAQS} />
                </Container>
            </section>

            <ConsultSection />
        </>
    );
}
