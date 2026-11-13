import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
    FUNERAL_SIDO,
    funeralHomePath,
    funeralHomesPath,
    funeralSidoList,
    funeralSidoPath,
    isFuneralSido,
    ogImagePath,
    sigunguGroups,
    type FuneralSidoSlug,
} from "@/lib/site/funeral-homes";
import { metaWithImage } from "@/lib/site/seo";
import { getService } from "@/lib/site/services";
import { faqLd } from "@/lib/site/schema";
import { ConsultSection } from "@/components/site/sections";
import { Container, FaqList, JsonLd } from "@/components/site/ui";
import { DirectoryHero } from "@/components/site/funeral-homes/DirectoryHero";
import { toFilterRow } from "@/components/site/funeral-homes/FuneralHomeList";
import { FilteredHomeGroups } from "@/components/site/funeral-homes/FilteredHomeGroups";
import { ShelfLink } from "@/components/site/funeral-homes/HomeShelf";
import { TocNav, type TocItem } from "@/components/site/funeral-homes/TocNav";
import { AnchorTitle } from "@/components/site/funeral-homes/listing/AnchorTitle";
import { CapitalLinks } from "@/components/site/funeral-homes/listing/CapitalLinks";
import { CHECKED_DOT, groupLabel, hasManyTowns, isCapitalSido, seoulNote, sidoDescription, sidoFaqs } from "@/components/site/funeral-homes/listing/copy";
import { ListingHeroActions } from "@/components/site/funeral-homes/listing/HeroActions";
import { collectionPageLd, listingBreadcrumbLd } from "@/components/site/funeral-homes/listing/ld";
import { OtherSidoLinks } from "@/components/site/funeral-homes/listing/OtherSidoLinks";
import { SourceNote } from "@/components/site/funeral-homes/listing/SourceNote";

export const dynamicParams = false;
export const generateStaticParams = () => funeralSidoList().map((s) => ({ sido: s.slug }));

type Props = { params: Promise<{ sido: string }> };

function load(sido: string) {
    if (!isFuneralSido(sido)) return null;
    const groups = sigunguGroups(sido);
    const count = groups.reduce((n, g) => n + g.homes.length, 0);
    if (count === 0) return null;
    return { sido, groups, count };
}

const titleFor = (sido: FuneralSidoSlug, n: number) => `${FUNERAL_SIDO[sido].short} 반려동물 장례식장 ${n}곳 | 허가 업체 목록`;
const h1For = (sido: FuneralSidoSlug, n: number) => `${FUNERAL_SIDO[sido].name} 반려동물 장례식장 ${n}곳`;
const imageAltFor = (sido: FuneralSidoSlug, n: number) => `${FUNERAL_SIDO[sido].short} 반려동물 장례식장 ${n}곳, 허가 업체 목록`;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const d = load((await params).sido);
    if (!d) return {};
    const { short } = FUNERAL_SIDO[d.sido];
    return metaWithImage({
        title: titleFor(d.sido, d.count),
        description: sidoDescription(d.sido),
        path: funeralSidoPath(d.sido),
        imageAlt: imageAltFor(d.sido, d.count),
        keywords: [`${short} 반려동물 장례식장`, `${short} 강아지 장례식장`, `${short} 고양이 장례식장`, "동물장묘업 허가 업체"],
    });
}

export default async function FuneralSidoPage({ params }: Props) {
    const d = load((await params).sido);
    if (!d) notFound();
    const { sido, groups, count } = d;
    const { name } = FUNERAL_SIDO[sido];
    const path = funeralSidoPath(sido);
    const crumbs = [
        { name: "홈", href: "/" },
        { name: "반려동물 장례식장 찾기", href: funeralHomesPath() },
        { name, href: path },
    ];
    const faqs = sidoFaqs(sido);
    const funeral = getService("funeral");
    const capital = isCapitalSido(sido);
    const note = seoulNote(sido);

    // 목차: 시군구 묶음(id = sigunguSlug, 한 페이지 안에서 하나뿐) + 아래 섹션
    const toc: TocItem[] = [
        ...groups.map((g) => ({ id: g.slug, label: `${groupLabel(sido, g)} ${g.homes.length}곳` })),
        { id: "faq", label: "자주 묻는 질문" },
        { id: "other-sido", label: "다른 시·도" },
    ];

    return (
        <>
            <JsonLd
                data={[
                    listingBreadcrumbLd(crumbs),
                    collectionPageLd({
                        path,
                        name: h1For(sido, count),
                        description: sidoDescription(sido),
                        itemPaths: groups.flatMap((g) => g.homes.map(funeralHomePath)),
                    }),
                    faqLd(faqs),
                ]}
            />

            <DirectoryHero
                crumbs={crumbs}
                meta={`공식 허가 목록 · 확인일 ${CHECKED_DOT}`}
                title={h1For(sido, count)}
                subtitle={
                    hasManyTowns(sido) ? (
                        <>
                            가까운 곳에서 배웅할 수 있도록, 허가 업체를 <span className="whitespace-nowrap">시·군·구별로</span> 정리했습니다
                        </>
                    ) : (
                        "가까운 곳에서 배웅할 수 있도록, 허가 업체를 정리했습니다"
                    )
                }
                actions={<ListingHeroActions findHref="#list" />}
                image={{ src: ogImagePath(path, "square"), alt: imageAltFor(sido, count) }}
            />

            <section id="list" className="scroll-mt-16 pb-16 pt-8 sm:pb-20 sm:pt-12 lg:pt-16">
                <Container>
                    <TocNav items={toc} layout="inline" />

                    {/* 목차는 상세·가이드 페이지와 같이 오른쪽 sticky 칸에 둡니다. 항목이 많아 화면 높이를 넘으면 칸 안에서 스크롤 */}
                    <div className="mt-10 lg:mt-0 lg:grid lg:grid-cols-[minmax(0,1fr)_220px] lg:gap-16">
                        <div className="min-w-0">
                            <p className="max-w-[62ch] text-[15.5px] leading-relaxed text-ink-2">
                                {name} 허가 동물장묘업체 {count}곳입니다. 업체명, 소재지, 전화, 시설 종류는 공식 목록에서, 서비스와 공개 가격은 각 업체 홈페이지에서
                                확인했습니다(확인일 {CHECKED_DOT}). 홈페이지에 안내가 없는 내용은 업체에 직접 확인해 주세요.
                            </p>
                            {note && <p className="mt-4 max-w-[62ch] text-[15.5px] leading-relaxed text-ink-2">{note}</p>}
                            <ShelfLink className="mt-6 max-w-[62ch]" />

                            {/* 조건 거르기(24시간 접수·참관·대형견·가격) + 시·군·구별 목록. 서버 HTML 에는 전체 목록이 있습니다 */}
                            <FilteredHomeGroups groups={groups.map((g) => ({ slug: g.slug, label: groupLabel(sido, g), rows: g.homes.map(toFilterRow) }))} />

                            {capital && <CapitalLinks className="mt-16" />}

                            <div className="mt-20">
                                <AnchorTitle id="faq">{FUNERAL_SIDO[sido].short} 반려동물 장례식장 자주 묻는 질문</AnchorTitle>
                                <div className="mt-8">
                                    <FaqList faqs={faqs} />
                                </div>
                            </div>

                            <div className="mt-20">
                                <AnchorTitle id="other-sido" size="block">
                                    다른 시·도 장례식장
                                </AnchorTitle>
                                <OtherSidoLinks current={sido} className="mt-6" />
                            </div>

                            <SourceNote className="mt-16" />
                        </div>

                        <div className="hidden lg:block">
                            <div className="sticky top-24 max-h-[calc(100dvh-7rem)] overflow-y-auto overscroll-contain pb-4">
                                <TocNav items={toc} layout="sidebar" />
                            </div>
                        </div>
                    </div>
                </Container>
            </section>

            {funeral && <ConsultSection service={funeral} />}
        </>
    );
}
