"use client";

import { useRouter } from "next/navigation";
import { Check, ChevronRight, Clock, Flower2, Heart, Info, PawPrint, ShieldCheck, Star, Users } from "lucide-react";
import { useState } from "react";
import { APP_ICON_STROKE, AppBody, AppBottomAction, AppButton, AppList, AppSection, AppTopBar, appOptionClass, AppIntro } from "@/components/app/ui";
import { PassCard } from "@/components/site/PassCard";
import { cn } from "@/lib/utils";

/*
 * 포온 펫상조 안내. 밤 윗줄 + 밤 소개 -> 달빛 본문.
 * 상조는 장례 관련 화면이라 라임을 쓰지 않습니다(강조는 남색과 흰색).
 */

const ICON_CLASS = "h-[18px] w-[18px]";

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
        // 문서 4장: "완벽한" 같은 빈말 금지
        description: "더 세심하게 준비하는 마지막 여정",
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
    { num: "01", title: "전화 상담", desc: "24시간 연결 가능", icon: <Clock className={ICON_CLASS} strokeWidth={APP_ICON_STROKE} aria-hidden /> },
    { num: "02", title: "차량 출동", desc: "전용 운구 차량 배치", icon: <Star className={ICON_CLASS} strokeWidth={APP_ICON_STROKE} aria-hidden /> },
    { num: "03", title: "안치 및 장례", desc: "정성스러운 안치 절차", icon: <Heart className={ICON_CLASS} strokeWidth={APP_ICON_STROKE} aria-hidden /> },
    { num: "04", title: "화장 및 추모", desc: "개별 진행으로 정중함", icon: <Flower2 className={ICON_CLASS} strokeWidth={APP_ICON_STROKE} aria-hidden /> },
    { num: "05", title: "유골 인도", desc: "메모리얼 스톤 또는 봉안", icon: <ShieldCheck className={ICON_CLASS} strokeWidth={APP_ICON_STROKE} aria-hidden /> },
];

const BENEFITS = [
    {
        icon: <Clock className={ICON_CLASS} strokeWidth={APP_ICON_STROKE} aria-hidden />,
        title: "24시간 긴급 출동",
        desc: "밤낮없이 언제든 전문 장례지도사가 출동합니다"
    },
    {
        icon: <Heart className={ICON_CLASS} strokeWidth={APP_ICON_STROKE} aria-hidden />,
        title: "마음 돌봄 프로그램",
        desc: "펫로스 증후군 예방을 위한 심리 케어 지원"
    },
    {
        icon: <ShieldCheck className={ICON_CLASS} strokeWidth={APP_ICON_STROKE} aria-hidden />,
        title: "투명한 가격",
        desc: "가입 시점의 가격이 유지되어 물가 상승과 무관"
    },
    {
        icon: <Users className={ICON_CLASS} strokeWidth={APP_ICON_STROKE} aria-hidden />,
        title: "전담팀 서비스",
        desc: "하나의 장례지도사가 처음부터 끝까지 동행"
    },
    {
        icon: <PawPrint className={ICON_CLASS} strokeWidth={APP_ICON_STROKE} aria-hidden />,
        title: "개별 진행",
        desc: "타 동물과 섞이지 않는 개별 화장 시스템"
    },
    {
        icon: <Star className={ICON_CLASS} strokeWidth={APP_ICON_STROKE} aria-hidden />,
        title: "프리미엄 공간",
        desc: "VIP 전용 추모실에서 편안히 이별을 준비하세요"
    },
];

export default function SangjoPage() {
    const router = useRouter();
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

    return (
        <div className="flex min-h-full flex-col bg-moon">
            {/* 윗줄은 소개와 한 덩어리로 보이도록 불투명 밤색 */}
            <AppTopBar title="포온 펫상조" className="bg-night" />
            <AppIntro
                title={
                    <>
                        언젠가 마주할 이별,
                        <br />
                        가장 아름다운 약속으로
                    </>
                }
                subtitle="당황스러운 순간이 오더라도, 아이에게만 집중할 수 있도록 지금 미리 준비하세요."
            />

            <AppBody className="flex-1 pb-4">
                {/* 특별한 이유 */}
                <AppSection title="포온 상조가 특별한 이유" id="sangjo-benefits">
                    <AppList>
                        {BENEFITS.map((benefit, i) => (
                            <li key={i} className="flex items-start gap-3 px-4 py-4">
                                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-paper-2 text-ink-2">{benefit.icon}</span>
                                <div className="min-w-0 pt-0.5">
                                    <h3 className="text-[15.5px] font-semibold leading-snug text-ink">{benefit.title}</h3>
                                    <p className="mt-0.5 text-[14px] leading-relaxed text-ink-2">{benefit.desc}</p>
                                </div>
                            </li>
                        ))}
                    </AppList>
                </AppSection>

                {/* 진행 절차: 탑승권 카드 안의 세로 단계 */}
                <AppSection title="장례 진행 절차" id="sangjo-process">
                    <PassCard mainClassName="p-5 sm:p-6">
                        <ol>
                            {PROCESS_STEPS.map((step, i) => (
                                <li key={i} className="relative flex gap-4 pb-5 last:pb-0">
                                    {i < PROCESS_STEPS.length - 1 && <span className="absolute bottom-1 left-[19.5px] top-11 w-px bg-line" aria-hidden />}
                                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-paper-2 text-ink-2">{step.icon}</span>
                                    <div className="min-w-0 pt-1">
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-[13px] font-semibold tabular-nums text-ink-3">{step.num}</span>
                                            <h3 className="text-[15.5px] font-semibold text-ink">{step.title}</h3>
                                        </div>
                                        <p className="mt-0.5 text-[14px] text-ink-2">{step.desc}</p>
                                    </div>
                                </li>
                            ))}
                        </ol>
                    </PassCard>
                </AppSection>

                {/* 플랜 선택: 선택 = 남색 테두리 + 체크 */}
                <AppSection title="멤버십 플랜 선택" id="sangjo-plans">
                    <div className="space-y-3">
                        {PLANS.map((plan) => {
                            const selected = selectedPlan === plan.id;
                            return (
                                <button
                                    key={plan.id}
                                    type="button"
                                    aria-pressed={selected}
                                    onClick={() => setSelectedPlan(plan.id)}
                                    className={appOptionClass(selected, "relative block w-full p-5")}
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="min-w-0">
                                            {plan.isPopular && (
                                                <span className="mb-2 inline-flex rounded-full bg-pine-soft px-2.5 py-0.5 text-[13px] font-semibold text-pine">
                                                    MOST POPULAR
                                                </span>
                                            )}
                                            <h3 className="text-[17px] font-bold text-ink">{plan.name}</h3>
                                            <p className="mt-0.5 text-[14px] text-ink-2">{plan.description}</p>
                                        </div>
                                        <div className="shrink-0 text-right">
                                            <div className="text-[22px] font-extrabold leading-none tabular-nums text-ink">{plan.price}</div>
                                            <div className="mt-1 text-[13px] text-ink-3">{plan.priceUnit}</div>
                                        </div>
                                    </div>
                                    <div className="mt-4 flex flex-wrap gap-1.5">
                                        {plan.benefits.map((benefit, i) => (
                                            <span
                                                key={i}
                                                className={cn(
                                                    "rounded-full px-2.5 py-1 text-[13px] transition-colors",
                                                    selected ? "bg-pine-soft text-pine" : "bg-paper-2 text-ink-2",
                                                )}
                                            >
                                                {benefit}
                                            </span>
                                        ))}
                                    </div>
                                    {selected && (
                                        <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-night text-star ring-2 ring-moon" aria-hidden>
                                            <Check className="h-4 w-4" strokeWidth={2.5} />
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </AppSection>

                {/* 안내 */}
                <AppSection>
                    <div className="flex items-start gap-3 rounded-[20px] bg-pine-soft p-5">
                        <Info className="mt-0.5 h-5 w-5 shrink-0 text-pine" strokeWidth={APP_ICON_STROKE} aria-hidden />
                        <div>
                            <h3 className="text-[15px] font-semibold leading-snug text-ink">가입 전 꼭 확인해 주세요</h3>
                            <p className="mt-1 text-[14px] leading-relaxed text-ink-2">
                                멤버십은 가입 30일 이후부터 장례 서비스 혜택 적용이 가능합니다.
                                중도 해지 시 환급 규정은 이용 약관을 참조해 주세요.
                            </p>
                        </div>
                    </div>
                </AppSection>
            </AppBody>

            {/* 주 버튼: 남색 (장례 관련 화면이라 라임 대신) */}
            <AppBottomAction>
                <AppButton
                    variant="primary"
                    size="lg"
                    block
                    disabled={!selectedPlan}
                    onClick={() => router.push(`/booking/new?category=MUTUAL_AID`)}
                    className="disabled:bg-paper-2 disabled:text-ink-3 disabled:opacity-100"
                >
                    {selectedPlan ? "장례 서비스 신청하기" : "플랜을 선택해 주세요"}
                    <ChevronRight className="h-5 w-5" strokeWidth={APP_ICON_STROKE} aria-hidden />
                </AppButton>
            </AppBottomAction>
        </div>
    );
}
