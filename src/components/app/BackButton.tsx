"use client";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { APP_ICON_STROKE, appBackButtonClass } from "./tokens";

/**
 * 뒤로 가기. 앱 안에서 들어온 경우 history.back, 바로 열린 경우(공유 링크 등) fallbackHref 로 이동합니다.
 * 밤(AppHero/AppTopBar) 위에서 쓰는 것이 기본이고, 밝은 면에서는 tone="onLight".
 */
export function BackButton({
    fallbackHref = "/app",
    tone = "onNight",
    label = "뒤로 가기",
    className,
}: {
    fallbackHref?: string;
    tone?: "onNight" | "onLight";
    label?: string;
    className?: string;
}) {
    const router = useRouter();
    return (
        <button
            type="button"
            aria-label={label}
            onClick={() => {
                if (typeof window !== "undefined" && window.history.length > 1) router.back();
                else router.push(fallbackHref);
            }}
            className={appBackButtonClass(tone, className)}
        >
            <ChevronLeft className="h-6 w-6" strokeWidth={APP_ICON_STROKE} aria-hidden />
        </button>
    );
}
