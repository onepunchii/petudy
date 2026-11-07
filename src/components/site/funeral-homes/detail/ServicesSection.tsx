import { SERVICE_KEYS, SERVICE_LABEL, type FuneralHome } from "@/lib/site/funeral-homes";
import { DetailSection, SourceLink, StatusIcon, StatusText } from "./bits";
import { businessSiteUrls, dotDate, viewingLabel } from "./content";

/**
 * 서비스: 11개 항목의 홈페이지 안내 상태 (2열, 메모와 출처). 그 아래 그 밖의 안내(extras).
 * 상태 순서와 항목 순서는 모든 업체가 같게 둡니다(업체끼리 비교하기 쉽게).
 */
export function ServicesSection({ home: h }: { home: FuneralHome }) {
    const noneKnown = SERVICE_KEYS.every((k) => (h.services[k]?.status ?? "unknown") === "unknown");
    // 화장시설이 없는 업체(건조장 등)는 "화장 참관" 대신 "장례 참관"
    const label = (k: (typeof SERVICE_KEYS)[number]) => (k === "viewing" ? viewingLabel(h) : SERVICE_LABEL[k]);
    const fromHomepage = businessSiteUrls(h).length > 0;
    return (
        <DetailSection
            id="services"
            title="서비스"
            lead={
                noneKnown
                    ? "홈페이지에서 확인된 서비스 안내가 없습니다. 방문이나 예약 전에 아래 항목을 업체에 확인해 주세요."
                    : "업체 홈페이지에 안내된 내용을 항목별로 정리했습니다. 안내가 없는 항목은 하지 않는다는 뜻이 아닙니다."
            }
        >
            {noneKnown ? (
                // 11줄이 모두 "홈페이지 안내 없음"이면 같은 줄을 되풀이하지 않고 확인할 항목 이름만 한 줄로 둡니다
                <div className="border-y border-line py-4">
                    <p className="text-[13.5px] font-semibold text-ink-3">확인할 항목</p>
                    <p className="mt-1.5 text-[15px] leading-relaxed text-ink-2">{SERVICE_KEYS.map(label).join(" · ")}</p>
                </div>
            ) : (
            <ul className="grid border-b border-line sm:grid-cols-2 sm:gap-x-10">
                {SERVICE_KEYS.map((k) => {
                    const f = h.services[k] ?? { status: "unknown" as const, note: null, sourceUrl: null };
                    // "홈페이지에 OO 안내 없음" 같은 메모는 상태 글자와 같은 말이라 빼고, 정보가 있는 메모만 둡니다
                    const note = f.status === "unknown" && /안내 없음$/.test(f.note ?? "") ? null : f.note;
                    return (
                        <li key={k} className="flex gap-3 border-t border-line py-4">
                            <StatusIcon status={f.status} className="mt-[3px]" />
                            <div className="min-w-0 flex-1">
                                <p className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                                    <span className="text-[15.5px] font-semibold text-ink">{label(k)}</span>
                                    <StatusText status={f.status} />
                                </p>
                                {(note || f.sourceUrl) && (
                                    <p className="mt-1 text-[14px] leading-relaxed text-ink-2">
                                        {note}
                                        {f.sourceUrl && <SourceLink href={f.sourceUrl} what={label(k)} className={note ? "ml-1.5" : undefined} />}
                                    </p>
                                )}
                            </div>
                        </li>
                    );
                })}
            </ul>
            )}

            {h.extras.length > 0 && (
                <div className="mt-10">
                    <h3 className="text-[17px] font-bold text-ink">그 밖의 안내</h3>
                    <dl className="mt-3 divide-y divide-line border-y border-line">
                        {h.extras.map((e) => (
                            <div key={`${e.label}:${e.note}`} className="grid gap-x-6 gap-y-1 py-3.5 sm:grid-cols-[9rem_minmax(0,1fr)]">
                                <dt className="text-[15px] font-semibold text-ink">{e.label}</dt>
                                <dd className="text-[14.5px] leading-relaxed text-ink-2">
                                    {e.note}
                                    <SourceLink href={e.sourceUrl} what={e.label} className="ml-1.5" />
                                </dd>
                            </div>
                        ))}
                    </dl>
                </div>
            )}

            <p className="mt-5 text-[13px] text-ink-3">
                {fromHomepage ? "업체 홈페이지 기준이며 바뀔 수 있어요." : "공식 목록 기준이며 바뀔 수 있어요."} 확인일{" "}
                <time dateTime={h.checkedAt}>{dotDate(h.checkedAt)}</time>
            </p>
        </DetailSection>
    );
}
