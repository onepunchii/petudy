"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * 섹션이 처음 화면에 들어올 때 한 번 아래에서 올라오며 나타납니다.
 *
 * - 서버 HTML 은 항상 보이는 상태입니다(JS 가 없거나 검색엔진이 읽을 때도 내용이 숨지 않음).
 * - 하이드레이션 후 화면 밖에 있는 요소에만 data-reveal="wait" 를 붙였다가, 들어오면 "in" 으로 바꿉니다.
 *   이미 화면 안에 있던 요소는 깜빡이지 않도록 그대로 둡니다. 그래서 히어로에는 감쌀 필요가 없습니다.
 * - prefers-reduced-motion 이면 아무 것도 하지 않습니다(즉시 표시).
 * - 상태(useState)를 쓰지 않고 DOM 속성만 바꿔 다시 렌더링하지 않습니다.
 */
export function Reveal({
    children,
    as: Tag = "div",
    delay = 0,
    className,
    id,
}: {
    children: React.ReactNode;
    as?: "div" | "section" | "article" | "li" | "ul" | "ol" | "figure";
    /** 순서가 의미 있을 때만 쓰는 지연(ms). 형제 사이 60~90ms 권장 */
    delay?: number;
    className?: string;
    id?: string;
}) {
    const ref = useRef<HTMLElement | null>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        if (typeof IntersectionObserver === "undefined") return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) return; // 이미 보이는 중이면 손대지 않음

        el.dataset.reveal = "wait";
        const io = new IntersectionObserver(
            (entries) => {
                if (entries.some((e) => e.isIntersecting)) {
                    el.dataset.reveal = "in";
                    io.disconnect();
                }
            },
            { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
        );
        io.observe(el);
        return () => io.disconnect();
    }, []);

    const Comp = Tag as React.ElementType;
    return (
        <Comp
            ref={ref}
            id={id}
            className={cn("site-reveal", className)}
            style={delay ? ({ "--reveal-delay": `${delay}ms` } as React.CSSProperties) : undefined}
        >
            {children}
        </Comp>
    );
}
