import { ExternalLink, Info, ShieldCheck } from "lucide-react";
import { telHref, type FuneralHome } from "@/lib/site/funeral-homes";
import { PassCard } from "../../PassCard";
import { ICON_STROKE } from "../../ui";
import { DetailSection, OutLink, SourceLink, Unknown } from "./bits";
import { NOT_LISTED_TEXT, businessSiteUrls, dotDate, foundSiteUrl, prettyUrl, registrySource } from "./content";

const linkClass = "font-semibold text-pine underline decoration-pine/30 underline-offset-4 hover:decoration-pine";

/**
 * 한눈에 보기: 요약 문단 + 탑승권 카드(본문 <dl>, 떼어내는 쪽은 공식 목록 등재 확인).
 * 주소·전화·운영 시간은 접지 않고 펼쳐 둡니다. 확인할 점(cautions)과 제휴 아님 안내를 카드 아래에 둡니다.
 */
export function SummarySection({ home: h }: { home: FuneralHome }) {
    const registry = registrySource(h);
    const fromSite = businessSiteUrls(h).length > 0;
    // 공식 목록에 홈페이지가 없어도 상호로 찾은 사이트에서 정보를 옮긴 경우가 있어, 그 사이트를 함께 밝힙니다
    const foundSite = foundSiteUrl(h);
    const rows: { label: string; value: React.ReactNode }[] = [
        { label: "업체명", value: <span className="font-semibold">{h.name}</span> },
        { label: "시설 종류", value: <>{h.facilityTypes.join(", ")}</> },
        {
            label: "소재지",
            value: (
                <>
                    {h.address}
                    {!h.addressComplete && <span className="mt-0.5 block text-[13px] text-ink-3">공식 목록 소재지, 번지 미기재</span>}
                </>
            ),
        },
        {
            label: "전화",
            value: h.phone ? (
                <a href={telHref(h.phone)} className={`${linkClass} tabular-nums`}>
                    {h.phone}
                </a>
            ) : (
                <Unknown>{NOT_LISTED_TEXT}</Unknown>
            ),
        },
        {
            label: "운영 시간",
            value: h.hours ? (
                <>
                    {h.hours.text} <SourceLink href={h.hours.sourceUrl} what="운영 시간" className="ml-1" />
                </>
            ) : (
                <Unknown />
            ),
        },
        {
            label: "주차",
            value: h.parking ? (
                <>
                    {h.parking.text} <SourceLink href={h.parking.sourceUrl} what="주차" className="ml-1" />
                </>
            ) : (
                <Unknown />
            ),
        },
        {
            label: "홈페이지",
            value: h.website ? (
                <OutLink href={h.website} className={`${linkClass} inline-flex flex-wrap items-baseline gap-x-2`}>
                    업체 홈페이지
                    <span className="text-[13px] font-normal text-ink-3 [overflow-wrap:anywhere]">{prettyUrl(h.website)}</span>
                </OutLink>
            ) : foundSite ? (
                <>
                    <Unknown>{NOT_LISTED_TEXT}</Unknown>
                    <span className="mt-0.5 block text-[13px] text-ink-3">
                        확인한 사이트:{" "}
                        <OutLink href={foundSite} className="underline decoration-line underline-offset-[3px] [overflow-wrap:anywhere] hover:text-ink">
                            {prettyUrl(foundSite)}
                        </OutLink>
                    </span>
                </>
            ) : (
                <Unknown>{NOT_LISTED_TEXT}</Unknown>
            ),
        },
    ];

    return (
        <DetailSection id="summary" title="한눈에 보기" className="mt-0 sm:mt-0">
            {h.summary && <p className="mb-7 max-w-[62ch] text-pretty text-[16.5px] leading-[1.8] text-ink">{h.summary}</p>}

            <PassCard
                radius="tile"
                aria-label={`${h.name} 기본 정보`}
                mainClassName="p-5 sm:p-7"
                stubClassName="sm:min-w-[11.5rem]"
                stub={
                    <div className="grid gap-3">
                        <p className="flex items-center gap-2 text-[15px] font-bold leading-snug text-ink sm:block">
                            <ShieldCheck className="h-5 w-5 shrink-0 text-pine sm:mb-3" strokeWidth={ICON_STROKE} aria-hidden />
                            공식 허가 목록 등재
                        </p>
                        <dl className="grid grid-cols-2 gap-2 text-[13px] leading-snug sm:grid-cols-1">
                            <div>
                                <dt className="text-ink-3">확인일</dt>
                                <dd className="mt-0.5 font-semibold tabular-nums text-ink">
                                    <time dateTime={h.checkedAt}>{dotDate(h.checkedAt)}</time>
                                </dd>
                            </div>
                            {h.officialListNo !== null && (
                                <div>
                                    <dt className="text-ink-3">목록 번호</dt>
                                    <dd className="mt-0.5 font-semibold tabular-nums text-ink">{h.officialListNo}번</dd>
                                </div>
                            )}
                        </dl>
                        <OutLink
                            href={registry.url}
                            className="inline-flex items-center gap-1 text-[13.5px] font-semibold text-ink-2 underline decoration-line underline-offset-4 hover:text-ink hover:decoration-ink-3"
                        >
                            공식 목록 보기
                            <ExternalLink className="h-3.5 w-3.5" strokeWidth={ICON_STROKE} aria-hidden />
                        </OutLink>
                    </div>
                }
            >
                <dl className="divide-y divide-line/80">
                    {rows.map((r) => (
                        <div key={r.label} className="grid grid-cols-[5.25rem_minmax(0,1fr)] gap-x-4 py-3 first:pt-0 last:pb-0 sm:grid-cols-[6rem_minmax(0,1fr)]">
                            <dt className="pt-px text-[13.5px] text-ink-3">{r.label}</dt>
                            <dd className="text-[15.5px] leading-relaxed text-ink">{r.value}</dd>
                        </div>
                    ))}
                </dl>
            </PassCard>

            {h.cautions.length > 0 && (
                <div className="mt-5 flex gap-3 rounded-[20px] bg-pine-soft p-5 sm:p-6">
                    <Info className="mt-0.5 h-5 w-5 shrink-0 text-pine" strokeWidth={ICON_STROKE} aria-hidden />
                    <div className="min-w-0">
                        <p className="text-[15px] font-bold text-ink">방문 전 확인할 점</p>
                        <ul className="mt-2 space-y-1.5 text-[14.5px] leading-relaxed text-ink-2">
                            {h.cautions.map((c) => (
                                <li key={c} className="flex gap-2">
                                    <span aria-hidden className="mt-[0.7em] h-1 w-1 shrink-0 rounded-full bg-ink-3" />
                                    {c}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            <p className="mt-5 max-w-[62ch] text-[13.5px] leading-relaxed text-ink-3">
                포온은 이 업체와 제휴 관계가 아닙니다.{" "}
                {fromSite ? "공식 목록과 업체 홈페이지에 공개된 내용만 옮겼습니다." : "공식 목록에 공개된 내용만 옮겼습니다."}
            </p>
        </DetailSection>
    );
}
