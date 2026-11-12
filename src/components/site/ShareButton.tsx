"use client";

import { useEffect, useRef, useState } from "react";
import { Share2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ICON_STROKE, pillClass, type PillTone } from "./ui";

/** 보이지 않는 입력칸에 넣어 복사(execCommand). 성공하면 true */
function copyWithTextarea(text: string) {
    const el = document.createElement("textarea");
    el.value = text;
    el.setAttribute("readonly", "");
    el.style.position = "fixed";
    el.style.opacity = "0";
    document.body.appendChild(el);
    el.select();
    let ok = false;
    try {
        ok = document.execCommand("copy");
    } catch {
        ok = false;
    }
    el.remove();
    return ok;
}

/**
 * 공유 버튼. 휴대폰에서는 기기 공유창(카카오톡·문자 등)을 열고, 공유창이 없는 컴퓨터에서는 링크를 복사합니다.
 * 카카오 SDK 없이 동작합니다(앱 키·외부 스크립트 불필요).
 * path 는 이 사이트 안 주소("/funeral-homes/…"). 지금 보고 있는 도메인을 앞에 붙여 공유합니다.
 */
export function ShareButton({
    title,
    text,
    path,
    label = "공유하기",
    tone = "onLight",
    size = "md",
    className,
}: {
    title: string;
    text?: string;
    path: string;
    label?: string;
    tone?: PillTone;
    size?: "sm" | "md";
    className?: string;
}) {
    const [message, setMessage] = useState("");
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => () => {
        if (timer.current) clearTimeout(timer.current);
    }, []);

    function flash(m: string) {
        setMessage(m);
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => setMessage(""), 4000);
    }

    async function share() {
        const url = new URL(path, window.location.origin).href;
        if (typeof navigator.share === "function") {
            try {
                await navigator.share({ title, text, url });
                return;
            } catch (e) {
                // 사용자가 공유창을 닫은 경우는 조용히 끝냅니다
                if (e instanceof DOMException && e.name === "AbortError") return;
            }
        }
        try {
            await navigator.clipboard.writeText(url);
            flash("링크를 복사했어요. 원하는 곳에 붙여 넣어 주세요.");
        } catch {
            // 카카오톡 같은 앱 안 브라우저는 clipboard API 를 막는 경우가 있어 옛 방식으로 한 번 더 시도합니다
            flash(copyWithTextarea(url) ? "링크를 복사했어요. 원하는 곳에 붙여 넣어 주세요." : "링크를 복사하지 못했어요. 주소창의 주소를 복사해 주세요.");
        }
    }

    return (
        <span className="relative inline-flex">
            <button type="button" onClick={share} className={cn(pillClass({ tone, variant: "ghost", size }), className)}>
                <Share2 className="h-4 w-4 shrink-0" strokeWidth={ICON_STROKE} aria-hidden />
                {label}
            </button>
            <span
                role="status"
                className={cn(
                    "absolute left-0 top-full z-10 mt-2 w-max max-w-[16rem] rounded-xl px-3 py-2 text-[13px] font-medium shadow-[0_12px_24px_-12px_rgb(11_16_32/0.5)]",
                    tone === "onNight" ? "bg-star text-ink" : "bg-night text-star",
                    !message && "sr-only",
                )}
            >
                {message}
            </span>
        </span>
    );
}
