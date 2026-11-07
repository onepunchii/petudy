"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PetPassCard, PetPassData } from "@/components/pet/PetPassCard";
import { Share2, CheckCircle } from "lucide-react";
import { MbtiType } from "@/components/shared/PetPassCard"; // Import MbtiType from shared
import { getPets } from "@/actions/pet";
import { APP_ICON_STROKE, AppBody, AppButton, AppHero, BRAND_ICON, skeletonClass } from "@/components/app/ui";
import { Porthole } from "@/components/site/ui";
import { cn } from "@/lib/utils";

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
                        description: "우리 아이 멍BTI 검사가 완료되었습니다!\n이제 포온에서 맞춤형 서비스를 받아보세요.",
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
        router.push("/app");
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
        <div className="min-h-full bg-moon">
            <AppHero
                title="분석 완료!"
                subtitle={
                    <>
                        우리 아이에게 딱 맞는 <span className="font-semibold text-star">뱃지</span>가 발급되었어요.
                    </>
                }
                action={<Porthole src={BRAND_ICON.mbti} size={72} />}
            />

            <AppBody className="flex flex-col items-center gap-8 pb-10">
                {/* Card Display: 펫패스는 400px 고정이라 좁은 화면에서는 줄여 보여 줍니다 */}
                <div className="flex w-full justify-center">
                    <div className="w-[400px] shrink-0 origin-top max-[439px]:-mb-24 max-[439px]:scale-[0.85]">
                        {petData ? (
                            <PetPassCard
                                data={petData}
                                mbtiType={type}
                            />
                        ) : (
                            <div className={cn(skeletonClass, "flex h-[640px] w-[400px] items-center justify-center rounded-[28px] text-[14px] text-ink-3")}>
                                Loading...
                            </div>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="w-full max-w-sm space-y-3">
                    <AppButton variant="accent" size="lg" block onClick={handleApplyBadge}>
                        <CheckCircle className="h-5 w-5" strokeWidth={APP_ICON_STROKE} aria-hidden />
                        반려동물 등록증에 뱃지 달기
                    </AppButton>
                    <AppButton variant="secondary" size="lg" block onClick={handleShare}>
                        <Share2 className="h-5 w-5" strokeWidth={APP_ICON_STROKE} aria-hidden />
                        결과 공유하기
                    </AppButton>
                </div>
            </AppBody>
        </div>
    );
}

export default function MbtiResultPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-moon" />}>
            <MbtiResultContent />
        </Suspense>
    );
}
