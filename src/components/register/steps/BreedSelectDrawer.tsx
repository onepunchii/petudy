import React, { useState, useEffect } from "react";
import { Search, X, ChevronUp } from "lucide-react";
import { ALL_PET_BREEDS } from "@/data/petData";

interface BreedSelectDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (breedName: string) => void;
    species: "dog" | "cat" | null | undefined;
}

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

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
            {/* Backdrop */}
            <div
                className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"
                    }`}
                onClick={onClose}
            />

            {/* Drawer */}
            <div
                className={`bg-[#1C1C1E] rounded-t-[32px] w-full max-w-[430px] h-[85vh] flex flex-col relative transition-transform duration-300 ease-out transform border-t border-[#333] ${isOpen ? "translate-y-0" : "translate-y-full"
                    }`}
            >
                {/* Drag Handle */}
                <div className="w-full h-8 flex items-center justify-center shrink-0" onClick={onClose}>
                    <div className="w-12 h-1.5 bg-[#333] rounded-full" />
                </div>

                {/* Header */}
                <div className="px-6 pb-4 flex items-center justify-between shrink-0">
                    <h2 className="text-2xl font-bold text-white">
                        {species === "cat" ? "묘종 선택" : "견종 선택"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 -mr-2 text-gray-400 hover:text-white rounded-full hover:bg-[#333]"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Search Input */}
                <div className="px-6 pb-4 shrink-0">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="검색"
                            className="w-full bg-[#111] border border-[#333] rounded-2xl pl-12 pr-4 py-4 text-white text-lg placeholder:text-gray-500 focus:border-foon-lime focus:outline-none transition-colors"
                            autoFocus
                        />
                    </div>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto px-6 pb-8 custom-scrollbar">
                    <div className="space-y-1">
                        {/* Mix Option */}
                        <button
                            onClick={() => {
                                onSelect("믹스");
                                onClose();
                            }}
                            className="w-full text-left py-4 border-b border-[#333] text-gray-300 hover:text-foon-lime hover:bg-[#252527] transition-colors flex items-center justify-between group px-2 rounded-lg"
                        >
                            <span className="font-medium">믹스 (Mix)</span>
                            <span className="text-xs text-gray-500 font-normal group-hover:text-foon-lime/70">해당하는 품종이 없어요</span>
                        </button>

                        {filteredBreeds.map((breed) => (
                            <button
                                key={breed.id}
                                onClick={() => {
                                    onSelect(breed.name);
                                    onClose();
                                }}
                                className="w-full text-left py-4 border-b border-[#333] text-gray-300 hover:text-foon-lime hover:bg-[#252527] transition-colors px-2 rounded-lg"
                            >
                                {breed.name}
                            </button>
                        ))}

                        {filteredBreeds.length === 0 && (
                            <div className="py-10 text-center text-gray-500">
                                검색 결과가 없습니다.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
