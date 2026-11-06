import type { Metadata } from "next";
import Link from "next/link";
import { GUIDES } from "@/lib/site/guides";
import { getService, liveServices } from "@/lib/site/services";
import { breadcrumbLd } from "@/lib/site/schema";
import { Breadcrumbs, Container, JsonLd, SectionTitle } from "@/components/site/ui";

export const metadata: Metadata = {
    title: "보호자 가이드 · 반려동물 장례·미용 알아두면 좋은 것",
    description: "강아지·고양이가 떠났을 때 해야 할 일, 장례 비용, 합법 장례식장 확인법, 유골 모시는 방법, 미용 주기와 가격까지. 보호자가 처음 겪는 순간을 위한 가이드.",
    alternates: { canonical: "/guide" },
};

export default function GuideIndexPage() {
    const crumbs = [
        { name: "홈", href: "/" },
        { name: "보호자 가이드", href: "/guide" },
    ];
    return (
        <>
            <JsonLd data={breadcrumbLd(crumbs)} />
            <Container className="pt-6">
                <Breadcrumbs items={crumbs} />
                <div className="py-12 sm:py-16">
                    <SectionTitle
                        eyebrow="보호자 가이드"
                        title={<span className="text-[34px] sm:text-[44px]">처음 겪는 순간을 위한 안내서</span>}
                        lead="법령과 공식 자료를 근거로, 보호자 입장에서 꼭 필요한 것만 정리했습니다."
                    />
                </div>
                {liveServices().map((s) => (
                    <section key={s.slug} className="pb-14">
                        <h2 className="text-[20px] font-bold text-ink">{s.name}</h2>
                        <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {GUIDES.filter((g) => g.service === s.slug).map((g) => (
                                <li key={g.slug}>
                                    <Link href={`/guide/${g.slug}`} className="group flex h-full flex-col rounded-3xl bg-white p-6 ring-1 ring-line hover:ring-ink/20">
                                        <p className="text-[16.5px] font-bold leading-snug text-ink group-hover:text-pine">{g.title}</p>
                                        <p className="mt-3 line-clamp-3 text-[14px] leading-relaxed text-ink-2">{g.description}</p>
                                        <span className="mt-auto pt-4 text-[12.5px] text-ink-3">{getService(g.service)?.short} · {g.updated} 업데이트</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </section>
                ))}
            </Container>
        </>
    );
}
