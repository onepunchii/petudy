import type { Metadata } from "next";
import { SITE } from "@/lib/site/config";
import { REGIONS } from "@/lib/site/regions";
import { breadcrumbLd, organizationLd } from "@/lib/site/schema";
import { ConsultSection } from "@/components/site/sections";
import { Breadcrumbs, Container, JsonLd, SectionTitle } from "@/components/site/ui";

export const metadata: Metadata = {
    title: "포온 소개 · 반려동물 서비스 에이전시",
    description: "포온은 보호자님 동네에서 가장 가까운 허가·등록 반려동물 서비스 업체를 확인해 연결하는 에이전시입니다. 우리가 지키는 연결 원칙을 소개합니다.",
    alternates: { canonical: "/about" },
};

const PRINCIPLES = [
    { t: "허가·등록 업체만 연결합니다", d: "동물장묘업은 허가, 동물미용업·위탁관리업·운송업은 등록 여부를 공식 시스템에서 확인한 뒤 연결합니다." },
    { t: "총액을 먼저 안내합니다", d: "기본 비용과 선택 항목을 구분해, 현장에서 예상하지 못한 비용이 생기지 않도록 연결 전에 견적을 공유합니다." },
    { t: "가까움은 '지금 기준'으로 봅니다", d: "지도상 거리보다 지금 시간대에 실제로 이동이 편한지, 당일 가능한지를 기준으로 추천합니다." },
    { t: "보호자가 볼 수 있어야 합니다", d: "장례는 개별 화장과 전 과정 참관, 미용은 1:1 진행과 과정 공개가 가능한 곳을 우선합니다." },
    { t: "하지 않는 일도 분명히 합니다", d: "안락사 중개, 무허가 업체 연결, 사실과 다른 후기·거리 표시는 하지 않습니다." },
];

export default function AboutPage() {
    const crumbs = [{ name: "홈", href: "/" }, { name: "포온 소개", href: "/about" }];
    return (
        <>
            <JsonLd data={[breadcrumbLd(crumbs), organizationLd()]} />
            <Container className="pt-6"><Breadcrumbs items={crumbs} /></Container>
            <section className="py-12 sm:py-16">
                <Container className="max-w-3xl">
                    <SectionTitle
                        eyebrow="포온 소개"
                        title={<span className="text-[32px] sm:text-[42px]">동네를 아는 이웃처럼,<br />가장 가까운 곳으로</span>}
                        lead={`${SITE.name}은 반려동물 서비스 에이전시입니다. 장례식장이나 미용실을 직접 운영하지 않고, 서울·경기 ${REGIONS.length}개 지역 보호자님이 필요한 순간에 동네에서 가장 알맞은 정식 업체를 찾을 수 있도록 확인하고 연결합니다.`}
                    />
                    <ol className="mt-12 grid gap-3">
                        {PRINCIPLES.map((p, i) => (
                            <li key={p.t} className="flex gap-5 rounded-3xl bg-white p-6 ring-1 ring-line">
                                <span className="text-[14px] font-bold tabular-nums text-ink-3">{String(i + 1).padStart(2, "0")}</span>
                                <div>
                                    <p className="text-[17px] font-bold text-ink">{p.t}</p>
                                    <p className="mt-1.5 text-[14.5px] leading-relaxed text-ink-2">{p.d}</p>
                                </div>
                            </li>
                        ))}
                    </ol>
                </Container>
            </section>
            <ConsultSection />
        </>
    );
}
