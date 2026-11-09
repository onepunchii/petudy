import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, ShieldCheck } from "lucide-react";
import { SITE } from "@/lib/site/config";
import { GUIDES, type Guide } from "@/lib/site/guides";
import { REGIONS, SIDO, type Region } from "@/lib/site/regions";
import { LEAD_SERVICE_UNSURE } from "@/lib/site/lead-options";
import { liveServicesEverydayFirst, type Service, type ServiceSlug } from "@/lib/site/services";
import { cn } from "@/lib/utils";
import { LeadForm } from "./LeadForm";
import { PassCard } from "./PassCard";
import { Reveal } from "./Reveal";
import { CallButton, Container, ICON_STROKE, PillLink, SectionTitle } from "./ui";

/*
 * 서비스·지역 페이지가 함께 쓰는 본문 섹션들 (모두 히어로 아래 밝은 면 위).
 * - 섹션 위 작은 라벨(eyebrow)은 쓰지 않습니다. 제목만으로 충분합니다.
 * - 섹션마다 다른 모양을 씁니다: 비용 = 탑승권 + 확인 목록, 진행 = 노선(정거장), 상황 = 큰 탑승권 1 + 목록,
 *   가이드 = 표지 1 + 목록, 지역 = 출발 안내판, 상담 = 문구 + 폼.
 */

/** 3D 서비스 아이콘 (흰 바탕). 장례에는 쓰지 않습니다 */
const SERVICE_ICON: Partial<Record<ServiceSlug, string>> = {
    grooming: "/brand/icons/grooming.webp",
    hotel: "/brand/icons/hotel.webp",
    petsitter: "/brand/icons/petsitter.webp",
    "pet-taxi": "/brand/icons/pet-taxi.webp",
    training: "/brand/icons/training.webp",
};
export const serviceIconSrc = (slug: ServiceSlug) => SERVICE_ICON[slug];

/** 허가·등록 업체만 연결한다는 안내. 카드 없이 아이콘 + 문단 */
export function LicenseNote({ service, className }: { service: Service; className?: string }) {
    return (
        <div className={cn("flex gap-3.5", className)}>
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-pine" strokeWidth={ICON_STROKE} aria-hidden />
            <div>
                <p className="text-[15.5px] font-bold text-ink">
                    {service.license.kind} {service.license.type} 업체만 연결합니다
                </p>
                <p className="mt-1.5 max-w-[60ch] text-[14.5px] leading-relaxed text-ink-2">{service.license.desc}</p>
            </div>
        </div>
    );
}

/** 진행 순서: 정거장을 잇는 노선. 모바일은 세로, lg 는 가로(6단계는 3개씩 두 줄) */
export function ProcessSection({ service, regionName }: { service: Service; regionName?: string }) {
    const steps = service.process;
    const n = steps.length;
    const cols = n === 4 ? 4 : 3;
    return (
        <Reveal as="section" className="py-16 sm:py-20">
            <Container>
                <SectionTitle title={regionName ? `${regionName}에서 ${service.short}까지, 이렇게 진행돼요` : `${service.name}, 이렇게 진행돼요`} />
                <ol className={cn("mt-12 grid gap-y-8 lg:gap-x-8 lg:gap-y-12", cols === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3")}>
                    {steps.map((p, i) => {
                        const last = i === n - 1;
                        const rowEnd = i % cols === cols - 1;
                        return (
                            <li key={p.title} className="relative pl-12 lg:pl-0 lg:pt-12">
                                {!last && (
                                    <span
                                        aria-hidden
                                        className={cn(
                                            "absolute -bottom-7 left-[15.5px] top-9 w-px bg-line lg:bottom-auto lg:left-10 lg:right-[-1.5rem] lg:top-[15.5px] lg:h-px lg:w-auto",
                                            rowEnd && "lg:hidden",
                                        )}
                                    />
                                )}
                                <span
                                    aria-hidden
                                    className={cn(
                                        "absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-full text-[13px] font-semibold tabular-nums",
                                        i === 0 ? "bg-ink text-white" : "bg-pass text-ink ring-1 ring-inset ring-line",
                                    )}
                                >
                                    {i + 1}
                                </span>
                                <h3 className="text-[17px] font-bold text-ink">{p.title}</h3>
                                <p className="mt-1.5 max-w-[36ch] text-[14.5px] leading-relaxed text-ink-2">{p.desc}</p>
                            </li>
                        );
                    })}
                </ol>
            </Container>
        </Reveal>
    );
}

/**
 * 예상 비용: 기본 비용표(탑승권 본문) + 선택 항목(떼어내는 쪽) + 오른쪽 확인 목록.
 * 표는 실제 <table>(caption, th scope) 입니다.
 */
export function PriceSection({ service, regionName, showLicense }: { service: Service; regionName?: string; showLicense?: boolean }) {
    const base = service.prices.filter((p) => !p.label.includes("(선택)"));
    const extras = service.prices.filter((p) => p.label.includes("(선택)"));
    // 선택 항목이 하나뿐이면 오른쪽 세로 칸이 비어 보이므로 아래쪽 가로 띠로
    const stubBelow = extras.length <= 1;
    const title = regionName
        ? `${regionName} 보호자님이 많이 묻는 ${service.short} 비용`
        : service.slug === "funeral"
          ? "장례 비용, 체중별로 먼저 확인하세요"
          : `${service.short} 비용, 미리 알아두세요`;

    return (
        <Reveal as="section" className="py-16 sm:py-20">
            <Container>
                <SectionTitle title={title} lead={service.priceNote} />
                <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)] lg:gap-14">
                    <PassCard
                        radius="tile"
                        stubPosition={stubBelow ? "bottom" : "auto"}
                        mainClassName="p-0 sm:p-0"
                        stubClassName={stubBelow ? "px-5 py-5 sm:px-7" : "p-6 sm:w-[15.5rem] sm:justify-start sm:p-7"}
                        stub={
                            extras.length > 0 ? (
                                <div className={cn(stubBelow && "flex flex-wrap items-baseline gap-x-5 gap-y-3")}>
                                    <p className="text-[13.5px] font-semibold text-ink-3">선택 항목</p>
                                    <dl className={cn("grid gap-4", stubBelow ? "flex-1" : "mt-4")}>
                                        {extras.map((p) => (
                                            <div key={p.label} className={cn(stubBelow && "flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5")}>
                                                <dt className="text-[14.5px] font-semibold text-ink">{p.label.replace(/\s*\(선택\)\s*/, "")}</dt>
                                                <dd className={cn("text-[15px] font-bold tabular-nums text-ink", !stubBelow && "mt-0.5")}>{p.range}</dd>
                                                {p.note && <dd className="mt-0.5 w-full text-[12.5px] leading-snug text-ink-3">{p.note}</dd>}
                                            </div>
                                        ))}
                                    </dl>
                                </div>
                            ) : undefined
                        }
                    >
                        <table className="w-full text-left">
                            <caption className="px-5 pb-3 pt-6 text-left sm:px-7 sm:pt-7">
                                <span className="block text-[17px] font-bold text-ink">{service.slug === "funeral" ? "기본 장례 비용" : `${service.short} 기본 비용`}</span>
                                <span className="mt-1 block text-[13.5px] text-ink-3">공개 가격 범위 기준 참고값</span>
                            </caption>
                            <thead className="text-[12.5px] text-ink-3">
                                <tr className="border-b border-line">
                                    <th scope="col" className="py-2.5 pl-5 pr-3 font-semibold sm:pl-7">
                                        항목
                                    </th>
                                    <th scope="col" className="py-2.5 pl-3 pr-5 text-right font-semibold sm:pr-7">
                                        일반적인 범위
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-line/70">
                                {base.map((p) => (
                                    <tr key={p.label}>
                                        <th scope="row" className="py-4 pl-5 pr-3 align-top sm:pl-7">
                                            <span className="block text-[15px] font-semibold text-ink">{p.label}</span>
                                            {p.note && <span className="mt-1 block text-[13px] font-normal leading-snug text-ink-3">{p.note}</span>}
                                        </th>
                                        <td className="whitespace-nowrap py-4 pl-3 pr-5 text-right align-top text-[16px] font-bold tabular-nums text-ink sm:pr-7">
                                            {p.range}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="h-3" aria-hidden />
                    </PassCard>

                    <div className="lg:pt-2">
                        <h3 className="text-[18px] font-bold text-ink">{service.checklist.title}</h3>
                        <ul className="mt-5 grid gap-3.5">
                            {service.checklist.items.map((it) => (
                                <li key={it} className="flex gap-3 text-[15px] leading-relaxed text-ink-2">
                                    <Check className="mt-1 h-4 w-4 shrink-0 text-pine" strokeWidth={ICON_STROKE} aria-hidden />
                                    {it}
                                </li>
                            ))}
                        </ul>
                        {showLicense && <LicenseNote service={service} className="mt-8 border-t border-line pt-8" />}
                    </div>
                </div>
            </Container>
        </Reveal>
    );
}

export type Scenario = { title: string; desc: string };

/** 허브(지역 미선택) 상황 안내. 지역 페이지는 local.ts 의 지역별 문구를 씁니다 */
export const HUB_SCENARIOS: Partial<Record<ServiceSlug, Scenario[]>> = {
    grooming: [
        { title: "첫 미용이에요", desc: "짧은 위생미용부터 천천히 익숙해질 수 있는 미용실을 추천합니다." },
        { title: "예민하거나 노령견이에요", desc: "1:1 미용, 보호자 동반, 짧게 나눠 진행할 수 있는 곳을 찾습니다." },
        { title: "가위컷 스타일을 원해요", desc: "원하는 스타일 사진을 보여 주고 상담할 수 있는 동네 미용실을 안내합니다." },
        { title: "고양이 미용이 필요해요", desc: "고양이 미용 경험이 있는 미용실만 따로 골라 연결합니다." },
    ],
};

/**
 * 상황별 안내: 가장 급하거나 중요한 상황 하나는 가로로 긴 탑승권(떼어내는 쪽에서 바로 행동),
 * 나머지는 아래에 "상황 | 안내" 두 칸 줄로. 같은 카드 여러 장을 나란히 두지 않습니다.
 * 장례는 전화 상담, 그 밖의 서비스는 상담 남기기(#consult)로 이어집니다.
 */
export function ScenarioSection({ service, scenarios, title, featured = 0 }: { service: Service; scenarios: Scenario[]; title: string; featured?: number }) {
    if (!scenarios.length) return null;
    const isFuneral = service.slug === "funeral";
    const main = scenarios[featured] ?? scenarios[0];
    const rest = scenarios.filter((s) => s !== main);
    const icon = isFuneral ? undefined : serviceIconSrc(service.slug);

    return (
        <Reveal as="section" className="py-16 sm:py-20">
            <Container>
                <SectionTitle title={title} />
                <PassCard
                    radius="tile"
                    className="mt-10"
                    mainClassName="p-7 sm:p-9"
                    stubClassName="gap-3 p-7 sm:w-[17.5rem] sm:p-8"
                    stub={
                        <>
                            {isFuneral ? (
                                <CallButton size="sm" className="self-start" />
                            ) : (
                                <PillLink href="#consult" variant="solid" size="sm" className="self-start">
                                    상담 남기기
                                </PillLink>
                            )}
                            <span className="text-[13.5px] leading-relaxed text-ink-3">{isFuneral ? SITE.hours : "상담과 연결은 무료, 예약까지 도와드립니다"}</span>
                        </>
                    }
                >
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-7">
                        {icon && <Image src={icon} alt="" width={192} height={192} className="-my-2 h-20 w-20 shrink-0 mix-blend-multiply sm:h-24 sm:w-24" />}
                        <div>
                            <h3 className="text-[22px] font-bold leading-snug text-ink sm:text-[25px]">{main.title}</h3>
                            <p className="mt-2.5 max-w-[48ch] text-[15.5px] leading-[1.8] text-ink-2">{main.desc}</p>
                        </div>
                    </div>
                </PassCard>

                {rest.length > 0 && (
                    <dl className="mt-10 divide-y divide-line border-t border-line">
                        {rest.map((s) => (
                            <div key={s.title} className="grid gap-1.5 py-5 sm:grid-cols-[minmax(0,16rem)_minmax(0,1fr)] sm:gap-10">
                                <dt className="text-[17px] font-bold text-ink">{s.title}</dt>
                                <dd className="max-w-[62ch] text-[15px] leading-relaxed text-ink-2">{s.desc}</dd>
                            </div>
                        ))}
                    </dl>
                )}
            </Container>
        </Reveal>
    );
}

const guideCover = (slug: string) => `/brand/guides/${slug}.webp`;

function GuideRow({ g }: { g: Guide }) {
    return (
        <Link href={`/guide/${g.slug}`} className="group flex items-start gap-4 py-5">
            <span className="relative aspect-[4/3] w-24 shrink-0 overflow-hidden rounded-xl bg-paper-2 sm:w-28">
                <Image src={guideCover(g.slug)} alt="" fill sizes="112px" className="object-cover" />
            </span>
            <span className="min-w-0">
                <span className="line-clamp-2 text-[16px] font-bold leading-snug text-ink decoration-ink/30 underline-offset-4 group-hover:underline">{g.title}</span>
                <span className="mt-1.5 line-clamp-2 text-[13.5px] leading-relaxed text-ink-3">{g.description}</span>
            </span>
        </Link>
    );
}

/** 가이드: 첫 글은 큰 표지, 다음 세 개는 옆 목록, 나머지는 아래 목록 */
export function GuideCards({ guides, title = "보호자 가이드", lead }: { guides: Guide[]; title?: string; lead?: string }) {
    if (!guides.length) return null;
    const [first, ...rest] = guides;
    const side = rest.slice(0, 3);
    const more = rest.slice(3);

    return (
        <Reveal as="section" className="py-16 sm:py-20">
            <Container>
                <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
                    <SectionTitle title={title} lead={lead} />
                    <Link href="/guide" className="inline-flex items-center gap-1 text-[14.5px] font-semibold text-ink-2 hover:text-ink">
                        가이드 전체 보기
                        <ArrowUpRight className="h-4 w-4" strokeWidth={ICON_STROKE} aria-hidden />
                    </Link>
                </div>

                <div className={cn("mt-10 grid gap-8", side.length > 0 && "lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-12")}>
                    <Link href={`/guide/${first.slug}`} className="group block">
                        <span className="relative block aspect-[4/3] overflow-hidden rounded-[28px] bg-paper-2">
                            <Image
                                src={guideCover(first.slug)}
                                alt=""
                                fill
                                sizes="(min-width: 1024px) 600px, 100vw"
                                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                            />
                        </span>
                        <span className="mt-5 block text-[20px] font-bold leading-snug text-ink decoration-ink/30 underline-offset-4 group-hover:underline sm:text-[22px]">
                            {first.title}
                        </span>
                        <span className="mt-2 line-clamp-2 block max-w-[60ch] text-[15px] leading-relaxed text-ink-2">{first.description}</span>
                    </Link>
                    {side.length > 0 && (
                        <ul className="grid content-start divide-y divide-line lg:-mt-5">
                            {side.map((g) => (
                                <li key={g.slug}>
                                    <GuideRow g={g} />
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {more.length > 0 && (
                    <ul className="mt-10 grid gap-x-10 border-t border-line sm:grid-cols-2 lg:grid-cols-3">
                        {more.map((g) => (
                            <li key={g.slug}>
                                <GuideRow g={g} />
                            </li>
                        ))}
                    </ul>
                )}
            </Container>
        </Reveal>
    );
}

export const guidesBySlugs = (slugs: string[]) => slugs.map((s) => GUIDES.find((g) => g.slug === s)).filter((g): g is Guide => Boolean(g));

/** 전체 지역 링크: 출발 안내판처럼 윗선 하나로 묶은 글자 목록 (서비스 허브·지역 인덱스·홈. 내부 링크 구조의 핵심) */
export function RegionLinkGrid({ hrefFor, labelFor, current }: { hrefFor: (r: Region) => string; labelFor?: (r: Region) => string; current?: string }) {
    return (
        <div className="grid gap-12">
            {(["seoul", "gyeonggi"] as const).map((sido) => {
                const list = REGIONS.filter((r) => r.sido === sido);
                return (
                    <div key={sido}>
                        <h3 className="flex items-baseline gap-2 text-[16px] font-bold text-ink">
                            {SIDO[sido].name}
                            <span className="text-[13.5px] font-normal tabular-nums text-ink-3">{list.length}곳</span>
                        </h3>
                        <ul className="mt-4 grid grid-cols-2 gap-x-5 sm:grid-cols-3 lg:grid-cols-5">
                            {list.map((r) => {
                                const on = current === r.slug;
                                return (
                                    <li key={r.slug}>
                                        <Link
                                            href={hrefFor(r)}
                                            aria-current={on ? "page" : undefined}
                                            className={cn(
                                                "group block py-3.5 pr-1 transition-colors motion-reduce:transition-none",
                                                on ? "border-t-2 border-ink" : "border-t border-line hover:border-ink/50",
                                            )}
                                        >
                                            <span className="flex items-center justify-between gap-2 text-[15px] font-semibold text-ink">
                                                <span className="min-w-0 truncate">{labelFor ? labelFor(r) : r.name}</span>
                                                <ArrowRight
                                                    className="h-3.5 w-3.5 shrink-0 text-ink-3 opacity-0 transition-opacity group-hover:opacity-100 motion-reduce:transition-none"
                                                    strokeWidth={ICON_STROKE}
                                                    aria-hidden
                                                />
                                            </span>
                                            <span className="mt-0.5 block truncate text-[12.5px] text-ink-3">
                                                {r.areas
                                                    .map((a) => a.name.replace(/ 생활권| 권역/, ""))
                                                    .slice(0, 3)
                                                    .join(", ")}
                                            </span>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                );
            })}
        </div>
    );
}

const PROMISES = ["상담·연결 비용 없음", "허가·등록 업체만 연결", "연결 전 총액 견적 먼저 안내"];

/** 상담: 밝은 면 그대로(본문 중간에 밤으로 돌아가지 않음). 왼쪽 문구·전화, 오른쪽 폼 */
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
    return (
        <Reveal as="section" id="consult" className="scroll-mt-20 border-t border-line py-16 sm:pt-24 sm:pb-8">
            <Container className="grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-14">
                <div className="lg:pt-2">
                    <h2 className="whitespace-pre-line text-[26px] font-bold leading-[1.3] text-ink sm:text-[32px]">{title ?? "전화가 어렵다면,\n상담을 남겨주세요"}</h2>
                    <p className="mt-4 max-w-[46ch] text-[15.5px] leading-relaxed text-ink-2">
                        {lead ??
                            `${region ? `${region.name} ` : ""}계신 동네와 상황을 알려주시면 가까운 ${service ? service.short : "서비스"} 업체와 예상 비용을 먼저 확인해 연락드립니다.`}
                    </p>
                    <div className="mt-8">
                        <CallButton />
                        <p className="mt-3 text-[13.5px] text-ink-3">{SITE.hours}</p>
                    </div>
                    <ul className="mt-8 grid gap-2.5 border-t border-line pt-6">
                        {PROMISES.map((t) => (
                            <li key={t} className="flex items-center gap-2.5 text-[15px] text-ink-2">
                                <Check className="h-4 w-4 shrink-0 text-pine" strokeWidth={ICON_STROKE} aria-hidden />
                                {t}
                            </li>
                        ))}
                    </ul>
                </div>
                <LeadForm
                    service={service?.slug ?? LEAD_SERVICE_UNSURE}
                    services={service ? undefined : liveServicesEverydayFirst().map((s) => ({ slug: s.slug, short: s.name }))}
                    regionSido={region?.sido}
                    regionSlug={region?.slug}
                    regionName={region?.name}
                />
            </Container>
        </Reveal>
    );
}
