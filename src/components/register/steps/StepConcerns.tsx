import React from "react";
import { Activity, Bone, Apple, Smile, Scale, Heart, Eye, Brain } from "lucide-react";

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
    return (
        <div className="space-y-4 animate-fade-in-up h-full flex flex-col justify-center">
            <h2 className="text-2xl font-bold text-white mb-6 text-center leading-snug break-keep">
                <span className="text-foon-lime">{formData.name || "아이"}</span>의<br />
                건강 고민이 있나요?
            </h2>
            <p className="text-gray-400 text-center text-xs mb-4">
                중복 선택이 가능해요.
            </p>

            <div className="flex-1 overflow-y-auto no-scrollbar grid grid-cols-3 gap-2 content-start pr-1 -mr-1 custom-scrollbar max-h-[50vh]">
                <button
                    onClick={() => onChange("none")}
                    className={`col-span-3 p-3 rounded-xl border transition-all ${formData.concern?.includes("none")
                        ? "bg-foon-lime/20 border-foon-lime text-foon-lime font-bold"
                        : "bg-bg-input border-[#333] text-gray-400 hover:bg-[#252527]"
                        }`}
                >
                    없음 (건강해요!)
                </button>

                {CONCERN_OPTIONS.map((opt) => (
                    <button
                        key={opt.value}
                        onClick={() => onChange(opt.value)}
                        className={`p-2 rounded-xl border transition-all flex flex-col items-center justify-center gap-1.5 h-24 ${formData.concern?.includes(opt.value)
                            ? "bg-foon-lime/20 border-foon-lime text-foon-lime shadow-[0_0_15px_rgba(206,255,0,0.2)]"
                            : "bg-bg-input border-[#333] text-gray-400 hover:bg-[#252527]"
                            }`}
                    >
                        <opt.icon className="w-5 h-5" />
                        <span className="text-[11px] font-bold text-center leading-tight break-keep">{opt.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}
