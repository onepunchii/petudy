import React from "react";

interface StepPhysicalProps {
    stepId: "weight" | "color";
    formData: {
        weight?: string;
        color?: string;
        [key: string]: any;
    };
    onChange: (field: string, value: any) => void;
}

const PET_COLORS = [
    { label: "흰색", bg: "bg-white" },
    { label: "흰색 + 금색", bg: "bg-[linear-gradient(90deg,white_50%,#F5DEB3_50%)]" },
    { label: "금색", bg: "bg-[#F5DEB3]" },
    { label: "흰색 + 황색", bg: "bg-[linear-gradient(90deg,white_50%,#DAA520_50%)]" },
    { label: "황색", bg: "bg-[#DAA520]" },
    { label: "흰색 + 갈색", bg: "bg-[linear-gradient(90deg,white_50%,#8B4513_50%)]" },
    { label: "갈색", bg: "bg-[#8B4513]" },
    { label: "흰색 + 회색", bg: "bg-[linear-gradient(90deg,white_50%,#808080_50%)]" },
    { label: "회색", bg: "bg-gray-500" },
    { label: "흰색 + 검은색", bg: "bg-[linear-gradient(90deg,white_50%,black_50%)]" },
    { label: "검은색", bg: "bg-black" },
    { label: "검은색 + 금색", bg: "bg-[linear-gradient(90deg,black_50%,#F5DEB3_50%)]" },
    { label: "기타", bg: "bg-[#4A4A4A]" },
];

export default function StepPhysical({ stepId, formData, onChange }: StepPhysicalProps) {
    if (stepId === "weight") {
        return (
            <div className="space-y-4 animate-fade-in-up h-full flex flex-col justify-center">
                <h2 className="text-2xl font-bold text-white mb-10 text-center">
                    몸무게는 얼마나 나가나요?
                </h2>
                <div className="relative">
                    <input
                        type="number"
                        inputMode="decimal"
                        value={formData.weight || ""}
                        onChange={(e) => onChange("weight", e.target.value)}
                        className="w-full bg-bg-input border border-[#333] rounded-xl p-4 text-white text-lg focus:border-foon-lime focus:outline-none transition-colors pr-12 text-center"
                        placeholder="0.0"
                        autoFocus
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">
                        kg
                    </span>
                </div>
            </div>
        );
    }

    if (stepId === "color") {
        return (
            <div className="space-y-4 animate-fade-in-up h-full flex flex-col justify-center">
                <h2 className="text-2xl font-bold text-white mb-10 text-center">
                    <span className="text-foon-lime">{formData.name}</span>(의) 털 색상은?
                    <p className="text-xs text-center font-normal text-gray-400 mt-2">가장 비슷한 색상으로 선택해 주세요</p>
                </h2>

                <div className="grid grid-cols-2 gap-2 max-h-[55vh] overflow-y-auto pr-1 -mr-1 custom-scrollbar">
                    {PET_COLORS.map((c) => (
                        <button
                            key={c.label}
                            onClick={() => onChange("color", c.label)}
                            className={`flex items-center gap-3 p-2 rounded-xl border transition-all ${formData.color === c.label
                                ? "bg-foon-lime/20 border-foon-lime"
                                : "bg-bg-input border-[#333] hover:bg-[#252527]"
                                }`}
                        >
                            <div className={`w-6 h-6 rounded-full border border-gray-600 shrink-0 shadow-sm ${c.bg}`} />
                            <span className={`text-xs font-bold ${formData.color === c.label ? "text-foon-lime" : "text-gray-400"}`}>
                                {c.label}
                            </span>
                        </button>
                    ))}
                </div>
                {/* Fallback Input */}
                <div className="mt-4 pt-4 border-t border-white/10">
                    <p className="text-xs text-gray-400 mb-2 text-center">목록에 없다면 직접 입력해주세요</p>
                    <input
                        type="text"
                        value={formData.color || ""}
                        onChange={(e) => onChange("color", e.target.value)}
                        className="w-full bg-bg-input border border-[#333] rounded-xl p-3 text-white text-md focus:border-foon-lime focus:outline-none transition-colors text-center"
                        placeholder="직접 입력"
                    />
                </div>
            </div>
        );
    }

    return null;
}
