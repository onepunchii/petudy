import React, { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { ALL_PET_BREEDS } from "@/data/petData";
import { APP_ICON_STROKE, appInputClass, sheetBackdropClass, sheetPanelClass } from "@/components/app/ui";
import { cn } from "@/lib/utils";

interface BreedSelectDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (breedName: string) => void;
    species: "dog" | "cat" | null | undefined;
}

const rowClass =
    "flex min-h-[52px] w-full items-center justify-between gap-3 px-4 py-3 text-left text-[16px] text-ink transition-colors hover:bg-paper-2/70 active:bg-paper-2";

export default function BreedSelectDrawer({ isOpen, onClose, onSelect, species }: BreedSelectDrawerProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [isVisible, setIsVisible] = useState(false);

    // Filter breeds
    const filteredBreeds = ALL_PET_BREEDS
        .filter(b => b.species === species)
        .filter(b => b.name.includes(searchTerm))
        .sort((a, b) => a.name.localeCompare(b.name)) // Default sort by name
        .slice(0, 100);

    // Handle animation
    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            document.body.style.overflow = "hidden"; // Prevent background scrolling
        } else {
            const timer = setTimeout(() => setIsVisible(false), 300); // Match transition duration
            document.body.style.overflow = "";
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isVisible && !isOpen) return null;

    const title = species === "cat" ? "묘종 선택" : "견종 선택";

    return (
        <>
            {/* Backdrop */}
            <div
                className={cn(
                    sheetBackdropClass,
                    "transition-opacity duration-300 motion-reduce:transition-none",
                    isOpen ? "opacity-100" : "opacity-0",
                )}
                onClick={onClose}
            />

            {/* Drawer */}
            <div
                role="dialog"
                aria-modal="true"
                aria-label={title}
                className={cn(
                    sheetPanelClass,
                    "flex h-[85vh] flex-col transition-transform duration-300 ease-out motion-reduce:transition-none",
                    isOpen ? "translate-y-0" : "translate-y-full",
                )}
            >
                {/* Drag Handle */}
                <div className="flex h-8 w-full shrink-0 items-center justify-center pt-1" onClick={onClose}>
                    <div className="h-1.5 w-10 rounded-full bg-line" />
                </div>

                {/* Header */}
                <div className="flex shrink-0 items-center justify-between gap-3 px-5 pb-4 pt-2">
                    <h2 className="text-[20px] font-bold text-ink">{title}</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="닫기"
                        className="-mr-2 flex h-10 w-10 items-center justify-center rounded-full text-ink-2 transition-colors hover:bg-paper-2 hover:text-ink"
                    >
                        <X className="h-5 w-5" strokeWidth={APP_ICON_STROKE} aria-hidden />
                    </button>
                </div>

                {/* Search Input */}
                <div className="shrink-0 px-5 pb-4">
                    <div className="relative">
                        <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-3" strokeWidth={APP_ICON_STROKE} aria-hidden />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="검색"
                            aria-label="검색"
                            className={cn(appInputClass, "h-14 pl-12")}
                            autoFocus
                        />
                    </div>
                </div>

                {/* List */}
                <div
                    className="flex-1 overflow-y-auto overscroll-contain px-5"
                    style={{ paddingBottom: "max(32px, env(safe-area-inset-bottom))" }}
                >
                    {/* Mix Option */}
                    <ul className="overflow-hidden rounded-[20px] bg-pass ring-1 ring-line/70">
                        <li>
                            <button
                                type="button"
                                onClick={() => {
                                    onSelect("믹스");
                                    onClose();
                                }}
                                className={rowClass}
                            >
                                <span className="font-semibold">믹스 (Mix)</span>
                                <span className="text-[13px] text-ink-3">해당하는 품종이 없어요</span>
                            </button>
                        </li>
                    </ul>

                    {filteredBreeds.length > 0 && (
                        <ul className="mt-3 divide-y divide-line overflow-hidden rounded-[20px] bg-pass ring-1 ring-line/70">
                            {filteredBreeds.map((breed) => (
                                <li key={breed.id}>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            onSelect(breed.name);
                                            onClose();
                                        }}
                                        className={rowClass}
                                    >
                                        {breed.name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}

                    {filteredBreeds.length === 0 && (
                        <div className="py-10 text-center text-[15px] text-ink-3">
                            검색 결과가 없습니다.
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
