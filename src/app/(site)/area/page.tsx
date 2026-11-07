import type { Metadata } from "next";
import { REGIONS } from "@/lib/site/regions";
import { breadcrumbLd } from "@/lib/site/schema";
import { PassCard } from "@/components/site/PassCard";
import { RegionPicker } from "@/components/site/RegionPicker";
import { Reveal } from "@/components/site/Reveal";
import { RegionLinkGrid } from "@/components/site/sections";
import { CallButton, Container, JsonLd, PillLink, SectionTitle } from "@/components/site/ui";
import { PageHero } from "../_components/PageHero";

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
    const seoul = REGIONS.filter((r) => r.sido === "seoul").length;
    const gyeonggi = REGIONS.filter((r) => r.sido === "gyeonggi").length;

    return (
        <>
            <JsonLd data={breadcrumbLd(crumbs)} />

            <PageHero
                crumbs={crumbs}
                title={
                    <>
                        우리 동네
                        <br />
                        반려동물 서비스 찾기
                    </>
                }
                subtitle={`서울 ${seoul}개 구와 경기 ${gyeonggi}개 도시, 어디서 출발하든 가까운 곳부터 찾아 드립니다.`}
                aside={
                    <div className="lg:ml-auto lg:max-w-[440px]">
                        <RegionPicker regions={REGIONS.map(({ sido, slug, name, lat, lng }) => ({ sido, slug, name, lat, lng }))} variant="dark" />
                    </div>
                }
            />

            <Reveal as="section" className="py-14 sm:py-20">
                <Container>
                    <SectionTitle
                        title="구·시를 고르면 그 동네 기준으로 안내합니다"
                        lead="지역마다 생활권과 동네, 가까운 허가 장묘업체 방면, 미용실 연결 기준을 따로 정리했습니다."
                    />
                    <div className="mt-10">
                        <RegionLinkGrid hrefFor={(r) => `/area/${r.sido}/${r.slug}`} />
                    </div>
                </Container>
            </Reveal>

            <section className="pb-16 sm:pb-24">
                <Container>
                    <PassCard
                        radius="tile"
                        mainClassName="p-6 sm:p-8"
                        stubClassName="items-start gap-3 p-6 sm:items-stretch sm:p-7"
                        stub={
                            <>
                                <CallButton />
                                <PillLink href="/contact">상담 남기기</PillLink>
                            </>
                        }
                    >
                        <h2 className="text-[20px] font-bold leading-snug text-ink sm:text-[22px]">찾는 동네가 목록에 없나요?</h2>
                        <p className="mt-3 max-w-[52ch] text-[15.5px] leading-[1.8] text-ink-2">
                            아직 안내하지 않는 지역이라도 전화나 상담으로 계신 곳을 알려 주시면, 가능한 방법을 함께 찾아봅니다.
                        </p>
                    </PassCard>
                </Container>
            </section>
        </>
    );
}
