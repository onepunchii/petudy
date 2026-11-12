import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, X } from "lucide-react";
import { SITE } from "@/lib/site/config";
import { REGIONS } from "@/lib/site/regions";
import { SERVICES } from "@/lib/site/services";
import { breadcrumbLd, organizationLd } from "@/lib/site/schema";
import { PassCard } from "@/components/site/PassCard";
import { Reveal } from "@/components/site/Reveal";
import { ConsultSection } from "@/components/site/sections";
import { CallButton, Chip, Container, ICON_STROKE, JsonLd, PillLink, SectionTitle } from "@/components/site/ui";
import { PageHero } from "../_components/PageHero";

export const metadata: Metadata = {
    title: "포온 소개 · 반려동물 서비스 에이전시",
    description: "포온은 보호자님 동네에서 가장 가까운 허가·등록 반려동물 서비스 업체를 확인해 연결하는 에이전시입니다. 우리가 지키는 연결 원칙을 소개합니다.",
    alternates: { canonical: "/about" },
};

/** 반려동물과의 삶을 하나의 여행으로 보는 세 장면 (브랜드 가이드 2장) */
const STOPS = [
    {
        when: "함께 사는 동안",
        desc: "산책길에 들르기 좋은 미용실처럼, 함께 사는 날들에 필요한 가까운 곳을 찾아 드립니다.",
        link: { href: "/grooming", label: "애견미용 안내" },
    },
    {
        when: "떠나는 날",
        desc: `가장 가까운 허가 장례식장에서 차분하게 배웅할 수 있도록 길을 찾습니다.${SITE.open24h ? " 상담은 24시간 받습니다." : ""}`,
        link: { href: "/funeral", label: "반려동물 장례 안내" },
    },
    {
        when: "떠난 뒤",
        desc: "포온 추억상자에 사진과 이야기를 모아 두고, 부고장으로 가까운 사람들에게 소식을 전할 수 있습니다.",
        link: { href: "/memorial", label: "추억상자" },
    },
];

const PRINCIPLES = [
    { t: "허가·등록 업체만 연결합니다", d: "동물장묘업은 허가, 동물미용업·위탁관리업·운송업은 등록 여부를 공식 시스템에서 확인한 뒤 연결합니다." },
    { t: "총액을 먼저 안내합니다", d: "기본 비용과 선택 항목을 나눠, 현장에서 예상하지 못한 비용이 생기지 않도록 연결 전에 견적을 공유합니다." },
    { t: "가까움은 '지금 기준'으로 봅니다", d: "지도 위 거리보다 지금 시간대에 실제로 오가기 편한지, 오늘 가능한지를 기준으로 추천합니다." },
    { t: "보호자가 볼 수 있어야 합니다", d: "장례는 개별 화장과 전 과정 참관, 미용은 1:1 진행과 과정 공개가 가능한 곳을 먼저 연결합니다." },
];

const DONTS = ["안락사 중개", "무허가 업체 연결", "사실과 다른 후기·거리 표시"];

export default function AboutPage() {
    const crumbs = [
        { name: "홈", href: "/" },
        { name: "포온 소개", href: "/about" },
    ];
    const seoul = REGIONS.filter((r) => r.sido === "seoul").length;
    const gyeonggi = REGIONS.filter((r) => r.sido === "gyeonggi").length;
    const live = SERVICES.filter((s) => s.status === "live");
    const soon = SERVICES.filter((s) => s.status === "soon");

    return (
        <>
            <JsonLd data={[breadcrumbLd(crumbs), organizationLd()]} />

            <PageHero
                crumbs={crumbs}
                title={
                    <>
                        포온은 우리 동네
                        <br />
                        반려동물 안내소입니다
                    </>
                }
                subtitle="반려동물의 여행을 함께 준비하고, 떠나는 날에는 가까운 곳에서 배웅합니다."
                actions={<CallButton tone="onNight" />}
                art={{
                    src: "/brand/hero/home.webp",
                    alt: "저녁 하늘 아래 불 켜진 동네를 언덕 위 벤치 옆에서 함께 내려다보는 강아지와 고양이",
                    position: "50% 62%",
                }}
            />

            <Reveal as="section" className="py-16 sm:py-24">
                <Container>
                    <SectionTitle
                        id="about-journey"
                        title="반려동물과의 삶을 하나의 여행으로 봅니다"
                        lead="이별이 갑작스러운 단절이 아니라 함께 준비해 온 여행의 한 장면이 되도록 돕습니다. 슬픔을 없애 드릴 수는 없지만, 준비하는 동안과 떠나는 날 곁에 있겠습니다."
                    />
                    <ol aria-labelledby="about-journey" className="relative mt-12 grid gap-10 lg:grid-cols-3 lg:gap-10">
                        {/* 세 장면을 잇는 길 (모바일 세로, 데스크톱 가로) */}
                        <span aria-hidden className="absolute bottom-3 left-[7px] top-3 w-px bg-ink/15 lg:inset-x-0 lg:bottom-auto lg:top-[7px] lg:h-px lg:w-auto" />
                        {STOPS.map((s) => (
                            <li key={s.when} className="relative pl-10 lg:pl-0 lg:pt-10">
                                <span aria-hidden className="absolute left-0 top-1.5 h-[15px] w-[15px] rounded-full border-2 border-ink bg-moon lg:top-0" />
                                <h3 className="text-[20px] font-bold text-ink">{s.when}</h3>
                                <p className="mt-3 max-w-[40ch] text-[15.5px] leading-[1.8] text-ink-2">{s.desc}</p>
                                <Link href={s.link.href} className="mt-4 inline-flex items-center gap-1.5 text-[14.5px] font-semibold text-pine underline-offset-4 hover:underline">
                                    {s.link.label}
                                    <ArrowRight className="h-4 w-4" strokeWidth={ICON_STROKE} aria-hidden />
                                </Link>
                            </li>
                        ))}
                    </ol>
                </Container>
            </Reveal>

            <Reveal as="section" className="border-t border-line py-16 sm:py-24">
                <Container>
                    <SectionTitle id="about-principles" title="포온이 지키는 연결 원칙" />
                    <ul aria-labelledby="about-principles" className="mt-10 grid gap-x-12 gap-y-9 md:grid-cols-2">
                        {PRINCIPLES.map((p) => (
                            <li key={p.t} className="border-t border-ink/15 pt-5">
                                <h3 className="text-[18px] font-bold text-ink">{p.t}</h3>
                                <p className="mt-2 max-w-[48ch] text-[15.5px] leading-[1.8] text-ink-2">{p.d}</p>
                            </li>
                        ))}
                    </ul>

                    <PassCard
                        as="section"
                        aria-label="포온이 하지 않는 일"
                        className="mt-14"
                        radius="tile"
                        mainClassName="p-6 sm:p-8"
                        stubClassName="p-6 sm:min-w-[16rem] sm:p-8"
                        stub={
                            <ul className="space-y-2.5">
                                {DONTS.map((d) => (
                                    <li key={d} className="flex items-center gap-2.5 text-[15px] font-semibold text-ink">
                                        <X className="h-4 w-4 shrink-0 text-ink-3" strokeWidth={ICON_STROKE} aria-hidden />
                                        {d}
                                    </li>
                                ))}
                            </ul>
                        }
                    >
                        <h3 className="text-[20px] font-bold leading-snug text-ink sm:text-[22px]">하지 않는 일도 분명히 합니다</h3>
                        <p className="mt-3 max-w-[46ch] text-[15.5px] leading-[1.8] text-ink-2">
                            보호자님이 안심하고 물어보실 수 있도록, 이런 일은 어떤 경우에도 하지 않습니다.
                        </p>
                    </PassCard>
                </Container>
            </Reveal>

            <Reveal as="section" className="pb-16 sm:pb-24">
                <Container className="grid gap-10 border-t border-line pt-16 sm:pt-24 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
                    <div>
                        <SectionTitle
                            title="어디까지 안내하나요"
                            lead={`서울 ${seoul}개 구와 경기 ${gyeonggi}개 도시를 생활권과 동네 단위로 안내합니다. 포온은 장례식장이나 미용실을 직접 운영하지 않고, 확인한 업체를 연결합니다.`}
                        />
                        <PillLink href="/area" className="mt-8">
                            우리 동네 찾기
                        </PillLink>
                    </div>
                    <div>
                        <h3 className="text-[14px] font-semibold text-ink-3">지금 연결하는 서비스</h3>
                        <ul className="mt-3 grid gap-3 sm:grid-cols-2">
                            {live.map((s) => (
                                <li key={s.slug}>
                                    <Link
                                        href={`/${s.slug}`}
                                        className="site-lift group flex h-full flex-col rounded-[20px] bg-pass p-5 ring-1 ring-inset ring-line hover:ring-ink/20"
                                    >
                                        <span className="text-[17px] font-bold text-ink group-hover:text-pine">{s.name}</span>
                                        <span className="mt-1 text-[14px] text-ink-2">
                                            {s.license.kind} {s.license.type} 업체
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        <h3 className="mt-8 text-[14px] font-semibold text-ink-3">준비 중인 서비스</h3>
                        <ul className="mt-3 flex flex-wrap gap-2">
                            {soon.map((s) => (
                                <li key={s.slug}>
                                    <Chip>{s.name}</Chip>
                                </li>
                            ))}
                        </ul>
                    </div>
                </Container>
            </Reveal>

            <ConsultSection />
        </>
    );
}
