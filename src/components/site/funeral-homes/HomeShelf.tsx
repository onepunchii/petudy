"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Bookmark, BookmarkCheck } from "lucide-react";
import { RECENT_KEY, SAVED_KEY, SAVED_MAX, pushRecent, toggleSaved, useShelf } from "@/lib/site/home-shelf";
import { cn } from "@/lib/utils";
import { ICON_STROKE, pillClass, type PillTone } from "../ui";

export const COMPARE_PATH = "/funeral-homes/compare";

/**
 * 장례식장 저장 버튼(최대 3곳). 저장은 이 기기에만 됩니다.
 * aria-pressed 로 켜짐·꺼짐을 알리고, 결과는 버튼 아래 한 줄로 보여 줍니다(비교 화면 링크 포함).
 */
export function SaveHomeButton({ id, name, tone = "onNight", className }: { id: string; name: string; tone?: PillTone; className?: string }) {
    const saved = useShelf(SAVED_KEY);
    const on = saved.includes(id);
    const [message, setMessage] = useState<{ text: string; link: boolean } | null>(null);
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => () => {
        if (timer.current) clearTimeout(timer.current);
    }, []);

    function click() {
        const r = toggleSaved(id);
        const text =
            r === "added"
                ? "저장했어요. 이 기기에서만 보여요."
                : r === "removed"
                  ? "저장을 뺐어요."
                  : `비교는 ${SAVED_MAX}곳까지예요. 하나를 빼고 다시 저장해 주세요.`;
        setMessage({ text, link: r !== "removed" });
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => setMessage(null), 6000);
    }

    const Icon = on ? BookmarkCheck : Bookmark;
    return (
        <span className="relative inline-flex">
            <button type="button" aria-pressed={on} onClick={click} className={cn(pillClass({ tone, variant: "ghost" }), className)}>
                <Icon className="h-4 w-4 shrink-0" strokeWidth={ICON_STROKE} aria-hidden />
                {on ? "저장됨" : "저장"}
                <span className="sr-only"> {name}</span>
            </button>
            <span
                role="status"
                className={cn(
                    "absolute left-0 top-full z-10 mt-2 w-max max-w-[17rem] rounded-xl px-3 py-2 text-[13px] font-medium leading-snug shadow-[0_12px_24px_-12px_rgb(11_16_32/0.5)]",
                    tone === "onNight" ? "bg-star text-ink" : "bg-night text-star",
                    !message && "sr-only",
                )}
            >
                {message?.text}
                {message?.link && (
                    <Link href={COMPARE_PATH} className="ml-1 font-semibold underline underline-offset-2">
                        비교 보기
                    </Link>
                )}
            </span>
        </span>
    );
}

/** 상세 화면을 열면 '최근 본 장례식장'에 넣습니다. 화면에는 아무것도 그리지 않습니다 */
export function RecordRecentHome({ id }: { id: string }) {
    useEffect(() => {
        pushRecent(id);
    }, [id]);
    return null;
}

/** 저장했거나 최근 본 곳이 있을 때만 보이는 한 줄 입구(목록 화면용) */
export function ShelfLink({ className }: { className?: string }) {
    const saved = useShelf(SAVED_KEY);
    const recent = useShelf(RECENT_KEY);
    if (saved.length === 0 && recent.length === 0) return null;
    return (
        <Link
            href={COMPARE_PATH}
            className={cn(
                "group flex min-h-12 items-center justify-between gap-3 rounded-2xl bg-pine-soft px-4 py-3 text-[15px] font-semibold text-ink transition-colors hover:bg-paper-2 motion-reduce:transition-none",
                className,
            )}
        >
            <span>
                {saved.length > 0 ? `저장한 장례식장 ${saved.length}곳 비교하기` : `최근 본 장례식장 ${recent.length}곳`}
            </span>
            <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" strokeWidth={ICON_STROKE} aria-hidden />
        </Link>
    );
}
