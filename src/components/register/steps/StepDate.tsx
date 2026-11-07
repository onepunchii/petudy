import React from "react";
import { CalendarIcon, X } from "lucide-react";
import { APP_ICON_STROKE, appInputClass } from "@/components/app/ui";
import { cn } from "@/lib/utils";

interface StepDateProps {
    formData: {
        birth?: string;
        adoptionDate?: string;
        [key: string]: any;
    };
    onOpenPicker: (field: "birth" | "adoptionDate") => void;
    /** 고른 날짜 지우기 (둘 다 선택 항목) */
    onClear: (field: "birth" | "adoptionDate") => void;
    /** 날짜 규칙 오류 (미래 날짜, 생일보다 이른 가족이 된 날 등) */
    error?: string | null;
}

const dateFieldClass = cn(appInputClass, "flex h-14 cursor-pointer items-center justify-between text-left text-[17px] hover:ring-ink/30");
const dateLabelClass = "mb-2 block text-[16px] font-bold text-ink";
const clearButtonClass =
    "absolute right-11 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-ink-3 transition-colors hover:bg-paper-2 hover:text-ink active:translate-y-[calc(-50%+1px)]";

export default function StepDate({ formData, onOpenPicker, onClear, error }: StepDateProps) {
    // Helper helper for formatting date display (YYYY.MM.DD)
    const formatDateObj = (dateStr?: string) => {
        if (!dateStr) return "";
        const [y, m, d] = dateStr.split("-");
        return `${y}. ${m}. ${d} `;
    };

    return (
        <div className="flex flex-col">
            <h2 className="text-[24px] font-bold leading-[1.35] text-ink">
                기념일을 알려주세요
            </h2>
            <p className="mb-8 mt-2 text-[14px] leading-relaxed text-ink-2">
                정확히 몰라도 괜찮아요. 비워 두고 다음으로 넘어갈 수 있어요.
            </p>

            <div className="space-y-6">
                {/* Birthday Input */}
                <div>
                    <label id="step-date-birth-label" className={dateLabelClass}>
                        생일이 언제인가요? <span className="font-normal text-ink-3">(선택)</span>
                    </label>
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => onOpenPicker("birth")}
                            aria-labelledby="step-date-birth-label step-date-birth-value"
                            aria-describedby={error ? "step-date-error" : undefined}
                            className={dateFieldClass}
                        >
                            <span id="step-date-birth-value" className={cn("tabular-nums", formData.birth ? "text-ink" : "text-ink-3")}>
                                {formatDateObj(formData.birth) || "YYYY. MM. DD"}
                            </span>
                            <CalendarIcon className="h-5 w-5 text-ink-3" strokeWidth={APP_ICON_STROKE} aria-hidden />
                        </button>
                        {formData.birth && (
                            <button type="button" onClick={() => onClear("birth")} aria-label="생일 지우기" className={clearButtonClass}>
                                <X className="h-4 w-4" strokeWidth={APP_ICON_STROKE} aria-hidden />
                            </button>
                        )}
                    </div>
                </div>

                {/* Adoption Date Input */}
                <div>
                    <label id="step-date-adoption-label" className={dateLabelClass}>
                        가족이 된 날은 언제인가요? <span className="font-normal text-ink-3">(선택)</span>
                    </label>
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => onOpenPicker("adoptionDate")}
                            aria-labelledby="step-date-adoption-label step-date-adoption-value"
                            aria-describedby={error ? "step-date-error" : undefined}
                            className={dateFieldClass}
                        >
                            <span id="step-date-adoption-value" className={cn("tabular-nums", formData.adoptionDate ? "text-ink" : "text-ink-3")}>
                                {formatDateObj(formData.adoptionDate) || "YYYY. MM. DD"}
                            </span>
                            <CalendarIcon className="h-5 w-5 text-ink-3" strokeWidth={APP_ICON_STROKE} aria-hidden />
                        </button>
                        {formData.adoptionDate && (
                            <button type="button" onClick={() => onClear("adoptionDate")} aria-label="가족이 된 날 지우기" className={clearButtonClass}>
                                <X className="h-4 w-4" strokeWidth={APP_ICON_STROKE} aria-hidden />
                            </button>
                        )}
                    </div>
                </div>

                {error && (
                    <p id="step-date-error" role="alert" className="text-[14px] font-semibold leading-snug text-danger">
                        {error}
                    </p>
                )}
            </div>
        </div>
    );
}
