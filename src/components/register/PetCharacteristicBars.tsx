"use client";

import React, { useEffect, useState } from "react";
import { PetBreedData } from "@/data/petData";

interface PetCharacteristicBarsProps {
    traits: PetBreedData["traits"];
}

export default function PetCharacteristicBars({ traits }: PetCharacteristicBarsProps) {
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        // Trigger animation on mount
        const timer = setTimeout(() => setAnimate(true), 100);
        return () => clearTimeout(timer);
    }, []);

    if (!traits) return null;

    const items = [
        { label: "크기", value: traits.size || 3, color: "bg-blue-400", emoji: "📏", maxEmoji: "🐘", minEmoji: "🐁" },
        { label: "털빠짐", value: traits.shedding || 3, color: "bg-orange-400", emoji: "☁️", maxEmoji: "🌪️", minEmoji: "✨" },
        { label: "친화력", value: traits.friendliness || 3, color: "bg-pink-400", emoji: "💕", maxEmoji: "🥰", minEmoji: "😐" },
        { label: "학습력", value: traits.trainability || 3, color: "bg-purple-400", emoji: "🧠", maxEmoji: "🎓", minEmoji: "🍼" },
        { label: "실내/외", value: traits.energy || 3, color: "bg-green-400", emoji: "🏠", maxEmoji: "🏞️", minEmoji: "🛋️" },
    ];

    return (
        <div className="space-y-2 mt-3 bg-[#18181b]/50 p-4 rounded-2xl border border-[#27272a]">
            {items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                    {/* Label */}
                    <div className="w-10 text-right">
                        <span className="text-[10px] font-bold text-gray-500 block">{item.label}</span>
                    </div>

                    {/* Segmented Bar */}
                    <div className="flex-1 flex gap-1 h-1.5">
                        {[1, 2, 3, 4, 5].map((score) => (
                            <div
                                key={score}
                                className={`flex-1 rounded-full transition-all duration-500 ease-out border border-transparent
                                    ${item.value >= score
                                        ? `bg-foon-lime shadow-[0_0_5px_rgba(163,223,70,0.4)] ${animate ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`
                                        : "bg-[#27272a] opacity-50"
                                    }
                                `}
                                style={{
                                    transitionDelay: `${idx * 100 + score * 50}ms`
                                }}
                            />
                        ))}
                    </div>

                    {/* Emoji/Value */}
                    <div className="w-4 flex justify-start">
                        <span className="text-xs filter drop-shadow-sm opacity-80">
                            {item.value >= 3 ? item.maxEmoji : item.minEmoji}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
}
