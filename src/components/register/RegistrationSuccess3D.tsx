"use client";

import React, { useState, useEffect, useRef } from "react";
import { PetFormData } from "@/actions/pet";
import { PetPassCard, PetPassData } from "@/components/pet/PetPassCard";
import { Camera, Home, LoaderCircle, PartyPopper, X } from "lucide-react";
import { APP_ICON_STROKE, AppButton, appButtonClass } from "@/components/app/ui";
import { cn } from "@/lib/utils";
import { ALL_PET_BREEDS } from "@/data/petData";

// Extend PetFormData to include client-side ephemeral data
interface ExtendedPetFormData extends PetFormData {
    petId?: string;
    ownerName?: string;
    imageParams?: {
        base64?: string;
    };
    mbtiResult?: {
        result?: {
            description?: string;
        };
        scores?: {
            energy?: number;
            social?: number;
            smart?: number;
        };
    };
}

interface RegistrationSuccess3DProps {
    onComplete: () => void;
    formData: ExtendedPetFormData;
    viewMode?: boolean;
    petId?: string;
}

export default function RegistrationSuccess3D({
    onComplete,
    formData,
    viewMode = false,
    petId,
}: RegistrationSuccess3DProps) {
    const [showPopup, setShowPopup] = useState(false);
    const [cardData, setCardData] = useState<PetPassData | null>(null);
    const [isDownloading, setIsDownloading] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    // Initial Data Mapping
    useEffect(() => {
        // Find matching breed data
        const breedData = ALL_PET_BREEDS.find(
            (b) => b.name === formData.breed && (!formData.species || b.species === formData.species)
        );

        const getSizeFromWeight = (w: string | null) => {
            const weight = parseFloat(w || "0");
            if (weight < 5) return 1;
            if (weight < 10) return 2;
            if (weight < 20) return 3;
            if (weight < 30) return 4;
            return 5;
        };

        const initialPassData: PetPassData = {
            petId: formData.petId || petId || "UNKNOWN",
            name: formData.name,
            breed: formData.breed || "믹스",
            regNum: formData.reg_number || "미등록",
            photo: formData.imageParams?.base64 || formData.photo || null,
            birth: formData.birth,
            gender: formData.gender,
            neuter: formData.neuter === true,
            color: formData.color || "미상",
            ownerName: formData.ownerName || "소유자",
            description: formData.mbtiResult?.result?.description || breedData?.description || `"세상에 하나뿐인 나만의 소중한 반려동물입니다."`,
            stats: {
                size: breedData?.traits.size || getSizeFromWeight(formData.weight),
                shedding: breedData?.traits.shedding || 3,
                social: breedData?.traits.friendliness || Math.ceil((formData.mbtiResult?.scores?.social || 50) / 20),
                smart: breedData?.traits.trainability || Math.ceil((formData.mbtiResult?.scores?.smart || 50) / 20),
                indoor: breedData?.traits.energy || 3,
            },
        };

        const convertPhoto = async () => {
            if (initialPassData.photo && initialPassData.photo.startsWith("http")) {
                try {
                    const response = await fetch(initialPassData.photo, { mode: 'cors' });
                    const blob = await response.blob();
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        setCardData({ ...initialPassData, photo: reader.result as string });
                    };
                    reader.readAsDataURL(blob);
                } catch (e) {
                    console.error("Failed to convert image to base64", e);
                    setCardData(initialPassData); // Fallback to original URL
                }
            } else {
                setCardData(initialPassData);
            }
        };

        convertPhoto();
    }, [formData, petId]); // Removed breedData from dependency to avoid loop (it's derived inside)


    useEffect(() => {
        if (!viewMode) {
            const timer = setTimeout(() => setShowPopup(true), 500);
            const hideTimer = setTimeout(() => setShowPopup(false), 3000);
            return () => {
                clearTimeout(timer);
                clearTimeout(hideTimer);
            };
        }
    }, [viewMode]);

    const handleDownload = async () => {
        if (!cardRef.current || !cardData) return; // check cardData
        setIsDownloading(true);

        try {
            // Short delay to ensure rendering artifacts are settled
            await new Promise(resolve => setTimeout(resolve, 100));

            const html2canvas = (await import("html2canvas")).default;
            const canvas = await html2canvas(cardRef.current, {
                scale: 2,
                useCORS: true,
                backgroundColor: null,
                logging: false,
                allowTaint: false, // Must be false for toDataURL
            });

            const image = canvas.toDataURL("image/png");
            const link = document.createElement("a");
            link.href = image;
            link.download = `po-on_PASS_${cardData.name}.png`;
            link.click();
        } catch (err) {
            console.error("Download Failed:", err);
            alert(`이미지 저장 실패: ${err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다."}`);
        } finally {
            setIsDownloading(false);
        }
    };

    if (!cardData) return null; // Loading state if needed

    /* 등록 완료 연출: 짧은 전체 화면이라 밤 바탕을 씁니다(8장 예외). 강조 버튼은 "홈으로" 하나만 라임 */
    return (
        <div className="absolute inset-0 z-50 isolate flex h-full w-full touch-none flex-col items-center justify-center overflow-hidden bg-night pb-10 text-star">
            <div className="site-stars -z-10" aria-hidden />

            {/* Success Popup */}
            {!viewMode && (
                <div
                    className={cn(
                        "absolute left-1/2 top-1/4 z-[60] -translate-x-1/2 transition-all duration-500 motion-reduce:transition-none",
                        showPopup ? "translate-y-0 scale-100 opacity-100" : "pointer-events-none translate-y-10 scale-90 opacity-0",
                    )}
                >
                    <div className="flex items-center gap-3 rounded-full bg-star px-7 py-3.5 shadow-[0_16px_40px_-12px_rgb(11_16_32/0.6)]">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-night text-star">
                            <PartyPopper className="h-4 w-4" strokeWidth={APP_ICON_STROKE} aria-hidden />
                        </span>
                        <span className="text-[17px] font-extrabold tracking-tight text-ink">완료!!</span>
                    </div>
                </div>
            )}

            {/* Pass Card Container (Render Client Component) */}
            <div className="relative z-30 -mt-8 flex w-[400px] origin-top scale-[0.85] flex-col sm:scale-95">
                <PetPassCard
                    ref={cardRef}
                    data={cardData}
                />
            </div>

            {/* Bottom Controls */}
            <div className="absolute bottom-10 left-0 right-0 z-50 flex justify-center gap-3 px-6">
                {viewMode ? (
                    <button
                        type="button"
                        onClick={onComplete}
                        className={appButtonClass({ variant: "onNightGhost", size: "lg", className: "w-14 bg-white/10 px-0" })}
                        title="닫기"
                        aria-label="닫기"
                    >
                        <X className="h-6 w-6" strokeWidth={APP_ICON_STROKE} aria-hidden />
                    </button>
                ) : (
                    <div className="flex w-full max-w-[400px] gap-3">
                        {/* Download Button (Left) */}
                        <AppButton
                            variant="onNightGhost"
                            size="lg"
                            onClick={handleDownload}
                            disabled={isDownloading}
                            aria-label="저장하기"
                            aria-busy={isDownloading}
                            className="flex-1 bg-white/10 disabled:opacity-100"
                        >
                            {isDownloading ? (
                                <LoaderCircle className="h-5 w-5 animate-spin" strokeWidth={APP_ICON_STROKE} aria-hidden />
                            ) : (
                                <>
                                    <Camera className="h-5 w-5" strokeWidth={APP_ICON_STROKE} aria-hidden />
                                    저장하기
                                </>
                            )}
                        </AppButton>

                        {/* Home Button (Right) */}
                        <AppButton variant="accent" size="lg" onClick={onComplete} className="flex-1">
                            <Home className="h-5 w-5" strokeWidth={APP_ICON_STROKE} aria-hidden />
                            <span>홈으로</span>
                        </AppButton>
                    </div>
                )}
            </div>
        </div>
    );
}
