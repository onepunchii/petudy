import React from "react";
import { Activity, Bone, Apple, Smile, Scale, Heart, Eye, Brain } from "lucide-react";
import { APP_ICON_STROKE, appChipClass } from "@/components/app/ui";

interface StepConcernsProps {
    formData: {
        name?: string;
        concern?: string[];
        [key: string]: any;
    };
    onChange: (value: string) => void; // Handles toggle logic internally in parent or here? Logic was complex in parent.
    // Let's keep toggle logic in parent for consistency, so this just passes the clicked value.
}

const CONCERN_OPTIONS = [
    { value: "skin", label: "피부 / 알러지", icon: Activity },
    { value: "joint", label: "관절 / 뼈", icon: Bone },
    { value: "digestive", label: "소화기 / 위장", icon: Apple }, // Using Apple as placeholder for food/digestive
    { value: "dental", label: "치아 / 구강", icon: Smile },
    { value: "weight", label: "비만 / 체중", icon: Scale },
    { value: "heart", label: "심장 / 호흡기", icon: Heart },
    { value: "eye", label: "눈 / 귀", icon: Eye },
    { value: "behavior", label: "행동 / 분리불안", icon: Brain },
];

export default function StepConcerns({ formData, onChange }: StepConcernsProps) {
    const noneSelected = !!formData.concern?.includes("none");

    return (
        <div className="flex flex-col">
            <h2 className="text-[24px] font-bold leading-[1.35] text-ink">
                <span className="text-pine">{formData.name || "아이"}</span>의<br />
                건강 고민이 있나요?
            </h2>
            <p className="mb-6 mt-2 text-[14px] text-ink-2">
                중복 선택이 가능해요.
            </p>

            <div className="grid grid-cols-2 gap-2">
                <button
                    type="button"
                    onClick={() => onChange("none")}
                    aria-pressed={noneSelected}
                    className={appChipClass(noneSelected, "col-span-2 h-12 w-full")}
                >
                    없음 (건강해요!)
                </button>

                {CONCERN_OPTIONS.map((opt) => {
                    const selected = !!formData.concern?.includes(opt.value);
                    return (
                        <button
                            key={opt.value}
                            type="button"
                            onClick={() => onChange(opt.value)}
                            aria-pressed={selected}
                            className={appChipClass(selected, "h-auto min-h-12 w-full justify-start gap-2.5 px-4 py-2")}
                        >
                            <opt.icon className="h-[18px] w-[18px] shrink-0" strokeWidth={APP_ICON_STROKE} aria-hidden />
                            <span className="min-w-0 text-left leading-snug">{opt.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
