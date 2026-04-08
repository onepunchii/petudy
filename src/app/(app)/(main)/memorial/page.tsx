"use client";

import { ChevronLeft, Heart, PenLine, Image, Mail } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Pet {
    id: string;
    petName: string;
    species: string;
    profilePhotoUrl?: string;
}

export default function MemorialPage() {
    const [pets, setPets] = useState<Pet[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // TODO: Fetch user's pets from Supabase
        // For now, mock data
        setTimeout(() => {
            setPets([
                { id: "1", petName: "두부", species: "DOG" },
            ]);
            setLoading(false);
        }, 500);
    }, []);

    return (
        <div className="min-h-screen bg-[#0A0A0B]">
            <header className="sticky top-0 z-50 bg-[#0A0A0B]/80 backdrop-blur-md border-b border-white/5 h-14 flex items-center px-4">
                <div className="w-full max-w-[480px] mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Heart className="w-5 h-5 text-foon-lime" />
                        <h1 className="text-lg font-bold text-white">추억상자</h1>
                    </div>
                </div>
            </header>

            <main className="p-4 max-w-[480px] mx-auto">
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-8 h-8 border-2 border-foon-lime border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : pets.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#1e1e20] flex items-center justify-center">
                            <Heart className="w-10 h-10 text-gray-500" />
                        </div>
                        <h2 className="text-xl font-bold text-white mb-2">아직 추억상자에 담을 수 있는 아이가 없어요</h2>
                        <p className="text-gray-400 text-sm">마이페이지에서 반려동물을 등록해주세요</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {pets.map((pet) => (
                            <div key={pet.id} className="bg-[#1e1e20] rounded-2xl p-4 border border-white/5">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 rounded-full bg-foon-lime/20 flex items-center justify-center">
                                        <span className="text-lg">🐾</span>
                                    </div>
                                    <div>
                                        <h2 className="text-white font-bold">{pet.petName}</h2>
                                        <p className="text-gray-400 text-sm">{pet.species === "DOG" ? "강아지" : "고양이"}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-2">
                                    <Link
                                        href={`/memorial/${pet.id}/letters`}
                                        className="flex flex-col items-center gap-1.5 p-3 bg-[#252527] rounded-xl hover:bg-[#2a2a2c] transition-colors"
                                    >
                                        <PenLine className="w-5 h-5 text-foon-lime" />
                                        <span className="text-xs text-gray-300">편지</span>
                                    </Link>
                                    <Link
                                        href={`/memorial/${pet.id}/photos`}
                                        className="flex flex-col items-center gap-1.5 p-3 bg-[#252527] rounded-xl hover:bg-[#2a2a2c] transition-colors"
                                    >
                                        <Image className="w-5 h-5 text-foon-lime" />
                                        <span className="text-xs text-gray-300">사진</span>
                                    </Link>
                                    <Link
                                        href={`/memorial/${pet.id}/obituary`}
                                        className="flex flex-col items-center gap-1.5 p-3 bg-[#252527] rounded-xl hover:bg-[#2a2a2c] transition-colors"
                                    >
                                        <Mail className="w-5 h-5 text-foon-lime" />
                                        <span className="text-xs text-gray-300">부고장</span>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
