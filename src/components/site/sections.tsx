import Link from "next/link";
import { ArrowUpRight, Check, ShieldCheck } from "lucide-react";
import { SITE } from "@/lib/site/config";
import { GUIDES, type Guide } from "@/lib/site/guides";
import { REGIONS, SIDO, type Region } from "@/lib/site/regions";
import { liveServices, type Service } from "@/lib/site/services";
import { cn } from "@/lib/utils";
import { LeadForm } from "./LeadForm";
import { CallButton, Container, SectionTitle } from "./ui";

export function ProcessSection({ service, regionName }: { service: Service; regionName?: string }) {
    return (
        <section className="py-16 sm:py-20">
            <Container>
                <SectionTitle
                    eyebrow="진행 순서"
                    title={regionName ? `${regionName}에서 ${service.short}까지, 이렇게 진행돼요` : `${service.name}, 이렇게 진행돼요`}
                />
                <ol className="mt-10 grid gap-px overflow-hidden rounded-3xl bg-line ring-1 ring-line sm:grid-cols-2 lg:grid-cols-3">
                    {service.process.map((p, i) => (
                        <li key={p.title} className="bg-white p-6 sm:p-7">
                            <span className="text-[13px] font-bold tabular-nums text-ink-3">{String(i + 1).padStart(2, "0")}</span>
                            <p className="mt-2 text-[17px] font-bold text-ink">{p.title}</p>
                            <p className="mt-2 text-[14.5px] leading-relaxed text-ink-2">{p.desc}</p>
                        </li>
                    ))}
                </ol>
            </Container>
        </section>
    );
}

export function PriceSection({ service, regionName }: { service: Service; regionName?: string }) {
    return (
        <section className="py-16 sm:py-20">
            <Container className="grid gap-10 lg:grid-cols-[1fr_1.3fr]">
                <div>
                    <SectionTitle
                        eyebrow="예상 비용"
                        title={regionName ? `${regionName} 보호자님이 많이 묻는 ${service.short} 비용` : `${service.short} 비용, 미리 알아두세요`}
                        lead={service.priceNote}
                    />
                    <div className="mt-8 rounded-3xl bg-white p-6 ring-1 ring-line">
                        <p className="text-[15px] font-bold text-ink">{service.checklist.title}</p>
                        <ul className="mt-4 space-y-3">
                            {service.checklist.items.map((it) => (
                                <li key={it} className="flex gap-3 text-[14.5px] leading-relaxed text-ink-2">
                                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-pine" aria-hidden />
                                    {it}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="overflow-hidden rounded-3xl bg-white ring-1 ring-line">
                    <table className="w-full text-left">
                        <caption className="sr-only">{service.name} 예상 비용표</caption>
                        <thead className="bg-paper-2/70 text-[13px] text-ink-3">
                            <tr>
                                <th scope="col" className="px-5 py-3 font-semibold">항목</th>
                                <th scope="col" className="px-5 py-3 text-right font-semibold">일반적인 범위</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-line">
                            {service.prices.map((p) => (
                                <tr key={p.label}>
                                    <th scope="row" className="px-5 py-4 align-top">
                                        <span className="block text-[15px] font-semibold text-ink">{p.label}</span>
                                        {p.note && <span className="mt-1 block text-[13px] font-normal text-ink-3">{p.note}</span>}
                                    </th>
                                    <td className="px-5 py-4 text-right align-top text-[15px] font-bold tabular-nums text-ink">{p.range}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Container>
        </section>
    );
}

export function LicenseNote({ service }: { service: Service }) {
    return (
        <div className="flex gap-4 rounded-3xl bg-pine-soft/70 p-6">
            <ShieldCheck className="h-6 w-6 shrink-0 text-pine" aria-hidden />
            <div>
                <p className="text-[15px] font-bold text-ink">
                    {service.license.kind} {service.license.type} 업체만 연결합니다
                </p>
                <p className="mt-1.5 text-[14px] leading-relaxed text-ink-2">{service.license.desc}</p>
            </div>
        </div>
    );
}

export function GuideCards({ guides, title = "보호자 가이드", lead }: { guides: Guide[]; title?: string; lead?: string }) {
    if (!guides.length) return null;
    return (
        <section className="py-16 sm:py-20">
            <Container>
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <SectionTitle eyebrow="알아두면 좋은 것" title={title} lead={lead} />
                    <Link href="/guide" className="inline-flex items-center gap-1 text-[14px] font-semibold text-ink-2 hover:text-ink">
                        전체 가이드 <ArrowUpRight className="h-4 w-4" aria-hidden />
                    </Link>
                </div>
                <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {guides.map((g) => (
                        <li key={g.slug}>
                            <Link href={`/guide/${g.slug}`} className="group flex h-full flex-col rounded-3xl bg-white p-6 ring-1 ring-line transition hover:-translate-y-0.5 hover:ring-ink/20">
                                <p className="text-[16.5px] font-bold leading-snug text-ink group-hover:text-pine">{g.title}</p>
                                <p className="mt-3 line-clamp-3 text-[14px] leading-relaxed text-ink-2">{g.description}</p>
                                <span className="mt-auto pt-5 text-[13px] font-semibold text-ink-3">읽어보기 →</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </Container>
        </section>
    );
}

export const guidesBySlugs = (slugs: string[]) => slugs.map((s) => GUIDES.find((g) => g.slug === s)).filter((g): g is Guide => Boolean(g));

/** 전체 지역 링크 그리드 — 서비스 허브·지역 인덱스에서 사용 (내부 링크 구조의 핵심) */
export function RegionLinkGrid({ hrefFor, labelFor, current }: { hrefFor: (r: Region) => string; labelFor?: (r: Region) => string; current?: string }) {
    return (
        <div className="grid gap-10">
            {(["seoul", "gyeonggi"] as const).map((sido) => (
                <div key={sido}>
                    <p className="text-[14px] font-bold text-ink">
                        {SIDO[sido].name} <span className="font-normal text-ink-3">{REGIONS.filter((r) => r.sido === sido).length}곳</span>
                    </p>
                    <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-5">
                        {REGIONS.filter((r) => r.sido === sido).map((r) => (
                            <li key={r.slug}>
                                <Link
                                    href={hrefFor(r)}
                                    className={cn(
                                        "block rounded-2xl bg-white px-4 py-3 text-[14.5px] font-semibold text-ink ring-1 ring-line transition hover:ring-ink/25",
                                        current === r.slug && "bg-ink text-white ring-ink",
                                    )}
                                >
                                    {labelFor ? labelFor(r) : r.name}
                                    <span className={cn("mt-0.5 block truncate text-[12px] font-normal", current === r.slug ? "text-white/70" : "text-ink-3")}>
                                        {r.areas.map((a) => a.name.replace(/ 생활권| 권역/, "")).slice(0, 3).join(" · ")}
                                    </span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
}

export function ConsultSection({
    service,
    region,
    title,
    lead,
}: {
    service?: Service;
    region?: Region;
    title?: string;
    lead?: string;
}) {
    const live = liveServices();
    return (
        <section id="consult" className="scroll-mt-20 py-16 sm:py-20">
            <Container>
                <div className="grid gap-8 overflow-hidden rounded-[32px] bg-ink p-6 text-white sm:p-10 lg:grid-cols-[1fr_1.15fr] lg:p-12">
                    <div>
                        <p className="text-[13px] font-semibold text-white/60">{SITE.hours}</p>
                        <h2 className="mt-3 whitespace-pre-line text-[26px] font-bold leading-[1.3] sm:text-[32px]">
                            {title ?? "지금 전화가 어렵다면\n상담 접수만 남겨주세요"}
                        </h2>
                        <p className="mt-4 text-[15px] leading-relaxed text-white/75">
                            {lead ??
                                `${region ? `${region.name} ` : ""}계신 동네와 상황을 알려주시면 가까운 ${service ? service.short : "서비스"} 업체와 예상 비용을 먼저 확인해 연락드립니다.`}
                        </p>
                        <CallButton tone="light" className="mt-8" />
                        <ul className="mt-8 space-y-2 text-[14px] text-white/70">
                            <li>· 상담·연결 비용 없음</li>
                            <li>· 허가·등록 업체만 연결</li>
                            <li>· 연결 전 총액 견적 먼저 안내</li>
                        </ul>
                    </div>
                    <LeadForm
                        service={service?.slug ?? live[0].slug}
                        services={service ? undefined : live.map((s) => ({ slug: s.slug, short: s.name }))}
                        regionSido={region?.sido}
                        regionSlug={region?.slug}
                        regionName={region?.name}
                    />
                </div>
            </Container>
        </section>
    );
}
