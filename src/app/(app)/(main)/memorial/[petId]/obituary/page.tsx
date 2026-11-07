"use client";

import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { createObituary } from "@/actions/memorial";
import { APP_ICON_STROKE, AppBody, AppButton, AppTopBar, appInputClass, appTextareaClass } from "@/components/app/ui";
import { cn } from "@/lib/utils";

export default function ObituaryPage() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [shareToken, setShareToken] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleCreateAndCopy = async () => {
        if (!title.trim() || !content.trim()) {
            alert("제목과 내용을 모두 입력해주세요.");
            return;
        }
        setSaving(true);
        const result = await createObituary("1", "user-id", title, content);
        setSaving(false);
        if (result.success && result.token) {
            setShareToken(result.token);
            const shareUrl = `${window.location.origin}/memorial/1/obituary/${result.token}`;
            navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } else {
            alert("부고장 생성에 실패했습니다: " + result.error);
        }
    };

    return (
        <div className="min-h-full">
            <AppTopBar back="/memorial" title="부고장" />

            <AppBody className="space-y-4">
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="부고장 제목을 입력하세요"
                    aria-label="부고장 제목"
                    className={appInputClass}
                />

                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="故소중한 반려동물 이름을 기리며..."
                    aria-label="부고장 내용"
                    className={cn(appTextareaClass, "h-48")}
                />

                {shareToken ? (
                    <div role="status" className="flex gap-3 rounded-[20px] bg-pine-soft p-4">
                        <Check className="mt-0.5 h-5 w-5 shrink-0 text-pine" strokeWidth={APP_ICON_STROKE} aria-hidden />
                        <div className="min-w-0">
                            <p className="text-[15px] font-semibold text-ink">링크가 클립보드에 복사되었습니다!</p>
                            <p className="mt-1 text-[13.5px] leading-relaxed text-ink-2">원하는 곳에 붙여넣기 하여 공유해주세요.</p>
                        </div>
                    </div>
                ) : (
                    <AppButton variant="primary" size="lg" block onClick={handleCreateAndCopy} disabled={saving}>
                        {saving ? (
                            <span className="h-5 w-5 animate-spin rounded-full border-2 border-star border-t-transparent" aria-hidden />
                        ) : copied ? (
                            <>
                                <Check className="h-5 w-5" strokeWidth={APP_ICON_STROKE} aria-hidden />
                                복사됨!
                            </>
                        ) : (
                            <>
                                <Copy className="h-5 w-5" strokeWidth={APP_ICON_STROKE} aria-hidden />
                                링크 복사하기
                            </>
                        )}
                    </AppButton>
                )}
            </AppBody>
        </div>
    );
}
