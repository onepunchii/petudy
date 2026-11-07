"use client";

import React, { useEffect, useState } from "react";
import { PetBreedData } from "@/data/petData";
import { cn } from "@/lib/utils";

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

    // 예전 이모지(높음/낮음 표시)는 점수 숫자로 바꿨습니다. 막대는 남색(pine) 한 가지 색
    const items = [
        { label: "크기", value: traits.size || 3 },
        { label: "털빠짐", value: traits.shedding || 3 },
        { label: "친화력", value: traits.friendliness || 3 },
        { label: "학습력", value: traits.trainability || 3 },
        { label: "실내/외", value: traits.energy || 3 },
    ];

    return (
        <dl className="mt-4 space-y-2.5 border-t border-line pt-4">
            {items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                    {/* Label */}
                    <dt className="w-14 shrink-0 text-right text-[13px] font-semibold text-ink-3">{item.label}</dt>

                    <dd className="flex min-w-0 flex-1 items-center gap-3">
                        {/* Segmented Bar */}
                        <span className="flex h-1.5 flex-1 gap-1" aria-hidden>
                            {[1, 2, 3, 4, 5].map((score) => (
                                <span
                                    key={score}
                                    className={cn(
                                        "flex-1 rounded-full transition-[opacity,transform] duration-500 ease-out motion-reduce:transition-none",
                                        item.value >= score
                                            ? cn("bg-pine", animate ? "scale-100 opacity-100" : "scale-90 opacity-0")
                                            : "bg-paper-2",
                                    )}
                                    style={{
                                        transitionDelay: `${idx * 100 + score * 50}ms`
                                    }}
                                />
                            ))}
                        </span>

                        {/* Value */}
                        <span className="w-8 shrink-0 text-[13px] font-semibold tabular-nums text-ink-2">
                            {item.value}
                            <span className="text-ink-3">/5</span>
                        </span>
                    </dd>
                </div>
            ))}
        </dl>
    );
}
