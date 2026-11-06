import type { Metadata } from "next";
import { REGIONS } from "@/lib/site/regions";
import { breadcrumbLd } from "@/lib/site/schema";
import { RegionLinkGrid } from "@/components/site/sections";
import { Breadcrumbs, Container, JsonLd, SectionTitle } from "@/components/site/ui";
import { RegionPicker } from "@/components/site/RegionPicker";

export const metadata: Metadata = {
    title: "지역별 반려동물 서비스 찾기 · 서울 25개 구·경기 주요 도시",
    description: "서울 25개 구와 경기 주요 도시의 생활권·동네 기준으로 반려동물 장례, 애견미용 등 가까운 서비스를 찾아보세요.",
    alternates: { canonical: "/area" },
};

export default function AreaIndexPage() {
    const crumbs = [
        { name: "홈", href: "/" },
        { name: "지역별 찾기", href: "/area" },
    ];
    return (
        <>
            <JsonLd data={breadcrumbLd(crumbs)} />
            <Container className="pt-6">
                <Breadcrumbs items={crumbs} />
            </Container>
            <section className="py-12 sm:py-16">
                <Container className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
                    <SectionTitle
                        eyebrow="지역별 찾기"
                        title={<span className="text-[34px] sm:text-[44px]">우리 동네 반려동물 서비스</span>}
                        lead={`서울 25개 구와 경기 ${REGIONS.filter((r) => r.sido === "gyeonggi").length}개 도시, 생활권 단위로 안내합니다. 지역을 고르면 그 동네 기준으로 장례·미용 정보를 보여드려요.`}
                    />
                    <RegionPicker regions={REGIONS.map(({ sido, slug, name, lat, lng }) => ({ sido, slug, name, lat, lng }))} />
                </Container>
            </section>
            <section className="pb-8">
                <Container>
                    <RegionLinkGrid hrefFor={(r) => `/area/${r.sido}/${r.slug}`} />
                </Container>
            </section>
        </>
    );
}
