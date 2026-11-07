import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getGuide } from "@/lib/site/guides";
import { FUNERAL_HOMES } from "@/lib/site/funeral-homes";
import { cn } from "@/lib/utils";
import { Reveal } from "../../Reveal";
import { Container, ICON_STROKE } from "../../ui";
import { AnchorTitle } from "./AnchorTitle";
import { countWithPrices, countWithService } from "./copy";

/**
 * 전체 목록 "고르기 전에 확인할 것": 허가, 개별/합동 화장, 참관, 추가 비용.
 * 숫자는 데이터에서 계산합니다(홈페이지에 안내가 있는 업체 수). 가이드 링크 3개.
 */
export function ChecklistSection({ id = "check" }: { id?: string }) {
    const total = FUNERAL_HOMES.length;
    const items: { title: string; desc: string; guide?: string }[] = [
        {
            title: "허가 업체인가요",
            desc: `동물장묘업은 지자체 허가가 필요한 업종입니다. 이 목록의 ${total}곳은 모두 동물보호관리시스템 허가 현황에 올라 있는 업체입니다.`,
            guide: "licensed-pet-crematorium-check",
        },
        {
            title: "개별 화장인가요",
            desc: `한 아이만 따로 화장해 유골을 돌려받는 개별 화장인지, 여러 아이를 함께 화장하는 합동 화장인지 확인하세요. 홈페이지에 개별 화장 안내가 있는 곳은 ${total}곳 중 ${countWithService(FUNERAL_HOMES, "individualCremation")}곳입니다.`,
            guide: "individual-vs-group-cremation",
        },
        {
            title: "화장 과정을 볼 수 있나요",
            desc: `화장 과정을 곁에서 지켜보는 참관은 업체마다 다릅니다. 홈페이지에 참관 안내가 있는 곳은 ${countWithService(FUNERAL_HOMES, "viewing")}곳입니다.`,
        },
        {
            title: "추가 비용이 있나요",
            desc: `기본 장례 외에 수의, 유골함, 운구 같은 항목이 따로 붙을 수 있어요. 홈페이지에 가격을 공개한 곳은 ${countWithPrices(FUNERAL_HOMES)}곳이며, 업체 페이지에 정리했습니다.`,
            guide: "pet-funeral-cost",
        },
    ];

    return (
        <Reveal as="section" className="py-16 sm:py-20">
            <Container className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-14">
                <AnchorTitle id={id} lead="전화로 문의하기 전에 이 네 가지를 물어보면 업체끼리 비교하기 쉬워요. 업체 페이지에는 홈페이지에서 확인한 내용만 적었습니다.">
                    고르기 전에 확인할 것
                </AnchorTitle>
                <ol className="divide-y divide-line border-y border-line">
                    {items.map((it, i) => {
                        const g = it.guide ? getGuide(it.guide) : undefined;
                        return (
                            <li key={it.title} className="grid grid-cols-[2rem_minmax(0,1fr)] gap-x-4 py-6">
                                <span
                                    aria-hidden
                                    className={cn(
                                        "flex h-8 w-8 items-center justify-center rounded-full text-[13px] font-semibold tabular-nums",
                                        "bg-pass text-ink ring-1 ring-inset ring-line",
                                    )}
                                >
                                    {i + 1}
                                </span>
                                <div className="min-w-0 pt-0.5">
                                    <h3 className="text-[17px] font-bold text-ink">{it.title}</h3>
                                    <p className="mt-1.5 max-w-[60ch] text-[15px] leading-relaxed text-ink-2">{it.desc}</p>
                                    {g && (
                                        <Link
                                            href={`/guide/${g.slug}`}
                                            className="group mt-3 inline-flex items-start gap-1 text-[14.5px] font-semibold text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink"
                                        >
                                            {g.title}
                                            <ArrowRight
                                                className="mt-[3px] h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
                                                strokeWidth={ICON_STROKE}
                                                aria-hidden
                                            />
                                        </Link>
                                    )}
                                </div>
                            </li>
                        );
                    })}
                </ol>
            </Container>
        </Reveal>
    );
}
