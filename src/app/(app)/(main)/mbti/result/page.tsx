"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PetPassCard, PetPassData } from "@/components/pet/PetPassCard";
import { Share2, CheckCircle } from "lucide-react";
import { MbtiType } from "@/components/shared/PetPassCard"; // Import MbtiType from shared
import { getPets } from "@/actions/pet";

function MbtiResultContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const type = (searchParams.get("type") as MbtiType) || "SOCIAL";

    const [petData, setPetData] = useState<PetPassData | null>(null);

    useEffect(() => {
        const loadPetData = async () => {
            try {
                const pets = await getPets();
                if (pets && pets.length > 0) {
                    // Try to find the specific pet selected in Intro
                    const storedPetId = localStorage.getItem("currentPetId");
                    const mainPet = pets.find(p => p.id === storedPetId) || pets[0];

                    // Map to PetPassData
                    setPetData({
                        petId: mainPet.id,
                        name: mainPet.name,
                        breed: mainPet.breed || "믹스견",
                        regNum: mainPet.registration_number || "PT-2024-00000",
                        photo: mainPet.photo_url,
                        birth: mainPet.birth_date,
                        gender: mainPet.gender === "male" ? "male" : "female", // Type assertion/mapping
                        neuter: mainPet.neuter || false,
                        color: mainPet.color || "모름",
                        ownerName: "보호자", // TODO: Fetch from user profile (nickname field in users table)
                        description: "우리 아이 멍BTI 검사가 완료되었습니다!\n이제 펫터디에서 맞춤형 서비스를 받아보세요.",
                        stats: { // Mock stats for now as DB doesn't have them
                            size: 3,
                            shedding: 3,
                            social: 4,
                            smart: 5,
                            indoor: 3
                        }
                    });
                } else {
                    // Fallback using LocalStorage if no DB data
                    const storedName = localStorage.getItem("petName") || "두부";
                    const storedPhoto = localStorage.getItem("petPhoto");
                    setPetData({
                        petId: "TEMP",
                        name: storedName,
                        breed: "말티즈",
                        regNum: "PT-TEST-00000",
                        photo: storedPhoto,
                        birth: "2023-01-01",
                        gender: "male",
                        neuter: true,
                        color: "화이트",
                        ownerName: "체험유저",
                        description: "체험용 등록증입니다.",
                        stats: { size: 3, shedding: 2, social: 5, smart: 4, indoor: 3 }
                    });
                }
            } catch (error) {
                console.error("Failed to load pet data:", error);
            }
        };
        loadPetData();
    }, []);

    const handleApplyBadge = () => {
        // Simulate API call to save result
        localStorage.setItem("petMbtiType", type);
        alert("뱃지가 반려동물 등록증에 적용되었습니다!");
        router.push("/");
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: '멍BTI 결과',
                text: `우리 ${petData?.name || "아이"}의 성격 유형은?`,
                url: window.location.href,
            });
        } else {
            alert("링크가 복사되었습니다.");
        }
    };

    return (
        <div className="min-h-screen bg-bg-main flex flex-col pb-10 text-white relative overflow-hidden">
            {/* Ambient Glow */}
            <div className="absolute top-0 right-0 w-full h-[500px] bg-foon-lime/5 blur-[120px] pointer-events-none" />

            <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-8 relative z-10">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-white mb-2 leading-tight">분석 완료!</h2>
                    <p className="text-gray-400 font-light">
                        우리 아이에게 딱 맞는 <span className="text-foon-lime font-bold">뱃지</span>가 발급되었어요.
                    </p>
                </div>

                {/* Card Display */}
                <div className="transform transition-all duration-700 hover:scale-[1.02] shadow-2xl">
                    {petData ? (
                        <PetPassCard
                            data={petData}
                            mbtiType={type}
                        />
                    ) : (
                        <div className="w-[400px] h-[640px] flex items-center justify-center bg-[#1f1f1f] rounded-[30px] animate-pulse">
                            Loading...
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="w-full space-y-3 max-w-sm">
                    <button
                        onClick={handleApplyBadge}
                        className="w-full bg-foon-lime text-bg-main font-black text-lg py-4 rounded-xl shadow-[0_0_20px_rgba(163,223,70,0.3)] hover:bg-[#bbf080] transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                    >
                        <CheckCircle className="w-5 h-5" />
                        반려동물 등록증에 뱃지 달기
                    </button>
                    <button
                        onClick={handleShare}
                        className="w-full bg-bg-card text-gray-300 font-bold py-4 rounded-xl border border-[#333] hover:bg-[#252527] transition-all flex items-center justify-center gap-2"
                    >
                        <Share2 className="w-5 h-5" />
                        결과 공유하기
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function MbtiResultPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-bg-main" />}>
            <MbtiResultContent />
        </Suspense>
    );
}
