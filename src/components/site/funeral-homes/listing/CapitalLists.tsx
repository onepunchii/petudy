import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FUNERAL_SIDO, funeralSidoPath } from "@/lib/site/funeral-homes";
import { Container, ICON_STROKE } from "../../ui";
import { FuneralHomeList } from "../FuneralHomeList";
import { AnchorTitle } from "./AnchorTitle";
import { CapitalLinks } from "./CapitalLinks";
import { CAPITAL_SIDO, hasManyTowns, homesInGroupOrder, townSentence } from "./copy";

/**
 * 전체 목록의 수도권(서울·경기·인천) 전체 업체. 포온 상담 지역이라 먼저 보여 줍니다.
 * 시·도마다 h2(ASCII id = 시·도 slug) + FuneralHomeList. 업체 순서는 시군구 묶음 순(업체 많은 곳 먼저).
 * 바로 위 시·도 바로가기 섹션의 안내 문단이 이 목록을 소개하므로 따로 제목을 두지 않습니다.
 */
export function CapitalLists() {
    const blocks = CAPITAL_SIDO.map((s) => ({ sido: s, homes: homesInGroupOrder(s) })).filter((b) => b.homes.length > 0);
    const total = blocks.reduce((n, b) => n + b.homes.length, 0);
    return (
        <section aria-label={`수도권 반려동물 장례식장 ${total}곳`} className="pb-16 sm:pb-20">
            <Container>
                <div className="grid gap-14">
                    {blocks.map(({ sido, homes }) => (
                        <div key={sido} className="grid gap-6 border-t border-line pt-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-14">
                            {/* 경기처럼 목록이 길면 제목 칸이 비어 보이지 않도록 lg 에서 따라 내려옵니다 */}
                            <div className="lg:sticky lg:top-24 lg:self-start">
                                <AnchorTitle id={sido} size="block" lead={`공식 목록 기준으로 ${townSentence(sido)}`}>
                                    {FUNERAL_SIDO[sido].name} 반려동물 장례식장 <span className="tabular-nums">{homes.length}곳</span>
                                </AnchorTitle>
                                <Link
                                    href={funeralSidoPath(sido)}
                                    className="group mt-5 inline-flex items-center gap-1 text-[15px] font-semibold text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink"
                                >
                                    {hasManyTowns(sido) ? `${FUNERAL_SIDO[sido].short} 시·군·구별로 보기` : `${FUNERAL_SIDO[sido].short} 반려동물 장례식장 목록`}
                                    <ArrowRight
                                        className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
                                        strokeWidth={ICON_STROKE}
                                        aria-hidden
                                    />
                                </Link>
                            </div>
                            <FuneralHomeList homes={homes} />
                        </div>
                    ))}
                </div>
                <CapitalLinks className="mt-14" />
            </Container>
        </section>
    );
}
