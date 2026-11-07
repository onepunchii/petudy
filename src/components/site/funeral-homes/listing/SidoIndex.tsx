import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { funeralSidoList, funeralSidoPath } from "@/lib/site/funeral-homes";
import { cn } from "@/lib/utils";
import { ICON_STROKE } from "../../ui";
import { townCounts } from "./copy";

/**
 * 시·도 바로가기. 같은 카드를 나란히 두지 않고, 출발 안내판 같은 구분선 표로 정리합니다.
 * 열: 시·도 | 업체 수 | 업체가 많은 시·군·구(최대 3곳). 모바일은 시·도와 업체 수 아래에 지역 줄.
 */
export function SidoIndex({ className }: { className?: string }) {
    const list = funeralSidoList();
    const cols = "sm:grid-cols-[11.5rem_4.5rem_minmax(0,1fr)_1rem]";
    return (
        <div className={className}>
            <div aria-hidden className={cn("hidden gap-x-5 pb-2.5 text-[12.5px] font-semibold text-ink-3 sm:grid", cols)}>
                <span>시·도</span>
                <span>업체 수</span>
                <span>업체가 있는 시·군·구</span>
                <span />
            </div>
            <ul className="border-b border-line">
                {list.map((s) => {
                    const { shown, rest } = townCounts(s.slug, 3);
                    return (
                        <li key={s.slug}>
                            <Link
                                href={funeralSidoPath(s.slug)}
                                className={cn(
                                    "group grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-5 gap-y-1 border-t border-line py-4 transition-colors hover:border-ink/50 motion-reduce:transition-none",
                                    cols,
                                )}
                            >
                                <span className="text-[16.5px] font-bold text-ink decoration-ink/30 underline-offset-4 group-hover:underline">{s.name}</span>
                                <span className="text-right text-[15px] font-semibold tabular-nums text-ink sm:text-left">{s.count}곳</span>
                                <span className="col-span-2 text-[13.5px] leading-relaxed text-ink-3 sm:col-span-1">
                                    {/* 세종처럼 시군구가 없는 곳은 시·군·구 구분이 없다고 적습니다 */}
                                    {shown.length > 0 ? `${shown.join(", ")}${rest > 0 ? ` 외 ${rest}개 지역` : ""}` : "시·군·구 구분 없음"}
                                </span>
                                <ArrowRight
                                    className="hidden h-4 w-4 self-center text-ink-3 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none sm:block"
                                    strokeWidth={ICON_STROKE}
                                    aria-hidden
                                />
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
