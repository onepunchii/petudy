import type { Metadata } from "next";
import { SITE } from "@/lib/site/config";
import { Container } from "@/components/site/ui";
import { PageHero } from "../_components/PageHero";

export const metadata: Metadata = {
    title: "개인정보처리방침",
    alternates: { canonical: "/privacy" },
    robots: { index: false, follow: true },
};

const SECTIONS: { h: string; p: React.ReactNode }[] = [
    { h: "1. 수집 항목", p: "필수: 연락처 / 선택: 성함, 거주 동네, 반려동물 정보, 상담 내용" },
    { h: "2. 이용 목적", p: "상담 응대, 보호자가 요청한 서비스 업체 연결 및 예약 확인" },
    { h: "3. 보유 기간", p: "상담 완료 후 1년간 보관 후 파기합니다. 관계 법령에 따라 보존이 필요한 경우 해당 기간 동안 보관합니다." },
    { h: "4. 제3자 제공", p: "보호자가 연결을 요청한 업체에 한해, 예약 확인에 필요한 최소 정보(연락처, 동네, 반려동물 정보)를 제공합니다." },
    {
        h: "5. 문의",
        p: (
            <a href={`mailto:${SITE.company.email}`} className="font-semibold text-ink underline-offset-4 hover:underline">
                {SITE.company.email}
            </a>
        ),
    },
];

// TODO: 법무 검토 후 확정본으로 교체하세요. 아래는 상담 접수 기준의 초안입니다.
export default function PrivacyPage() {
    const crumbs = [
        { name: "홈", href: "/" },
        { name: "개인정보처리방침", href: "/privacy" },
    ];
    return (
        <>
            <PageHero size="compact" crumbs={crumbs} title="개인정보처리방침" />

            <section className="py-12 sm:py-16">
                <Container>
                    <div className="max-w-[40em] text-[16.5px] leading-[1.85] text-ink-2">
                        <p>
                            {SITE.company.legalName}(이하 &quot;회사&quot;)는 상담 접수 및 업체 연결을 위해 아래와 같이 개인정보를 처리합니다.
                        </p>
                        {SECTIONS.map((s) => (
                            <section key={s.h} className="mt-10">
                                <h2 className="text-[19px] font-bold text-ink sm:text-[20px]">{s.h}</h2>
                                <p className="mt-3">{s.p}</p>
                            </section>
                        ))}
                    </div>
                </Container>
            </section>
        </>
    );
}
