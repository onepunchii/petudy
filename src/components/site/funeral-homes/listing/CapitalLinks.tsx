import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SIDO, regionsBySido } from "@/lib/site/regions";
import { cn } from "@/lib/utils";
import { PassCard } from "../../PassCard";
import { ICON_STROKE } from "../../ui";

/**
 * 수도권(서울·경기·인천) 목록에서 "출발하는 동네 기준 안내"(/funeral/seoul, /funeral/gyeonggi)로 잇는 탑승권 한 장.
 * 기존 지역 페이지 문구(구·시를 고르면 가까운 순서로 다시 정리)를 그대로 따릅니다.
 */
export function CapitalLinks({ className }: { className?: string }) {
    const links = (["seoul", "gyeonggi"] as const).map((s) => ({
        href: `/funeral/${s}`,
        label: `${SIDO[s].short} ${s === "seoul" ? "구별" : "시별"} 장례 안내`,
        note: `${regionsBySido(s).length}개 지역`,
    }));
    return (
        <PassCard
            radius="tile"
            className={className}
            mainClassName="p-6 sm:p-8"
            stubClassName="gap-1 p-5 sm:w-[17rem] sm:p-6"
            stub={
                <ul className="grid">
                    {links.map((l, i) => (
                        <li key={l.href}>
                            <Link
                                href={l.href}
                                className={cn("group flex items-center justify-between gap-3 py-3", i > 0 && "border-t border-line")}
                            >
                                <span>
                                    <span className="block text-[15px] font-semibold text-ink decoration-ink/30 underline-offset-4 group-hover:underline">{l.label}</span>
                                    <span className="block text-[12.5px] tabular-nums text-ink-3">{l.note}</span>
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
            }
        >
            <p className="text-[18px] font-bold leading-snug text-ink">출발하는 동네 기준으로도 볼 수 있어요</p>
            <p className="mt-2.5 max-w-[48ch] text-[15px] leading-relaxed text-ink-2">
                서울·경기의 구·시를 고르면, 그 지역 중심에서 가까운 허가 업체 순서로 다시 정리해 보여드립니다.
            </p>
        </PassCard>
    );
}
