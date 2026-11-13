import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { COST_PATH } from "@/lib/site/funeral-cost";
import { cn } from "@/lib/utils";
import { ICON_STROKE } from "../../ui";

/** 장례 비용 비교 입구. 시·도 화면에서는 그 시·도 칸으로 바로 내려갑니다 */
export function CostLink({ sido, label = "지역별 장례 비용 비교", className }: { sido?: string; label?: string; className?: string }) {
    return (
        <Link
            href={sido ? `${COST_PATH}#${sido}` : COST_PATH}
            className={cn(
                "group flex min-h-12 items-center justify-between gap-3 rounded-2xl bg-pass px-4 py-3 text-[15px] font-semibold text-ink ring-1 ring-line transition-colors hover:bg-paper-2 motion-reduce:transition-none",
                className,
            )}
        >
            <span>{label}</span>
            <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" strokeWidth={ICON_STROKE} aria-hidden />
        </Link>
    );
}
