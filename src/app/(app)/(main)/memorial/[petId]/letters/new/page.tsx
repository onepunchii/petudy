"use client";

import { Send } from "lucide-react";
import { useState } from "react";
import { createLetter } from "@/actions/memorial";
import { useRouter } from "next/navigation";
import { APP_ICON_STROKE, AppBody, AppTopBar, appButtonClass, appChipClass, appTextareaClass } from "@/components/app/ui";
import { cn } from "@/lib/utils";

const occasions = ["생일", "기념일", "장례", "기타"];

export default function NewLetterPage() {
    const router = useRouter();
    const [occasion, setOccasion] = useState("기타");
    const [content, setContent] = useState("");
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        if (!content.trim()) {
            alert("편지 내용을 입력해주세요.");
            return;
        }
        setSaving(true);
        const result = await createLetter("1", "user-id", content, occasion);
        setSaving(false);
        if (result.success) {
            // 저장 후 뒤로 가기가 빈 작성 화면으로 돌아오지 않도록 작성 화면 기록을 목록으로 바꿉니다
            router.replace("/memorial/1/letters");
        } else {
            alert("저장에 실패했습니다: " + result.error);
        }
    };

    return (
        <div className="min-h-full">
            <AppTopBar
                back="/memorial/1/letters"
                title="편지 쓰기"
                action={
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={saving}
                        aria-label="편지 보내기"
                        className={appButtonClass({ variant: "onNight", size: "sm", className: "w-10 px-0" })}
                    >
                        <Send className="h-[18px] w-[18px]" strokeWidth={APP_ICON_STROKE} aria-hidden />
                    </button>
                }
            />

            <AppBody className="space-y-4">
                <div className="scrollbar-hide -mx-5 flex gap-2 overflow-x-auto px-5 pb-1">
                    {occasions.map((occ) => (
                        <button
                            key={occ}
                            type="button"
                            onClick={() => setOccasion(occ)}
                            aria-pressed={occasion === occ}
                            className={appChipClass(occasion === occ, "shrink-0 whitespace-nowrap")}
                        >
                            {occ}
                        </button>
                    ))}
                </div>

                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="떠나보낸 아이에게 편지를 써보세요..."
                    aria-label="편지 내용"
                    className={cn(appTextareaClass, "h-64")}
                />
            </AppBody>
        </div>
    );
}
