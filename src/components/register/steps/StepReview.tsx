import React from "react";
import { PassCard } from "@/components/site/PassCard";

interface StepReviewProps {
    formData: {
        name: string;
        species: "dog" | "cat";
        breed?: string | null;
        gender: "male" | "female";
        neuter: boolean | null;
        birth?: string;
        adoptionDate?: string;
        weight?: string;
        color?: string;
        concern?: string[];
        reg_number?: string | null;
        [key: string]: any;
    };
}

export default function StepReview({ formData }: StepReviewProps) {
    const formatDate = (dateStr?: string) => {
        if (!dateStr) return "-";
        const [y, m, d] = dateStr.split("-");
        return `${y}.${m}.${d}`;
    };

    const getConcernLabels = (concerns?: string[]) => {
        if (!concerns || concerns.length === 0 || concerns.includes("none")) return "없음";
        // Map values to labels manually or passed from parent? 
        // For simplicity, let's duplicate the simple map or jusy rely on parent? 
        // Better: Self-contained.
        const map: Record<string, string> = {
            skin: "피부/알러지",
            joint: "관절/뼈",
            digestive: "소화기/위장",
            dental: "치아/구강",
            weight: "비만/체중",
            heart: "심장/호흡기",
            eye: "눈/귀",
            behavior: "행동/분리불안",
        };
        return concerns.map(c => map[c] || c).join(", ");
    };

    const details = [
        { label: "이름", value: formData.name },
        { label: "종류", value: formData.species === "dog" ? "강아지" : "고양이" },
        { label: "품종", value: formData.breed || "-" },
        {
            label: "성별",
            value: `${formData.gender === "male" ? "왕자님" : "공주님"} ${formData.neuter === true ? "(중성화 O)" : formData.neuter === false ? "(중성화 X)" : ""}`.trim()
        },
        { label: "생일", value: formatDate(formData.birth) },
        { label: "입양일", value: formatDate(formData.adoptionDate) },
        { label: "몸무게", value: formData.weight ? `${formData.weight}kg` : "-" },
        { label: "모색", value: formData.color || "-" },
        { label: "건강고민", value: getConcernLabels(formData.concern) },
        { label: "등록번호", value: formData.reg_number || "-" },
    ];

    return (
        <div className="flex flex-col">
            <h2 className="mb-6 text-[24px] font-bold leading-[1.35] text-ink">
                입력한 내용이 맞나요?
            </h2>

            {/* 펫패스 탑승권: 위는 입력한 내용, 절취선 아래는 안내 */}
            <PassCard
                stub={
                    <p className="text-center text-[13px] text-ink-3">
                        * 등록 후에도 언제든 수정할 수 있어요.
                    </p>
                }
                stubPosition="bottom"
                mainClassName="px-5 py-2 sm:px-6 sm:py-2"
                stubClassName="px-5 py-4 sm:p-4"
            >
                <dl className="divide-y divide-line">
                    {details.map((item, idx) => (
                        <div key={idx} className="flex items-start justify-between gap-4 py-3">
                            <dt className="shrink-0 text-[14px] text-ink-3">{item.label}</dt>
                            <dd className="max-w-[65%] break-keep text-right text-[15px] font-semibold text-ink">
                                {item.value}
                            </dd>
                        </div>
                    ))}
                </dl>
            </PassCard>
        </div>
    );
}
