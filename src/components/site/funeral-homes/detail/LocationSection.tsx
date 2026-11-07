import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { kakaoMapUrl, naverMapUrl, type FuneralHome } from "@/lib/site/funeral-homes";
import { ICON_STROKE, pillClass } from "../../ui";
import { DetailSection, OutLink, SourceLink, Unknown } from "./bits";
import { NEAR_REGION_MAX_KM, formatKm, isCapitalArea, nearestServiceRegions } from "./content";

/**
 * 위치·오시는 길: 공식 목록 소재지, 지도 버튼 2개, 오시는 길·주차(홈페이지 기준).
 * 서울·경기·인천 업체는 포온이 장례를 안내하는 지역 중 직선거리 25km 안의 가까운 곳(최대 4곳)을 잇습니다.
 * 차로 걸리는 시간은 시내 속도로 추정하므로 20km 이하에서만 적습니다.
 */
export function LocationSection({ home: h }: { home: FuneralHome }) {
    const regions = isCapitalArea(h) ? nearestServiceRegions(h, 4) : [];
    const mapBtn = pillClass({ tone: "onLight", variant: "ghost", size: "md" });

    return (
        <DetailSection id="location" title="위치·오시는 길">
            <div>
                <p className="text-[13px] text-ink-3">공식 목록 소재지</p>
                <p className="mt-1.5 text-pretty text-[19px] font-bold leading-snug text-ink sm:text-[20px]">{h.address}</p>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-3">
                    {h.addressComplete ? "" : "번지가 없는 소재지라 "}지도 버튼은 업체명과 소재지로 검색합니다.
                </p>
                <div className="mt-5 flex flex-wrap gap-2.5">
                    <OutLink href={naverMapUrl(h)} className={mapBtn}>
                        <MapPin className="h-4 w-4 shrink-0" strokeWidth={ICON_STROKE} aria-hidden />
                        네이버 지도
                    </OutLink>
                    <OutLink href={kakaoMapUrl(h)} className={mapBtn}>
                        <MapPin className="h-4 w-4 shrink-0" strokeWidth={ICON_STROKE} aria-hidden />
                        카카오맵
                    </OutLink>
                </div>
            </div>

            <dl className="mt-9 divide-y divide-line border-y border-line">
                <div className="grid gap-x-6 gap-y-1.5 py-4 sm:grid-cols-[7rem_minmax(0,1fr)]">
                    <dt className="text-[15px] font-semibold text-ink">오시는 길</dt>
                    <dd className="text-[15px] leading-relaxed text-ink-2">
                        {h.access.length ? (
                            <ul className="space-y-1.5">
                                {h.access.map((a) => (
                                    <li key={a.text}>
                                        {a.text}
                                        <SourceLink href={a.sourceUrl} what="오시는 길" className="ml-1.5" />
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <Unknown />
                        )}
                    </dd>
                </div>
                <div className="grid gap-x-6 gap-y-1.5 py-4 sm:grid-cols-[7rem_minmax(0,1fr)]">
                    <dt className="text-[15px] font-semibold text-ink">주차</dt>
                    <dd className="text-[15px] leading-relaxed text-ink-2">
                        {h.parking ? (
                            <>
                                {h.parking.text}
                                <SourceLink href={h.parking.sourceUrl} what="주차" className="ml-1.5" />
                            </>
                        ) : (
                            <Unknown />
                        )}
                    </dd>
                </div>
            </dl>

            {regions.length > 0 && (
                <div className="mt-12">
                    <h3 className="text-[18px] font-bold text-ink">이 장례식장에서 가까운 동네</h3>
                    <p className="mt-2 max-w-[60ch] text-[14.5px] leading-relaxed text-ink-2">
                        포온이 장례를 안내하는 서울·경기 지역 가운데 직선거리 {NEAR_REGION_MAX_KM}km 안에 있는 {regions.length}곳입니다. 동네별 허가 업체와 비용 안내로 이어집니다.
                    </p>
                    <ul className="mt-5 grid border-b border-line sm:grid-cols-2 sm:gap-x-8">
                        {regions.map(({ region: r, km, minutes }) => (
                            <li key={`${r.sido}/${r.slug}`}>
                                <Link
                                    href={`/funeral/${r.sido}/${r.slug}`}
                                    className="group flex items-center justify-between gap-4 border-t border-line py-4 transition-colors hover:border-ink/50 motion-reduce:transition-none"
                                >
                                    <span className="min-w-0">
                                        <span className="block text-[15.5px] font-semibold text-ink">{r.name} 반려동물 장례식장</span>
                                        <span className="mt-0.5 block text-[13px] tabular-nums text-ink-3">
                                            {/* 좌표가 시·군청 기준 대략값이면 가까운 거리는 실제와 크게 다를 수 있어 "같은 시·군"으로만 */}
                                            {km < 3 && h.geo === "approx"
                                                ? "같은 시·군"
                                                : km <= 20
                                                  ? `약 ${formatKm(km)}km, 차로 약 ${minutes[0]}~${minutes[1]}분`
                                                  : `직선거리 약 ${formatKm(km)}km`}
                                        </span>
                                    </span>
                                    <ArrowRight
                                        className="h-4 w-4 shrink-0 text-ink-3 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
                                        strokeWidth={ICON_STROKE}
                                        aria-hidden
                                    />
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <p className="mt-3 text-[12.5px] leading-relaxed text-ink-3">
                        직선거리 기준 추정입니다. 동네는 구·시청, 업체는 {h.geo === "address" ? "주소" : "시·군·구청 기준 대략"} 위치로 계산해 실제 길과 다를 수 있어요.
                    </p>
                </div>
            )}
        </DetailSection>
    );
}
