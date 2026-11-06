import type { Metadata } from "next";
import { SERVICES } from "@/lib/site/services";
import { LeadForm } from "@/components/site/LeadForm";
import { Breadcrumbs, Container, SectionTitle } from "@/components/site/ui";

export const metadata: Metadata = {
    title: "제휴 업체 모집 · 장례식장·미용실·호텔·펫시터",
    description: "포온과 함께 동네 보호자님을 만날 허가·등록 반려동물 서비스 업체를 모집합니다.",
    alternates: { canonical: "/partners" },
};

export default function PartnersPage() {
    return (
        <>
            <Container className="pt-6"><Breadcrumbs items={[{ name: "홈", href: "/" }, { name: "제휴 업체 모집", href: "/partners" }]} /></Container>
            <section className="py-12 sm:py-16">
                <Container className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
                    <div>
                        <SectionTitle
                            eyebrow="제휴 업체 모집"
                            title={<span className="text-[32px] sm:text-[40px]">동네 보호자님과<br />연결될 업체를 찾습니다</span>}
                            lead="포온은 지역 검색으로 들어온 보호자님을 가까운 정식 업체와 연결합니다. 아래 조건을 갖춘 업체라면 연락 주세요."
                        />
                        <ul className="mt-8 space-y-3 text-[15px] text-ink-2">
                            {SERVICES.map((s) => (
                                <li key={s.slug} className="rounded-2xl bg-white p-4 ring-1 ring-line">
                                    <span className="font-semibold text-ink">{s.name}</span> — {s.license.kind} {s.license.type}
                                </li>
                            ))}
                            <li className="rounded-2xl bg-white p-4 ring-1 ring-line">가격표 공개 및 견적 외 추가 비용 없음</li>
                        </ul>
                    </div>
                    <LeadForm service="partner" compact />
                </Container>
            </section>
        </>
    );
}
