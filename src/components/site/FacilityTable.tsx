import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { FACILITY_AREAS, FACILITY_CHECKED_AT, FACILITY_REGISTRY_URL, type FacilityArea } from "@/lib/site/facilities";
import { FUNERAL_HOMES, funeralHomesPath, funeralSidoPath, sigunguGroups, type FuneralSidoSlug } from "@/lib/site/funeral-homes";
import type { FacilityDistance } from "@/lib/site/local";
import { cn } from "@/lib/utils";
import { PassCard } from "./PassCard";
import { ICON_STROKE } from "./ui";

const AREA_SIDO: Record<FacilityArea["sido"], FuneralSidoSlug> = { 경기: "gyeonggi", 인천: "incheon", 서울: "seoul" };

/**
 * 표의 지역 이름 → 장례식장 목록의 시군구 묶음 앵커 (예: /funeral-homes/gyeonggi#gimpo, /funeral-homes/incheon#seo-gu).
 * 이름이 목록의 시군구와 정확히 맞을 때만 링크합니다. 맞지 않으면 글자로만 둡니다.
 */
const DIRECTORY_HREF = new Map(
    FACILITY_AREAS.map((area) => {
        const sido = AREA_SIDO[area.sido];
        const name = area.name.replace(/^(경기|인천|서울) /, "");
        const group = sigunguGroups(sido).find((g) => g.name === name);
        return [area.name, group ? `${funeralSidoPath(sido)}#${group.slug}` : null] as const;
    }),
);

/**
 * 허가 동물장묘업체 소재 지역 표 (탑승권 카드 안의 실제 <table>).
 * - rows 를 주면(지역 페이지) 구·시청 기준 직선거리순, 첫 줄을 "가장 가까운 방면"으로 표시
 * - rows 가 없으면(허브) 업체 수가 많은 지역 순
 * - 지역 이름은 장례식장 목록(/funeral-homes/{시도}#{시군구})의 해당 묶음으로 연결합니다
 * - directory 를 켜면 표 아래에 전국 허가 장례식장 목록 링크를 둡니다(지역 페이지는 따로 두므로 끔)
 * 절취선 아래(stub)에는 출처와 직접 조회 링크를 둡니다.
 */
export function FacilityTable({
    rows,
    regionName,
    directory = true,
    className,
}: {
    rows?: FacilityDistance[];
    regionName?: string;
    /** 표 아래 "전국 허가 장례식장 목록" 링크 */
    directory?: boolean;
    className?: string;
}) {
    const withDistance = Boolean(rows);
    const list = rows ?? FACILITY_AREAS.map((area) => ({ area, km: 0, minutes: [0, 0] as [number, number], sameCity: false }));
    const linked = list.some((r) => DIRECTORY_HREF.get(r.area.name));

    return (
        <PassCard
            radius="tile"
            stubPosition="bottom"
            className={className}
            mainClassName="p-0 sm:p-0"
            stubClassName="px-5 py-4 sm:px-7 sm:py-5"
            stub={
                <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 text-[12.5px] leading-relaxed text-ink-3">
                    <p>
                        출처: 농림축산식품부 동물보호관리시스템 동물장묘업 허가 현황
                        <span className="whitespace-nowrap"> (확인일 {FACILITY_CHECKED_AT})</span>
                    </p>
                    <a
                        href={FACILITY_REGISTRY_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex shrink-0 items-center gap-1 font-semibold text-ink-2 underline decoration-line underline-offset-4 hover:text-ink hover:decoration-ink-3"
                    >
                        직접 조회
                        <ExternalLink className="h-3.5 w-3.5" strokeWidth={ICON_STROKE} aria-hidden />
                    </a>
                </div>
            }
        >
            <table className="w-full text-left">
                <caption className="px-5 pb-3 pt-6 text-left sm:px-7 sm:pt-7">
                    <span className="block text-[17px] font-bold text-ink">
                        {withDistance ? `${regionName}에서 가까운 허가 장묘업체 소재 지역` : "수도권 허가 동물장묘업체 소재 지역"}
                    </span>
                    <span className="mt-1 block text-[13.5px] leading-relaxed text-ink-3">
                        {withDistance ? "구·시청 기준 직선거리이며, 실제 업체 위치와 교통 상황에 따라 달라집니다." : "업체 수가 많은 지역 순입니다."}
                        {linked && " 지역 이름을 누르면 그 지역 업체 목록이 열립니다."}
                    </span>
                </caption>
                <thead className="text-[12.5px] text-ink-3">
                    <tr className="border-b border-line">
                        <th scope="col" className="py-2.5 pl-5 pr-2 font-semibold sm:pl-7">
                            지역
                        </th>
                        <th scope="col" className={cn("px-2 py-2.5 text-right font-semibold", !withDistance && "pr-5 sm:pr-7")}>
                            허가 업체
                        </th>
                        {withDistance && (
                            <th scope="col" className="px-2 py-2.5 text-right font-semibold">
                                직선거리
                            </th>
                        )}
                        {withDistance && (
                            <th scope="col" className="py-2.5 pl-2 pr-5 text-right font-semibold sm:pr-7">
                                차량(참고)
                            </th>
                        )}
                    </tr>
                </thead>
                <tbody className="divide-y divide-line/70 text-[14px] sm:text-[15px]">
                    {list.map((r, i) => {
                        const first = withDistance && i === 0;
                        const href = DIRECTORY_HREF.get(r.area.name);
                        return (
                            <tr key={r.area.name} className={cn(first && "bg-moon/60")}>
                                <th scope="row" className={cn("py-3 pl-5 pr-2 align-top font-semibold text-ink sm:pl-7", !withDistance && "py-2.5")}>
                                    {first && <span className="mb-0.5 block text-[12px] font-semibold text-pine">가장 가까운 방면</span>}
                                    {href ? (
                                        <Link
                                            href={href}
                                            className="rounded-sm underline decoration-line decoration-1 underline-offset-4 transition-colors hover:decoration-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink motion-reduce:transition-none"
                                        >
                                            {r.area.name}
                                            <span className="sr-only"> 장례식장 목록</span>
                                        </Link>
                                    ) : (
                                        r.area.name
                                    )}
                                    {r.sameCity && <span className="ml-1.5 inline-block rounded-full bg-pine-soft px-2 py-px align-[1px] text-[11.5px] text-pine">같은 시</span>}
                                    {r.area.note && <span className="mt-0.5 block text-[12.5px] font-normal leading-snug text-ink-3">{r.area.note}</span>}
                                </th>
                                <td className={cn("px-2 py-3 text-right align-bottom tabular-nums text-ink-2", !withDistance && "pr-5 sm:pr-7")}>{r.area.count}곳</td>
                                {withDistance && (
                                    <td className={cn("whitespace-nowrap px-2 py-3 text-right align-bottom tabular-nums", first ? "font-bold text-ink" : "text-ink-2")}>
                                        {r.sameCity ? "시내" : `약 ${Math.round(r.km)}km`}
                                    </td>
                                )}
                                {withDistance && (
                                    <td className="whitespace-nowrap py-3 pl-2 pr-5 text-right align-bottom tabular-nums text-ink-2 sm:pr-7">
                                        {r.minutes[0]}~{r.minutes[1]}분
                                    </td>
                                )}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            {directory && (
                <div className="border-t border-line px-5 py-4 sm:px-7">
                    <Link
                        href={funeralHomesPath()}
                        className="group/dir inline-flex items-center gap-1.5 rounded-sm text-[14.5px] font-semibold text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
                    >
                        <span className="underline decoration-ink/30 underline-offset-4 group-hover/dir:decoration-ink">전국 허가 장례식장 목록</span>
                        <span className="font-normal tabular-nums text-ink-3">{FUNERAL_HOMES.length}곳</span>
                        <ArrowRight
                            className="h-4 w-4 transition-transform group-hover/dir:translate-x-0.5 motion-reduce:transition-none"
                            strokeWidth={ICON_STROKE}
                            aria-hidden
                        />
                    </Link>
                </div>
            )}
        </PassCard>
    );
}
