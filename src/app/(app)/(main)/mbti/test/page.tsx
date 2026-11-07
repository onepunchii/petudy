"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MBTI_QUESTIONS } from "../questions";
import { MbtiType } from "@/components/shared/PetPassCard";
import { AppBody, AppProgress, AppTopBar, appOptionClass } from "@/components/app/ui";

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
        <div className="min-h-full bg-moon">
            {/* Header + Progress Bar */}
            <AppTopBar
                back="/mbti"
                title={
                    <span className="tabular-nums">
                        {currentStep + 1} <span className="font-medium text-star-3">/ {MBTI_QUESTIONS.length}</span>
                    </span>
                }
            >
                <AppProgress value={progress / 100} />
            </AppTopBar>

            {/* Question Content */}
            <AppBody className="mx-auto w-full max-w-md pt-10">
                <div className="mb-8 min-h-[120px]">
                    <span className="inline-flex h-7 items-center rounded-full bg-pine-soft px-3 text-[13px] font-bold text-pine tabular-nums">
                        Q{currentStep + 1}
                    </span>
                    <h2 className="mt-4 text-[22px] font-bold leading-snug tracking-[-0.02em] text-ink">
                        {currentQuestion.question}
                    </h2>
                </div>

                <div className="space-y-3">
                    {currentQuestion.options.map((option, idx) => (
                        <button
                            key={`${currentStep}-${idx}`} // Force re-render to clear focus/active states
                            type="button"
                            onClick={() => handleAnswer(currentQuestion.category, option.score)}
                            className={appOptionClass(false, "block w-full px-5 py-5")}
                        >
                            <span className="text-[16px] font-semibold leading-snug text-ink">
                                {option.text}
                            </span>
                        </button>
                    ))}
                </div>
            </AppBody>
        </div>
    );
}
