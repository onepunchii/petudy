"use client";

import React, { useState } from "react";
import { X, Info, Search } from "lucide-react";

interface ImportRegistrationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onImport: (data: {
        ownerName: string;
        regNumber: string;
        petName?: string;
        species?: "dog" | "cat";
        breed?: string;
        gender?: "male" | "female";
        neuter?: boolean | null;
        org?: string;
    }) => void;
}

export default function ImportRegistrationModal({ isOpen, onClose, onImport }: ImportRegistrationModalProps) {
    const [ownerName, setOwnerName] = useState("");
    const [regNumber, setRegNumber] = useState("");
    const [showTooltip, setShowTooltip] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;

    const handleSearch = async () => {
        if (!ownerName || !regNumber) {
            alert("정보를 모두 입력해주세요.");
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(`/api/animal-registration?dog_reg_no=${regNumber}&owner_nm=${encodeURIComponent(ownerName)}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to fetch data");
            }

            // Check if data body exists (API specific structure)
            const item = data.response?.body?.items?.item;

            if (!item) {
                alert("일치하는 정보가 없습니다. \n입력한 정보를 다시 확인해주세요.");
                return;
            }

            // If multiple items, currently taking the first one or the object itself if single
            const petData = Array.isArray(item) ? item[0] : item;

            // Map API response to our app's format
            // API returns fields like: dogNm, sexNm, kindNm, neuterYn, orgNm
            onImport({
                ownerName,
                regNumber,
                petName: petData.dogNm,
                species: petData.kindNm?.includes("고양이") ? "cat" : "dog", // Simple heuristic
                breed: petData.kindNm?.replace("[개] ", "").replace("[고양이] ", ""),
                gender: petData.sexNm === "암컷" ? "female" : "male",
                neuter: petData.neuterYn === "중성" ? true : false,
                org: petData.orgNm
            });

        } catch (error) {
            console.error("Search failed:", error);
            alert("조회 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md animate-fade-in p-4">
            {/* Modal Container */}
            <div className="bg-bg-card w-full max-w-[380px] rounded-[32px] p-8 shadow-2xl animate-zoom-in relative border border-[#333]">

                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-xl font-bold text-white">동물등록번호 불러오기</h3>
                    <button onClick={onClose} disabled={isLoading} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors disabled:opacity-50">
                        <X className="w-5 h-5" strokeWidth={3} />
                    </button>
                </div>

                <div className="space-y-6">
                    {/* Field 1: Owner Name */}
                    <div className="space-y-2 relative">
                        <div className="flex items-center gap-1">
                            <label className="text-sm font-semibold text-gray-300">
                                등록 반려인
                            </label>
                            <button
                                type="button"
                                onClick={() => setShowTooltip(!showTooltip)}
                                className="text-gray-500 hover:text-foon-lime transition-colors"
                            >
                                <Info className="w-4 h-4" />
                            </button>

                            {/* Tooltip */}
                            {showTooltip && (
                                <div className="absolute left-0 top-8 z-10 bg-[#333] text-gray-200 text-xs px-3 py-2 rounded-lg shadow-xl w-max max-w-[200px] border border-[#444]">
                                    동물등록시 소유자로 신고한 반려인명
                                    <div className="absolute -top-1 left-9 w-2 h-2 bg-[#333] rotate-45 border-l border-t border-[#444]"></div>
                                </div>
                            )}
                        </div>
                        <input
                            type="text"
                            value={ownerName}
                            onChange={(e) => setOwnerName(e.target.value)}
                            placeholder="이름을 입력해주세요"
                            className="w-full bg-bg-input border border-[#333] rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-foon-lime focus:shadow-[0_0_10px_rgba(163,223,70,0.2)] transition-all disabled:bg-[#222] disabled:text-gray-600"
                            disabled={isLoading}
                        />
                    </div>

                    {/* Field 2: Registration Number */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-300">
                            동물등록번호
                        </label>
                        <input
                            type="number"
                            value={regNumber}
                            onChange={(e) => setRegNumber(e.target.value)}
                            placeholder="번호를 입력해주세요"
                            className="w-full bg-bg-input border border-[#333] rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-foon-lime focus:shadow-[0_0_10px_rgba(163,223,70,0.2)] transition-all disabled:bg-[#222] disabled:text-gray-600"
                            disabled={isLoading}
                        />
                    </div>

                    {/* Action Button */}
                    <button
                        onClick={handleSearch}
                        disabled={isLoading}
                        className="w-full bg-foon-lime text-bg-main font-bold text-lg py-4 rounded-2xl shadow-[0_4px_14px_rgba(163,223,70,0.4)] hover:bg-[#bbf080] active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4 disabled:bg-[#333] disabled:text-gray-500 disabled:shadow-none disabled:cursor-wait"
                    >
                        {isLoading ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-bg-main"></div>
                                조회 중...
                            </>
                        ) : (
                            <>
                                <Search className="w-5 h-5" />
                                조회
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
