import type { Metadata } from "next";
import { SERVICES, type Service } from "@/lib/site/services";
import { LeadForm } from "@/components/site/LeadForm";
import { PassCard } from "@/components/site/PassCard";
import { CallButton, Container, PillLink } from "@/components/site/ui";
import { PageHero } from "../_components/PageHero";

export const metadata: Metadata = {
    title: "제휴 업체 모집 · 장례식장·미용실·호텔·펫시터",
    description: "포온과 함께 동네 보호자님을 만날 허가·등록 반려동물 서비스 업체를 모집합니다.",
    alternates: { canonical: "/partners" },
};

/** "동물장묘업 허가", "동물위탁관리업 등록 등", "반려동물행동지도사 자격 등" */
function licenseLabel(s: Service) {
    const { kind, type } = s.license;
    const base = kind.replace(/ 등$/, "");
    const etc = base !== kind ? " 등" : "";
    return /지도사/.test(base) ? `${base} 자격${etc}` : `${base} ${type}${etc}`;
}

export default function PartnersPage() {
    const crumbs = [
        { name: "홈", href: "/" },
        { name: "제휴 업체 모집", href: "/partners" },
    ];
    return (
        <>
            <PageHero
                size="compact"
                overlap
                crumbs={crumbs}
                title={
                    <>
                        반려동물 서비스
                        <br />
                        제휴 업체 모집
                    </>
                }
                subtitle="우리 동네 보호자님을 가까운 곳에서 만날 허가·등록 업체를 찾습니다."
                actions={
                    <>
                        <CallButton tone="onNight" />
                        <PillLink href="#apply" tone="onNight" className="lg:hidden">
                            상담 남기기
                        </PillLink>
                    </>
                }
            />

            <section className="pb-16 pt-12 sm:pb-24">
                <Container className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-14">
                    <div>
                        <h2 id="partner-terms" className="text-[22px] font-bold leading-snug text-ink sm:text-[26px]">
                            이런 업체와 함께합니다
                        </h2>
                        <p className="mt-3 max-w-[52ch] text-[15.5px] leading-[1.8] text-ink-2">
                            포온은 지역 검색으로 찾아온 보호자님을 가까운 정식 업체와 연결합니다. 아래 조건을 갖춘 업체라면 연락 주세요.
                        </p>

                        <PassCard
                            as="section"
                            aria-label="제휴 조건"
                            className="mt-8"
                            mainClassName="p-6 sm:p-7"
                            stubClassName="p-6 sm:min-w-[11rem] sm:p-6"
                            stub={
                                <>
                                    <p className="text-[12px] font-semibold text-ink-3">모든 업체 공통</p>
                                    <ul className="mt-2 space-y-1.5 text-[15px] font-bold leading-snug text-ink">
                                        <li>가격표 공개</li>
                                        <li>견적 외 추가 비용 없음</li>
                                    </ul>
                                </>
                            }
                        >
                            <h3 className="text-[15px] font-bold text-ink">서비스별로 필요한 허가·등록</h3>
                            <dl className="mt-5 grid gap-3.5">
                                {SERVICES.map((s) => (
                                    <div key={s.slug} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5">
                                        <dt className="text-[15px] font-semibold text-ink">{s.name}</dt>
                                        <dd className="text-[14px] text-ink-2">{licenseLabel(s)}</dd>
                                    </div>
                                ))}
                            </dl>
                        </PassCard>
                    </div>

                    <div id="apply" className="order-first scroll-mt-24 lg:relative lg:z-[1] lg:order-last lg:-mt-48">
                        <h2 className="sr-only">제휴 상담 남기기</h2>
                        <LeadForm service="partner" compact />
                    </div>
                </Container>
            </section>
        </>
    );
}
