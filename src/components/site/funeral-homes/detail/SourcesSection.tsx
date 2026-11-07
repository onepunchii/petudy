import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import type { FuneralHome } from "@/lib/site/funeral-homes";
import { ICON_STROKE } from "../../ui";
import { DetailSection, OutLink, Unknown } from "./bits";
import { dotDate, foundSiteUrl, homepageSourceUrls, prettyUrl, registrySource } from "./content";

const outClass =
    "text-ink-2 underline decoration-line underline-offset-[3px] transition-colors hover:text-ink hover:decoration-ink-3 motion-reduce:transition-none";

/** 출처와 정보 수정: 공식 목록, 확인한 홈페이지 주소(중복 제거), 확인일, 제휴 아님, 수정 요청 */
export function SourcesSection({ home: h }: { home: FuneralHome }) {
    const registry = registrySource(h);
    const urls = homepageSourceUrls(h);

    return (
        <DetailSection id="sources" title="출처와 정보 수정">
            <dl className="divide-y divide-line border-y border-line text-[14.5px] leading-relaxed">
                <div className="grid gap-x-6 gap-y-1 py-4 sm:grid-cols-[8rem_minmax(0,1fr)]">
                    <dt className="font-semibold text-ink">공식 목록</dt>
                    <dd>
                        <OutLink href={registry.url} className={outClass}>
                            {registry.label}
                            <ExternalLink className="ml-1 inline-block h-3.5 w-3.5 align-[-2px]" strokeWidth={ICON_STROKE} aria-hidden />
                        </OutLink>
                        <p className="mt-1 text-[13px] text-ink-3">업체명, 소재지, 전화, 시설 종류, 홈페이지 주소</p>
                    </dd>
                </div>
                <div className="grid gap-x-6 gap-y-1 py-4 sm:grid-cols-[8rem_minmax(0,1fr)]">
                    <dt className="font-semibold text-ink">확인한 홈페이지</dt>
                    <dd>
                        {urls.length ? (
                            <>
                                <ul className="space-y-1">
                                    {urls.map((u) => (
                                        <li key={u}>
                                            <OutLink href={u} className={`${outClass} [overflow-wrap:anywhere]`}>
                                                {prettyUrl(u)}
                                            </OutLink>
                                        </li>
                                    ))}
                                </ul>
                                <p className="mt-1 text-[13px] text-ink-3">
                                    서비스, 운영 시간, 가격, 오시는 길
                                    {foundSiteUrl(h) && ". 공식 목록에 홈페이지가 없어 상호로 찾은 사이트 기준"}
                                </p>
                            </>
                        ) : (
                            <Unknown>홈페이지에서 옮긴 내용 없음</Unknown>
                        )}
                    </dd>
                </div>
                <div className="grid gap-x-6 gap-y-1 py-4 sm:grid-cols-[8rem_minmax(0,1fr)]">
                    <dt className="font-semibold text-ink">확인일</dt>
                    <dd className="tabular-nums text-ink-2">
                        <time dateTime={h.checkedAt}>{dotDate(h.checkedAt)}</time>
                    </dd>
                </div>
            </dl>

            <p className="mt-6 max-w-[62ch] text-[15px] leading-relaxed text-ink-2">
                포온은 이 업체와 제휴 관계가 아닙니다. 가격과 서비스는 업체 사정에 따라 바뀔 수 있어, 방문이나 예약 전에 업체에 다시 확인해 주세요.
            </p>
            <Link
                href="/contact"
                className="group mt-4 inline-flex items-center gap-1.5 text-[15px] font-semibold text-ink underline decoration-ink/25 underline-offset-4 hover:decoration-ink"
            >
                정보가 다르면 알려 주세요
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" strokeWidth={ICON_STROKE} aria-hidden />
            </Link>
        </DetailSection>
    );
}
