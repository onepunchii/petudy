
import React, { useState } from "react";
import { Search, X, Info } from "lucide-react";
import Image from "next/image";
import { ALL_PET_BREEDS } from "@/data/petData";
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
    onOpenImport?: () => void;
    // Drawer Props
    isBreedDrawerOpen?: boolean;
    onBreedDrawerOpenChange?: (open: boolean) => void;
}

export default function StepBasicInfo({
    stepId,
    formData,
    onChange,
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
            <div className="space-y-4 animate-fade-in-up h-full flex flex-col justify-center">
                <h2 className="text-2xl font-bold text-white mb-10 text-center">
                    아이의 이름은 무엇인가요?
                </h2>
                <input
                    type="text"
                    value={formData.name || ""}
                    onChange={(e) => onChange("name", e.target.value)}
                    className="w-full bg-bg-input border border-[#333] rounded-xl p-4 text-white text-lg focus:border-foon-lime focus:outline-none transition-colors text-center"
                    placeholder="이름을 입력해주세요"
                    autoFocus
                />
            </div>
        );
    }

    if (stepId === "species") {
        return (
            <div className="space-y-6 animate-fade-in-up h-full flex flex-col justify-center">
                <h2 className="text-2xl font-bold mb-10 text-white text-center">
                    어떤 친구인가요?
                </h2>
                <div className="grid grid-cols-2 gap-4">
                    <button
                        onClick={() => onChange("species", "dog")}
                        className={`p-6 rounded-2xl border transition-all flex flex-col items-center justify-center gap-3 h-48 ${formData.species === "dog"
                            ? "bg-foon-lime/20 border-foon-lime text-foon-lime"
                            : "bg-bg-input border-[#333] text-gray-400 hover:bg-[#252527]"
                            }`}
                    >
                        <div className="relative w-24 h-24">
                            <Image
                                src="/images/dog-character.png"
                                alt="강아지"
                                fill
                                className="object-contain"
                            />
                        </div>
                        <span className="text-xl font-bold">강아지</span>
                    </button>
                    <button
                        onClick={() => onChange("species", "cat")}
                        className={`p-6 rounded-2xl border transition-all flex flex-col items-center justify-center gap-3 h-48 ${formData.species === "cat"
                            ? "bg-foon-lime/20 border-foon-lime text-foon-lime"
                            : "bg-bg-input border-[#333] text-gray-400 hover:bg-[#252527]"
                            }`}
                    >
                        <div className="relative w-24 h-24">
                            <Image
                                src="/images/cat-character.png"
                                alt="고양이"
                                fill
                                className="object-contain"
                            />
                        </div>
                        <span className="text-xl font-bold">고양이</span>
                    </button>
                </div>

                {onOpenImport && (
                    <div className="mt-8 pt-4 border-t border-[#333]">
                        <button
                            type="button"
                            onClick={onOpenImport}
                            className="w-full bg-[#333] p-4 rounded-xl flex items-center justify-center text-gray-300 font-bold hover:bg-[#444] transition-colors border border-gray-700"
                        >
                            동물등록번호 불러오기
                        </button>
                        <p className="text-center text-xs text-gray-500 mt-2">
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
            <div className="space-y-4 animate-fade-in-up h-[60vh] flex flex-col">
                <h2 className="text-2xl font-bold text-white mb-10 text-center">
                    {headerText}
                </h2>

                {!selectedBreedData ? (
                    /* Search Trigger */
                    <button
                        onClick={openDrawer}
                        className="relative w-full text-left"
                    >
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <div className="w-full bg-bg-input border border-[#333] rounded-xl pl-12 pr-4 py-4 text-gray-400 text-sm">
                            {formData.species === "cat"
                                ? "고양이에 맞는 (예: 코숏, 페르시안...)"
                                : "강아지에 맞는 (예: 말티즈, 푸들...)"}
                        </div>
                    </button>
                ) : (
                    /* Selected Breed Info */
                    <div className="bg-[#222] p-4 rounded-xl border border-foon-lime/50 shrink-0 relative pr-10">
                        <button
                            onClick={() => {
                                onChange("breed", null);
                                openDrawer();
                            }}
                            className="absolute right-2 top-2 p-2 text-gray-400 hover:text-white"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <div className="flex justify-between items-center mb-2">
                            <span className="font-bold text-foon-lime">{selectedBreedData.name}</span>
                            <span className="text-xs text-gray-400">{selectedBreedData.origin}</span>
                        </div>
                        {selectedBreedData.description && (
                            <div className="relative mb-3 group">
                                <p
                                    className={`text-sm text-gray-300 leading-relaxed transition-all ${expandedBreed === selectedBreedData.name ? "whitespace-pre-wrap" : "line-clamp-2 pr-6"
                                        }`}
                                    onClick={() => setExpandedBreed(expandedBreed === selectedBreedData.name ? null : selectedBreedData.name)}
                                >
                                    {selectedBreedData.description}
                                </p>
                                {selectedBreedData.description.length > 50 && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setExpandedBreed(expandedBreed === selectedBreedData.name ? null : selectedBreedData.name);
                                        }}
                                        className="absolute right-0 bottom-0 text-foon-lime hover:text-white p-1 bg-[#222]/80 backdrop-blur-sm rounded-full"
                                    >
                                        <Info className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        )}
                        <PetCharacteristicBars traits={selectedBreedData.traits} />
                    </div>
                )}

                {/* Fallback Mix display if selected but not in data (e.g. "믹스") */}
                {formData.breed === "믹스" && !selectedBreedData && (
                    <div className="bg-[#222] p-4 rounded-xl border border-foon-lime/50 shrink-0 relative">
                        <button
                            onClick={() => onChange("breed", null)}
                            className="absolute right-2 top-2 p-2 text-gray-400 hover:text-white"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <div className="font-bold text-foon-lime mb-1">믹스 (Mix)</div>
                        <div className="text-sm text-gray-400">해당하는 품종이 없어요</div>
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

