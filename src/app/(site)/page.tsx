import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, PawPrint } from "lucide-react";
import { SITE } from "@/lib/site/config";
import { FACILITY_AREAS, FACILITY_CHECKED_AT } from "@/lib/site/facilities";
import { FUNERAL_HOMES, funeralHomesPath } from "@/lib/site/funeral-homes";
import { GUIDES, type Guide } from "@/lib/site/guides";
import { REGIONS, SIDO, allDongs, dongLabel, type SidoSlug } from "@/lib/site/regions";
import { SERVICES, getService, liveServices } from "@/lib/site/services";
import { faqLd, organizationLd, websiteLd } from "@/lib/site/schema";
import { LeadForm } from "@/components/site/LeadForm";
import { PassCard } from "@/components/site/PassCard";
import { RegionPicker } from "@/components/site/RegionPicker";
import { Reveal } from "@/components/site/Reveal";
import { MyPets } from "@/components/site/home/MyPets";
import { CallButton, Container, FaqList, ICON_STROKE, JsonLd, PillLink, SectionTitle } from "@/components/site/ui";
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

/** 히어로 "우리 동네 찾기" 가 가리키는 탑승권(동네 선택기) */
const FIND = "find";

/** 포온이 일하는 방식: 세 정거장 */
const ROUTE = [
    { t: "동네와 상황을 알려 주세요", d: "계신 동네(동 단위), 아이 정보, 원하는 시간만 있으면 됩니다." },
    { t: "허가·등록 업체부터 추립니다", d: "허가·등록 여부를 먼저 확인하고 이동 시간, 당일 가능 여부, 가격을 비교합니다." },
    { t: "총액을 먼저 알려 드리고 연결합니다", d: "업체와 시간, 픽업을 정하고 현장에서 비용이 늘지 않도록 견적부터 공유합니다." },
];

const FEATURED_GUIDE = "pet-death-first-steps";
const MORE_GUIDES = ["pet-funeral-cost", "licensed-pet-crematorium-check", "individual-vs-group-cremation", "dog-grooming-price", "dog-grooming-cycle"];

/** "함께 사는 동안" 바로가기. icon 이 없으면 발자국 아이콘(추억상자 타일에는 라임을 쓰지 않습니다) */
const LIFE_LINKS: { href: string; title: string; desc: string; icon?: string }[] = [
    { href: "/memorial", title: "추억상자", desc: "사진과 편지를 모아 둬요", icon: "memorial" },
    { href: "/mbti", title: "멍BTI", desc: "우리 아이 성격을 알아봐요", icon: "mbti" },
    { href: "/consult", title: "AI 도우미", desc: "궁금한 건 언제든 물어봐요", icon: "ai" },
    { href: "/register", title: "아이 등록", desc: "펫패스를 만들어 둬요" },
];

const pickGuides = (slugs: string[]) => slugs.map((s) => GUIDES.find((g) => g.slug === s)).filter((g): g is Guide => Boolean(g));

export default function HomePage() {
    const live = liveServices();
    const soon = SERVICES.filter((s) => s.status === "soon");
    const funeral = getService("funeral")!;
    const grooming = getService("grooming")!;
    const pickerRegions = REGIONS.map(({ sido, slug, name, lat, lng }) => ({ sido, slug, name, lat, lng }));
    const serviceOptions = live.map((s) => ({ slug: s.slug, short: s.name }));
    const metroCount = FACILITY_AREAS.reduce((s, f) => s + f.count, 0);
    const checkedAt = FACILITY_CHECKED_AT.slice(0, 7).replace("-", ".");
    const bySido = (sido: SidoSlug) => REGIONS.filter((r) => r.sido === sido);
    const [featured, ...moreGuides] = pickGuides([FEATURED_GUIDE, ...MORE_GUIDES]);

    return (
        <>
            <JsonLd data={[organizationLd(), websiteLd(), faqLd(HOME_FAQS)]} />

            {/* 히어로 (밤). 글자는 그림 위쪽 짙은 하늘에, 그림은 아래로 밝은 동네까지 이어집니다 */}
            <section className="relative isolate overflow-hidden bg-night text-star">
                <div className="site-stars -z-10" aria-hidden />
                <Container className="relative z-10 pt-10 sm:pt-14 lg:pt-16">
                    <h1 className="text-[31px] font-extrabold leading-[1.22] tracking-[-0.03em] text-star sm:text-[44px] lg:text-[52px]">
                        반려동물 장례·미용,
                        <br />
                        가장 가까운 곳으로 연결합니다
                    </h1>
                    <p className="mt-5 max-w-[42ch] text-[16px] leading-[1.7] text-star-2 sm:text-[18px]">
                        함께 사는 날에도, 먼저 떠나는 날에도.
                        <br className="hidden sm:block" /> 우리 동네 정거장 포온이 길을 찾아 드려요.
                    </p>
                    <div className="mt-8 flex flex-wrap gap-3">
                        <CallButton tone="onNight" accent="lime" />
                        <PillLink href={`#${FIND}`} tone="onNight" className="bg-night/45 backdrop-blur-sm">
                            우리 동네 찾기
                        </PillLink>
                    </div>
                </Container>
                {/* 그림의 짙은 하늘(위 약 22%)이 글자 아래로 들어오도록 끌어올림 */}
                <div className="relative -mt-[18vw] aspect-[43/24] w-full sm:-mt-[min(17vw,19rem)]">
                    <Image
                        src="/brand/hero/home.webp"
                        alt="별이 뜨기 시작한 저녁 하늘 아래, 언덕 위 벤치 옆에 나란히 앉아 불 켜진 동네를 바라보는 강아지와 고양이"
                        fill
                        preload
                        sizes="100vw"
                        className="object-cover"
                    />
                    <div className="absolute inset-x-0 top-0 h-[24%] bg-gradient-to-b from-night to-transparent" aria-hidden />
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_70%_at_10%_0%,rgb(11_16_32/0.9),transparent_85%)]" aria-hidden />
                </div>
            </section>

            {/* 탑승권: 밝은 면이 시작되는 자리에서 그림 아랫단에 살짝 걸칩니다 */}
            <div id={FIND} className="relative z-10 -mt-8 scroll-mt-24 sm:-mt-12 lg:-mt-16">
                <Container>
                    <RegionPicker
                        variant="pass"
                        titleAs="h2"
                        title="계신 동네를 고르면, 가까운 곳부터 안내해요"
                        regions={pickerRegions}
                        services={serviceOptions}
                    />
                </Container>
            </div>

            {/* 내 아이: 로그인해 아이를 등록한 보호자에게만 보입니다(서버 렌더·비회원은 아무것도 없음, 간격도 안쪽에) */}
            <MyPets />

            {/* 서비스: 비대칭 bento. 장례(큰 타일) / 미용 / 준비 중 4개(한 칸) / 함께 사는 동안 */}
            <Reveal as="section" className="pb-20 pt-16 sm:pb-24 sm:pt-20">
                <Container>
                    <SectionTitle
                        title="함께 사는 날부터 배웅하는 날까지"
                        lead="지금은 장례와 미용을 연결합니다. 돌봄과 이동은 함께할 업체를 확인하는 대로 차례로 엽니다."
                    />
                    <div className="mt-10 grid gap-4 lg:grid-cols-12 lg:gap-5">
                        {/* 장례 타일 + 그 아래 전국 허가 장례식장 목록 링크 (카드 전체가 링크라 안에 넣지 않고 바로 아래에 둡니다) */}
                        <div className="flex flex-col gap-3 lg:col-span-7 lg:row-span-2">
                            <PassCard
                                href={`/${funeral.slug}`}
                                radius="tile"
                                stubPosition="bottom"
                                // 오른쪽 두 타일보다 길어질 때 남는 높이는 그림 쪽(main)이 받도록 (.pass 규칙이 레이어 밖이라 ! 필요)
                                className="flex-1 grid-rows-[minmax(0,1fr)_auto]!"
                                mainClassName="flex flex-col p-3 sm:p-3"
                                stubClassName="px-6 py-5 sm:px-8"
                                stub={
                                    <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
                                        <div>
                                            <p className="text-[14px] font-semibold text-ink">수도권 허가 동물장묘업체</p>
                                            <p className="mt-0.5 text-[12.5px] text-ink-3">동물보호관리시스템 기준, {checkedAt} 확인</p>
                                        </div>
                                        <p className="text-[30px] font-extrabold leading-none tabular-nums text-ink">
                                            {metroCount}
                                            <span className="ml-0.5 text-[16px] font-bold">곳</span>
                                        </p>
                                    </div>
                                }
                            >
                                <div className="relative aspect-[16/9] overflow-hidden rounded-[16px] bg-night">
                                    <Image
                                        src="/brand/hero/funeral.webp"
                                        alt=""
                                        fill
                                        sizes="(min-width: 1152px) 640px, (min-width: 1024px) 56vw, 100vw"
                                        className="object-cover"
                                        style={{ objectPosition: "64% 45%" }}
                                    />
                                </div>
                                <div className="flex flex-1 flex-col px-3 pb-4 pt-6 sm:px-5">
                                    <h3 className="text-[26px] font-bold leading-tight text-ink sm:text-[30px]">{funeral.name}</h3>
                                    <p className="mt-2 max-w-[40ch] text-[15.5px] leading-relaxed text-ink-2">{funeral.tagline}</p>
                                    <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[14.5px] font-medium text-ink">
                                        {funeral.available24h && <Fact>24시간 상담</Fact>}
                                        <Fact>
                                            {funeral.license.kind} {funeral.license.type} 업체만 연결
                                        </Fact>
                                        <Fact>개별 화장, 보호자 참관</Fact>
                                    </ul>
                                    <span className="mt-auto inline-flex items-center gap-1.5 pt-7 text-[15px] font-semibold text-pine">
                                        지역별 장례 안내
                                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" strokeWidth={ICON_STROKE} aria-hidden />
                                    </span>
                                </div>
                            </PassCard>
                            <Link
                                href={funeralHomesPath()}
                                className="group/dir inline-flex items-center gap-1.5 self-start rounded-sm px-2 text-[14.5px] font-semibold text-ink-2 transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink motion-reduce:transition-none"
                            >
                                <span className="underline decoration-ink/25 underline-offset-4 group-hover/dir:decoration-ink">전국 허가 장례식장 목록</span>
                                <span className="font-normal tabular-nums text-ink-3">{FUNERAL_HOMES.length}곳</span>
                                <ArrowRight className="h-4 w-4 transition-transform group-hover/dir:translate-x-0.5 motion-reduce:transition-none" strokeWidth={ICON_STROKE} aria-hidden />
                            </Link>
                        </div>

                        <PassCard href={`/${grooming.slug}`} radius="tile" className="lg:col-span-5" mainClassName="flex h-full flex-col p-6 sm:p-7">
                            <div className="flex items-start justify-between gap-4">
                                <div className="min-w-0">
                                    <h3 className="text-[22px] font-bold leading-tight text-ink sm:text-[24px]">{grooming.name}</h3>
                                    <p className="mt-2 text-[15px] leading-relaxed text-ink-2">{grooming.tagline}</p>
                                </div>
                                <Image
                                    src="/brand/icons/grooming.webp"
                                    alt=""
                                    width={224}
                                    height={224}
                                    sizes="112px"
                                    className="-mr-2 -mt-2 h-24 w-24 shrink-0 mix-blend-multiply sm:h-28 sm:w-28"
                                />
                            </div>
                            {/* 장례 타일이 더 길 때 남는 높이는 가운데로 모이고, 사실·링크는 아래에 붙습니다 */}
                            <ul className="mt-auto flex flex-wrap gap-x-5 gap-y-2 pt-6 text-[14.5px] font-medium text-ink">
                                <Fact>
                                    {grooming.license.kind} {grooming.license.type} 업체만 연결
                                </Fact>
                                <Fact>예약까지 연결</Fact>
                            </ul>
                            <span className="mt-6 inline-flex items-center gap-1.5 text-[15px] font-semibold text-pine">
                                지역별 미용 안내
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" strokeWidth={ICON_STROKE} aria-hidden />
                            </span>
                        </PassCard>

                        <div className="rounded-[28px] bg-paper-2 p-5 sm:p-7 lg:col-span-5">
                            <h3 className="text-[19px] font-bold text-ink">준비 중인 서비스</h3>
                            <ul className="mt-4 grid gap-1 sm:grid-cols-2 lg:grid-cols-1">
                                {soon.map((s) => (
                                    <li key={s.slug}>
                                        <Link
                                            href={`/${s.slug}`}
                                            className="flex h-full items-center gap-2.5 rounded-2xl p-1.5 pr-3 transition-colors hover:bg-pass motion-reduce:transition-none"
                                        >
                                            <Image
                                                src={`/brand/icons/${s.slug}.webp`}
                                                alt=""
                                                width={112}
                                                height={112}
                                                sizes="56px"
                                                className="h-12 w-12 shrink-0 mix-blend-multiply sm:h-14 sm:w-14"
                                            />
                                            <span className="min-w-0 text-[14.5px] font-semibold leading-snug text-ink">{s.name}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* 함께 사는 동안: 추억상자·멍BTI·AI 도우미·아이 등록으로 바로 이어집니다 */}
                        <div className="rounded-[28px] bg-pine-soft p-6 sm:p-8 lg:col-span-12">
                            <h3 className="text-[19px] font-bold leading-snug text-ink sm:text-[21px]">함께 사는 동안</h3>
                            <p className="mt-1.5 max-w-[52ch] text-[15px] leading-relaxed text-ink-2">
                                사진과 편지를 모으는 추억상자, 멍BTI, AI 도우미까지 여기서 이어져요.
                            </p>
                            <ul className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
                                {LIFE_LINKS.map((l) => (
                                    <li key={l.href}>
                                        <Link
                                            href={l.href}
                                            className="group flex h-full flex-col gap-3 rounded-[20px] bg-pass p-4 ring-1 ring-line transition-[box-shadow,transform] duration-200 hover:shadow-[0_16px_32px_-24px_rgb(31_39_66/0.4)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink active:translate-y-px motion-reduce:transition-none sm:p-5"
                                        >
                                            {l.icon ? (
                                                <Image
                                                    src={`/brand/icons/${l.icon}.webp`}
                                                    alt=""
                                                    width={112}
                                                    height={112}
                                                    sizes="56px"
                                                    className="h-12 w-12 shrink-0 mix-blend-multiply sm:h-14 sm:w-14"
                                                />
                                            ) : (
                                                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-paper-2 text-ink sm:h-14 sm:w-14" aria-hidden>
                                                    <PawPrint className="h-6 w-6" strokeWidth={ICON_STROKE} />
                                                </span>
                                            )}
                                            <span className="block min-w-0">
                                                <span className="block text-[16px] font-bold leading-snug text-ink group-hover:text-pine">{l.title}</span>
                                                <span className="mt-0.5 block text-[13px] leading-snug text-ink-3">{l.desc}</span>
                                            </span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </Container>
            </Reveal>

            {/* 포온이 일하는 방식: 세 정거장을 잇는 노선 */}
            <Reveal as="section" className="pb-20 sm:pb-24">
                <Container>
                    <SectionTitle
                        eyebrow="포온이 일하는 방식"
                        title="검색 대신, 동네를 아는 사람에게 묻듯이"
                        lead="가장 가까운 곳이 늘 가장 좋은 곳은 아닙니다. 지금 시간에 이동이 편한지, 당일 가능한지, 비용이 투명한지를 함께 봅니다."
                    />
                    <ol className="mt-12 grid gap-9 lg:grid-cols-3 lg:gap-10">
                        {ROUTE.map((s, i) => {
                            const last = i === ROUTE.length - 1;
                            return (
                                <li key={s.t} className="relative pl-10 lg:pl-0 lg:pt-11">
                                    {!last && (
                                        <span
                                            className="absolute left-[10px] top-7 -bottom-9 border-l-2 border-dashed border-ink-3/40 lg:bottom-auto lg:left-8 lg:right-[-2.5rem] lg:top-[10px] lg:border-l-0 lg:border-t-2"
                                            aria-hidden
                                        />
                                    )}
                                    <span
                                        className={cn(
                                            "absolute left-0 top-0.5 flex h-[22px] w-[22px] items-center justify-center rounded-full ring-2 ring-inset ring-ink lg:top-0",
                                            last ? "bg-ink" : "bg-moon",
                                        )}
                                        aria-hidden
                                    >
                                        <span className={cn("h-1.5 w-1.5 rounded-full", last ? "bg-star" : "bg-ink")} />
                                    </span>
                                    <h3 className="text-[19px] font-bold leading-snug text-ink">{s.t}</h3>
                                    <p className="mt-2 max-w-[36ch] text-[15px] leading-relaxed text-ink-2">{s.d}</p>
                                </li>
                            );
                        })}
                    </ol>
                </Container>
            </Reveal>

            {/* 지역: 서울·경기 동네 색인 (지역 페이지로 가는 내부 링크 허브) */}
            <Reveal as="section" className="bg-paper-2 py-20 sm:py-24">
                <Container>
                    <SectionTitle
                        title={`서울 ${bySido("seoul").length}개 구, 경기 ${bySido("gyeonggi").length}개 도시`}
                        lead="같은 구 안에서도 생활권마다 편한 길이 다릅니다. 동네를 고르면 그 지역 기준으로 장례와 미용을 안내합니다."
                    />
                    <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,3fr)] lg:gap-16">
                        {(["seoul", "gyeonggi"] as const).map((sido) => {
                            const list = bySido(sido);
                            return (
                                <div key={sido}>
                                    <h3 className="flex items-baseline gap-2 border-b border-ink/10 pb-3 text-[16px] font-bold text-ink">
                                        {SIDO[sido].name}
                                        <span className="text-[13px] font-medium text-ink-3">{list.length}곳</span>
                                    </h3>
                                    <ul className={cn("mt-5 gap-x-8", sido === "seoul" ? "columns-2 sm:columns-3" : "columns-2")}>
                                        {list.map((r) => (
                                            <li key={r.slug} className="break-inside-avoid pb-4">
                                                <Link href={`/area/${r.sido}/${r.slug}`} className="group block rounded-md">
                                                    <span className="text-[16px] font-semibold text-ink underline-offset-4 group-hover:underline">{r.name}</span>
                                                    <span className="mt-0.5 block truncate text-[12.5px] text-ink-3">
                                                        {allDongs(r).slice(0, 3).map(dongLabel).join(", ")}
                                                    </span>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            );
                        })}
                    </div>
                </Container>
            </Reveal>

            {/* 가이드: 대표 한 편 + 목록 */}
            {featured && (
                <Reveal as="section" className="py-20 sm:py-24">
                    <Container>
                        <div className="flex flex-wrap items-end justify-between gap-4">
                            <SectionTitle title="처음 겪는 일이라면, 먼저 읽어 보세요" />
                            <Link href="/guide" className="inline-flex items-center gap-1 text-[15px] font-semibold text-pine underline-offset-4 hover:underline">
                                가이드 전체 보기
                                <ArrowUpRight className="h-4 w-4" strokeWidth={ICON_STROKE} aria-hidden />
                            </Link>
                        </div>
                        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-12">
                            <Link href={`/guide/${featured.slug}`} className="group block">
                                <span className="site-lift relative block aspect-[4/3] overflow-hidden rounded-[20px] bg-night">
                                    <Image
                                        src={`/brand/guides/${featured.slug}.webp`}
                                        alt=""
                                        fill
                                        sizes="(min-width: 1152px) 580px, (min-width: 1024px) 50vw, 100vw"
                                        className="object-cover"
                                    />
                                </span>
                                <span className="mt-5 block text-[22px] font-bold leading-snug text-ink group-hover:text-pine sm:text-[24px]">{featured.title}</span>
                                <span className="mt-2 block max-w-[56ch] text-[15px] leading-relaxed text-ink-2">{featured.description}</span>
                            </Link>
                            <ul className="grid content-start gap-2">
                                {moreGuides.map((g) => (
                                    <li key={g.slug}>
                                        <Link
                                            href={`/guide/${g.slug}`}
                                            className="group flex items-center gap-4 rounded-[20px] p-2 pr-4 transition-colors hover:bg-pass motion-reduce:transition-none"
                                        >
                                            <span className="relative aspect-[4/3] w-28 shrink-0 overflow-hidden rounded-[14px] bg-night sm:w-32">
                                                <Image src={`/brand/guides/${g.slug}.webp`} alt="" fill sizes="128px" className="object-cover" />
                                            </span>
                                            <span className="min-w-0">
                                                <span className="block text-[12.5px] font-semibold text-ink-3">{getService(g.service)?.short ?? ""}</span>
                                                <span className="mt-0.5 block text-[15.5px] font-semibold leading-snug text-ink group-hover:text-pine">{g.title}</span>
                                            </span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </Container>
                </Reveal>
            )}

            {/* 자주 묻는 질문: 좁은 한 단 */}
            <Reveal as="section" className="pb-20 sm:pb-24">
                <Container className="max-w-3xl">
                    <SectionTitle title="포온에 대해 자주 묻는 질문" />
                    <div className="mt-8">
                        <FaqList faqs={HOME_FAQS} />
                    </div>
                </Container>
            </Reveal>

            {/* 상담: 왼쪽 전화, 오른쪽 상담 남기기 */}
            <Reveal as="section" id="consult" className="scroll-mt-20 pb-24 sm:pb-28">
                <Container className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
                    <div className="lg:pt-2">
                        <SectionTitle
                            title={
                                <>
                                    전화가 어렵다면,
                                    <br />
                                    상담을 남겨 주세요
                                </>
                            }
                            lead="계신 동네와 상황을 알려 주시면 가까운 업체와 예상 비용을 먼저 확인하고 연락드립니다."
                        />
                        <CallButton className="mt-8" />
                        <p className="mt-3 text-[14px] text-ink-3">{SITE.hours}</p>
                        <ul className="mt-8 grid gap-2.5 border-t border-line pt-6 text-[15px] font-medium text-ink">
                            <Fact>상담·연결 비용 없음</Fact>
                            <Fact>허가·등록 업체만 연결</Fact>
                            <Fact>연결 전에 총액 견적 먼저 안내</Fact>
                        </ul>
                    </div>
                    <LeadForm service={live[0].slug} services={serviceOptions} />
                </Container>
            </Reveal>
        </>
    );
}

/** 체크 표시가 붙은 짧은 사실 한 줄 */
function Fact({ children }: { children: React.ReactNode }) {
    return (
        <li className="flex items-start gap-2">
            <Check className="mt-[3px] h-4 w-4 shrink-0 text-pine" strokeWidth={ICON_STROKE} aria-hidden />
            <span>{children}</span>
        </li>
    );
}
