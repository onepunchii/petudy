"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Check } from "lucide-react";
import { MBTI_QUESTIONS } from "../questions";
import { MbtiType } from "@/components/shared/PetPassCard";

export default function MbtiTestPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(0);
    const [scores, setScores] = useState<Record<string, number>>({ E: 0, S: 0, A: 0, L: 0 });
    const [direction, setDirection] = useState("next"); // 'next' or 'prev' for animation logic if needed

    const currentQuestion = MBTI_QUESTIONS[currentStep];
    const progress = ((currentStep + 1) / MBTI_QUESTIONS.length) * 100;

    const handleAnswer = (category: string, score: number) => {
        // Accumulate score
        const newScores = { ...scores, [category]: scores[category] + score };
        setScores(newScores);

        if (currentStep < MBTI_QUESTIONS.length - 1) {
            setDirection("next");
            setCurrentStep(prev => prev + 1);
        } else {
            finishTest(newScores);
        }
    };

    const finishTest = (finalScores: Record<string, number>) => {
        // Logic: Determine dominant trait
        // E >= 20 -> Active (ENERGIZER)
        // S >= 20 -> Social (SOCIAL)
        // A <= 10 -> Sensitive (PRINCESS)
        // L >= 20 -> Attached (HOMEBODY)
        // Priority: Princess > Energizer > Social > Homebody (This is arbitrary logic for 4 types mapping)

        let resultType: MbtiType = "SOCIAL"; // Default

        if (finalScores['A'] <= 10) {
            resultType = "PRINCESS";
        } else if (finalScores['E'] >= 20) {
            resultType = "ENERGIZER";
        } else if (finalScores['S'] >= 20) {
            resultType = "SOCIAL";
        } else if (finalScores['L'] >= 20) {
            resultType = "HOMEBODY";
        } else {
            // Fallback or balanced
            resultType = "SOCIAL";
        }

        // In a real app, save to DB here via API
        // For now, pass via URL query
        router.push(`/mbti/result?type=${resultType}`);
    };

    return (
        <div className="min-h-screen bg-bg-main flex flex-col text-white">
            {/* Header */}
            <div className="h-14 flex items-center px-4 relative border-b border-[#333]">
                <button onClick={() => router.back()} className="p-2 -ml-2 text-gray-400 hover:text-white transition-colors">
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <div className="absolute left-1/2 -translate-x-1/2 text-foon-lime font-bold text-sm">
                    {currentStep + 1} <span className="text-gray-600">/ {MBTI_QUESTIONS.length}</span>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="h-1 bg-[#2C2C2E] w-full">
                <div
                    className="h-full bg-foon-lime transition-all duration-300 ease-out shadow-[0_0_10px_#A3DF46]"
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Question Content */}
            <div className="flex-1 flex flex-col p-6 pt-12 max-w-md mx-auto w-full">
                <div className="mb-10 min-h-[120px]">
                    <span className="inline-block px-3 py-1 bg-[#2C2C2E] text-foon-lime border border-[#333] rounded-full text-xs font-bold mb-5">
                        Q{currentStep + 1}
                    </span>
                    <h2 className="text-2xl font-bold text-white leading-snug tracking-tight">
                        {currentQuestion.question}
                    </h2>
                </div>

                <div className="space-y-4">
                    {currentQuestion.options.map((option, idx) => (
                        <button
                            key={`${currentStep}-${idx}`} // Force re-render to clear focus/active states
                            onClick={() => handleAnswer(currentQuestion.category, option.score)}
                            className="w-full p-6 text-left bg-bg-card rounded-2xl border border-[#333] hover:border-foon-lime hover:bg-[#252527] transition-all active:scale-[0.99] group shadow-lg"
                        >
                            <span className="text-lg font-medium text-gray-300 group-hover:text-foon-lime transition-colors">
                                {option.text}
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
