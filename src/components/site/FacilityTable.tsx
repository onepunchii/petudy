import { ExternalLink } from "lucide-react";
import { FACILITY_AREAS, FACILITY_CHECKED_AT, FACILITY_REGISTRY_URL } from "@/lib/site/facilities";
import type { FacilityDistance } from "@/lib/site/local";

/** 허가 동물장묘업체 소재 지역 — 지역 페이지에서는 거리순, 허브에서는 업체 수 순 */
export function FacilityTable({ rows, regionName }: { rows?: FacilityDistance[]; regionName?: string }) {
    const withDistance = Boolean(rows);
    const list = rows ?? FACILITY_AREAS.map((area) => ({ area, km: 0, minutes: [0, 0] as [number, number], sameCity: false }));
    return (
        <div className="overflow-hidden rounded-3xl bg-white ring-1 ring-line">
            <table className="w-full text-left">
                <caption className="px-5 pb-1 pt-5 text-left">
                    <span className="block text-[16px] font-bold text-ink">
                        {withDistance ? `${regionName}에서 가까운 허가 장묘업체 소재 지역` : "수도권 허가 동물장묘업체 소재 지역"}
                    </span>
                    <span className="mt-1 block text-[13px] text-ink-3">
                        {withDistance ? "구·시청 기준 직선거리이며, 실제 업체 위치·교통 상황에 따라 달라집니다." : "업체 수가 많은 지역 순"}
                    </span>
                </caption>
                <thead className="text-[12.5px] text-ink-3">
                    <tr className="border-b border-line">
                        <th scope="col" className="px-5 py-3 font-semibold">지역</th>
                        <th scope="col" className="px-3 py-3 text-right font-semibold">허가 업체</th>
                        {withDistance && <th scope="col" className="px-3 py-3 text-right font-semibold">직선거리</th>}
                        {withDistance && <th scope="col" className="px-5 py-3 text-right font-semibold">차량(참고)</th>}
                    </tr>
                </thead>
                <tbody className="divide-y divide-line text-[14.5px]">
                    {list.map((r) => (
                        <tr key={r.area.name}>
                            <th scope="row" className="px-5 py-3.5 font-semibold text-ink">
                                {r.area.name}
                                {r.sameCity && <span className="ml-2 rounded-full bg-pine-soft px-2 py-0.5 text-[11.5px] text-pine">같은 시</span>}
                                {r.area.note && <span className="mt-0.5 block text-[12px] font-normal text-ink-3">{r.area.note}</span>}
                            </th>
                            <td className="px-3 py-3.5 text-right tabular-nums text-ink-2">{r.area.count}곳</td>
                            {withDistance && <td className="px-3 py-3.5 text-right tabular-nums text-ink-2">{r.sameCity ? "시내" : `약 ${Math.round(r.km)}km`}</td>}
                            {withDistance && (
                                <td className="px-5 py-3.5 text-right tabular-nums text-ink-2">
                                    {r.minutes[0]}~{r.minutes[1]}분
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
            <p className="flex flex-wrap items-center gap-1 border-t border-line px-5 py-3 text-[12px] text-ink-3">
                출처: 농림축산식품부 동물보호관리시스템 동물장묘업 허가 현황 (확인일 {FACILITY_CHECKED_AT})
                <a href={FACILITY_REGISTRY_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-0.5 font-semibold text-ink-2 underline underline-offset-2">
                    직접 조회 <ExternalLink className="h-3 w-3" aria-hidden />
                </a>
            </p>
        </div>
    );
}
