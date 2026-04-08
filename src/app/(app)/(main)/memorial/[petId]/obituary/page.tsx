"use client";

import { ChevronLeft, Copy, Check } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { createObituary } from "@/actions/memorial";
import { useRouter } from "next/navigation";

export default function ObituaryPage() {
    const router = useRouter();
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
        <div className="min-h-screen bg-[#0A0A0B]">
            <header className="sticky top-0 z-50 bg-[#0A0A0B]/80 backdrop-blur-md border-b border-white/5 h-14 flex items-center px-4">
                <Link href="/memorial" className="p-2 -ml-2 text-white hover:text-gray-300 transition-colors">
                    <ChevronLeft className="w-6 h-6" />
                </Link>
                <h1 className="absolute left-1/2 -translate-x-1/2 text-lg font-bold text-white">부고장</h1>
            </header>

            <main className="p-4 max-w-[480px] mx-auto space-y-4">
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="부고장 제목을 입력하세요"
                    className="w-full bg-[#1e1e20] border border-white/10 rounded-2xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-foon-lime/50"
                />

                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="故소중한 반려동물 이름을 기리며..."
                    className="w-full h-48 bg-[#1e1e20] border border-white/10 rounded-2xl p-4 text-white placeholder-gray-500 resize-none focus:outline-none focus:border-foon-lime/50"
                />

                {shareToken ? (
                    <div className="p-4 bg-foon-lime/10 border border-foon-lime/30 rounded-2xl">
                        <p className="text-foon-lime text-sm mb-2">링크가 클립보드에 복사되었습니다!</p>
                        <p className="text-gray-400 text-xs">원하는 곳에 붙여넣기 하여 공유해주세요.</p>
                    </div>
                ) : (
                    <button
                        onClick={handleCreateAndCopy}
                        disabled={saving}
                        className="w-full flex items-center justify-center gap-2 py-3.5 bg-foon-lime rounded-2xl text-bg-main font-medium hover:bg-[#bbf080] disabled:opacity-50 transition-colors"
                    >
                        {saving ? (
                            <div className="w-5 h-5 border-2 border-bg-main border-t-transparent rounded-full animate-spin" />
                        ) : copied ? (
                            <>
                                <Check className="w-5 h-5" />
                                복사됨!
                            </>
                        ) : (
                            <>
                                <Copy className="w-5 h-5" />
                                링크 복사하기
                            </>
                        )}
                    </button>
                )}
            </main>
        </div>
    );
}
