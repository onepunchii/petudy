"use client";

import { useState } from "react";
import { Check, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { ICON_STROKE, pillClass } from "../ui";
import { HomeRow, type HomeRowData } from "./HomeRow";
import { AnchorTitle } from "./listing/AnchorTitle";

/** 걸러 볼 수 있는 조건. 모두 '업체 홈페이지에 안내가 있는 곳'만 뜻합니다 */
export type HomeFilter = "allDay" | "viewing" | "largeDog" | "priceLow";

export const FILTERS: { key: HomeFilter; label: string }[] = [
    { key: "allDay", label: "24시간 접수" },
    { key: "viewing", label: "화장 참관" },
    { key: "largeDog", label: "대형견 장례" },
    { key: "priceLow", label: "공개 가격 20만 원 이하부터" },
];

export interface FilterRow extends HomeRowData {
    /** 이 업체가 맞는 조건 */
    tags: HomeFilter[];
}

/**
 * 시·도 장례식장 목록 + 조건 거르기. 서버 HTML 에는 걸러지지 않은 전체 목록이 그대로 있습니다(검색 노출 유지).
 * 조건은 모두 만족하는 곳(그리고)만 남기고, 남은 곳이 없는 시·군·구 묶음은 숨깁니다.
 */
export function FilteredHomeGroups({ groups }: { groups: { slug: string; label: string; rows: FilterRow[] }[] }) {
    const [on, setOn] = useState<HomeFilter[]>([]);
    const total = groups.reduce((n, g) => n + g.rows.length, 0);

    const shown = groups
        .map((g) => ({ ...g, rows: g.rows.filter((r) => on.every((f) => r.tags.includes(f))) }))
        .filter((g) => g.rows.length > 0);
    const count = shown.reduce((n, g) => n + g.rows.length, 0);

    const toggle = (f: HomeFilter) => setOn((cur) => (cur.includes(f) ? cur.filter((x) => x !== f) : [...cur, f]));

    return (
        <>
            <div role="group" aria-labelledby="home-filter-title" className="mt-10 rounded-[20px] bg-pass p-4 ring-1 ring-line sm:p-5">
                <p id="home-filter-title" className="flex items-center gap-2 text-[15px] font-bold text-ink">
                    <SlidersHorizontal className="h-4 w-4" strokeWidth={ICON_STROKE} aria-hidden />
                    조건으로 거르기
                </p>
                <ul className="mt-3 flex flex-wrap gap-2">
                    {FILTERS.map((f) => {
                        const active = on.includes(f.key);
                        return (
                            <li key={f.key}>
                                <button
                                    type="button"
                                    aria-pressed={active}
                                    onClick={() => toggle(f.key)}
                                    className={cn(
                                        "inline-flex min-h-11 items-center gap-1.5 rounded-full px-4 text-[14px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink motion-reduce:transition-none",
                                        active ? "bg-ink text-white" : "bg-moon text-ink ring-1 ring-inset ring-line hover:bg-paper-2",
                                    )}
                                >
                                    {active && <Check className="h-4 w-4" strokeWidth={ICON_STROKE} aria-hidden />}
                                    {f.label}
                                </button>
                            </li>
                        );
                    })}
                </ul>
                <p aria-live="polite" className="mt-3 text-[14px] text-ink-2">
                    {on.length === 0 ? `전체 ${total}곳` : `조건에 맞는 곳 ${count}곳 (전체 ${total}곳)`}
                </p>
                <p className="mt-1 text-[13px] leading-relaxed text-ink-3">업체 홈페이지에 안내가 있는 곳만 남깁니다. 안내가 없다고 하지 않는다는 뜻은 아니에요.</p>
            </div>

            {count === 0 ? (
                <div className="mt-10 rounded-[20px] bg-pass px-6 py-8 text-center ring-1 ring-line">
                    <p className="text-[17px] font-bold text-ink">조건에 맞는 곳이 없어요</p>
                    <p className="mt-2 text-[14.5px] leading-relaxed text-ink-2">조건을 하나씩 빼 보거나, 가까운 업체에 직접 물어보세요.</p>
                    <button type="button" onClick={() => setOn([])} className={cn(pillClass({ tone: "onLight", variant: "ghost", size: "sm" }), "mt-5")}>
                        조건 모두 지우기
                    </button>
                </div>
            ) : (
                <div className="mt-12 grid gap-14">
                    {shown.map((g) => (
                        <div key={g.slug}>
                            <AnchorTitle id={g.slug} size="group">
                                {g.label} <span className="font-semibold tabular-nums text-ink-3">({g.rows.length}곳)</span>
                            </AnchorTitle>
                            <ul className="mt-4 border-b border-line">
                                {g.rows.map((r) => (
                                    <HomeRow key={r.id} row={r} />
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}
