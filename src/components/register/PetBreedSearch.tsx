"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Search, X, Check } from "lucide-react";
import { ALL_PET_BREEDS, PetBreedData } from "@/data/petData";
import PetCharacteristicBars from "./PetCharacteristicBars";

interface PetBreedSearchProps {
    species: "dog" | "cat";
    value: string;
    onChange: (value: string) => void;
}

export default function PetBreedSearch({ species, value, onChange }: PetBreedSearchProps) {
    const [searchTerm, setSearchTerm] = useState(value || "");
    const [isFocused, setIsFocused] = useState(false);
    const [selectedBreedData, setSelectedBreedData] = useState<PetBreedData | null>(null);

    // Filter breeds by species
    const availableBreeds = useMemo(() => {
        return ALL_PET_BREEDS.filter(b => b.species === species);
    }, [species]);

    // Update selected data when value changes
    useEffect(() => {
        const found = availableBreeds.find(b => b.name === value);
        setSelectedBreedData(found || null);
        if (value) setSearchTerm(value);
    }, [value, availableBreeds]);

    // Filter suggestions based on search term
    const suggestions = useMemo(() => {
        if (!searchTerm) return [];
        return availableBreeds.filter(b =>
            b.name.includes(searchTerm) && b.name !== value
        );
    }, [searchTerm, availableBreeds, value]);

    const handleSelect = (breed: PetBreedData) => {
        onChange(breed.name);
        setSearchTerm(breed.name);
        setIsFocused(false);
    };

    const handleClear = () => {
        onChange("");
        setSearchTerm("");
        setSelectedBreedData(null);
        setIsFocused(true);
    };

    return (
        <div className="w-full space-y-4">
            {/* Search Input */}
            <div className="relative">
                <div className="flex items-center bg-bg-input border-b-2 border-[#444] rounded-t-lg transition-colors focus-within:border-foon-lime">
                    <Search className="w-5 h-5 text-gray-500 ml-3" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            // If user types something custom that isn't a known breed, we still update the parent value
                            // But we might want to encourage selection. For now, let's update.
                            onChange(e.target.value);
                        }}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setTimeout(() => setIsFocused(false), 200)} // Delay to allow click
                        placeholder={species === "cat" ? "예: 코숏, 러시안블루" : "예: 말티즈, 푸들"}
                        className="w-full bg-transparent p-4 text-xl text-white placeholder-gray-500 focus:outline-none"
                    />
                    {searchTerm && (
                        <button onClick={handleClear} className="p-2 mr-2 text-gray-500 hover:text-white">
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>

                {/* Suggestions Dropdown */}
                {isFocused && suggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 bg-[#2C2C2E] border border-[#333] rounded-b-xl shadow-xl z-50 max-h-60 overflow-y-auto">
                        {suggestions.map((breed) => (
                            <button
                                key={breed.id}
                                onClick={() => handleSelect(breed)}
                                className="w-full text-left p-4 hover:bg-[#3A3A3D] border-b border-[#333] last:border-0 flex items-center justify-between group"
                            >
                                <span className="text-gray-200 group-hover:text-white">{breed.name}</span>
                                <span className="text-xs text-gray-500">{breed.description.slice(0, 15)}...</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Selected Breed Info & Bars */}
            {selectedBreedData && (
                <div className="animate-fade-in-up">
                    <div className="bg-[#2C2C2E]/50 p-4 rounded-xl border border-foon-lime/30">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl font-bold text-foon-lime">{selectedBreedData.name}</span>
                            <span className="text-sm text-gray-400">정보</span>
                        </div>
                        <p className="text-gray-300 text-sm mb-4">"{selectedBreedData.description}"</p>

                        {/* Horizontal Bars */}
                        <PetCharacteristicBars traits={selectedBreedData.traits} />
                    </div>
                </div>
            )}
        </div>
    );
}
