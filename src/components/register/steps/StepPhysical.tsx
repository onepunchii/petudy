import React from "react";
import { appChipClass, appInputClass } from "@/components/app/ui";
import { PET_WEIGHT_MAX, PET_WEIGHT_MIN, weightError } from "@/lib/pet-rules";
import { cn } from "@/lib/utils";

interface StepPhysicalProps {
    stepId: "weight" | "color";
    formData: {
        weight?: string;
        color?: string;
        [key: string]: any;
    };
    onChange: (field: string, value: any) => void;
}

// 털 색 견본. 실제 털 색을 보여 주는 데이터라 브랜드 토큰이 아닌 색 값을 그대로 씁니다 (기타만 토큰)
const PET_COLORS = [
    { label: "흰색", swatch: "#FFFFFF" },
    { label: "흰색 + 금색", swatch: "linear-gradient(90deg, #FFFFFF 50%, #F5DEB3 50%)" },
    { label: "금색", swatch: "#F5DEB3" },
    { label: "흰색 + 황색", swatch: "linear-gradient(90deg, #FFFFFF 50%, #DAA520 50%)" },
    { label: "황색", swatch: "#DAA520" },
    { label: "흰색 + 갈색", swatch: "linear-gradient(90deg, #FFFFFF 50%, #8B4513 50%)" },
    { label: "갈색", swatch: "#8B4513" },
    { label: "흰색 + 회색", swatch: "linear-gradient(90deg, #FFFFFF 50%, #808080 50%)" },
    { label: "회색", swatch: "#6B7280" },
    { label: "흰색 + 검은색", swatch: "linear-gradient(90deg, #FFFFFF 50%, #000000 50%)" },
    { label: "검은색", swatch: "#000000" },
    { label: "검은색 + 금색", swatch: "linear-gradient(90deg, #000000 50%, #F5DEB3 50%)" },
    { label: "기타", swatch: "var(--color-ink-3)" },
];

const stepTitleClass = "text-[24px] font-bold leading-[1.35] text-ink";

export default function StepPhysical({ stepId, formData, onChange }: StepPhysicalProps) {
    if (stepId === "weight") {
        const error = weightError(formData.weight);
        return (
            <div className="flex flex-col">
                <h2 id="step-weight-title" className={stepTitleClass}>
                    몸무게는 얼마나 나가나요?
                </h2>
                <p className="mb-8 mt-2 text-[14px] leading-relaxed text-ink-2">대략적인 값도 괜찮아요.</p>
                <div className="relative">
                    <input
                        type="number"
                        inputMode="decimal"
                        min={PET_WEIGHT_MIN}
                        max={PET_WEIGHT_MAX}
                        step="0.1"
                        value={formData.weight || ""}
                        onChange={(e) => onChange("weight", e.target.value)}
                        aria-labelledby="step-weight-title"
                        aria-invalid={!!error}
                        aria-describedby="step-weight-help"
                        className={cn(
                            appInputClass,
                            "h-14 pr-14 text-[18px] font-semibold tabular-nums",
                            error && "ring-2 ring-danger focus:ring-danger",
                        )}
                        placeholder="0.0"
                        autoFocus
                    />
                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[16px] font-bold text-ink-3">
                        kg
                    </span>
                </div>
                <p
                    id="step-weight-help"
                    role={error ? "alert" : undefined}
                    className={cn("mt-2 text-[14px] leading-snug", error ? "font-semibold text-danger" : "text-ink-3")}
                >
                    {error ?? `${PET_WEIGHT_MIN}kg ~ ${PET_WEIGHT_MAX}kg 사이로 적어 주세요`}
                </p>
            </div>
        );
    }

    if (stepId === "color") {
        return (
            <div className="flex flex-col">
                <h2 className={stepTitleClass}>
                    <span className="text-pine">{formData.name}</span>(의) 털 색상은?
                </h2>
                <p className="mb-6 mt-2 text-[14px] text-ink-2">가장 비슷한 색상으로 선택해 주세요</p>

                <div className="grid grid-cols-2 gap-2">
                    {PET_COLORS.map((c) => {
                        const selected = formData.color === c.label;
                        return (
                            <button
                                key={c.label}
                                type="button"
                                onClick={() => onChange("color", c.label)}
                                aria-pressed={selected}
                                className={appChipClass(selected, "h-auto min-h-12 w-full justify-start gap-3 px-3 py-2")}
                            >
                                <span
                                    className={cn("h-6 w-6 shrink-0 rounded-full ring-1 ring-inset", selected ? "ring-star/40" : "ring-ink/15")}
                                    style={{ background: c.swatch }}
                                    aria-hidden
                                />
                                <span className="min-w-0 text-left leading-snug">{c.label}</span>
                            </button>
                        );
                    })}
                </div>
                {/* Fallback Input */}
                <div className="mt-6 border-t border-line pt-6">
                    <label htmlFor="step-color-custom" className="mb-2 block text-[14px] text-ink-2">
                        목록에 없다면 직접 입력해주세요
                    </label>
                    <input
                        id="step-color-custom"
                        type="text"
                        value={formData.color || ""}
                        onChange={(e) => onChange("color", e.target.value)}
                        className={appInputClass}
                        placeholder="직접 입력"
                    />
                </div>
            </div>
        );
    }

    return null;
}
