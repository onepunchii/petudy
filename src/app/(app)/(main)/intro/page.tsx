"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { ArrowRight, ChevronRight, X } from "lucide-react";
import { useState, useRef, useEffect, Suspense } from "react";

type IntroStep = {
    title: string;
    description: string;
    image: string; // Emoji or image URL
    bgGradient: string;
};

const introData: Record<string, { title: string; steps: IntroStep[] }> = {
    BATH: {
        title: "미용 예약",
        steps: [
            {
                title: "프리미엄 스타일링",
                description: "전문 스타일리스트의 손길로\n우리 아이의 미모를 찾아드려요.",
                image: "✂️",
                bgGradient: "from-pink-500/20 to-purple-500/20"
            },
            {
                title: "스트레스 프리 케어",
                description: "미용을 무서워하는 아이들도\n안심하고 맡길 수 있어요.",
                image: "🛁",
                bgGradient: "from-blue-500/20 to-cyan-500/20"
            },
            {
                title: "최고급 스파 제품",
                description: "피부가 예민한 아이들을 위해\n엄선된 천연 제품만 사용합니다.",
                image: "✨",
                bgGradient: "from-yellow-500/20 to-orange-500/20"
            }
        ]
    },
    FUNERAL: {
        title: "펫장례",
        steps: [
            {
                title: "아름다운 이별",
                description: "마지막 순간까지 함께해준 아이에게\n존중과 예우를 다합니다.",
                image: "🕊️",
                bgGradient: "from-gray-700/50 to-gray-900/50"
            },
            {
                title: "정성스러운 예식",
                description: "전문 장례지도사가\n모든 절차를 세심하게 도와드립니다.",
                image: "🕯️",
                bgGradient: "from-stone-700/50 to-stone-900/50"
            },
            {
                title: "영원한 기억",
                description: "메모리얼 스톤 제작으로\n아이를 영원히 곁에 간직하세요.",
                image: "💎",
                bgGradient: "from-indigo-900/50 to-slate-900/50"
            }
        ]
    },
    CHECKUP: {
        title: "건강검진",
        steps: [
            {
                title: "종합 건강 체크",
                description: "말 못하는 우리 아이,\n정기 검진으로 미리 지켜주세요.",
                image: "🩺",
                bgGradient: "from-green-500/20 to-emerald-500/20"
            },
            {
                title: "최첨단 의료 장비",
                description: "대학병원급 장비로\n작은 이상 징후도 놓치지 않습니다.",
                image: "🔬",
                bgGradient: "from-teal-500/20 to-cyan-500/20"
            },
            {
                title: "전문 수의사 팀",
                description: "분야별 전문 의료진이\n체계적인 진료를 약속합니다.",
                image: "👨‍⚕️",
                bgGradient: "from-blue-600/20 to-indigo-600/20"
            }
        ]
    }
};

function IntroPageContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const category = searchParams.get("category") || "BATH";
    const data = introData[category] || introData["BATH"];
    const [currentStep, setCurrentStep] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleScroll = () => {
        if (!containerRef.current) return;
        const scrollPosition = containerRef.current.scrollLeft;
        const width = containerRef.current.offsetWidth;
        const step = Math.round(scrollPosition / width);
        setCurrentStep(step);
    };

    const handleNext = () => {
        if (currentStep < 2) {
            containerRef.current?.scrollTo({
                left: (currentStep + 1) * containerRef.current.offsetWidth,
                behavior: "smooth"
            });
        } else {
            router.push(`/booking/new?category=${category}`);
        }
    };

    const handleSkip = () => {
        router.push(`/booking/new?category=${category}`);
    };

    return (
        <div className="bg-bg-main min-h-screen text-white relative overflow-hidden flex flex-col">
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-50">
                <button onClick={() => router.back()} className="w-9 h-9 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-md hover:bg-black/30 transition-colors">
                    <X className="w-5 h-5 text-white" strokeWidth={3} />
                </button>
                <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                        <div
                            key={i}
                            className={`h-1 rounded-full transition-all duration-300 ${i === currentStep ? "w-6 bg-foon-lime" : "w-2 bg-gray-600"
                                }`}
                        />
                    ))}
                </div>
                <button
                    onClick={handleSkip}
                    className="text-gray-400 text-sm font-medium hover:text-white transition-colors px-2"
                >
                    Skip
                </button>
            </div>

            {/* Scroll Container */}
            <div
                ref={containerRef}
                onScroll={handleScroll}
                className="flex-1 overflow-x-auto snap-x snap-mandatory flex scrollbar-hide"
                style={{ scrollBehavior: 'smooth' }}
            >
                {data.steps.map((step, index) => (
                    <div
                        key={index}
                        className="w-full h-full flex-shrink-0 snap-center flex flex-col items-center justify-center relative p-6"
                    >
                        {/* Dynamic Background */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${step.bgGradient} opacity-30`} />
                        <div className="absolute inset-0 bg-black/40" /> {/* Dim overlay */}

                        <div className="relative z-10 w-full max-w-sm flex flex-col items-center text-center space-y-8">
                            {/* Icon/Image */}
                            <div className="w-40 h-40 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center text-7xl shadow-[0_0_40px_rgba(0,0,0,0.5)] animate-float">
                                {step.image}
                            </div>

                            {/* Text */}
                            <div className="space-y-4">
                                <h2 className="text-3xl font-bold leading-tight">{step.title}</h2>
                                <p className="text-gray-300 text-lg leading-relaxed whitespace-pre-line">
                                    {step.description}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Bottom Action Area */}
            <div className="absolute bottom-10 left-0 right-0 px-6 z-50">
                <button
                    onClick={handleNext}
                    className={`w-full py-4 rounded-2xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${currentStep === 2
                        ? "bg-foon-lime text-bg-main shadow-[0_4px_20px_rgba(163,223,70,0.4)]"
                        : "bg-bg-card/80 backdrop-blur-md text-white border border-[#333]"
                        }`}
                >
                    {currentStep === 2 ? (
                        <>
                            예약하러 가기 <ArrowRight className="w-5 h-5" />
                        </>
                    ) : (
                        <>
                            다음으로 <ChevronRight className="w-5 h-5" />
                        </>
                    )}
                </button>
            </div>

            <style jsx global>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}

export default function IntroPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-bg-main" />}>
            <IntroPageContent />
        </Suspense>
    );
}
