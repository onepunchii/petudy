"use client";

import { ChevronLeft, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getLetters, deleteLetter } from "@/actions/memorial";

interface Letter {
    id: string;
    content: string;
    occasionType: string;
    createdAt: Date;
}

export default function LettersPage() {
    const [letters, setLetters] = useState<Letter[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadLetters();
    }, []);

    const loadLetters = async () => {
        setLoading(true);
        const result = await getLetters("1");
        if (result.success && result.data) {
            setLetters(result.data as any);
        }
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("정말 삭제하시겠습니까?")) return;
        const result = await deleteLetter(id);
        if (result.success) {
            setLetters(letters.filter((l) => l.id !== id));
        }
    };

    const occasionEmoji: Record<string, string> = {
        "생일": "🎂",
        "기념일": "💝",
        "장례": "🕯️",
        "기타": "💭",
    };

    return (
        <div className="min-h-screen bg-[#0A0A0B]">
            <header className="sticky top-0 z-50 bg-[#0A0A0B]/80 backdrop-blur-md border-b border-white/5 h-14 flex items-center px-4">
                <Link href="/memorial" className="p-2 -ml-2 text-white hover:text-gray-300 transition-colors">
                    <ChevronLeft className="w-6 h-6" />
                </Link>
                <h1 className="absolute left-1/2 -translate-x-1/2 text-lg font-bold text-white">편지</h1>
                <Link href="/memorial/1/letters/new" className="ml-auto p-2 text-foon-lime">
                    <Plus className="w-6 h-6" />
                </Link>
            </header>

            <main className="p-4 max-w-[480px] mx-auto">
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-8 h-8 border-2 border-foon-lime border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : letters.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#1e1e20] flex items-center justify-center">
                            <span className="text-4xl">💌</span>
                        </div>
                        <h2 className="text-xl font-bold text-white mb-2">아직 작성된 편지가 없어요</h2>
                        <p className="text-gray-400 text-sm mb-4">떠나보낸 아이에게 첫 번째 편지를 보내보세요</p>
                        <Link
                            href="/memorial/1/letters/new"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-foon-lime text-bg-main font-medium rounded-full"
                        >
                            <Plus className="w-5 h-5" />
                            편지 쓰기
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {letters.map((letter) => (
                            <div key={letter.id} className="bg-[#1e1e20] rounded-2xl p-4 border border-white/5">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-foon-lime">
                                        {occasionEmoji[letter.occasionType] || "💭"} {letter.occasionType}
                                    </span>
                                    <button
                                        onClick={() => handleDelete(letter.id)}
                                        className="p-1.5 text-gray-500 hover:text-red-400 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                                <p className="text-white text-sm leading-relaxed whitespace-pre-wrap">
                                    {letter.content}
                                </p>
                                <p className="text-gray-500 text-xs mt-3">
                                    {new Date(letter.createdAt).toLocaleDateString("ko-KR", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
