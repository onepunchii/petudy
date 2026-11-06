import type { Metadata } from "next";
import { SITE } from "@/lib/site/config";
import { liveServices } from "@/lib/site/services";
import { LeadForm } from "@/components/site/LeadForm";
import { Breadcrumbs, CallButton, Container, SectionTitle } from "@/components/site/ui";

export const metadata: Metadata = {
    title: "상담 접수 · 24시간 반려동물 서비스 상담",
    description: "반려동물 장례, 애견미용 상담을 남겨주세요. 계신 동네 기준으로 가까운 허가·등록 업체와 예상 비용을 확인해 연락드립니다.",
    alternates: { canonical: "/contact" },
};

export default function ContactPage() {
    return (
        <>
            <Container className="pt-6"><Breadcrumbs items={[{ name: "홈", href: "/" }, { name: "상담 접수", href: "/contact" }]} /></Container>
            <section className="py-12 sm:py-16">
                <Container className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
                    <div>
                        <SectionTitle
                            eyebrow={SITE.hours}
                            title={<span className="text-[32px] sm:text-[40px]">급하시면 전화가<br />가장 빠릅니다</span>}
                            lead="상담 접수를 남겨주시면 계신 동네와 상황을 확인한 뒤 담당자가 연락드립니다. 장례처럼 급한 일은 바로 전화 주세요."
                        />
                        <CallButton className="mt-8" label="24시간 상담" />
                    </div>
                    <LeadForm services={liveServices().map((s) => ({ slug: s.slug, short: s.name }))} />
                </Container>
            </section>
        </>
    );
}
