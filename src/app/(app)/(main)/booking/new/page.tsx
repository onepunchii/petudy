"use client";

import React, { useState, Suspense } from "react";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import Galaxy from "@/components/ui/Galaxy";
import { usePets } from "@/hooks/usePets";

// Service definitions
const SERVICES: Record<string, { title: string; icon: string }> = {
    "TAXI": { title: "펫택시", icon: "🚕" },
    "FUNERAL": { title: "모빌리티 장례", icon: "🕊️" },
    "BATH": { title: "모빌리티 목욕", icon: "🛁" },
    "CHECKUP": { title: "모빌리티 검진", icon: "🩺" },
    "INSURANCE": { title: "펫보험", icon: "🛡️" },
    "MUTUAL_AID": { title: "펫상조", icon: "🌺" },
    "TRAVEL": { title: "펫여행", icon: "✈️" },
};

export default function BookingPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <BookingContent />
        </Suspense>
    );
}

function BookingContent() {
    const searchParams = useSearchParams();
    const category = searchParams.get("category") || "TAXI"; // Default to TAXI if not specified
    const service = SERVICES[category] || SERVICES["TAXI"];
    const isFuneral = category === "FUNERAL";

    const { data: pets, isLoading } = usePets();
    const [step, setStep] = useState(1); // 1: Date/Time, 2: Pet/Option

    // Step 1 State
    const [selectedDate, setSelectedDate] = useState<number>(17);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);

    // Step 2 State
    const [selectedPetId, setSelectedPetId] = useState<string | null>(null);

    // Constant Data
    const dates = [
        { day: "오늘", date: 14, disabled: true },
        { day: "내일", date: 15, disabled: true },
        { day: "목", date: 16, disabled: false },
        { day: "금", date: 17, disabled: false },
        { day: "토", date: 18, disabled: false, isWeekend: true },
        { day: "일", date: 19, disabled: false },
        { day: "월", date: 20, disabled: false },
    ];

    const morningSlots = ["10:00", "10:30", "11:00", "11:30"];
    const afternoonSlots = ["12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00"];

    const handleNext = () => {
        if (step === 1 && selectedTime) {
            setStep(2);
        } else if (step === 2 && selectedPetId) {
            alert(`예약이 완료되었습니다! (Pet: ${selectedPetId})`);
        }
    };

    return (
        <div className="absolute inset-0 w-full h-full z-50 flex flex-col overflow-hidden bg-bg-main text-white">
            {/* Ambient Background Glow (Hide on Funeral) */}
            {!isFuneral && (
                <div className="absolute top-[-20%] right-[-20%] w-[500px] h-[500px] bg-foon-lime rounded-full blur-[150px] opacity-5 pointer-events-none"></div>
            )}

            {/* Galaxy Background for Funeral */}
            {isFuneral && (
                <div className="absolute inset-0 pointer-events-none z-0">
                    <Galaxy
                        mouseInteraction={true}
                        mouseRepulsion={true}
                        density={1.9}
                        glowIntensity={0.2}
                        saturation={0}
                        hueShift={0}
                        twinkleIntensity={0.7}
                        rotationSpeed={0}
                        repulsionStrength={0}
                        autoCenterRepulsion={0}
                        starSpeed={0.2}
                        speed={0.4}
                        transparent={true}
                    />
                </div>
            )}

            {/* Header */}
            <header className="px-4 py-3 flex items-center sticky top-0 z-30">
                <button
                    onClick={() => step === 1 ? window.history.back() : setStep(1)}
                    className="p-1 -ml-1"
                    aria-label="Go back"
                >
                    <ChevronLeft className="w-7 h-7 text-white" />
                </button>
            </header>

            <main className="px-6 flex-1 overflow-hidden relative z-10 pt-2 pb-28">

                {step === 1 && (
                    <div className="animate-in fade-in slide-in-from-right duration-300 h-full overflow-y-auto scrollbar-hide">
                        {/* Title */}
                        <div className="flex items-center gap-2 mt-[50px] mb-4">
                            <h1 className="text-2xl font-bold tracking-tight text-foon-lime leading-tight">
                                언제 방문 드릴까요?
                            </h1>
                            <Image
                                src="/images/rocket-3d.png"
                                alt="Rocket"
                                width={40}
                                height={40}
                                className="object-contain animate-bounce"
                            />
                        </div>

                        {/* Date Picker Section */}
                        <div className="mb-6">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-base font-bold text-white">날짜 선택</span>
                            </div>

                            {/* Horizontal Scroll Container */}
                            <div className="flex gap-3 overflow-x-auto pb-6 pt-2 -mx-6 px-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                                {dates.map((item) => (
                                    <button
                                        key={item.date}
                                        disabled={item.disabled}
                                        onClick={() => setSelectedDate(item.date)}
                                        className={`
                                            flex flex-col items-center justify-center min-w-[64px] h-[76px] rounded-[20px] border transition-all z-20 relative shrink-0
                                            ${item.disabled
                                                ? "opacity-30 cursor-not-allowed bg-[#1A1A1A] border-[#333]"
                                                : "cursor-pointer"}
                                            ${selectedDate === item.date
                                                ? "bg-[#2C2C2E] border-foon-lime text-foon-lime shadow-[0_0_15px_rgba(163,223,70,0.2)] scale-105"
                                                : "bg-[#2C2C2E] border-[#333] hover:border-gray-500 text-gray-300"
                                            }
                                        `}
                                    >
                                        <span className={`text-xs mb-1 ${selectedDate === item.date ? "text-foon-lime font-bold" :
                                            item.isWeekend ? "text-orange-400" : "text-gray-500"
                                            }`}>
                                            {item.day}
                                        </span>
                                        <span className={`text-xl font-black ${selectedDate === item.date ? "text-foon-lime" : "text-white"
                                            }`}>
                                            {item.date}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Time Slots Section */}
                        <div className="mb-4">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-base font-bold text-white">시간 선택</span>
                            </div>

                            {/* Morning */}
                            <div className="mb-4">
                                <h3 className="text-xs font-bold mb-2 text-gray-400 px-1">오전</h3>
                                <div className="flex gap-3 overflow-x-auto pb-4 pt-2 -mx-6 px-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                                    {morningSlots.map((time) => (
                                        <TimeSlot
                                            key={time}
                                            time={time}
                                            selected={selectedTime === time}
                                            onClick={() => setSelectedTime(time)}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Afternoon */}
                            <div>
                                <h3 className="text-xs font-bold mb-2 text-gray-400 px-1">오후</h3>
                                <div className="flex gap-3 overflow-x-auto pb-4 pt-2 -mx-6 px-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                                    {afternoonSlots.map((time) => (
                                        <TimeSlot
                                            key={time}
                                            time={time}
                                            selected={selectedTime === time}
                                            onClick={() => setSelectedTime(time)}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="animate-in fade-in slide-in-from-right duration-300 h-full overflow-y-auto scrollbar-hide pb-10">
                        {/* Title */}
                        <div className="mt-[20px] mb-8">
                            <h1 className="text-2xl font-bold tracking-tight text-white leading-snug">
                                <span className="text-foon-lime">어느 아이</span>의<br />
                                서비스를 받으실 건가요?
                            </h1>
                        </div>

                        {/* Pet List (Drag Scroll) */}
                        <div className="mb-10">
                            <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-8 -mx-6 px-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                                {isLoading ? (
                                    <div className="text-gray-500 text-sm px-4">로딩중...</div>
                                ) : pets && pets.length > 0 ? (
                                    pets.map((pet) => (
                                        <div
                                            key={pet.id}
                                            onClick={() => setSelectedPetId(pet.id)}
                                            className={`
                                                snap-center shrink-0 w-[200px] h-[280px] rounded-[24px] overflow-hidden relative border transition-all duration-300 cursor-pointer group
                                                ${selectedPetId === pet.id
                                                    ? "border-foon-lime ring-1 ring-foon-lime/50 shadow-[0_0_30px_rgba(163,223,70,0.15)] scale-100"
                                                    : "border-white/10 bg-[#1e1e20] scale-95 opacity-60 hover:opacity-100"
                                                }
                                            `}
                                        >
                                            {/* Photo Background */}
                                            {pet.photo_url ? (
                                                <Image
                                                    src={pet.photo_url}
                                                    alt={pet.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-[#333] flex items-center justify-center">
                                                    <span className="text-4xl">🐾</span>
                                                </div>
                                            )}

                                            {/* Gradient Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                                            {/* Info */}
                                            <div className="absolute bottom-0 w-full p-6 text-left">
                                                <div className="text-2xl font-black text-white mb-1 shadow-black drop-shadow-lg">
                                                    {pet.name}
                                                </div>
                                                <div className="text-sm text-gray-300 flex items-center gap-2">
                                                    <span>{pet.species === "dog" ? "강아지" : "고양이"}</span>
                                                    <span>·</span>
                                                    <span>{pet.breed || "품종 미입력"}</span>
                                                </div>
                                            </div>

                                            {/* Selected Check */}
                                            {selectedPetId === pet.id && (
                                                <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-foon-lime flex items-center justify-center text-black font-bold shadow-lg animate-in fade-in zoom-in">
                                                    ✓
                                                </div>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-gray-500 p-4 border border-dashed border-gray-700 rounded-xl w-full text-center">
                                        등록된 반려동물이 없습니다.
                                    </div>
                                )}
                                {/* Add Pet Placeholder for UX */}
                                <Link
                                    href="/register"
                                    className="snap-center shrink-0 w-[100px] h-[280px] rounded-[24px] border border-white/5 bg-[#1e1e20] flex flex-col items-center justify-center gap-4 text-gray-500 hover:bg-[#252527] transition-colors"
                                >
                                    <div className="w-12 h-12 rounded-full border border-dashed border-gray-500 flex items-center justify-center text-2xl">
                                        +
                                    </div>
                                    <span className="text-xs">추가하기</span>
                                </Link>
                            </div>
                        </div>

                        {/* Options Section */}
                        <div className="space-y-4">
                            <h3 className="font-bold text-white text-lg">추가 옵션</h3>

                            {/* Option Card 1 */}
                            <div className="bg-[#1e1e20] rounded-2xl p-4 border border-white/5 flex items-center justify-between cursor-pointer hover:bg-[#252527] transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-[#2a2a2c] flex items-center justify-center text-xl">
                                        📦
                                    </div>
                                    <div>
                                        <div className="font-bold text-white">기본 관</div>
                                        <div className="text-xs text-gray-500">가장 기본적인 오동나무 관입니다.</div>
                                    </div>
                                </div>
                                <div className="w-6 h-6 rounded-full border border-gray-600" />
                            </div>

                            {/* Option Card 2 */}
                            <div className="bg-[#1e1e20] rounded-2xl p-4 border border-white/5 flex items-center justify-between cursor-pointer hover:bg-[#252527] transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-[#2a2a2c] flex items-center justify-center text-xl">
                                        🧶
                                    </div>
                                    <div>
                                        <div className="font-bold text-white">고급 수의</div>
                                        <div className="text-xs text-gray-500">부드러운 삼베 소재의 수의입니다.</div>
                                    </div>
                                </div>
                                <div className="w-6 h-6 rounded-full border border-gray-600" />
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* Bottom Button */}
            <div className="absolute bottom-0 w-full p-6 flex justify-center z-20 bg-gradient-to-t from-bg-main via-bg-main/90 to-transparent">
                <div className="w-full max-w-[430px]">
                    <button
                        disabled={step === 1 ? !selectedTime : !selectedPetId}
                        onClick={handleNext}
                        className={`w-full py-4 rounded-2xl font-bold text-lg transition-all 
                            ${(step === 1 ? selectedTime : selectedPetId)
                                ? "bg-foon-lime text-bg-main shadow-[0_4px_14px_rgba(163,223,70,0.4)] hover:bg-[#bbf080] active:scale-[0.98]"
                                : "bg-[#2C2C2E] text-gray-600 border border-[#333] cursor-not-allowed"
                            }`}
                    >
                        {step === 1 ? `${service.title} 예약하기` : "예약 확정하기"}
                    </button>
                </div>
            </div>
        </div>
    );
}

function TimeSlot({ time, selected, onClick }: { time: string, selected: boolean, onClick: () => void }) {
    const [hour, minute] = time.split(':').map(Number);
    const period = hour < 12 ? "오전" : "오후";
    const displayHour = hour > 12 ? hour - 12 : hour;

    return (
        <button
            onClick={onClick}
            className={`
                flex flex-col items-center justify-center min-w-[64px] h-[76px] rounded-[20px] border transition-all relative z-20 shrink-0
                ${selected
                    ? "bg-[#2C2C2E] border-foon-lime text-foon-lime shadow-[0_0_15px_rgba(163,223,70,0.2)] font-bold scale-105"
                    : "bg-[#2C2C2E] border-[#333] text-gray-300 hover:bg-[#3A3A3D] hover:border-gray-500"
                }
            `}
        >
            <span className={`text-xs mb-1 ${selected ? "text-foon-lime font-bold" : "text-gray-500"}`}>
                {period}
            </span>
            <span className={`text-lg font-bold ${selected ? "text-foon-lime" : "text-white"}`}>
                {displayHour}:{minute.toString().padStart(2, '0')}
            </span>
        </button>
    );
}
