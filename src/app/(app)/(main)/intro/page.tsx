"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { ArrowRight, X, Heart, Sparkles, Moon, Activity, Stethoscope, ShieldCheck, Leaf, Cloud, Star, ChevronRight } from "lucide-react";
import { useState, useRef, Suspense, useEffect } from "react";
import Link from "next/link";
import { reviews, getRandomReviews, Review } from "@/lib/data/reviews";

type IntroStep = {
    title: string;
    description: string;
    icon: React.ElementType;
    glowColor: string;
    badge?: string;
};

const introData: Record<string, { title: string; steps: IntroStep[] }> = {
    FUNERAL: {
        title: "펫장례",
        steps: [
            {
                title: "서울·경기·인천 전지역 30분",
                description: "아이와 함께한 모든 빛나는 순간들이\n가장 아름답게 기억될 수 있도록.",
                icon: Sparkles,
                glowColor: "bg-amber-500/20",
                badge: "전지역 출발"
            },
            {
                title: "가장 포근한 안식",
                description: "전문 장례지도사가 모든 과정을\n마음 깊이 공감하며 세심하게 안내합니다.",
                icon: Moon,
                glowColor: "bg-slate-400/20"
            },
            {
                title: "영원한 유대, 포온",
                description: "이별이 끝이 아닌, 마음속 영원한\n별로 남을 수 있게 정성을 다합니다.",
                icon: Star,
                glowColor: "bg-foon-lime/20"
            }
        ]
    },
    CHECKUP: {
        title: "건강검진",
        steps: [
            {
                title: "말 못하는 아이를 위해",
                description: "작은 변화도 놓치지 않도록,\n정밀하고 따뜻한 검진을 시작합니다.",
                icon: Stethoscope,
                glowColor: "bg-blue-500/20"
            },
            {
                title: "대학병원급 인프라",
                description: "최고 수준의 의료 장비와\n각 분야 전문 수의사진이 함께합니다.",
                icon: Activity,
                glowColor: "bg-cyan-500/20"
            },
            {
                title: "평생의 건강 방패",
                description: "검진 결과를 바탕으로\n우리아이 맞춤형 평생 케어를 설계합니다.",
                icon: ShieldCheck,
                glowColor: "bg-foon-lime/20"
            }
        ]
    },
    SANGJO: {
        title: "펫상조",
        steps: [
            {
                title: "미리 준비하는 마음",
                description: "갑작스러운 이별의 순간에도\n당황하지 않도록 든든하게 준비하세요.",
                icon: Heart,
                glowColor: "bg-rose-500/20"
            },
            {
                title: "부담 없는 라이프케어",
                description: "합리적인 월 납입금으로\n최고의 프리미엄 장례 서비스를 보장받습니다.",
                icon: Cloud,
                glowColor: "bg-indigo-500/20"
            },
            {
                title: "신뢰의 파트너",
                description: "투명하고 안전한 자산 관리로\n고객님의 믿음에 보답합니다.",
                icon: Leaf,
                glowColor: "bg-foon-lime/20"
            }
        ]
    }
};

function IntroPageContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const category = searchParams.get("category")?.toUpperCase() || "FUNERAL";
    
    const data = introData[category] || introData["FUNERAL"];
    const [currentStep, setCurrentStep] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
    const [displayReviews] = useState<Review[]>(() => getRandomReviews(3));

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentReviewIndex((prev) => (prev + 1) % displayReviews.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [displayReviews.length]);

    const currentReview = displayReviews[currentReviewIndex];

    const handleScroll = () => {
        if (!containerRef.current) return;
        const scrollPosition = containerRef.current.scrollLeft;
        const width = containerRef.current.offsetWidth;
        const step = Math.round(scrollPosition / width);
        setCurrentStep(step);
    };

    const handleNext = () => {
        if (currentStep < data.steps.length - 1) {
            containerRef.current?.scrollTo({
                left: (currentStep + 1) * containerRef.current.offsetWidth,
                behavior: "smooth"
            });
        } else {
            router.push(`/booking/new?category=${category}`);
        }
    };

    return (
        <div className="bg-[#0A0A0B] min-h-screen text-white relative overflow-hidden flex flex-col font-sans">
            
            <div className="absolute inset-0 overflow-hidden pointer-events-none transition-colors duration-1000">
                <div className={`absolute top-1/4 left-1/2 -translate-x-1/2 w-[120vw] h-[120vw] rounded-full blur-[100px] opacity-40 transition-all duration-1000 ${data.steps[currentStep].glowColor}`} />
                <div className="absolute inset-0 bg-[#0A0A0B]/60 backdrop-blur-[100px]" />
            </div>

            <header className="relative z-50 flex justify-between items-center p-6 pt-10">
                <button 
                    onClick={() => router.back()} 
                    className="w-10 h-10 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all active:scale-95"
                >
                    <X className="w-5 h-5 text-gray-400" />
                </button>
                
                <div className="flex gap-2 items-center">
                    {data.steps.map((_, i) => (
                        <div
                            key={i}
                            className={`h-1 rounded-full transition-all duration-500 ease-out ${
                                i === currentStep ? "w-8 bg-foon-lime shadow-[0_0_10px_#A3DF46]" : "w-2 bg-white/20"
                            }`}
                        />
                    ))}
                </div>

                <button
                    onClick={() => router.push(`/booking/new?category=${category}`)}
                    className="text-gray-500 text-sm font-semibold tracking-wider uppercase hover:text-white transition-colors px-2"
                >
                    Skip
                </button>
            </header>

            <div
                ref={containerRef}
                onScroll={handleScroll}
                className="flex-1 overflow-x-auto snap-x snap-mandatory flex scrollbar-hide relative z-10"
            >
                {data.steps.map((step, index) => {
                    const Icon = step.icon;
                    return (
                        <div
                            key={index}
                            className="w-full h-full flex-shrink-0 snap-center flex flex-col items-center justify-center px-8 pb-32"
                        >
                            <div className={`transition-all duration-1000 transform ${currentStep === index ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} pt-10`}>
                                
                                <div className="relative w-48 h-48 mx-auto mb-12 flex items-center justify-center">
                                    <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent rounded-[3rem] border border-white/10 shadow-2xl backdrop-blur-xl rotate-45 animate-slow-spin"></div>
                                    <div className="relative z-10 w-24 h-24 bg-[#161618] rounded-full flex items-center justify-center shadow-inner border border-white/5">
                                        <Icon className="w-10 h-10 text-white/90" strokeWidth={1.5} />
                                    </div>
                                </div>

                                <div className="text-center space-y-5 max-w-[320px] mx-auto">
                                    {step.badge && (
                                        <span className="inline-block px-4 py-1.5 bg-foon-lime/20 border border-foon-lime/30 rounded-full text-foon-lime text-xs font-medium">
                                            {step.badge}
                                        </span>
                                    )}
                                    <h2 className="text-3xl font-extrabold tracking-tight text-white/90 text-balance">
                                        {step.title}
                                    </h2>
                                    <p className="text-gray-400 text-[15px] leading-relaxed text-balance">
                                        {step.description}
                                    </p>
                                </div>

                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-6 pb-10 bg-gradient-to-t from-[#0A0A0B] via-[#0A0A0B]/80 to-transparent z-50">
                <Link
                    href="/reviews"
                    className="block mb-3 p-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl hover:bg-white/10 transition-colors"
                >
                    <div className="flex items-center gap-3">
                        <div className="flex-shrink-0">
                            <div className="w-10 h-10 rounded-full bg-foon-lime/20 flex items-center justify-center">
                                <span className="text-lg">💬</span>
                            </div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1 mb-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-3 h-3 text-foon-lime fill-foon-lime" />
                                ))}
                            </div>
                            <p className="text-white/90 text-sm leading-relaxed line-clamp-2">
                                "{currentReview.content}"
                            </p>
                            <p className="text-gray-500 text-xs mt-1">
                                {currentReview.name} · {currentReview.petType} · {currentReview.serviceType}
                            </p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    </div>
                    <div className="flex justify-center gap-1.5 mt-3">
                        {displayReviews.map((_, i) => (
                            <div
                                key={i}
                                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                                    i === currentReviewIndex ? "bg-foon-lime" : "bg-white/20"
                                }`}
                            />
                        ))}
                    </div>
                </Link>

                <button
                    onClick={handleNext}
                    className={`w-full py-5 rounded-[2rem] font-bold text-lg flex items-center justify-center gap-3 transition-all duration-500 active:scale-95 border ${
                        currentStep === data.steps.length - 1
                            ? "bg-foon-lime text-[#0A0A0B] border-foon-lime shadow-[0_0_30px_rgba(163,223,70,0.3)] hover:shadow-[0_0_40px_rgba(163,223,70,0.5)]"
                            : "bg-white/5 text-white border-white/10 hover:bg-white/10 backdrop-blur-md"
                    }`}
                >
                    {currentStep === data.steps.length - 1 ? (
                        <>예약 시작하기 <ArrowRight className="w-5 h-5" /></>
                    ) : (
                        <span className="tracking-wide">다음</span>
                    )}
                </button>
            </div>

            <style jsx global>{`
                .scrollbar-hide::-webkit-scrollbar { display: none; }
                .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
                
                @keyframes slow-spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-slow-spin {
                    animation: slow-spin 20s linear infinite;
                }
                
                .text-balance {
                    text-wrap: balance;
                }
            `}</style>
        </div>
    );
}

export default function IntroPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#0A0A0B]" />}>
            <IntroPageContent />
        </Suspense>
    );
}