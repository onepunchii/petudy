"use client";

import React, { useState, useEffect, useRef } from "react";
import { PetFormData } from "@/actions/pet";
import { PetPassCard, PetPassData } from "@/components/pet/PetPassCard";
import { Home, X } from "lucide-react";
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
            link.download = `foon_PASS_${cardData.name}.png`;
            link.click();
        } catch (err) {
            console.error("Download Failed:", err);
            alert(`이미지 저장 실패: ${err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다."}`);
        } finally {
            setIsDownloading(false);
        }
    };

    if (!cardData) return null; // Loading state if needed

    return (
        <div className="absolute inset-0 z-50 bg-bg-main flex flex-col items-center justify-center font-sans pb-10 overflow-hidden touch-none h-full w-full">
            {/* Ambient Background Glow */}
            <div className="absolute top-[-20%] left-[-20%] w-[500px] h-[500px] bg-foon-lime rounded-full blur-[150px] opacity-10 pointer-events-none"></div>

            {/* Success Popup */}
            {!viewMode && (
                <div
                    className={`absolute top - 1 / 4 left - 1 / 2 - translate - x - 1 / 2 z - [60] transition - all duration - 500 transform ${showPopup ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-10 scale-90 pointer-events-none"} `}
                >
                    <div className="bg-white/90 backdrop-blur-md px-8 py-4 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.2)] border border-white/20 flex items-center gap-3">
                        <div className="w-8 h-8 bg-foon-lime rounded-full flex items-center justify-center text-lg shadow-sm animate-bounce">
                            🎉
                        </div>
                        <span className="text-gray-900 font-black text-lg tracking-tight">완료!!</span>
                    </div>
                </div>
            )}

            {/* Pass Card Container (Render Client Component) */}
            <div className="relative z-30 -mt-8 w-[380px] bg-transparent flex flex-col origin-top transform scale-[0.85] sm:scale-95">
                <PetPassCard
                    ref={cardRef}
                    data={cardData}
                />
            </div>

            {/* Bottom Controls */}
            <div className="absolute bottom-10 left-0 right-0 flex justify-center z-50 px-6 gap-3">
                {viewMode ? (
                    <button
                        onClick={onComplete}
                        className="w-14 h-14 bg-[#333]/80 hover:bg-[#444] backdrop-blur-md rounded-full border border-white/10 shadow-lg flex items-center justify-center text-white active:scale-95 transition-all"
                        title="닫기"
                    >
                        <X className="w-6 h-6" />
                    </button>
                ) : (
                    <div className="flex gap-3 w-full max-w-[400px]">
                        {/* Download Button (Left) */}
                        <button
                            onClick={handleDownload}
                            disabled={isDownloading}
                            className="flex-1 bg-[#333]/80 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-[#444] backdrop-blur-md border border-white/10 active:scale-95 transition-all flex items-center justify-center gap-2"
                        >
                            {isDownloading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>📸 저장하기</>}
                        </button>

                        {/* Home Button (Right) */}
                        <button
                            onClick={onComplete}
                            className="flex-1 bg-foon-lime text-black font-bold py-4 rounded-2xl shadow-[0_4px_20px_rgba(163,223,70,0.4)] hover:bg-[#92c93e] active:scale-95 transition-all flex items-center justify-center gap-2"
                        >
                            <Home className="w-5 h-5" />
                            <span>홈으로</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
