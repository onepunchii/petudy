"use client";

import { useState } from "react";
import { RankingBanner } from "@/components/contest/RankingBanner";
import { ContestPrizeBanner } from "@/components/contest/ContestPrizeBanner";
import { PhotoCard } from "@/components/contest/PhotoCard";
import { FloatingActionButton } from "@/components/contest/FloatingActionButton";
import { ContestEntry } from "@/components/contest/types";
import { Trophy, ChevronLeft, ChevronRight } from "lucide-react";

// Mock Data
const INITIAL_ENTRIES: ContestEntry[] = [
    {
        id: 1,
        petName: "두부",
        ownerName: "김철수",
        userId: "user-1", // Mock User ID
        imageUrl: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=800&auto=format&fit=crop",
        caption: "우리 두부 윙크하는 거 보세요! 너무 귀엽죠? 🐶",
        voteCount: 1240,
        rank: 1
    },
    {
        id: 2,
        petName: "초코",
        ownerName: "이영희",
        userId: "user-2",
        imageUrl: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=800&auto=format&fit=crop",
        caption: "산책 다녀와서 뻗은 초코... ㅋㅋㅋ",
        voteCount: 980,
        rank: 2
    },
    // ... (Other entries would have userId too, omitted for brevity of diff, but assuming they work or default)
];

// ... imports
import { UploadEntrySheet } from "@/components/contest/UploadEntrySheet";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { createPost, getFeed } from "@/actions/social";

export default function ContestPage() {
    const router = useRouter();
    const [entries, setEntries] = useState<ContestEntry[]>(INITIAL_ENTRIES);
    const [votedIds, setVotedIds] = useState<number[]>([]);
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(12);
    const [isPrizePopupOpen, setIsPrizePopupOpen] = useState(true); // Default open

    // Popup State
    const [recommendation, setRecommendation] = useState<ContestEntry | null>(null);

    const handleVote = (id: number) => {
        if (votedIds.includes(id)) {
            // Unvote
            setVotedIds(prev => prev.filter(vId => vId !== id));
            setEntries(prev => prev.map(entry =>
                entry.id === id ? { ...entry, voteCount: entry.voteCount - 1 } : entry
            ));
        } else {
            // Vote
            setVotedIds(prev => [...prev, id]);
            setEntries(prev => prev.map(entry =>
                entry.id === id ? { ...entry, voteCount: entry.voteCount + 1 } : entry
            ));

            // Trigger Recommendation Popup (Mock Logic: Show for the voted pet)
            const votedEntry = entries.find(e => e.id === id);
            if (votedEntry) {
                setRecommendation(votedEntry);
            }
        }
    };

    const handleFollowFromPopup = async () => {
        if (!recommendation) return;

        // Call Server Action (Mock ID used, in real app ensure proper UUID)
        // Since we are mocking user-1, user-2... real DB expects UUID. 
        // For demo, we might fail silently or we need Real UUIDs.
        // For now, allow close.
        setRecommendation(null);
        alert(`${recommendation.petName}님과 단짝이 되었습니다! 🎉`);
    };

    // ... (rest of filtering logic) ...
    const handlePrevMonth = () => {
        setCurrentMonth(prev => prev === 1 ? 12 : prev - 1);
    };

    const handleNextMonth = () => {
        setCurrentMonth(prev => prev === 12 ? 1 : prev + 1);
    };

    const handleUploadSubmit = async (data: { petId: string; image: File | null; caption: string }) => {
        // ... (existing logic)
        const newEntry: ContestEntry = {
            id: Date.now(),
            petName: "두부", // Mock
            ownerName: "나",
            userId: "me",
            imageUrl: "https://images.unsplash.com/photo-1591769225440-811ad7d6eca6?q=80&w=800&auto=format&fit=crop",
            caption: data.caption,
            voteCount: 0
        };
        setEntries(prev => [newEntry, ...prev]);
        setIsUploadOpen(false);
    };

    const sortedEntries = [...entries].sort((a, b) => b.voteCount - a.voteCount);
    const topEntries = sortedEntries.slice(0, 3);

    return (
        <div className="min-h-screen bg-bg-main pb-24 text-white relative">
            {/* Header */}
            <header className="sticky top-0 bg-bg-main/80 backdrop-blur-md z-30 border-b border-[#333] px-4 h-14 flex items-center justify-between">
                <button onClick={handlePrevMonth} className="p-2 -ml-2 text-gray-400 hover:text-white transition-colors" title="이전 달">
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <h1 className="font-bold text-lg flex items-center gap-2 text-white">
                    <Trophy className="w-5 h-5 text-foon-lime fill-current" />
                    {currentMonth}월 모델 선발대회
                </h1>
                <button onClick={handleNextMonth} className="p-2 -mr-2 text-gray-400 hover:text-white transition-colors" title="다음 달">
                    <ChevronRight className="w-6 h-6" />
                </button>
            </header>

            {/* Main Content */}
            <main>
                {/* Prize Popup */}
                {isPrizePopupOpen && (
                    <ContestPrizeBanner onClose={() => setIsPrizePopupOpen(false)} />
                )}

                <section className="mb-2">
                    <RankingBanner topEntries={topEntries} />
                </section>

                <section className="px-4 mb-4 flex gap-2 overflow-x-auto scrollbar-hide">
                    <button className="px-4 py-2 bg-foon-lime text-bg-main rounded-full text-sm font-bold shadow-[0_0_10px_rgba(163,223,70,0.3)] whitespace-nowrap">
                        🔥 인기순
                    </button>
                    <button className="px-4 py-2 bg-[#2C2C2E] text-gray-400 border border-[#333] rounded-full text-sm font-medium hover:text-white transition-colors whitespace-nowrap">
                        ✨ 최신순
                    </button>
                    <button className="px-4 py-2 bg-[#2C2C2E] text-gray-400 border border-[#333] rounded-full text-sm font-medium hover:text-white transition-colors whitespace-nowrap">
                        🐶 내 단짝
                    </button>
                </section>

                <section className="px-4">
                    <div className="columns-2 gap-4 space-y-4">
                        {entries.map(entry => (
                            <PhotoCard
                                key={entry.id}
                                entry={entry}
                                onVote={handleVote}
                                isVoted={votedIds.includes(entry.id)}
                                onClick={() => router.push(`/profile/${entry.userId || 'mock'}`)} // Go to Profile
                            />
                        ))}
                    </div>
                </section>
            </main>

            <FloatingActionButton onClick={() => setIsUploadOpen(true)} />

            <UploadEntrySheet
                isOpen={isUploadOpen}
                onClose={() => setIsUploadOpen(false)}
                onSubmit={handleUploadSubmit}
            />

            {/* Friend Recommendation Popup */}
            {recommendation && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setRecommendation(null)} />
                    <div className="bg-[#1c1c1e] w-full max-w-sm rounded-[24px] p-6 relative z-10 border border-[#333] shadow-2xl transform transition-all animate-in fade-in zoom-in-95 duration-200">
                        <div className="text-center">
                            <div className="w-24 h-24 mx-auto mb-4 relative rounded-full p-1 bg-gradient-to-tr from-foon-lime to-blue-500">
                                <div className="w-full h-full rounded-full overflow-hidden border-2 border-[#1c1c1e]">
                                    <Image src={recommendation.imageUrl} alt={recommendation.petName} fill className="object-cover" />
                                </div>
                                <div className="absolute bottom-0 right-0 bg-white text-xs font-bold px-2 py-0.5 rounded-full text-black shadow-lg">
                                    비글?
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-1">운명적인 만남? ✨</h3>
                            <p className="text-gray-400 text-sm mb-6">
                                어라? 내 강아지와 비슷한 친구네요!<br />
                                <strong>{recommendation.petName}</strong>님과 단짝이 되어보세요.
                            </p>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setRecommendation(null)}
                                    className="flex-1 py-3.5 bg-[#2C2C2E] text-gray-400 rounded-xl font-bold text-sm"
                                >
                                    괜찮아요
                                </button>
                                <button
                                    onClick={handleFollowFromPopup}
                                    className="flex-1 py-3.5 bg-foon-lime text-black rounded-xl font-bold text-sm shadow-[0_0_15px_rgba(163,223,70,0.3)]"
                                >
                                    단짝 맺기
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
