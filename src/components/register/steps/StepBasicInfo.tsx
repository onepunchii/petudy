import React, { useState } from "react";
import { Check, IdCard, Search, X, Info } from "lucide-react";
import Image from "next/image";
import { ALL_PET_BREEDS } from "@/data/petData";
import { APP_ICON_STROKE, AppButton, appCardClass, appInputClass, appOptionClass } from "@/components/app/ui";
import { PET_NAME_MAX } from "@/lib/pet-rules";
import { cn } from "@/lib/utils";
import PetCharacteristicBars from "../PetCharacteristicBars";

import BreedSelectDrawer from "./BreedSelectDrawer";

interface StepBasicInfoProps {
    stepId: "name" | "species" | "breed";
    formData: {
        name: string;
        species: "dog" | "cat" | null | undefined;
        breed: string | null;
        [key: string]: any;
    };
    onChange: (field: string, value: any) => void;
    /** 이름 칸 오류 문구 (name 단계) */
    nameError?: string | null;
    onOpenImport?: () => void;
    // Drawer Props
    isBreedDrawerOpen?: boolean;
    onBreedDrawerOpenChange?: (open: boolean) => void;
}

const stepTitleClass = "text-[24px] font-bold leading-[1.35] text-ink";

/** 선택 카드 오른쪽 위 체크 (appOptionClass: 남색 테두리 + 체크) */
function SelectedCheck() {
    return (
        <span className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-night text-star" aria-hidden>
            <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
        </span>
    );
}

export default function StepBasicInfo({
    stepId,
    formData,
    onChange,
    nameError,
    onOpenImport,
    isBreedDrawerOpen = false,
    onBreedDrawerOpenChange
}: StepBasicInfoProps) {
    const [expandedBreed, setExpandedBreed] = useState<string | null>(null);

    // Helper to open drawer (if handler provided)
    const openDrawer = () => onBreedDrawerOpenChange?.(true);
    const closeDrawer = () => onBreedDrawerOpenChange?.(false);

    if (stepId === "name") {
        return (
            <div className="flex flex-col">
                <h2 id="step-name-title" className={cn(stepTitleClass, "mb-8")}>
                    아이의 이름은 무엇인가요?
                </h2>
                <input
                    type="text"
                    maxLength={PET_NAME_MAX}
                    value={formData.name || ""}
                    onChange={(e) => onChange("name", e.target.value)}
                    aria-labelledby="step-name-title"
                    aria-invalid={!!nameError}
                    aria-describedby={nameError ? "step-name-error" : undefined}
                    className={cn(appInputClass, "h-14 text-[18px] font-semibold", nameError && "ring-2 ring-danger focus:ring-danger")}
                    placeholder="이름을 입력해주세요"
                    autoFocus
                />
                {nameError && (
                    <p id="step-name-error" role="alert" className="mt-2 text-[13px] font-semibold leading-snug text-danger">
                        {nameError}
                    </p>
                )}
            </div>
        );
    }

    if (stepId === "species") {
        return (
            <div className="flex flex-col">
                <h2 className={cn(stepTitleClass, "mb-8")}>
                    어떤 친구인가요?
                </h2>
                <div className="grid grid-cols-2 gap-3">
                    <button
                        type="button"
                        onClick={() => onChange("species", "dog")}
                        aria-pressed={formData.species === "dog"}
                        className={appOptionClass(formData.species === "dog", "relative flex h-48 flex-col items-center justify-center gap-3")}
                    >
                        {formData.species === "dog" && <SelectedCheck />}
                        <div className="relative h-24 w-24">
                            <Image
                                src="/images/dog-character.png"
                                alt="강아지"
                                fill
                                sizes="96px"
                                className="object-contain"
                            />
                        </div>
                        <span className="text-[18px] font-bold text-ink">강아지</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => onChange("species", "cat")}
                        aria-pressed={formData.species === "cat"}
                        className={appOptionClass(formData.species === "cat", "relative flex h-48 flex-col items-center justify-center gap-3")}
                    >
                        {formData.species === "cat" && <SelectedCheck />}
                        <div className="relative h-24 w-24">
                            <Image
                                src="/images/cat-character.png"
                                alt="고양이"
                                fill
                                sizes="96px"
                                className="object-contain"
                            />
                        </div>
                        <span className="text-[18px] font-bold text-ink">고양이</span>
                    </button>
                </div>

                {onOpenImport && (
                    <div className="mt-8 border-t border-line pt-6">
                        <AppButton variant="secondary" size="lg" block onClick={onOpenImport}>
                            <IdCard className="h-5 w-5 text-ink-2" strokeWidth={APP_ICON_STROKE} aria-hidden />
                            동물등록번호 불러오기
                        </AppButton>
                        <p className="mt-3 text-center text-[13px] text-ink-3">
                            * 이미 등록된 정보를 간편하게 가져올 수 있어요.
                        </p>
                    </div>
                )}
            </div>
        );
    }

    if (stepId === "breed") {
        const selectedBreedData = ALL_PET_BREEDS.find(b => b.name === formData.breed && b.species === formData.species);
        const headerText = formData.species === "cat" ? "묘종이 무엇인가요?" : "견종이 무엇인가요?";

        return (
            <div className="flex flex-col gap-4">
                <h2 className={cn(stepTitleClass, "mb-4")}>
                    {headerText}
                </h2>

                {!selectedBreedData ? (
                    /* Search Trigger */
                    <button
                        type="button"
                        onClick={openDrawer}
                        className={cn(appInputClass, "flex h-14 items-center gap-3 text-left text-[15px] text-ink-3 hover:ring-ink/30")}
                    >
                        <Search className="h-5 w-5 shrink-0" strokeWidth={APP_ICON_STROKE} aria-hidden />
                        <span className="min-w-0 truncate">
                            {formData.species === "cat"
                                ? "고양이에 맞는 (예: 코숏, 페르시안...)"
                                : "강아지에 맞는 (예: 말티즈, 푸들...)"}
                        </span>
                    </button>
                ) : (
                    /* Selected Breed Info */
                    <div className={cn(appCardClass, "relative shrink-0 p-5 pr-12")}>
                        <button
                            type="button"
                            onClick={() => {
                                onChange("breed", null);
                                openDrawer();
                            }}
                            aria-label="품종 다시 고르기"
                            className="absolute right-2 top-2 flex h-10 w-10 items-center justify-center rounded-full text-ink-3 transition-colors hover:bg-paper-2 hover:text-ink"
                        >
                            <X className="h-5 w-5" strokeWidth={APP_ICON_STROKE} aria-hidden />
                        </button>
                        <div className="mb-2 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                            <span className="text-[18px] font-bold text-ink">{selectedBreedData.name}</span>
                            <span className="text-[13px] text-ink-3">{selectedBreedData.origin}</span>
                        </div>
                        {selectedBreedData.description && (
                            <div className="relative">
                                <p
                                    className={cn(
                                        "text-[15px] leading-relaxed text-ink-2",
                                        expandedBreed === selectedBreedData.name ? "whitespace-pre-wrap" : "line-clamp-2 pr-8",
                                    )}
                                    onClick={() => setExpandedBreed(expandedBreed === selectedBreedData.name ? null : selectedBreedData.name)}
                                >
                                    {selectedBreedData.description}
                                </p>
                                {selectedBreedData.description.length > 50 && (
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setExpandedBreed(expandedBreed === selectedBreedData.name ? null : selectedBreedData.name);
                                        }}
                                        aria-label="품종 설명 펼치기"
                                        aria-expanded={expandedBreed === selectedBreedData.name}
                                        className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full bg-pass text-pine transition-colors after:absolute after:-inset-1.5 after:content-[''] hover:bg-paper-2"
                                    >
                                        <Info className="h-4 w-4" strokeWidth={APP_ICON_STROKE} aria-hidden />
                                    </button>
                                )}
                            </div>
                        )}
                        <PetCharacteristicBars traits={selectedBreedData.traits} />
                    </div>
                )}

                {/* Fallback Mix display if selected but not in data (e.g. "믹스") */}
                {formData.breed === "믹스" && !selectedBreedData && (
                    <div className={cn(appCardClass, "relative shrink-0 p-5 pr-12")}>
                        <button
                            type="button"
                            onClick={() => onChange("breed", null)}
                            aria-label="품종 다시 고르기"
                            className="absolute right-2 top-2 flex h-10 w-10 items-center justify-center rounded-full text-ink-3 transition-colors hover:bg-paper-2 hover:text-ink"
                        >
                            <X className="h-5 w-5" strokeWidth={APP_ICON_STROKE} aria-hidden />
                        </button>
                        <div className="mb-1 text-[18px] font-bold text-ink">믹스 (Mix)</div>
                        <div className="text-[14px] text-ink-2">해당하는 품종이 없어요</div>
                    </div>
                )}

                <BreedSelectDrawer
                    isOpen={isBreedDrawerOpen}
                    onClose={closeDrawer}
                    onSelect={(breed) => onChange("breed", breed)}
                    species={formData.species}
                />
            </div>
        );
    }

    return null;
}
