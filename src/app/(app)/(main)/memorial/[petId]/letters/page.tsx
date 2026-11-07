"use client";

import { Cake, Flower2, Heart, Mail, MessageCircle, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getLetters, deleteLetter } from "@/actions/memorial";
import { APP_ICON_STROKE, AppBody, AppEmpty, AppLinkButton, AppTopBar, appCardClass, skeletonClass } from "@/components/app/ui";
import { cn } from "@/lib/utils";

interface Letter {
    id: string;
    content: string;
    occasionType: string;
    createdAt: Date;
}

/** 편지 종류 표시 아이콘 (예전 이모지 대신 lucide). 모르는 종류는 "기타"와 같게 */
function OccasionIcon({ type, className }: { type: string; className?: string }) {
    const props = { className, strokeWidth: APP_ICON_STROKE, "aria-hidden": true } as const;
    switch (type) {
        case "생일":
            return <Cake {...props} />;
        case "기념일":
            return <Heart {...props} />;
        case "장례":
            return <Flower2 {...props} />;
        default:
            return <MessageCircle {...props} />;
    }
}

export default function LettersPage() {
    const [letters, setLetters] = useState<Letter[]>([]);
    const [loading, setLoading] = useState(true);

    // 처음 열 때 한 번 불러옵니다 (loading 은 처음부터 true)
    useEffect(() => {
        getLetters("1").then((result) => {
            if (result.success && result.data) {
                setLetters(result.data as Letter[]);
            }
            setLoading(false);
        });
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("정말 삭제하시겠습니까?")) return;
        const result = await deleteLetter(id);
        if (result.success) {
            setLetters(letters.filter((l) => l.id !== id));
        }
    };

    return (
        <div className="min-h-full">
            <AppTopBar
                back="/memorial"
                title="편지"
                action={
                    <Link
                        href="/memorial/1/letters/new"
                        aria-label="편지 쓰기"
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full text-star transition-colors hover:bg-white/10 active:translate-y-px"
                    >
                        <Plus className="h-6 w-6" strokeWidth={APP_ICON_STROKE} aria-hidden />
                    </Link>
                }
            />

            <AppBody>
                {loading ? (
                    <div className="space-y-3" role="status" aria-live="polite">
                        <div className={cn(skeletonClass, "h-[148px]")} aria-hidden />
                        <div className={cn(skeletonClass, "h-[148px]")} aria-hidden />
                        <span className="sr-only">편지를 불러오는 중이에요</span>
                    </div>
                ) : letters.length === 0 ? (
                    <AppEmpty
                        icon={<Mail className="h-7 w-7" strokeWidth={APP_ICON_STROKE} aria-hidden />}
                        title={
                            <span role="heading" aria-level={2}>
                                아직 작성된 편지가 없어요
                            </span>
                        }
                        description="떠나보낸 아이에게 첫 번째 편지를 보내보세요"
                        action={
                            <AppLinkButton href="/memorial/1/letters/new" variant="primary">
                                <Plus className="h-4 w-4" strokeWidth={APP_ICON_STROKE} aria-hidden />
                                편지 쓰기
                            </AppLinkButton>
                        }
                    />
                ) : (
                    <div className="space-y-3">
                        {letters.map((letter) => (
                            <article key={letter.id} className={cn(appCardClass, "p-5")}>
                                <div className="flex items-center justify-between gap-3">
                                    <span className="inline-flex h-8 items-center gap-1.5 rounded-full bg-pine-soft px-3 text-[13px] font-semibold text-pine">
                                        <OccasionIcon type={letter.occasionType} className="h-4 w-4" />
                                        {letter.occasionType}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(letter.id)}
                                        aria-label="편지 삭제"
                                        className="-mr-2 inline-flex h-10 w-10 items-center justify-center rounded-full text-ink-3 transition-colors hover:bg-paper-2 hover:text-danger"
                                    >
                                        <Trash2 className="h-[18px] w-[18px]" strokeWidth={APP_ICON_STROKE} aria-hidden />
                                    </button>
                                </div>
                                <p className="mt-3 whitespace-pre-wrap text-[15.5px] leading-[1.8] text-ink">{letter.content}</p>
                                <p className="mt-4 text-[13px] text-ink-3">
                                    {new Date(letter.createdAt).toLocaleDateString("ko-KR", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </p>
                            </article>
                        ))}
                    </div>
                )}
            </AppBody>
        </div>
    );
}
