import type { Metadata } from "next";
import { FUNERAL_HOMES, funeralHomesBySido, funeralHomesPath, funeralSidoList, funeralSidoPath, ogImagePath } from "@/lib/site/funeral-homes";
import { metaWithImage } from "@/lib/site/seo";
import { getService } from "@/lib/site/services";
import { faqLd } from "@/lib/site/schema";
import { Reveal } from "@/components/site/Reveal";
import { ConsultSection } from "@/components/site/sections";
import { Container, FaqList, JsonLd } from "@/components/site/ui";
import { DirectoryHero } from "@/components/site/funeral-homes/DirectoryHero";
import { AnchorTitle } from "@/components/site/funeral-homes/listing/AnchorTitle";
import { CapitalLists } from "@/components/site/funeral-homes/listing/CapitalLists";
import { ChecklistSection } from "@/components/site/funeral-homes/listing/ChecklistSection";
import { CAPITAL_SIDO, CHECKED_DOT, hubDescription, hubFaqs } from "@/components/site/funeral-homes/listing/copy";
import { ListingHeroActions } from "@/components/site/funeral-homes/listing/HeroActions";
import { collectionPageLd, listingBreadcrumbLd } from "@/components/site/funeral-homes/listing/ld";
import { SidoIndex } from "@/components/site/funeral-homes/listing/SidoIndex";
import { SourceNote } from "@/components/site/funeral-homes/listing/SourceNote";

const PATH = funeralHomesPath();
const H1 = "전국 반려동물 장례식장 찾기";
const title = () => `전국 반려동물 장례식장 ${FUNERAL_HOMES.length}곳 | 허가 업체 시·도별 목록`;
const imageAlt = () => `전국 반려동물 장례식장 ${FUNERAL_HOMES.length}곳, 시·도별 허가 업체 목록`;

export function generateMetadata(): Metadata {
    return metaWithImage({
        title: title(),
        description: hubDescription(),
        path: PATH,
        imageAlt: imageAlt(),
        keywords: ["반려동물 장례식장", "강아지 장례식장", "고양이 장례식장", "동물장묘업 허가 업체", "반려동물 화장장"],
    });
}

export default function FuneralHomesHubPage() {
    const total = FUNERAL_HOMES.length;
    const sidoList = funeralSidoList();
    const crumbs = [
        { name: "홈", href: "/" },
        { name: "반려동물 장례식장 찾기", href: PATH },
    ];
    const faqs = hubFaqs();
    const funeral = getService("funeral");
    const capitalTotal = CAPITAL_SIDO.reduce((n, s) => n + funeralHomesBySido(s).length, 0);

    return (
        <>
            <JsonLd
                data={[
                    listingBreadcrumbLd(crumbs),
                    collectionPageLd({ path: PATH, name: H1, description: hubDescription(), itemPaths: sidoList.map((s) => funeralSidoPath(s.slug)) }),
                    faqLd(faqs),
                ]}
            />

            <DirectoryHero
                crumbs={crumbs}
                meta={`공식 허가 목록 · 확인일 ${CHECKED_DOT}`}
                title={H1}
                subtitle={`공식 허가 목록 ${total}곳을 시·도별로 정리했습니다`}
                actions={<ListingHeroActions findHref="#sido" />}
                image={{ src: ogImagePath(PATH, "square"), alt: imageAlt() }}
            />

            {/* 시·도 바로가기 (표처럼 구분선 목록) */}
            <section className="py-16 sm:py-20">
                <Container className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-14">
                    <AnchorTitle
                        id="sido"
                        lead={
                            <>
                                {sidoList.length}개 시·도의 허가 업체 수입니다. 시·도를 고르면 <span className="whitespace-nowrap">시·군·구별</span> 목록으로 이어지고,
                                수도권(서울·경기·인천) {capitalTotal}곳은 바로 아래에 전체 목록을 두었습니다.
                            </>
                        }
                    >
                        시·도별 반려동물 장례식장
                    </AnchorTitle>
                    <SidoIndex />
                </Container>
            </section>

            {/* 수도권 전체 목록 */}
            <CapitalLists />

            <ChecklistSection />

            <Reveal as="section" className="py-16 sm:py-20">
                <Container className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-14">
                    <AnchorTitle id="faq">반려동물 장례식장 자주 묻는 질문</AnchorTitle>
                    <div>
                        <FaqList faqs={faqs} />
                        <SourceNote className="mt-12" />
                    </div>
                </Container>
            </Reveal>

            {funeral && <ConsultSection service={funeral} />}
        </>
    );
}
