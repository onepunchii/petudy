"use client";

import { useEffect, useState } from "react";
import { getObituaryByToken } from "@/actions/memorial";

interface Obituary {
    title: string;
    content: string;
    createdAt: Date;
}

export default function SharedObituaryPage({ params }: { params: { token: string } }) {
    const [obituary, setObituary] = useState<Obituary | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadObituary();
    }, []);

    const loadObituary = async () => {
        const result = await getObituaryByToken(params.token);
        if (result.success && result.data) {
            setObituary(result.data as any);
        }
        setLoading(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-foon-lime border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!obituary) {
        return (
            <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-white mb-2">부고장을 찾을 수 없습니다</h1>
                    <p className="text-gray-400">유효하지 않은 링크입니다.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0A0A0B]">
            <main className="p-6 max-w-[480px] mx-auto">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-foon-lime/20 flex items-center justify-center">
                        <span className="text-3xl">🕯️</span>
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2">{obituary.title}</h1>
                    <p className="text-gray-400 text-sm">
                        {new Date(obituary.createdAt).toLocaleDateString("ko-KR", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                    </p>
                </div>

                <div className="bg-[#1e1e20] rounded-2xl p-6 border border-white/5">
                    <p className="text-white leading-relaxed whitespace-pre-wrap">{obituary.content}</p>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-gray-500 text-xs">po-on에서 제작된 부고장입니다</p>
                </div>
            </main>
        </div>
    );
}
