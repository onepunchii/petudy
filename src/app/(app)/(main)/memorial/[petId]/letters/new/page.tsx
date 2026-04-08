"use client";

import { ChevronLeft, Send } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { createLetter } from "@/actions/memorial";
import { useRouter } from "next/navigation";

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
            router.push("/memorial/1/letters");
        } else {
            alert("저장에 실패했습니다: " + result.error);
        }
    };

    return (
        <div className="min-h-screen bg-[#0A0A0B]">
            <header className="sticky top-0 z-50 bg-[#0A0A0B]/80 backdrop-blur-md border-b border-white/5 h-14 flex items-center px-4">
                <Link href="/memorial/1/letters" className="p-2 -ml-2 text-white hover:text-gray-300 transition-colors">
                    <ChevronLeft className="w-6 h-6" />
                </Link>
                <h1 className="absolute left-1/2 -translate-x-1/2 text-lg font-bold text-white">편지 쓰기</h1>
                <button onClick={handleSave} disabled={saving} className="ml-auto p-2 text-foon-lime disabled:opacity-50">
                    <Send className="w-6 h-6" />
                </button>
            </header>

            <main className="p-4 max-w-[480px] mx-auto space-y-4">
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {occasions.map((occ) => (
                        <button
                            key={occ}
                            onClick={() => setOccasion(occ)}
                            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                                occasion === occ
                                    ? "bg-foon-lime text-bg-main font-medium"
                                    : "bg-[#1e1e20] text-gray-300 border border-white/10"
                            }`}
                        >
                            {occ}
                        </button>
                    ))}
                </div>

                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="떠나보낸 아이에게 편지를 써보세요..."
                    className="w-full h-64 bg-[#1e1e20] border border-white/10 rounded-2xl p-4 text-white placeholder-gray-500 resize-none focus:outline-none focus:border-foon-lime/50"
                />
            </main>
        </div>
    );
}
