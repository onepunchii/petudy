import React from "react";
import { Check } from "lucide-react";
import Image from "next/image";
import { appOptionClass } from "@/components/app/ui";
import { cn } from "@/lib/utils";

interface StepGenderProps {
    formData: {
        gender: "male" | "female" | null | undefined;
        neuter: boolean | null;
        [key: string]: any;
    };
    onChange: (field: string, value: any) => void;
}

/** 선택 카드 오른쪽 위 체크 (appOptionClass: 남색 테두리 + 체크) */
function SelectedCheck() {
    return (
        <span className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-night text-star" aria-hidden>
            <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
        </span>
    );
}

export default function StepGender({ formData, onChange }: StepGenderProps) {
    const toggleNeuter = () => {
        // Toggle strict boolean
        onChange("neuter", !formData.neuter);
    };

    return (
        <div className="flex flex-col">
            <h2 className="mb-8 text-[24px] font-bold leading-[1.35] text-ink">
                성별을 알려주세요
            </h2>
            <div className="grid grid-cols-2 gap-3">
                <button
                    type="button"
                    onClick={() => onChange("gender", "male")}
                    aria-pressed={formData.gender === "male"}
                    className={appOptionClass(formData.gender === "male", "relative flex flex-col items-center justify-center gap-3 p-6")}
                >
                    {formData.gender === "male" && <SelectedCheck />}
                    <div className="relative h-24 w-24">
                        <Image
                            src="/images/gender-male-symbol.png"
                            alt="왕자님"
                            fill
                            sizes="96px"
                            className="object-contain"
                        />
                    </div>
                    <div className="text-[18px] font-bold text-ink">왕자님</div>
                </button>
                <button
                    type="button"
                    onClick={() => onChange("gender", "female")}
                    aria-pressed={formData.gender === "female"}
                    className={appOptionClass(formData.gender === "female", "relative flex flex-col items-center justify-center gap-3 p-6")}
                >
                    {formData.gender === "female" && <SelectedCheck />}
                    <div className="relative h-24 w-24">
                        <Image
                            src="/images/gender-female-symbol.png"
                            alt="공주님"
                            fill
                            sizes="96px"
                            className="object-contain"
                        />
                    </div>
                    <div className="text-[18px] font-bold text-ink">공주님</div>
                </button>
            </div>

            {/* Neuter Toggle - Only shows after gender selection */}
            {formData.gender && (
                <div className="pt-8">
                    <label className="mb-3 block text-[17px] font-bold text-ink">
                        중성화 수술을 했나요?
                    </label>
                    <button
                        type="button"
                        onClick={toggleNeuter}
                        aria-pressed={formData.neuter === true}
                        className={appOptionClass(formData.neuter === true, "flex w-full items-center justify-between")}
                    >
                        <span className="text-[16px] font-semibold text-ink">중성화를 했어요</span>
                        <span
                            className={cn(
                                "flex h-6 w-6 items-center justify-center rounded-full transition-colors",
                                formData.neuter === true ? "bg-night text-star" : "bg-pass ring-1 ring-inset ring-line",
                            )}
                            aria-hidden
                        >
                            {formData.neuter === true && <Check className="h-3.5 w-3.5" strokeWidth={2.5} />}
                        </span>
                    </button>
                </div>
            )}
        </div>
    );
}
