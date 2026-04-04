"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Heart, ShieldCheck, Clock, Flower2, Star, CheckCircle2, ChevronRight, Users, PawPrint } from "lucide-react";
import { useState } from "react";

const PLANS = [
    {
        id: "standard",
        name: "스탠다드",
        price: "9,900",
        priceUnit: "월",
        description: "필수 장례 서비스를 합리적으로",
        benefits: [
            "24시간 긴급 출동",
            "개별 화장 서비스",
            "오동나무 관 제공",
            "기본 추모 영상 제작"
        ],
        isPopular: false,
    },
    {
        id: "premium",
        name: "프리미엄",
        price: "19,800",
        priceUnit: "월",
        description: "가장 완벽한 마지막 여정",
        benefits: [
            "스탠다드 모든 혜택",
            "고급 수의 및 유골함",
            "메모리얼 스톤 제작",
            "VIP 전용 추모실",
            "1:1 전담 장례지도사"
        ],
        isPopular: true,
    }
];

const PROCESS_STEPS = [
    { num: "01", title: "전화 상담", desc: "24시간 연결 가능", icon: <Clock className="w-5 h-5" strokeWidth={1.5} /> },
    { num: "02", title: "차량 출동", desc: "전용 운구 차량 배치", icon: <Star className="w-5 h-5" strokeWidth={1.5} /> },
    { num: "03", title: "안치 및 장례", desc: "정성스러운 안치 절차", icon: <Heart className="w-5 h-5" strokeWidth={1.5} /> },
    { num: "04", title: "화장 및 추모", desc: "개별 진행으로 정중함", icon: <Flower2 className="w-5 h-5" strokeWidth={1.5} /> },
    { num: "05", title: "유골 인도", desc: "메모리얼 스톤 또는 봉안", icon: <ShieldCheck className="w-5 h-5" strokeWidth={1.5} /> },
];

const BENEFITS = [
    {
        icon: <Clock className="w-5 h-5" strokeWidth={1.5} />,
        title: "24시간 긴급 출동",
        desc: "밤낮없이 언제든 전문 장례지도사가 출동합니다"
    },
    {
        icon: <Heart className="w-5 h-5" strokeWidth={1.5} />,
        title: "마음 돌봄 프로그램",
        desc: "펫로스 증후군 예방을 위한 심리 케어 지원"
    },
    {
        icon: <ShieldCheck className="w-5 h-5" strokeWidth={1.5} />,
        title: "투명한 가격",
        desc: "가입 시점의 가격이 유지되어物料 상승과 무관"
    },
    {
        icon: <Users className="w-5 h-5" strokeWidth={1.5} />,
        title: "전담팀 서비스",
        desc: "하나의 장례지도사가 처음부터 끝까지 동행"
    },
    {
        icon: <PawPrint className="w-5 h-5" strokeWidth={1.5} />,
        title: "개별 진행",
        desc: "타 동물과 섞이지 않는 개별 화장 시스템"
    },
    {
        icon: <Star className="w-5 h-5" strokeWidth={1.5} />,
        title: "프리미엄 공간",
        desc: "VIP 전용 추모실에서 편안히 이별을 준비하세요"
    },
];

export default function SangjoPage() {
    const router = useRouter();
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

    return (
        <div className="min-h-screen bg-[#0A0A0B] text-white relative flex flex-col font-sans">
            <header className="h-16 flex items-center px-4 sticky top-0 bg-[#0A0A0B]/80 backdrop-blur-2xl z-50 border-b border-white/[0.06]">
                <button 
                    onClick={() => router.back()} 
                    className="p-2 -ml-2 rounded-full hover:bg-white/5 transition-all duration-300 active:scale-90"
                >
                    <ArrowLeft className="w-6 h-6 text-gray-300" />
                </button>
                <h1 className="font-bold text-[17px] ml-2 tracking-tight">포온 펫상조</h1>
            </header>

            <main className="flex-1 overflow-y-auto pb-36 scrollbar-hide">

                {/* Hero Section */}
                <section className="px-6 pt-12 pb-16 text-center relative overflow-hidden">
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-0 right-0 w-[85vw] h-[85vw] rounded-full bg-amber-500/[0.04] blur-[120px]" />
                        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[60vw] h-[60vw] rounded-full bg-amber-500/[0.02] blur-[100px]" />
                    </div>
                    
                    <h2 className="text-[32px] font-bold leading-snug tracking-tight mb-5 break-keep-all relative">
                        언젠가 마주할 이별,
                        <br className="leading-tight" />
                        <span className="text-amber-400">가장 아름다운 약속</span>으로
                    </h2>
                    <p className="text-gray-400 text-[15px] leading-relaxed max-w-[280px] mx-auto break-keep-all relative">
                        당황스러운 순간이 오더라도,
                        <br />아이에게만 집중할 수 있도록
                        <br />지금 미리 준비하세요.
                    </p>
                </section>

                {/* Benefits Section - Bento Grid */}
                <section className="px-6 mb-14">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-1 h-5 bg-amber-400 rounded-full" />
                        <h3 className="text-[15px] font-bold tracking-tight">포온 상조가 특별한 이유</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        {BENEFITS.map((benefit, i) => (
                            <div 
                                key={i}
                                className="relative bg-[#111113] rounded-2xl border border-white/[0.06] p-4 overflow-hidden group"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                                <div className="relative">
                                    <div className="w-10 h-10 rounded-xl bg-[#1a1a1d] border border-white/[0.08] flex items-center justify-center text-amber-400 mb-3">
                                        {benefit.icon}
                                    </div>
                                    <h4 className="font-bold text-[13px] mb-1 leading-snug">{benefit.title}</h4>
                                    <p className="text-[11px] text-gray-500 leading-relaxed break-keep-all">{benefit.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Process Section */}
                <section className="px-6 mb-14">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-1 h-5 bg-amber-400 rounded-full" />
                        <h3 className="text-[15px] font-bold tracking-tight">장례 진행 절차</h3>
                    </div>
                    <div className="relative bg-[#111113] rounded-3xl border border-white/[0.06] p-6 overflow-hidden">
                        <div className="absolute left-[3.25rem] top-8 bottom-8 w-[1px] bg-gradient-to-b from-amber-400/40 via-amber-400/20 to-transparent" />
                        <div className="space-y-5">
                            {PROCESS_STEPS.map((step, i) => (
                                <div key={i} className="flex items-center gap-4 relative">
                                    <div className="w-12 h-12 rounded-2xl bg-[#1a1a1d] border border-white/[0.08] flex items-center justify-center text-amber-400 shrink-0 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
                                        {step.icon}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <span className="text-[10px] font-bold text-amber-400 tracking-widest">{step.num}</span>
                                            <h4 className="font-bold text-[14px]">{step.title}</h4>
                                        </div>
                                        <p className="text-[12px] text-gray-500">{step.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Plan Selection */}
                <section className="px-6 mb-14">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-1 h-5 bg-amber-400 rounded-full" />
                        <h3 className="text-[15px] font-bold tracking-tight">멤버십 플랜 선택</h3>
                    </div>
                    <div className="space-y-4">
                        {PLANS.map((plan) => (
                            <button
                                key={plan.id}
                                onClick={() => setSelectedPlan(plan.id)}
                                className={`w-full text-left p-6 rounded-2xl border transition-all duration-300 relative overflow-hidden ${
                                    selectedPlan === plan.id 
                                        ? "bg-[#111113] border-amber-400/40 shadow-[0_0_40px_rgba(245,158,11,0.08)]" 
                                        : "bg-[#111113] border-white/[0.06] hover:border-white/[0.1]"
                                }`}
                            >
                                {plan.isPopular && (
                                    <div className="absolute -top-0.5 left-6">
                                        <span className="inline-block bg-amber-400 text-[#0A0A0B] text-[10px] font-black px-4 py-1.5 rounded-b-xl tracking-wider">
                                            MOST POPULAR
                                        </span>
                                    </div>
                                )}
                                <div className="flex justify-between items-start mb-5 pt-2">
                                    <div>
                                        <h4 className="text-[16px] font-bold mb-1">{plan.name}</h4>
                                        <p className="text-[12px] text-gray-500">{plan.description}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[22px] font-black text-white leading-none">{plan.price}</div>
                                        <div className="text-[11px] text-gray-500 mt-0.5">{plan.priceUnit}</div>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {plan.benefits.map((benefit, i) => (
                                        <span 
                                            key={i}
                                            className={`text-[11px] px-2.5 py-1 rounded-full transition-colors duration-300 ${
                                                selectedPlan === plan.id 
                                                    ? "bg-amber-400/10 text-amber-400" 
                                                    : "bg-white/[0.04] text-gray-400"
                                            }`}
                                        >
                                            {benefit}
                                        </span>
                                    ))}
                                </div>
                                {selectedPlan === plan.id && (
                                    <div className="absolute top-5 right-5 w-6 h-6 rounded-full bg-amber-400 flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.3)]">
                                        <CheckCircle2 className="w-4 h-4 text-[#0A0A0B]" strokeWidth={2.5} />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </section>

                {/* Notice */}
                <section className="px-6 pb-10">
                    <div className="relative bg-[#111113] rounded-2xl border border-white/[0.06] p-5 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-400/[0.02] to-transparent" />
                        <div className="relative flex items-start gap-4">
                            <div className="w-10 h-10 rounded-xl bg-[#1a1a1d] border border-white/[0.08] flex items-center justify-center text-amber-400 shrink-0">
                                <Star className="w-5 h-5" strokeWidth={1.5} />
                            </div>
                            <div>
                                <h4 className="font-bold text-[13px] mb-1.5 leading-snug">가입 전 꼭 확인해 주세요</h4>
                                <p className="text-[12px] text-gray-500 leading-relaxed break-keep-all">
                                    멤버십은 가입 30일 이후부터 장례 서비스 혜택 적용이 가능합니다.
                                    중도 해지 시 환급 규정은 이용 약관을 참조해 주세요.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

            </main>

            {/* Fixed Bottom CTA */}
            <div className="fixed bottom-0 left-0 w-full p-6 bg-gradient-to-t from-[#0A0A0B] via-[#0A0A0B]/95 to-transparent z-50">
                <button
                    disabled={!selectedPlan}
                    onClick={() => router.push(`/booking/new?category=MUTUAL_AID`)}
                    className={`w-full py-[18px] rounded-full font-bold text-[15px] transition-all duration-300 flex items-center justify-center gap-2 ${
                        selectedPlan 
                            ? "bg-amber-400 text-[#0A0A0B] shadow-[0_0_40px_rgba(245,158,11,0.25)] hover:bg-amber-300 hover:shadow-[0_0_50px_rgba(245,158,11,0.35)] active:scale-[0.98]" 
                            : "bg-[#1a1a1d] text-gray-600 border border-white/[0.06] cursor-not-allowed"
                    }`}
                >
                    {selectedPlan ? "장례 서비스 신청하기" : "플랜을 선택해 주세요"}
                    <ChevronRight className="w-5 h-5 transition-transform duration-300" />
                </button>
            </div>
        </div>
    );
}
