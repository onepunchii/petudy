import React from "react";
import { CalendarIcon } from "lucide-react";

interface StepDateProps {
    formData: {
        birth?: string;
        adoptionDate?: string;
        [key: string]: any;
    };
    onOpenPicker: (field: "birth" | "adoptionDate") => void;
}

export default function StepDate({ formData, onOpenPicker }: StepDateProps) {
    // Helper helper for formatting date display (YYYY.MM.DD)
    const formatDateObj = (dateStr?: string) => {
        if (!dateStr) return "";
        const [y, m, d] = dateStr.split("-");
        return `${y}. ${m}. ${d} `;
    };

    return (
        <div className="space-y-6 animate-fade-in-up">
            <h2 className="text-2xl font-bold mb-10 text-white text-center">
                기념일을 알려주세요
            </h2>

            {/* Birthday Input */}
            <div className="space-y-2">
                <label className="text-lg font-bold text-gray-300 block">
                    생일이 언제인가요?
                </label>
                <div
                    onClick={() => onOpenPicker("birth")}
                    className="w-full p-4 rounded-xl bg-bg-input border border-[#333] text-lg text-white flex items-center justify-between cursor-pointer hover:border-foon-lime transition-colors"
                >
                    <span className={formData.birth ? "text-white" : "text-gray-500"}>
                        {formatDateObj(formData.birth) || "YYYY. MM. DD"}
                    </span>
                    <CalendarIcon className="w-5 h-5 text-gray-400" />
                </div>
            </div>

            {/* Adoption Date Input */}
            <div className="space-y-2">
                <label className="text-lg font-bold text-gray-300 block">
                    가족이 된 날은 언제인가요?
                </label>
                <div
                    onClick={() => onOpenPicker("adoptionDate")}
                    className="w-full p-4 rounded-xl bg-bg-input border border-[#333] text-lg text-white flex items-center justify-between cursor-pointer hover:border-foon-lime transition-colors"
                >
                    <span className={formData.adoptionDate ? "text-white" : "text-gray-500"}>
                        {formatDateObj(formData.adoptionDate) || "YYYY. MM. DD"}
                    </span>
                    <CalendarIcon className="w-5 h-5 text-gray-400" />
                </div>
            </div>
        </div>
    );
}
