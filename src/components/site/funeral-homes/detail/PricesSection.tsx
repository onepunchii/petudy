import Link from "next/link";
import { ArrowRight, Info } from "lucide-react";
import { formatWon, naverMapUrl, type FuneralHome } from "@/lib/site/funeral-homes";
import { ICON_STROKE } from "../../ui";
import { DetailSection, OutLink } from "./bits";
import { dotDate, prettyUrl } from "./content";

const inlineLink = "font-semibold text-pine underline decoration-pine/30 underline-offset-4 hover:decoration-pine";

const GUIDE_HREF = "/guide/pet-funeral-cost";
const GUIDE_LABEL = "반려동물 장례 비용 총정리";

/**
 * 비용: 홈페이지 공개 가격을 실제 <table>(항목, 금액, 포함 내용)로 둡니다.
 * 모바일(640px 미만)에서는 표를 유지한 채 줄마다 항목·금액 한 줄, 포함 내용 아래 줄로 쌓습니다.
 */
export function PricesSection({ home: h }: { home: FuneralHome }) {
    const has = h.prices.length > 0;
    const sources = [...new Set(h.prices.map((p) => p.sourceUrl))].sort();
    const seenAt = h.prices.map((p) => p.seenAt).sort().at(-1) ?? h.checkedAt;

    return (
        <DetailSection
            id="prices"
            title="비용"
            lead={
                has
                    ? `업체 홈페이지에 공개된 가격 ${h.prices.length}개 항목을 그대로 옮겼습니다.${h.priceFrom ? ` 장례·화장 공개 가격은 ${formatWon(h.priceFrom)}부터입니다(봉안·운구 같은 추가 항목과 할인·차감 조건 제외).` : " 기본 장례·화장 가격은 홈페이지에 공개되어 있지 않습니다."}`
                    : undefined
            }
        >
            {has ? (
                <>
                    <div className="overflow-hidden rounded-[20px] bg-pass ring-1 ring-line">
                        <table className="w-full text-left text-[15px] leading-[1.6] max-sm:block">
                            <caption className="sr-only">
                                {h.name} 공개 가격, 업체 홈페이지 기준, 확인일 {dotDate(seenAt)}
                            </caption>
                            <thead className="bg-paper-2 text-[13px] text-ink-2 max-sm:sr-only">
                                <tr>
                                    <th scope="col" className="py-3 pl-6 pr-3 font-semibold">
                                        항목
                                    </th>
                                    <th scope="col" className="px-3 py-3 text-right font-semibold">
                                        금액
                                    </th>
                                    <th scope="col" className="py-3 pl-3 pr-6 font-semibold">
                                        포함 내용
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-line max-sm:block">
                                {h.prices.map((p) => (
                                    <tr
                                        key={`${p.label}:${p.amount}`}
                                        className="max-sm:grid max-sm:grid-cols-[minmax(0,1fr)_auto] max-sm:gap-x-4 max-sm:gap-y-1 max-sm:px-5 max-sm:py-4"
                                    >
                                        <th scope="row" className="py-4 pl-6 pr-3 align-top font-semibold text-ink max-sm:p-0">
                                            {p.label}
                                        </th>
                                        <td className="px-3 py-4 text-right align-top font-semibold tabular-nums text-ink max-sm:max-w-[10.5rem] max-sm:p-0 sm:whitespace-nowrap">
                                            {p.amount}
                                        </td>
                                        <td className="py-4 pl-3 pr-6 align-top text-[14px] text-ink-2 max-sm:col-span-2 max-sm:p-0">
                                            {p.includes ?? <span className="text-ink-3">기재 없음</span>}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <p className="mt-4 text-[13px] leading-relaxed text-ink-3">
                        출처: 업체 홈페이지{" "}
                        {sources.map((u, i) => (
                            <span key={u}>
                                {i > 0 && ", "}
                                <OutLink href={u} className="underline [overflow-wrap:anywhere] decoration-line underline-offset-[3px] hover:text-ink hover:decoration-ink-3">
                                    {prettyUrl(u)}
                                </OutLink>
                            </span>
                        ))}
                        <span className="whitespace-nowrap">
                            {" "}
                            · 확인일 <time dateTime={seenAt}>{dotDate(seenAt)}</time>
                        </span>
                    </p>
                </>
            ) : (
                <div className="flex gap-3 rounded-[20px] bg-pine-soft p-5 sm:p-6">
                    <Info className="mt-0.5 h-5 w-5 shrink-0 text-pine" strokeWidth={ICON_STROKE} aria-hidden />
                    <div className="min-w-0">
                        <p className="text-[15.5px] font-bold text-ink">홈페이지에 공개된 가격이 없어요</p>
                        <p className="mt-1.5 max-w-[56ch] text-[14.5px] leading-relaxed text-ink-2">
                            {h.phone ? (
                                "비용은 업체에 전화로 확인해 주세요."
                            ) : (
                                <>
                                    공식 목록에 전화번호가 없어,{" "}
                                    <OutLink href={naverMapUrl(h)} className={inlineLink}>
                                        네이버 지도
                                    </OutLink>
                                    의 업체 정보로 확인하거나 포온 전화 상담으로 문의하실 수 있어요.
                                </>
                            )}{" "}
                            체중별 일반적인 비용 구성과 추가 항목은 가이드에 정리해 두었습니다.
                        </p>
                    </div>
                </div>
            )}

            <Link
                href={GUIDE_HREF}
                className="group mt-6 inline-flex items-center gap-1.5 text-[15px] font-semibold text-ink underline decoration-ink/25 underline-offset-4 hover:decoration-ink"
            >
                {GUIDE_LABEL}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" strokeWidth={ICON_STROKE} aria-hidden />
            </Link>
        </DetailSection>
    );
}
