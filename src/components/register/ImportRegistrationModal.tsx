"use client";

import React, { useState } from "react";
import { X, Info, Search } from "lucide-react";
import { APP_ICON_STROKE, AppButton, appInputClass, appLabelClass, dialogPanelClass, sheetBackdropClass } from "@/components/app/ui";
import { cn } from "@/lib/utils";

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
            const response = await fetch(`/api/animal-registration?dog_reg_no=${encodeURIComponent(regNumber)}&owner_nm=${encodeURIComponent(ownerName)}`);
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
                // "중성" / "미중성" 외의 값은 모름(null)으로 둡니다
                neuter: petData.neuterYn === "중성" ? true : petData.neuterYn === "미중성" ? false : null,
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
        <div className={cn(sheetBackdropClass, "z-[100] flex items-center justify-center p-4")}>
            {/* Modal Container */}
            <div role="dialog" aria-modal="true" aria-labelledby="import-registration-title" className={cn(dialogPanelClass, "relative")}>

                {/* Header */}
                <div className="mb-6 flex items-center justify-between gap-3">
                    <h3 id="import-registration-title" className="text-[19px] font-bold text-ink">동물등록번호 불러오기</h3>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isLoading}
                        aria-label="닫기"
                        className="-mr-2 flex h-10 w-10 items-center justify-center rounded-full text-ink-2 transition-colors hover:bg-paper-2 hover:text-ink disabled:opacity-50"
                    >
                        <X className="h-5 w-5" strokeWidth={APP_ICON_STROKE} aria-hidden />
                    </button>
                </div>

                <div className="space-y-5">
                    {/* Field 1: Owner Name */}
                    <div className="relative">
                        <div className="mb-2 flex items-center gap-1">
                            <label htmlFor="import-owner-name" className="text-[14px] font-semibold text-ink">
                                등록 반려인
                            </label>
                            <button
                                type="button"
                                onClick={() => setShowTooltip(!showTooltip)}
                                aria-label="등록 반려인 안내"
                                aria-expanded={showTooltip}
                                className="-my-2 flex h-10 w-10 items-center justify-center rounded-full text-ink-3 transition-colors hover:bg-paper-2 hover:text-pine"
                            >
                                <Info className="h-4 w-4" strokeWidth={APP_ICON_STROKE} aria-hidden />
                            </button>

                            {/* Tooltip */}
                            {showTooltip && (
                                <div role="note" className="absolute left-0 top-9 z-10 w-max max-w-[220px] rounded-xl bg-pass px-3 py-2 text-[13px] leading-snug text-ink-2 shadow-[0_8px_24px_-12px_rgb(31_39_66/0.35)] ring-1 ring-line">
                                    동물등록시 소유자로 신고한 반려인명
                                    <div className="absolute -top-1 left-[5.25rem] h-2 w-2 rotate-45 border-l border-t border-line bg-pass" aria-hidden></div>
                                </div>
                            )}
                        </div>
                        <input
                            id="import-owner-name"
                            type="text"
                            value={ownerName}
                            onChange={(e) => setOwnerName(e.target.value)}
                            placeholder="이름을 입력해주세요"
                            className={appInputClass}
                            disabled={isLoading}
                        />
                    </div>

                    {/* Field 2: Registration Number */}
                    <div>
                        <label htmlFor="import-reg-number" className={appLabelClass}>
                            동물등록번호
                        </label>
                        <input
                            id="import-reg-number"
                            type="text"
                            inputMode="numeric"
                            autoComplete="off"
                            value={regNumber}
                            // 붙여넣은 "410-1234-…" 처럼 구분 기호가 섞여도 숫자 15자리를 다 남기도록, 숫자만 고른 뒤 자릅니다
                            onChange={(e) => setRegNumber(e.target.value.replace(/\D/g, "").slice(0, 15))}
                            placeholder="번호를 입력해주세요"
                            className={cn(appInputClass, "tabular-nums")}
                            disabled={isLoading}
                        />
                    </div>

                    {/* Action Button */}
                    <AppButton variant="primary" size="lg" block onClick={handleSearch} disabled={isLoading} className="mt-2">
                        {isLoading ? (
                            <>
                                <span className="h-5 w-5 animate-spin rounded-full border-2 border-star/30 border-t-star motion-reduce:animate-none" aria-hidden></span>
                                조회 중...
                            </>
                        ) : (
                            <>
                                <Search className="h-5 w-5" strokeWidth={APP_ICON_STROKE} aria-hidden />
                                조회
                            </>
                        )}
                    </AppButton>
                </div>
            </div>
        </div>
    );
}
