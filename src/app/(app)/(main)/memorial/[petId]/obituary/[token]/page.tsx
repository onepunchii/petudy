"use client";

import { Star } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getObituaryByToken } from "@/actions/memorial";
import { APP_ICON_STROKE, AppBody, AppHero, skeletonClass } from "@/components/app/ui";
import { PassCard } from "@/components/site/PassCard";
import { cn } from "@/lib/utils";

/*
 * 보호자가 지인에게 보내는 부고장(공개 링크). 차분하게: 밤 머리(제목·날짜) -> 달빛 본문(탑승권 카드 한 장).
 * 라임·이모지·캐릭터를 쓰지 않습니다.
 */

interface Obituary {
    title: string;
    content: string;
    createdAt: Date;
}

export default function SharedObituaryPage() {
    const { token } = useParams<{ token: string }>();
    const [obituary, setObituary] = useState<Obituary | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!token) return;
        let cancelled = false;

        const loadObituary = async () => {
            try {
                const result = await getObituaryByToken(token);
                if (cancelled) return;
                if (result.success && result.data) {
                    setObituary(result.data as Obituary);
                }
            } catch (error) {
                // 네트워크 오류 등 — 무한 로딩 대신 '찾을 수 없음' 화면으로
                console.error("Failed to load obituary", error);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        loadObituary();
        return () => {
            cancelled = true;
        };
    }, [token]);

    if (loading) {
        // AppHero 와 같은 밤 머리 모양의 자리 표시 (제목이 아직 없으므로 h1 을 만들지 않습니다)
        return (
            <div className="min-h-full" role="status" aria-live="polite">
                <div
                    className="relative isolate overflow-hidden rounded-b-[28px] bg-night px-5 pb-8"
                    style={{ paddingTop: "max(20px, env(safe-area-inset-top))" }}
                    aria-hidden
                >
                    <div className="site-stars -z-10" />
                    <div className="mb-6 h-10 w-10 rounded-full bg-white/10" />
                    <div className="h-8 w-3/5 animate-pulse rounded-full bg-white/10 motion-reduce:animate-none" />
                    <div className="mt-3 h-4 w-2/5 animate-pulse rounded-full bg-white/10 motion-reduce:animate-none" />
                </div>
                <AppBody>
                    <div className={cn(skeletonClass, "h-60 rounded-[28px]")} aria-hidden />
                </AppBody>
                <span className="sr-only">부고장을 불러오는 중이에요</span>
            </div>
        );
    }

    if (!obituary) {
        return (
            <div className="min-h-full">
                <AppHero title="부고장을 찾을 수 없습니다" subtitle="유효하지 않은 링크입니다." />
            </div>
        );
    }

    return (
        <div className="min-h-full">
            <AppHero
                top={
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-star ring-1 ring-inset ring-white/15">
                        <Star className="h-[18px] w-[18px]" strokeWidth={APP_ICON_STROKE} aria-hidden />
                    </span>
                }
                title={obituary.title}
                subtitle={
                    <span className="tabular-nums">
                        {new Date(obituary.createdAt).toLocaleDateString("ko-KR", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                    </span>
                }
            />

            <AppBody>
                <PassCard
                    as="article"
                    radius="tile"
                    stubPosition="bottom"
                    mainClassName="p-6 sm:p-7"
                    stubClassName="px-6 py-4 sm:min-w-0 sm:px-7 sm:py-4"
                    stub={<p className="text-[13px] text-ink-3">포온에서 제작된 부고장입니다</p>}
                >
                    <p className="whitespace-pre-wrap text-[16px] leading-[1.9] text-ink">{obituary.content}</p>
                </PassCard>
            </AppBody>
        </div>
    );
}
