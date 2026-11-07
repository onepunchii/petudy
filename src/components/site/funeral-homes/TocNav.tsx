import { cn } from "@/lib/utils";

export type TocItem = { id: string; label: string };

/**
 * 목차. 순수 HTML 앵커(#id)만 씁니다(JS 스크롤 없음). 각 섹션 h2 에 같은 id 와 scroll-mt-24 를 두세요.
 * - inline: 모바일·태블릿용 가로 스크롤 알약 줄 (lg 에서 숨김)
 * - sidebar: lg 이상 본문 옆 sticky 세로 목록
 */
export function TocNav({ items, layout, className }: { items: TocItem[]; layout: "inline" | "sidebar"; className?: string }) {
    if (layout === "inline") {
        return (
            <nav aria-label="목차" className={cn("lg:hidden", className)}>
                <ol className="scrollbar-hide -mx-4 flex gap-2 overflow-x-auto px-4 py-1 sm:-mx-6 sm:px-6">
                    {items.map((it) => (
                        <li key={it.id} className="shrink-0">
                            <a
                                href={`#${it.id}`}
                                className="inline-flex h-10 items-center rounded-full bg-pass px-4 text-[14px] font-semibold text-ink-2 ring-1 ring-inset ring-line transition-colors hover:text-ink"
                            >
                                {it.label}
                            </a>
                        </li>
                    ))}
                </ol>
            </nav>
        );
    }
    return (
        <nav aria-label="목차" className={cn("hidden lg:block", className)}>
            <p className="text-[13px] font-semibold text-ink-3">이 페이지에서</p>
            <ol className="mt-3 space-y-0.5 border-l border-line">
                {items.map((it) => (
                    <li key={it.id}>
                        <a href={`#${it.id}`} className="-ml-px block border-l border-transparent py-1.5 pl-4 text-[14.5px] text-ink-2 transition-colors hover:border-ink hover:text-ink">
                            {it.label}
                        </a>
                    </li>
                ))}
            </ol>
        </nav>
    );
}
