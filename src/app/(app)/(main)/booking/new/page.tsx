"use client";

import React, { useState, Suspense, useMemo, useRef, useSyncExternalStore } from "react";
import { ArrowRight, Building2, CarTaxiFront, Check, Flower, Flower2, MapPin, MessageCircle, PawPrint, Phone, Plane, ShieldCheck, Stethoscope, type LucideIcon } from "lucide-react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import {
    APP_ICON_STROKE,
    AppBody,
    AppBottomAction,
    AppButton,
    AppEmpty,
    AppProgress,
    AppTopBar,
    appChipClass,
    appInputClass,
    appLabelClass,
    skeletonClass,
} from "@/components/app/ui";
import { PassCard } from "@/components/site/PassCard";
import { usePets } from "@/hooks/usePets";
import { SITE } from "@/lib/site/config";
import { cn } from "@/lib/utils";

const SERVICES: Record<string, { title: string; icon: LucideIcon }> = {
    "TAXI": { title: "펫택시", icon: CarTaxiFront },
    "FUNERAL": { title: "펫장례", icon: Flower2 },
    "BATH": { title: "고정식 장례", icon: Building2 },
    "CHECKUP": { title: "건강검진", icon: Stethoscope },
    "INSURANCE": { title: "펫보험", icon: ShieldCheck },
    "MUTUAL_AID": { title: "펫상조", icon: Flower },
    "TRAVEL": { title: "펫여행", icon: Plane },
};

/** category 없이 들어온 경우(예: 내 상담 > 새 상담 시작하기). 장례 문구를 보여주지 않는 일반 상담 */
const GENERAL_SERVICE = { title: "상담", icon: MessageCircle };

/** 장례와 관련된 상담. 화면에 라임을 쓰지 않습니다 (docs/BRAND_SPACE_CONCEPT.md 8장) */
const CALM_CATEGORIES = ["FUNERAL", "BATH", "MUTUAL_AID"];

/** 단계: 0 = 희망 지역·일시, 1 = 반려동물 선택 + 상담 남기기 */
const TOTAL_STEPS = 2;
const LAST_STEP = TOTAL_STEPS - 1;

/** "시간은 상담 때 정할게요" 선택값 */
const FLEXIBLE_TIME = "FLEX";

const morningSlots = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30"];
const afternoonSlots = ["12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00"];

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

type DateOption = {
    key: string;
    label: string;
    month: number;
    date: number;
    weekday: string;
    isWeekend: boolean;
};

const toDateKey = (d: Date) => `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;

// 오늘 날짜는 기기(브라우저) 기준으로만 계산합니다. 서버 렌더 시에는 null → 하이드레이션 불일치 방지.
const subscribeNoop = () => () => {};
const getTodayKey = () => toDateKey(new Date());
const getServerTodayKey = () => null;

function useTodayKey() {
    return useSyncExternalStore(subscribeNoop, getTodayKey, getServerTodayKey);
}

// 현재 시각(분). 오늘 날짜에서 이미 지난 시간을 고르지 못하게 할 때 씁니다.
const getNowMinutes = () => {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
};
const getServerNowMinutes = () => null;

function useNowMinutes() {
    return useSyncExternalStore(subscribeNoop, getNowMinutes, getServerNowMinutes);
}

const toMinutes = (time: string) => {
    const [hour, minute] = time.split(":").map(Number);
    return hour * 60 + minute;
};

function buildDateOptions(todayKey: string | null): DateOption[] {
    if (!todayKey) return [];
    const [y, m, d] = todayKey.split("-").map(Number);
    return Array.from({ length: 7 }, (_, i) => {
        const day = new Date(y, m - 1, d + i);
        const dow = day.getDay();
        return {
            key: toDateKey(day),
            label: i === 0 ? "오늘" : i === 1 ? "내일" : WEEKDAYS[dow],
            month: day.getMonth() + 1,
            date: day.getDate(),
            weekday: WEEKDAYS[dow],
            isWeekend: dow === 0 || dow === 6,
        };
    });
}

function formatTime(time: string) {
    const [hour, minute] = time.split(":").map(Number);
    const period = hour < 12 ? "오전" : "오후";
    const displayHour = hour > 12 ? hour - 12 : hour;
    return { period, text: `${displayHour}:${minute.toString().padStart(2, "0")}` };
}

export default function BookingPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen bg-moon">
                    <div className="h-14 bg-night" />
                </div>
            }
        >
            <BookingContent />
        </Suspense>
    );
}

function BookingContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const category = searchParams.get("category")?.toUpperCase() ?? "";
    const isGeneral = !Object.prototype.hasOwnProperty.call(SERVICES, category);
    const service = isGeneral ? GENERAL_SERVICE : SERVICES[category];
    const isFuneral = category === "FUNERAL";
    const isCalm = CALM_CATEGORIES.includes(category);

    const { data: pets, isLoading } = usePets();
    const [step, setStep] = useState(0);
    const mainRef = useRef<HTMLElement>(null);

    const [region, setRegion] = useState("");
    const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [selectedPetId, setSelectedPetId] = useState<string | null>(null);

    const todayKey = useTodayKey();
    const dateOptions = useMemo(() => buildDateOptions(todayKey), [todayKey]);
    // 날짜를 고르지 않았다면 오늘을 기본 희망 날짜로 둡니다.
    const activeDateKey = selectedDateKey ?? dateOptions[0]?.key ?? null;
    const activeDate = dateOptions.find((d) => d.key === activeDateKey) ?? null;

    const nowMinutes = useNowMinutes();
    const isTodayActive = !!activeDateKey && activeDateKey === todayKey;
    const isPastSlot = (time: string) => isTodayActive && nowMinutes !== null && toMinutes(time) <= nowMinutes;
    // 다른 날짜에서 고른 시간이 오늘 기준으로 이미 지났다면 고르지 않은 것으로 봅니다.
    const effectiveTime =
        selectedTime && selectedTime !== FLEXIBLE_TIME && isPastSlot(selectedTime) ? null : selectedTime;

    const hasNoPets = !isLoading && (!pets || pets.length === 0);
    const selectedPet = pets?.find((p) => p.id === selectedPetId) ?? null;

    const isScheduleReady = !!activeDateKey && !!effectiveTime;
    // 등록된 반려동물이 없으면 상담 때 알려주셔도 되므로 막지 않습니다.
    const isPetReady = !!selectedPetId || hasNoPets;
    const isNextEnabled = step === 0 ? isScheduleReady : isPetReady;
    const isLastStep = step === LAST_STEP;

    const goToStep = (next: number) => {
        setStep(next);
        mainRef.current?.scrollTo({ top: 0 });
    };

    const handleNext = () => {
        if (step === 0) {
            if (isScheduleReady) goToStep(1);
            return;
        }
        if (isPetReady) router.push("/contact");
    };

    const handleBack = () => {
        if (step === 0) router.back();
        else goToStep(step - 1);
    };

    const scheduleSummary = (() => {
        if (!activeDate) return "상담 시 협의";
        const dateText = `${activeDate.month}월 ${activeDate.date}일 (${activeDate.weekday})`;
        if (!effectiveTime || effectiveTime === FLEXIBLE_TIME) return `${dateText} · 시간 협의`;
        const { period, text } = formatTime(effectiveTime);
        return `${dateText} ${period} ${text}`;
    })();

    return (
        <div className="absolute inset-0 z-50 flex h-full w-full flex-col overflow-hidden bg-moon text-ink">
            {/* 뒤로 가기는 단계 이동(handleBack). 본문에 h1 이 있어 윗줄 제목은 p. 장례 관련 상담은 라임 대신 흰 진행 막대 */}
            <AppTopBar titleAs="p" title={isGeneral ? service.title : `${service.title} 상담`} onBack={handleBack} className="shrink-0">
                <AppProgress value={(step + 1) / TOTAL_STEPS} label={`${TOTAL_STEPS}단계 중 ${step + 1}단계`} tone={isCalm ? "star" : "lime"} />
            </AppTopBar>

            <main ref={mainRef} className="scrollbar-hide relative flex flex-1 flex-col overflow-y-auto">
                <AppBody className="grow pb-2">
                    {step === 0 && (
                        <div>
                            <div className="mb-8">
                                <h1 className="text-[24px] font-bold leading-[1.35] tracking-[-0.02em] text-ink">
                                    {isFuneral
                                        ? "장례를 원하시는 지역과"
                                        : isGeneral
                                            ? "상담 받으실 지역과"
                                            : `${service.title} 상담 받을 지역과`}<br />
                                    <span className="text-pine">희망 일시</span>를 알려주세요
                                </h1>
                                <p className="mt-3 text-[15px] leading-relaxed text-ink-2">
                                    고르신 일시는 희망 일정이에요.<br />
                                    담당자가 전화로 가능 여부를 확인한 뒤 확정해요.
                                </p>
                            </div>

                            <div className="mb-8">
                                <label htmlFor="booking-region" className={appLabelClass}>
                                    희망 지역 <span className="font-normal text-ink-3">(선택)</span>
                                </label>
                                <div className="relative">
                                    <MapPin
                                        className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-ink-3"
                                        strokeWidth={APP_ICON_STROKE}
                                        aria-hidden
                                    />
                                    <input
                                        id="booking-region"
                                        type="text"
                                        value={region}
                                        onChange={(e) => setRegion(e.target.value)}
                                        maxLength={40}
                                        autoComplete="address-level2"
                                        placeholder="예: 서울 송파구, 경기 성남시"
                                        className={cn(appInputClass, "pl-11")}
                                    />
                                </div>
                            </div>

                            <div className="mb-8">
                                <h3 className={cn(appLabelClass, "mb-3")}>희망 날짜</h3>
                                <div className="scrollbar-hide -mx-5 flex gap-2 overflow-x-auto px-5 pb-1">
                                    {dateOptions.length === 0 ? (
                                        <div className={cn(skeletonClass, "h-[84px] w-full")} />
                                    ) : (
                                        dateOptions.map((item) => {
                                            const isSelected = activeDateKey === item.key;
                                            return (
                                                <button
                                                    key={item.key}
                                                    type="button"
                                                    aria-pressed={isSelected}
                                                    onClick={() => setSelectedDateKey(item.key)}
                                                    className={appChipClass(isSelected, "h-[84px] min-w-[60px] shrink-0 flex-col gap-1 rounded-[20px] px-2")}
                                                >
                                                    <span
                                                        className={cn(
                                                            "text-[13px]",
                                                            isSelected ? "font-medium text-star-2" : item.isWeekend ? "font-semibold text-pine" : "font-medium text-ink-3",
                                                        )}
                                                    >
                                                        {item.label}
                                                    </span>
                                                    <span className={cn("text-[20px] font-bold tabular-nums", isSelected ? "text-star" : "text-ink")}>
                                                        {item.date === 1 ? `${item.month}/${item.date}` : item.date}
                                                    </span>
                                                </button>
                                            );
                                        })
                                    )}
                                </div>
                            </div>

                            <div className="mb-6">
                                <h3 className={cn(appLabelClass, "mb-3")}>희망 시간 · 오전</h3>
                                <div className="mb-6 grid grid-cols-4 gap-2">
                                    {morningSlots.map((time) => (
                                        <TimeSlot key={time} time={time} selected={effectiveTime === time} disabled={isPastSlot(time)} onClick={() => setSelectedTime(time)} />
                                    ))}
                                </div>

                                <h3 className={cn(appLabelClass, "mb-3")}>희망 시간 · 오후</h3>
                                <div className="mb-4 grid grid-cols-4 gap-2">
                                    {afternoonSlots.map((time) => (
                                        <TimeSlot key={time} time={time} selected={effectiveTime === time} disabled={isPastSlot(time)} onClick={() => setSelectedTime(time)} />
                                    ))}
                                </div>

                                {isPastSlot(morningSlots[0]) && (
                                    <p className="mb-4 text-[13px] text-ink-3">오늘은 이미 지난 시간을 고를 수 없어요.</p>
                                )}

                                <button
                                    type="button"
                                    aria-pressed={selectedTime === FLEXIBLE_TIME}
                                    onClick={() => setSelectedTime(FLEXIBLE_TIME)}
                                    className={appChipClass(selectedTime === FLEXIBLE_TIME, "h-12 w-full text-[15px]")}
                                >
                                    시간은 상담 때 정할게요
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 1 && (
                        <div className="pb-4">
                            <div className="mb-8">
                                <h1 className="text-[24px] font-bold leading-[1.35] tracking-[-0.02em] text-ink">
                                    {isFuneral ? (
                                        <>어떤 아이의<br />마지막 여정을 준비해 드릴까요?</>
                                    ) : isGeneral ? (
                                        <>어떤 아이를 위한<br />상담인가요?</>
                                    ) : (
                                        <>어떤 아이와<br />함께하실 건가요?</>
                                    )}
                                </h1>
                            </div>

                            <div className="mb-8">
                                <div className="scrollbar-hide -mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-1">
                                    {isLoading ? (
                                        <div className="text-[14px] text-ink-3">불러오는 중...</div>
                                    ) : pets && pets.length > 0 ? (
                                        pets.map((pet) => {
                                            const isSelected = selectedPetId === pet.id;
                                            return (
                                                <div
                                                    key={pet.id}
                                                    role="button"
                                                    tabIndex={0}
                                                    aria-pressed={isSelected}
                                                    onClick={() => setSelectedPetId(pet.id)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter" || e.key === " ") {
                                                            e.preventDefault();
                                                            setSelectedPetId(pet.id);
                                                        }
                                                    }}
                                                    className="relative w-[200px] shrink-0 cursor-pointer snap-center overflow-hidden rounded-[20px] bg-pass text-left transition-transform active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink motion-reduce:transition-none"
                                                >
                                                    <div className="relative aspect-[4/5] bg-paper-2">
                                                        {pet.photo_url ? (
                                                            <Image src={pet.photo_url} alt={pet.name} fill sizes="200px" className="object-cover" />
                                                        ) : (
                                                            <div className="flex h-full w-full items-center justify-center text-ink-3">
                                                                <PawPrint className="h-10 w-10" strokeWidth={APP_ICON_STROKE} aria-hidden />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="p-4">
                                                        <div className="truncate text-[18px] font-bold text-ink">{pet.name}</div>
                                                        <div className="mt-0.5 truncate text-[13px] text-ink-3">
                                                            {pet.species === "dog" ? "강아지" : "고양이"} · {pet.breed || "품종 미입력"}
                                                        </div>
                                                    </div>
                                                    {/* 선택 표시: 남색 테두리 2px + 체크 (사진 위에도 보이도록 맨 위에 겹침) */}
                                                    <span
                                                        aria-hidden
                                                        className={cn(
                                                            "pointer-events-none absolute inset-0 rounded-[20px] ring-inset",
                                                            isSelected ? "ring-2 ring-night" : "ring-1 ring-line",
                                                        )}
                                                    />
                                                    {isSelected && (
                                                        <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-night text-star ring-2 ring-pass">
                                                            <Check className="h-4 w-4" strokeWidth={3} aria-hidden />
                                                        </span>
                                                    )}
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <AppEmpty
                                            className="w-full shrink-0"
                                            icon={<PawPrint className="h-7 w-7" strokeWidth={APP_ICON_STROKE} aria-hidden />}
                                            title="등록된 반려동물이 없어요."
                                            description="상담 때 아이 정보를 알려주셔도 괜찮아요."
                                        />
                                    )}
                                </div>
                            </div>

                            <div>
                                <h3 className={cn(appLabelClass, "mb-3")}>상담 때 확인할 내용</h3>
                                <PassCard mainClassName="space-y-3 p-5 sm:p-5">
                                    <SummaryRow label="서비스" value={isGeneral ? "상담 시 안내" : service.title} icon={isGeneral ? undefined : service.icon} />
                                    <SummaryRow label="희망 지역" value={region.trim() || "상담 시 안내"} />
                                    <SummaryRow label="희망 일시" value={scheduleSummary} />
                                    <SummaryRow label="반려동물" value={selectedPet?.name ?? "상담 시 안내"} />
                                </PassCard>
                                <p className="mt-3 text-[13px] leading-relaxed text-ink-3">
                                    아직 확정된 일정이 아니에요. 다음 화면에서 연락처를 남겨주시면 담당자가 연락드려요.
                                    위 내용을 함께 적어주시면 더 빠르게 안내해 드릴 수 있어요.
                                </p>
                            </div>
                        </div>
                    )}
                </AppBody>

                <AppBottomAction>
                    {isLastStep && (
                        <div className="mb-3 flex items-center justify-between gap-3 rounded-[20px] bg-pass px-4 py-3 ring-1 ring-line/70">
                            <p className="text-[13px] text-ink-2">담당자가 전화로 일정을 확정해요</p>
                            <a
                                href={SITE.phoneHref}
                                className="flex shrink-0 items-center gap-1.5 text-[14px] font-bold tabular-nums text-pine"
                            >
                                <Phone className="h-4 w-4" strokeWidth={APP_ICON_STROKE} aria-hidden />
                                {SITE.phone}
                            </a>
                        </div>
                    )}
                    {/* 장례 관련 상담은 라임 대신 남색 버튼 */}
                    <AppButton variant={isCalm ? "primary" : "accent"} size="lg" block disabled={!isNextEnabled} onClick={handleNext}>
                        {isLastStep ? "상담 남기기" : "다음으로"} <ArrowRight className="h-5 w-5" strokeWidth={APP_ICON_STROKE} aria-hidden />
                    </AppButton>
                </AppBottomAction>
            </main>

            <style jsx global>{`
                .scrollbar-hide::-webkit-scrollbar { display: none; }
                .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div>
    );
}

function SummaryRow({ label, value, icon: Icon }: { label: string; value: string; icon?: LucideIcon }) {
    return (
        <div className="flex items-start justify-between gap-4 text-[15px]">
            <span className="shrink-0 text-ink-3">{label}</span>
            <span className="inline-flex items-center justify-end gap-1.5 break-keep text-right font-semibold text-ink">
                {Icon && <Icon className="h-4 w-4 shrink-0 text-ink-3" strokeWidth={APP_ICON_STROKE} aria-hidden />}
                {value}
            </span>
        </div>
    );
}

function TimeSlot({ time, selected, disabled = false, onClick }: { time: string, selected: boolean, disabled?: boolean, onClick: () => void }) {
    const { period, text } = formatTime(time);

    return (
        <button
            type="button"
            aria-pressed={selected}
            disabled={disabled}
            onClick={onClick}
            className={appChipClass(selected, "h-14 flex-col gap-0 px-0 disabled:cursor-not-allowed disabled:opacity-35")}
        >
            <span className={cn("text-[13px] font-medium", selected ? "text-star-2" : "text-ink-3")}>{period}</span>
            <span className={cn("text-[15px] font-bold tabular-nums", selected ? "text-star" : "text-ink")}>{text}</span>
        </button>
    );
}
