import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { formatWon, funeralHomePath, funeralHomesPath, funeralSidoPath, shortPlaceLabel } from "@/lib/site/funeral-homes";
import { COST_PATH, COST_WEIGHT_KG, costBySido, costSummary, type CostPick, type SidoCost } from "@/lib/site/funeral-cost";
import { metaWithImage } from "@/lib/site/seo";
import { getService } from "@/lib/site/services";
import { faqLd } from "@/lib/site/schema";
import { ConsultSection } from "@/components/site/sections";
import { Container, FaqList, ICON_STROKE, JsonLd, SectionTitle } from "@/components/site/ui";
import { listingBreadcrumbLd } from "@/components/site/funeral-homes/listing/ld";
import { OutLink } from "@/components/site/funeral-homes/detail/bits";
import { dotDate, prettyUrl } from "@/components/site/funeral-homes/detail/content";
import { PageHero } from "../../_components/PageHero";

/*
 * 반려동물 장례 비용 비교. 밤(배웅하는 날) 화면이라 라임·캐릭터를 쓰지 않습니다.
 * 업체 공개 가격만, 체중 4kg 아이의 기본 장례로 맞춰 시·도별로 보여 줍니다(기준은 src/lib/site/funeral-cost.ts).
 * 시·도마다 따로 페이지를 만들지 않고 한 페이지에 모읍니다(얇은 페이지를 늘리지 않음).
 */

const H1 = "반려동물 장례 비용 비교";
const won = (n: number | null) => (n === null ? "-" : formatWon(n));
const pickWon = (p: CostPick) => `${formatWon(p.won)}${p.from ? "부터" : ""}`;

function description() {
    const s = costSummary();
    return `허가 반려동물 장례식장 ${s.compared}곳이 홈페이지에 공개한 가격을 체중 ${COST_WEIGHT_KG}kg 아이의 기본 장례로 맞춰 시·도별로 비교했습니다. ${won(s.min)}부터 ${won(s.max)}까지, 가운데 값 ${won(s.median)}. 항목·출처·확인일 포함.`;
}

export function generateMetadata(): Metadata {
    return metaWithImage({
        title: `${H1} | 허가 장례식장 공개 가격, 체중 ${COST_WEIGHT_KG}kg 기준`,
        description: description(),
        path: COST_PATH,
        imageAlt: `반려동물 장례 비용 비교, 허가 장례식장 공개 가격 체중 ${COST_WEIGHT_KG}kg 기준`,
        keywords: ["반려동물 장례 비용", "강아지 장례 비용", "고양이 장례 비용", "반려동물 화장 비용", "반려동물 장례식장 가격 비교"],
    });
}

const FAQS = [
    {
        q: `왜 체중 ${COST_WEIGHT_KG}kg 기준인가요?`,
        a: `업체마다 가격표의 체중 구간과 패키지 이름이 달라 그대로는 비교하기 어렵습니다. 그래서 작은 강아지나 고양이를 예로 들어 ${COST_WEIGHT_KG}kg으로 맞추고, 그 체중의 아이가 받을 수 있는 가장 기본적인 장례·화장 가격을 골랐습니다. 아이 체중이 다르면 각 업체 화면의 전체 가격표를 보세요.`,
    },
    {
        q: "표의 가격이 최종 비용인가요?",
        a: "아닙니다. 업체 홈페이지에 공개된 기본 가격입니다. 유골함·메모리얼 스톤·봉안·운구·야간 접수 같은 선택 항목은 따로 붙고, 포함 내용과 부가세 표시도 업체마다 다릅니다. 연락할 때 총액을 먼저 물어보세요.",
    },
    {
        q: "가격이 안 보이는 업체는 왜 그런가요?",
        a: "홈페이지에 가격을 공개하지 않았거나, 체중 구간 없이 안내해 같은 조건으로 맞출 수 없는 곳입니다. 이런 곳도 모두 허가 업체이며 전화로 가격을 확인할 수 있습니다.",
    },
    {
        q: "가장 저렴한 곳을 고르면 되나요?",
        a: "가격만으로 정하지 않는 편이 좋습니다. 이동 거리, 개별 화장과 참관 가능 여부, 접수 시간, 포함 내용을 함께 보세요. 이 페이지의 업체는 모두 동물장묘업 허가를 받은 곳입니다.",
    },
];

function SidoTable({ c }: { c: SidoCost }) {
    return (
        <div className="overflow-hidden rounded-[20px] bg-pass ring-1 ring-line">
            <table className="w-full text-left text-[15px] leading-[1.6] max-sm:block">
                <caption className="sr-only">
                    {c.name} 허가 반려동물 장례식장 공개 가격, 체중 {COST_WEIGHT_KG}kg 기본 장례 기준, 낮은 가격 순
                </caption>
                <thead className="bg-paper-2 text-[13px] text-ink-2 max-sm:sr-only">
                    <tr>
                        <th scope="col" className="py-3 pl-6 pr-3 font-semibold">
                            업체
                        </th>
                        <th scope="col" className="px-3 py-3 text-right font-semibold">
                            {COST_WEIGHT_KG}kg 기본 장례
                        </th>
                        <th scope="col" className="py-3 pl-3 pr-6 font-semibold">
                            가격표 항목과 포함 내용
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-line max-sm:block">
                    {c.picks.map((p) => (
                        <tr key={p.home.id} className="max-sm:grid max-sm:grid-cols-[minmax(0,1fr)_auto] max-sm:gap-x-4 max-sm:gap-y-1.5 max-sm:px-5 max-sm:py-4">
                            <th scope="row" className="py-4 pl-6 pr-3 align-top font-normal max-sm:p-0">
                                <Link href={funeralHomePath(p.home)} className="font-semibold text-ink underline decoration-ink/20 underline-offset-4 hover:decoration-ink">
                                    {p.home.name}
                                </Link>
                                <span className="mt-0.5 block text-[13px] text-ink-3">{shortPlaceLabel(p.home)}</span>
                            </th>
                            <td className="px-3 py-4 text-right align-top text-[16px] font-bold tabular-nums text-ink max-sm:p-0 sm:whitespace-nowrap">{pickWon(p)}</td>
                            <td className="py-4 pl-3 pr-6 align-top text-[14px] text-ink-2 max-sm:col-span-2 max-sm:p-0">
                                <span className="font-semibold text-ink">{p.row.label}</span> {p.row.amount}
                                {p.row.includes && <span className="mt-0.5 block">{p.row.includes}</span>}
                                {p.surcharge && (
                                    <span className="mt-0.5 block text-ink-3">
                                        체중이 크면: {p.surcharge.label} {p.surcharge.amount}
                                    </span>
                                )}
                                <span className="mt-1 block text-[12.5px] text-ink-3">
                                    출처{" "}
                                    <OutLink href={p.row.sourceUrl} className="underline decoration-line underline-offset-[3px] [overflow-wrap:anywhere] hover:text-ink">
                                        {prettyUrl(p.row.sourceUrl)}
                                    </OutLink>{" "}
                                    · 확인 {dotDate(p.row.seenAt || p.home.checkedAt)}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default function FuneralCostPage() {
    const s = costSummary();
    const sidos = costBySido();
    const withPicks = sidos.filter((c) => c.picks.length > 0);
    const crumbs = [
        { name: "홈", href: "/" },
        { name: "반려동물 장례식장 찾기", href: funeralHomesPath() },
        { name: H1, href: COST_PATH },
    ];
    const funeral = getService("funeral");
    const linkCls = "group inline-flex min-h-11 items-center gap-1.5 text-[15px] font-semibold text-ink underline decoration-ink/25 underline-offset-4 hover:decoration-ink";

    return (
        <>
            <JsonLd data={[listingBreadcrumbLd(crumbs), faqLd(FAQS)]} />
            <PageHero size="compact" crumbs={crumbs} title={H1} subtitle="업체가 공개한 가격만, 같은 체중으로 맞춰 봤어요" />

            {/* 한눈에 보기: 검색 결과 요약에 쓰이기 좋은 세 줄 */}
            <section className="pt-12 sm:pt-14">
                <Container>
                    <div className="max-w-[68ch] rounded-[20px] bg-pass p-6 ring-1 ring-line sm:p-7">
                        <h2 className="text-[18px] font-bold text-ink">한눈에 보기</h2>
                        <ul className="mt-3 grid gap-2 text-[15.5px] leading-relaxed text-ink-2">
                            <li>
                                전국 허가 장례식장 {s.total}곳 중 홈페이지에 가격을 공개한 <b className="font-semibold text-ink">{s.compared}곳</b>을 같은 조건으로 맞춰 봤습니다.
                            </li>
                            <li>
                                체중 {COST_WEIGHT_KG}kg 아이의 기본 장례는 <b className="font-semibold text-ink">{won(s.min)}</b>부터{" "}
                                <b className="font-semibold text-ink">{won(s.max)}</b>까지, 가운데 값은 <b className="font-semibold text-ink">{won(s.median)}</b>입니다.
                            </li>
                            <li>
                                가격은 업체 홈페이지 기준이고{s.seenAt ? ` ${dotDate(s.seenAt)}에 확인했습니다` : " 줄마다 확인일을 적었습니다"}. 연락할 때 총액을 다시 확인하세요.
                            </li>
                        </ul>
                    </div>
                </Container>
            </section>

            {/* 시·도별 요약 */}
            <section className="pt-14 sm:pt-16">
                <Container>
                    <SectionTitle id="by-sido" title="시·도별 장례 비용" lead={`체중 ${COST_WEIGHT_KG}kg 아이의 기본 장례 공개 가격입니다. 시·도 이름을 누르면 업체별 가격으로 내려갑니다.`} />
                    <div className="mt-8 overflow-x-auto rounded-[20px] bg-pass ring-1 ring-line">
                        <table className="w-full min-w-[34rem] text-left text-[15px] leading-[1.6]">
                            <caption className="sr-only">시·도별 반려동물 장례 공개 가격 요약, 체중 {COST_WEIGHT_KG}kg 기본 장례 기준</caption>
                            <thead className="bg-paper-2 text-[13px] text-ink-2">
                                <tr>
                                    <th scope="col" className="py-3 pl-6 pr-3 font-semibold">
                                        시·도
                                    </th>
                                    <th scope="col" className="px-3 py-3 font-semibold">
                                        비교한 곳
                                    </th>
                                    <th scope="col" className="px-3 py-3 text-right font-semibold">
                                        가장 낮은
                                    </th>
                                    <th scope="col" className="px-3 py-3 text-right font-semibold">
                                        가운데
                                    </th>
                                    <th scope="col" className="py-3 pl-3 pr-6 text-right font-semibold">
                                        가장 높은
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-line">
                                {sidos.map((c) => (
                                    <tr key={c.sido}>
                                        <th scope="row" className="py-3.5 pl-6 pr-3 font-semibold">
                                            {c.picks.length > 0 ? (
                                                <a href={`#${c.sido}`} className="text-ink underline decoration-ink/20 underline-offset-4 hover:decoration-ink">
                                                    {c.short}
                                                </a>
                                            ) : (
                                                <span className="text-ink">{c.short}</span>
                                            )}
                                        </th>
                                        <td className="px-3 py-3.5 tabular-nums text-ink-2">
                                            {c.picks.length} / {c.total}곳
                                        </td>
                                        <td className="px-3 py-3.5 text-right tabular-nums text-ink">{won(c.min)}</td>
                                        <td className="px-3 py-3.5 text-right font-semibold tabular-nums text-ink">{won(c.median)}</td>
                                        <td className="py-3.5 pl-3 pr-6 text-right tabular-nums text-ink">{won(c.max)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <p className="mt-3 text-[13px] leading-relaxed text-ink-3">{"'비교한 곳'은 같은 조건으로 맞출 수 있었던 업체 수 / 그 시·도의 허가 업체 수입니다."}</p>
                </Container>
            </section>

            {/* 시·도별 업체 가격 */}
            {withPicks.map((c) => (
                <section key={c.sido} id={c.sido} className="scroll-mt-24 pt-16 sm:pt-20">
                    <Container>
                        <SectionTitle
                            title={`${c.name} 반려동물 장례 비용`}
                            lead={`${c.picks.length}곳 비교, ${won(c.min)}부터 ${won(c.max)}까지, 가운데 값 ${won(c.median)}. 낮은 가격 순입니다.`}
                        />
                        <div className="mt-8">
                            <SidoTable c={c} />
                        </div>
                        {(c.otherPriced.length > 0 || c.unpriced > 0) && (
                            <div className="mt-5 grid max-w-[68ch] gap-2 text-[14.5px] leading-relaxed text-ink-2">
                                {c.otherPriced.length > 0 && (
                                    <p>
                                        가격은 공개했지만 {COST_WEIGHT_KG}kg 기본 장례 조건이 따로 없어 비교에서 뺀 곳:{" "}
                                        {c.otherPriced.map((h, i) => (
                                            <span key={h.id}>
                                                {i > 0 && ", "}
                                                <Link href={funeralHomePath(h)} className="font-semibold text-ink underline decoration-ink/20 underline-offset-4 hover:decoration-ink">
                                                    {h.name}
                                                </Link>
                                            </span>
                                        ))}
                                    </p>
                                )}
                                {c.unpriced > 0 && <p>홈페이지에 가격을 공개하지 않은 허가 업체 {c.unpriced}곳은 전화로 확인할 수 있습니다.</p>}
                            </div>
                        )}
                        <Link href={funeralSidoPath(c.sido)} className={`${linkCls} mt-4`}>
                            {c.name} 장례식장 전체 목록
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" strokeWidth={ICON_STROKE} aria-hidden />
                        </Link>
                    </Container>
                </section>
            ))}

            {/* 비교 방법 */}
            <section className="pt-16 sm:pt-20">
                <Container>
                    <SectionTitle id="method" title="이렇게 비교했어요" />
                    <ul className="mt-6 grid max-w-[68ch] list-disc gap-2.5 pl-5 text-[15.5px] leading-relaxed text-ink-2 marker:text-ink-3">
                        <li>대상은 동물보호관리시스템 공식 목록의 허가 동물장묘업체 {s.total}곳 가운데 홈페이지에 가격을 공개한 곳입니다.</li>
                        <li>가격표 항목명에 적힌 체중 구간(이하·미만·기준)을 읽어, 체중 {COST_WEIGHT_KG}kg 아이가 받을 수 있는 가장 기본적인 장례·화장 항목 중 가장 낮은 금액을 골랐습니다.</li>
                        <li>메모리얼 스톤, 봉안, 수목장·산골, 운구·픽업, 야간 할증, 체중 추가, 비동행·공동 화장은 기본 비교에서 뺐습니다.</li>
                        <li>{"금액은 업체가 공개한 가격을 그대로 옮긴 것이고 포온이 정한 가격이 아닙니다. 할인가는 할인가 그대로, 범위로 적힌 금액은 낮은 쪽에 '부터'를 붙였습니다."}</li>
                        <li>가격은 바뀔 수 있습니다. 줄마다 적은 확인일을 보고, 연락할 때 다시 확인하세요.</li>
                    </ul>
                </Container>
            </section>

            <section className="pt-16 sm:pt-20">
                <Container>
                    <SectionTitle id="faq" title="자주 묻는 질문" />
                    <div className="mt-6 max-w-[68ch]">
                        <FaqList faqs={FAQS} />
                    </div>
                    <div className="mt-8 flex flex-wrap gap-x-6 gap-y-1">
                        <Link href="/guide/pet-funeral-cost" className={linkCls}>
                            반려동물 장례 비용 총정리
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" strokeWidth={ICON_STROKE} aria-hidden />
                        </Link>
                        <Link href="/guide/licensed-pet-crematorium-check" className={linkCls}>
                            허가 장례식장 확인하는 법
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" strokeWidth={ICON_STROKE} aria-hidden />
                        </Link>
                        <Link href={funeralHomesPath()} className={linkCls}>
                            전국 반려동물 장례식장 찾기
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" strokeWidth={ICON_STROKE} aria-hidden />
                        </Link>
                    </div>
                </Container>
            </section>

            {funeral && <ConsultSection service={funeral} />}
        </>
    );
}
