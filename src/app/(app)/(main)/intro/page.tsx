"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { ArrowRight, X, Heart, Sparkles, Moon, Activity, Stethoscope, ShieldCheck, Leaf, Cloud, Star, ChevronRight, MessageCircle } from "lucide-react";
import { useState, useRef, Suspense, useEffect } from "react";
import { reviews, getRandomReviews, Review } from "@/lib/data/reviews";
import { APP_ICON_STROKE, AppBody, AppBottomAction, AppButton } from "@/components/app/ui";
import { PassCard } from "@/components/site/PassCard";
import { cn } from "@/lib/utils";

type IntroStep = {
    title: string;
    description: string;
    icon: React.ElementType;
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
                badge: "전지역 출발"
            },
            {
                title: "가장 포근한 안식",
                description: "전문 장례지도사가 모든 과정을\n마음 깊이 공감하며 세심하게 안내합니다.",
                icon: Moon
            },
            {
                title: "영원한 유대, 포온",
                description: "이별이 끝이 아닌, 마음속 영원한\n별로 남을 수 있게 정성을 다합니다.",
                icon: Star
            }
        ]
    },
    CHECKUP: {
        title: "건강검진",
        steps: [
            {
                title: "말 못하는 아이를 위해",
                description: "작은 변화도 놓치지 않도록,\n정밀하고 따뜻한 검진을 시작합니다.",
                icon: Stethoscope
            },
            {
                title: "대학병원급 인프라",
                description: "최고 수준의 의료 장비와\n각 분야 전문 수의사진이 함께합니다.",
                icon: Activity
            },
            {
                title: "평생의 건강 방패",
                description: "검진 결과를 바탕으로\n우리아이 맞춤형 평생 케어를 설계합니다.",
                icon: ShieldCheck
            }
        ]
    },
    SANGJO: {
        title: "펫상조",
        steps: [
            {
                title: "미리 준비하는 마음",
                description: "갑작스러운 이별의 순간에도\n당황하지 않도록 든든하게 준비하세요.",
                icon: Heart
            },
            {
                title: "부담 없는 라이프케어",
                description: "합리적인 월 납입금으로\n최고의 프리미엄 장례 서비스를 보장받습니다.",
                icon: Cloud
            },
            {
                title: "신뢰의 파트너",
                description: "투명하고 안전한 자산 관리로\n고객님의 믿음에 보답합니다.",
                icon: Leaf
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

    const isLast = currentStep === data.steps.length - 1;

    return (
        // 소개 화면은 하단 탭이 없으므로 (main) 레이아웃의 pb-28 을 상쇄해 아래 버튼이 화면 바닥에 붙게 합니다.
        // 장례·상조 안내가 기본이라 이 화면에는 라임을 쓰지 않습니다(8장 규칙).
        <div className="-mb-28 flex min-h-[100dvh] flex-col bg-moon">
            {/* 밤 머리: 닫기, 단계 표시, 건너뛰기 + 단계별 소개 */}
            <header
                className="relative isolate overflow-hidden rounded-b-[28px] bg-night pb-9 text-star"
                style={{ paddingTop: "max(12px, env(safe-area-inset-top))" }}
            >
                <div className="site-stars -z-10" aria-hidden />

                <div className="flex h-14 items-center justify-between px-3">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        aria-label="닫기"
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full text-star transition-colors hover:bg-white/10 active:translate-y-px"
                    >
                        <X className="h-5 w-5" strokeWidth={APP_ICON_STROKE} aria-hidden />
                    </button>

                    <div className="flex items-center gap-2">
                        {data.steps.map((_, i) => (
                            <div
                                key={i}
                                className={cn(
                                    "h-1 rounded-full transition-all duration-500 ease-out motion-reduce:transition-none",
                                    i === currentStep ? "w-8 bg-star" : "w-2 bg-white/20",
                                )}
                            />
                        ))}
                    </div>

                    <button
                        type="button"
                        onClick={() => router.push(`/booking/new?category=${category}`)}
                        className="h-10 rounded-full px-3 text-[14px] font-semibold text-star-2 transition-colors hover:text-star"
                    >
                        Skip
                    </button>
                </div>

                <div
                    ref={containerRef}
                    onScroll={handleScroll}
                    className="scrollbar-hide flex snap-x snap-mandatory overflow-x-auto"
                >
                    {data.steps.map((step, index) => {
                        const Icon = step.icon;
                        return (
                            <div
                                key={index}
                                className="flex w-full flex-shrink-0 snap-center flex-col items-center px-8 pt-6"
                            >
                                <div
                                    className={cn(
                                        "flex flex-col items-center text-center transition-opacity duration-700 motion-reduce:transition-none",
                                        currentStep === index ? "opacity-100" : "opacity-0",
                                    )}
                                >
                                    <span className="flex h-24 w-24 items-center justify-center rounded-full bg-night-3 text-star ring-4 ring-white/10">
                                        <Icon className="h-10 w-10" strokeWidth={APP_ICON_STROKE} aria-hidden />
                                    </span>

                                    <div className="mt-8 max-w-[320px] space-y-4">
                                        {step.badge && (
                                            <span className="inline-flex h-8 items-center rounded-full bg-white/10 px-3.5 text-[13px] font-semibold text-star-2 ring-1 ring-inset ring-white/15">
                                                {step.badge}
                                            </span>
                                        )}
                                        <h2 className="text-balance text-[26px] font-extrabold leading-[1.28] tracking-[-0.03em] text-star">
                                            {step.title}
                                        </h2>
                                        <p className="whitespace-pre-line text-balance text-[15px] leading-relaxed text-star-2">
                                            {step.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </header>

            <AppBody className="flex-1">
                <PassCard href="/reviews" mainClassName="p-4 sm:p-4">
                    <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-paper-2 text-ink-2">
                            <MessageCircle className="h-5 w-5" strokeWidth={APP_ICON_STROKE} aria-hidden />
                        </span>
                        <div className="min-w-0 flex-1">
                            <div className="mb-1 flex items-center gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="h-3.5 w-3.5 fill-current text-pine" strokeWidth={APP_ICON_STROKE} />
                                ))}
                            </div>
                            <p className="line-clamp-2 text-[14.5px] leading-relaxed text-ink">
                                {`"${currentReview.content}"`}
                            </p>
                            <p className="mt-1 text-[13px] text-ink-3">
                                {currentReview.name} · {currentReview.petType} · {currentReview.serviceType}
                            </p>
                        </div>
                        <ChevronRight className="h-5 w-5 shrink-0 text-ink-3" strokeWidth={APP_ICON_STROKE} />
                    </div>
                    <div className="mt-3 flex justify-center gap-1.5">
                        {displayReviews.map((_, i) => (
                            <div
                                key={i}
                                className={cn(
                                    "h-1.5 w-1.5 rounded-full transition-colors",
                                    i === currentReviewIndex ? "bg-ink" : "bg-line",
                                )}
                            />
                        ))}
                    </div>
                </PassCard>
            </AppBody>

            <AppBottomAction>
                <AppButton variant={isLast ? "primary" : "secondary"} size="lg" block onClick={handleNext}>
                    {isLast ? (
                        <>예약 시작하기 <ArrowRight className="h-5 w-5" strokeWidth={APP_ICON_STROKE} aria-hidden /></>
                    ) : (
                        <span>다음</span>
                    )}
                </AppButton>
            </AppBottomAction>
        </div>
    );
}

export default function IntroPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-moon" />}>
            <IntroPageContent />
        </Suspense>
    );
}
