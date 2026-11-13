import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MapPin, Phone } from "lucide-react";
import { FUNERAL_HOMES, funeralHomePath, getFuneralHome, naverMapUrl, placeLabel, telHref } from "@/lib/site/funeral-homes";
import { ShareButton } from "@/components/site/ShareButton";
import { RecordRecentHome, SaveHomeButton } from "@/components/site/funeral-homes/HomeShelf";
import { funeralHomeBreadcrumbLd, funeralHomeBusinessLd, funeralHomeCrumbs, funeralHomeImage, funeralHomeWebPageLd } from "@/lib/site/funeral-home-schema";
import { faqLd } from "@/lib/site/schema";
import { metaWithImage } from "@/lib/site/seo";
import { getService } from "@/lib/site/services";
import { DirectoryHero } from "@/components/site/funeral-homes/DirectoryHero";
import { TocNav } from "@/components/site/funeral-homes/TocNav";
import { DetailSection } from "@/components/site/funeral-homes/detail/bits";
import { DETAIL_TOC, detailDescription, detailFaqs, detailImageAlt, detailTitle } from "@/components/site/funeral-homes/detail/content";
import { DetailSidebar } from "@/components/site/funeral-homes/detail/DetailSidebar";
import { LocationSection } from "@/components/site/funeral-homes/detail/LocationSection";
import { NearbySection } from "@/components/site/funeral-homes/detail/NearbySection";
import { PricesSection } from "@/components/site/funeral-homes/detail/PricesSection";
import { ServicesSection } from "@/components/site/funeral-homes/detail/ServicesSection";
import { SourcesSection } from "@/components/site/funeral-homes/detail/SourcesSection";
import { OwnerSection } from "@/components/site/funeral-homes/detail/OwnerSection";
import { SummarySection } from "@/components/site/funeral-homes/detail/SummarySection";
import { ConsultSection } from "@/components/site/sections";
import { Container, FaqList, ICON_STROKE, JsonLd, pillClass } from "@/components/site/ui";

export const dynamicParams = false;
export const generateStaticParams = () => FUNERAL_HOMES.map((h) => ({ sido: h.sido, slug: h.slug }));

type Props = { params: Promise<{ sido: string; slug: string }> };

async function load(params: Props["params"]) {
    const { sido, slug } = await params;
    return getFuneralHome(sido, slug) ?? null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const h = await load(params);
    if (!h) return {};
    return metaWithImage({
        title: detailTitle(h),
        description: detailDescription(h),
        path: funeralHomePath(h),
        imageAlt: detailImageAlt(h),
        wide: true,
        keywords: [h.name, `${h.sigungu ?? h.sidoName} 반려동물 장례식장`, "반려동물 장례식장", "동물장묘업"],
    });
}

export default async function FuneralHomePage({ params }: Props) {
    const h = await load(params);
    if (!h) notFound();

    const funeral = getService("funeral")!;
    const title = detailTitle(h);
    const description = detailDescription(h);
    const imageAlt = detailImageAlt(h);
    const image = funeralHomeImage(h);
    const faqs = detailFaqs(h);
    const toc = [...DETAIL_TOC];

    return (
        <>
            <JsonLd data={[funeralHomeBreadcrumbLd(h), funeralHomeBusinessLd(h), funeralHomeWebPageLd(h, { title, description, imageAlt }), faqLd(faqs)]} />

            <RecordRecentHome id={h.id} />
            <DirectoryHero
                crumbs={funeralHomeCrumbs(h)}
                meta={h.facilityTypes.join(" · ")}
                title={h.name}
                subtitle={`${placeLabel(h)}의 허가 반려동물 장례식장`}
                image={{ src: image.path, alt: imageAlt }}
                actions={
                    <>
                        {h.phone && (
                            <a href={telHref(h.phone)} className={pillClass({ tone: "onNight", variant: "solid", accent: "white" })}>
                                <Phone className="h-4 w-4 shrink-0" strokeWidth={ICON_STROKE} aria-hidden />
                                업체에 전화
                                <span className="tabular-nums">{h.phone}</span>
                            </a>
                        )}
                        <a
                            href={naverMapUrl(h)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={pillClass({ tone: "onNight", variant: h.phone ? "ghost" : "solid", accent: "white" })}
                        >
                            <MapPin className="h-4 w-4 shrink-0" strokeWidth={ICON_STROKE} aria-hidden />
                            네이버 지도
                            <span className="sr-only"> (새 창)</span>
                        </a>
                        {/* 저장(이 기기, 3곳까지) → 저장한 장례식장 비교 */}
                        <SaveHomeButton id={h.id} name={h.name} />
                        {/* 장례는 가족과 상의해 정하는 일이 많아, 이 업체 정보를 바로 보낼 수 있게 */}
                        <ShareButton tone="onNight" label="가족에게 공유" title={`${h.name} · ${placeLabel(h)} 허가 반려동물 장례식장`} path={funeralHomePath(h)} />
                    </>
                }
            />

            <div className="pb-4 pt-8 sm:pt-12 lg:pt-16">
                <Container className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_260px] lg:gap-16">
                    <div className="min-w-0">
                        <TocNav items={toc} layout="inline" className="mb-10 sm:mb-12" />

                        <SummarySection home={h} />
                        <ServicesSection home={h} />
                        <PricesSection home={h} />
                        <LocationSection home={h} />
                        <NearbySection home={h} />
                        <DetailSection id="faq" title="자주 묻는 질문">
                            <FaqList faqs={faqs} />
                        </DetailSection>
                        <SourcesSection home={h} />
                        <OwnerSection home={h} />
                    </div>

                    <DetailSidebar toc={toc} />
                </Container>
            </div>

            <div className="mt-16 sm:mt-20">
                <ConsultSection service={funeral} />
            </div>
        </>
    );
}
