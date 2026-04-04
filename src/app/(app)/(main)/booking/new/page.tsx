"use client";

import React, { useState, Suspense, useEffect, useRef } from "react";
import { ChevronLeft, MapPin, Clock, Info, Check, ArrowRight } from "lucide-react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { usePets } from "@/hooks/usePets";

const SERVICES: Record<string, { title: string; icon: string }> = {
    "TAXI": { title: "펫택시", icon: "🚕" },
    "FUNERAL": { title: "펫장례", icon: "🕊️" },
    "BATH": { title: "고정식 장례", icon: "🛁" },
    "CHECKUP": { title: "건강검진", icon: "🩺" },
    "INSURANCE": { title: "펫보험", icon: "🛡️" },
    "MUTUAL_AID": { title: "펫상조", icon: "🌺" },
    "TRAVEL": { title: "펫여행", icon: "✈️" },
};

const FUNERAL_BRANCHES = [
    {
        id: "21g-gj-1",
        name: "21그램 경기광주 1호점",
        address: "경기도 광주시 매자리길 185-35",
        time: "09:00 - 24:00",
        lastOrder: "21시",
        tag: "본점",
        images: ["/21gram/1/1-1.webp", "/21gram/1/1-2.webp", "/21gram/1/2.webp", "/21gram/1/3.webp", "/21gram/1/4-1.webp", "/21gram/1/4-2.webp", "/21gram/1/5.webp"]
    },
    {
        id: "21g-ca-2",
        name: "21그램 천안아산 2호점",
        address: "천안시 동남구 광풍로 1668",
        time: "09:00 - 22:00",
        lastOrder: "19시",
        tag: "직영",
        images: ["/21gram/2/1-1.webp", "/21gram/2/1-2.webp", "/21gram/2/2.webp", "/21gram/2/3.webp", "/21gram/2/4.webp", "/21gram/2/5.webp"]
    },
    {
        id: "21g-ny-3",
        name: "21그램 남양주 3호점",
        address: "남양주시 화도읍 수레로964번길 86",
        time: "09:00 - 22:00",
        lastOrder: "19시",
        tag: "직영",
        images: ["/21gram/3/1.webp", "/21gram/3/2.webp", "/21gram/3/3.webp", "/21gram/3/4.webp", "/21gram/3/5.webp"]
    }
];

function BranchCard({
    branch,
    isSelected,
    onSelect
}: {
    branch: typeof FUNERAL_BRANCHES[0],
    isSelected: boolean,
    onSelect: (id: string) => void
}) {
    const [imageIndex, setImageIndex] = useState(0);
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const handleScroll = () => {
                            if (!cardRef.current) return;
                            
                            const rect = cardRef.current.getBoundingClientRect();
                            const windowHeight = window.innerHeight;
                            const cardCenter = rect.top + rect.height / 2;
                            const screenCenter = windowHeight / 2;
                            const distanceFromCenter = screenCenter - cardCenter;
                            const scrollRange = 300;
                            
                            let nextIndex = Math.floor((distanceFromCenter + scrollRange) / (scrollRange * 2 / branch.images.length));
                            nextIndex = Math.max(0, Math.min(nextIndex, branch.images.length - 1));
                            
                            setImageIndex(nextIndex);
                        };

                        window.addEventListener("scroll", handleScroll);
                        return () => window.removeEventListener("scroll", handleScroll);
                    }
                });
            },
            { threshold: 0.1 }
        );

        if (cardRef.current) observer.observe(cardRef.current);
        return () => observer.disconnect();
    }, [branch.images.length]);

    return (
        <div 
            ref={cardRef}
            onClick={() => onSelect(branch.id)}
            className={`w-full rounded-[2rem] border transition-all duration-700 relative overflow-hidden mb-10 cursor-pointer ${
                isSelected ? "border-amber-500/50 shadow-[0_0_40px_rgba(245,158,11,0.1)]" : "border-white/5"
            }`}
        >
            <div className="relative h-[450px] bg-[#0A0A0B]">
                {branch.images.map((img, idx) => (
                    <Image
                        key={img}
                        src={img}
                        alt={branch.name}
                        fill
                        className={`object-cover transition-opacity duration-1000 ease-in-out ${
                            imageIndex === idx ? "opacity-100" : "opacity-0"
                        }`}
                        priority={idx === 0}
                    />
                ))}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B] via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                    <div className="flex justify-between items-end mb-4">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <h3 className="font-bold text-2xl text-white tracking-tight">{branch.name}</h3>
                                <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-[10px] font-bold text-amber-500">
                                    {branch.tag}
                                </span>
                            </div>
                            <p className="text-sm text-gray-400 flex items-center gap-1.5 opacity-80">
                                <MapPin className="w-3.5 h-3.5" /> {branch.address}
                            </p>
                        </div>
                        {isSelected && (
                            <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center shadow-lg animate-in zoom-in">
                                <Check className="w-6 h-6 text-black" strokeWidth={3} />
                            </div>
                        )}
                    </div>
                    <div className="flex gap-6 pt-5 border-t border-white/10">
                        <div className="flex items-center gap-2 text-[13px] text-gray-400">
                            <Clock className="w-4 h-4" />
                            <span>{branch.time}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[13px] text-amber-500/80">
                            <Info className="w-4 h-4" />
                            <span>예약 마감 {branch.lastOrder}</span>
                        </div>
                    </div>
                </div>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-2">
                    {branch.images.map((_, idx) => (
                        <div
                            key={idx}
                            className={`w-1 rounded-full transition-all duration-500 ${
                                imageIndex === idx ? "h-6 bg-amber-500" : "h-1.5 bg-white/20"
                            }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default function BookingPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#0A0A0B]" />}>
            <BookingContent />
        </Suspense>
    );
}

function BookingContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const category = searchParams.get("category")?.toUpperCase() || "FUNERAL";
    const service = SERVICES[category] || SERVICES["FUNERAL"];
    const isFuneral = category === "FUNERAL";

    const { data: pets, isLoading } = usePets();
    const [step, setStep] = useState(isFuneral ? 0 : 1);

    const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState<number>(17);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [selectedPetId, setSelectedPetId] = useState<string | null>(null);
    const dates = [
        { day: "오늘", date: 14, disabled: true },
        { day: "내일", date: 15, disabled: true },
        { day: "목", date: 16, disabled: false },
        { day: "금", date: 17, disabled: false },
        { day: "토", date: 18, disabled: false, isWeekend: true },
        { day: "일", date: 19, disabled: false, isWeekend: true },
        { day: "월", date: 20, disabled: false },
    ];

    const morningSlots = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30"];
    const afternoonSlots = ["12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00"];

    const handleNext = () => {
        if (step === 0 && selectedBranch) setStep(1);
        else if (step === 1 && selectedTime) setStep(2);
        else if (step === 2 && selectedPetId) {
            alert(`예약이 완료되었습니다!`);
            router.push('/');
        }
    };

    const handleBack = () => {
        if (step === 0) router.back();
        else if (step === 1) isFuneral ? setStep(0) : router.back();
        else if (step === 2) setStep(1);
    };

    const isNextEnabled = 
        (step === 0 && selectedBranch) || 
        (step === 1 && selectedTime) || 
        (step === 2 && selectedPetId);

    return (
        <div className="absolute inset-0 w-full h-full z-50 flex flex-col bg-[#0A0A0B] text-white overflow-hidden font-sans">
            
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className={`absolute top-0 right-0 w-[80vw] h-[80vw] rounded-full blur-[120px] opacity-20 transition-colors duration-1000 ${isFuneral ? 'bg-amber-500/20' : 'bg-foon-lime/10'}`} />
            </div>

            <header className="px-6 py-5 flex items-center justify-between sticky top-0 z-30 bg-[#0A0A0B]/80 backdrop-blur-xl border-b border-white/5">
                <button onClick={handleBack} className="p-2 -ml-2 rounded-xl hover:bg-white/5 transition-colors">
                    <ChevronLeft className="w-6 h-6 text-gray-300" />
                </button>
                <div className="flex gap-1.5">
                    {Array.from({ length: isFuneral ? 3 : 2 }).map((_, i) => (
                        <div key={i} className={`h-1 rounded-full transition-all duration-500 ${step === (isFuneral ? i : i + 1) ? "w-6 bg-foon-lime shadow-[0_0_8px_#A3DF46]" : "w-1.5 bg-white/20"}`} />
                    ))}
                </div>
                <div className="w-6" />
            </header>

            <main className="px-6 flex-1 overflow-y-auto scrollbar-hide relative z-10 pt-6 pb-32">

                {step === 0 && isFuneral && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="mb-8">
                            <h1 className="text-2xl font-bold tracking-tight text-white leading-snug">
                                방문하실 <span className="text-amber-500">21그램 장례식장</span>을<br />선택해 주세요
                            </h1>
                        </div>

                        <div className="space-y-4">
                            {FUNERAL_BRANCHES.map((branch) => (
                                <BranchCard
                                    key={branch.id}
                                    branch={branch}
                                    isSelected={selectedBranch === branch.id}
                                    onSelect={setSelectedBranch}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {step === 1 && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="mb-8">
                            <h1 className="text-2xl font-bold tracking-tight text-white leading-snug">
                                {isFuneral ? "안치 및 예식" : "방문"}을 진행할<br />
                                <span className={isFuneral ? "text-amber-500" : "text-foon-lime"}>날짜와 시간</span>을 알려주세요
                            </h1>
                        </div>

                        <div className="mb-10">
                            <h3 className="text-sm font-semibold text-gray-400 mb-4 px-1">날짜 선택</h3>
                            <div className="flex gap-3 overflow-x-auto pb-2 -mx-6 px-6 scrollbar-hide">
                                {dates.map((item) => (
                                    <button
                                        key={item.date}
                                        disabled={item.disabled}
                                        onClick={() => setSelectedDate(item.date)}
                                        className={`
                                            flex flex-col items-center justify-center min-w-[70px] h-[85px] rounded-[1.2rem] border transition-all shrink-0
                                            ${item.disabled ? "opacity-20 cursor-not-allowed bg-[#161618] border-transparent" : "cursor-pointer"}
                                            ${selectedDate === item.date
                                                ? "bg-[#1C1C1E] border-foon-lime shadow-lg"
                                                : "bg-[#161618] border-white/5 hover:bg-[#1C1C1E]"
                                            }
                                        `}
                                    >
                                        <span className={`text-xs mb-1.5 ${selectedDate === item.date ? "text-foon-lime" : item.isWeekend ? "text-rose-400/80" : "text-gray-500"}`}>
                                            {item.day}
                                        </span>
                                        <span className={`text-xl font-bold ${selectedDate === item.date ? "text-white" : "text-gray-300"}`}>
                                            {item.date}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="mb-6">
                            <h3 className="text-sm font-semibold text-gray-400 mb-4 px-1">오전</h3>
                            <div className="grid grid-cols-4 gap-3 mb-8">
                                {morningSlots.map((time) => (
                                    <TimeSlot key={time} time={time} selected={selectedTime === time} onClick={() => setSelectedTime(time)} isFuneral={isFuneral} />
                                ))}
                            </div>

                            <h3 className="text-sm font-semibold text-gray-400 mb-4 px-1">오후</h3>
                            <div className="grid grid-cols-4 gap-3">
                                {afternoonSlots.map((time) => (
                                    <TimeSlot key={time} time={time} selected={selectedTime === time} onClick={() => setSelectedTime(time)} isFuneral={isFuneral} />
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
                        <div className="mb-8">
                            <h1 className="text-2xl font-bold tracking-tight text-white leading-snug">
                                어떤 아이의<br />
                                마지막 여정을 준비해 드릴까요?
                            </h1>
                        </div>

                        <div className="mb-10">
                            <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 -mx-6 px-6 scrollbar-hide">
                                {isLoading ? (
                                    <div className="text-gray-500 text-sm">로딩중...</div>
                                ) : pets && pets.length > 0 ? (
                                    pets.map((pet) => (
                                        <div
                                            key={pet.id}
                                            onClick={() => setSelectedPetId(pet.id)}
                                            className={`
                                                snap-center shrink-0 w-[220px] h-[300px] rounded-[2rem] overflow-hidden relative border transition-all duration-500 cursor-pointer group
                                                ${selectedPetId === pet.id
                                                    ? "border-foon-lime/50 shadow-2xl"
                                                    : "border-white/5 bg-[#161618] opacity-70 hover:opacity-100"
                                                }
                                            `}
                                        >
                                            {pet.photo_url ? (
                                                <Image src={pet.photo_url} alt={pet.name} fill className="object-cover" />
                                            ) : (
                                                <div className="w-full h-full bg-[#1C1C1E] flex items-center justify-center text-4xl">🐾</div>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B] via-[#0A0A0B]/40 to-transparent" />
                                            <div className="absolute bottom-0 w-full p-6">
                                                <div className="text-2xl font-bold text-white mb-1">{pet.name}</div>
                                                <div className="text-xs text-gray-400">{pet.species === "dog" ? "강아지" : "고양이"} · {pet.breed || "품종 미입력"}</div>
                                            </div>
                                            {selectedPetId === pet.id && (
                                                <div className={`absolute top-5 right-5 w-8 h-8 rounded-full ${isFuneral ? 'bg-amber-500 text-[#0A0A0B]' : 'bg-foon-lime text-[#0A0A0B]'} flex items-center justify-center font-bold animate-in zoom-in`}>
                                                    <Check className="w-4 h-4" strokeWidth={3} />
                                                </div>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-gray-500 p-6 border border-dashed border-white/10 bg-[#161618] rounded-[2rem] w-full text-center text-sm">
                                        등록된 반려동물이 없습니다.
                                    </div>
                                )}
                            </div>
                        </div>

                        {isFuneral && (
                            <div className="space-y-4 animate-in fade-in duration-700 delay-200">
                                <h3 className="font-semibold text-gray-300 text-sm px-1">기본 제공 내역</h3>
                                <div className="bg-[#161618] rounded-[1.5rem] p-5 border border-white/5 space-y-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-lg">📦</div>
                                        <div>
                                            <div className="text-sm font-bold text-white">기본 오동나무 관</div>
                                            <div className="text-[11px] text-gray-500">아이가 편안하게 쉴 수 있는 친환경 관</div>
                                        </div>
                                    </div>
                                    <div className="h-px bg-white/5 w-full" />
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-lg">🕯️</div>
                                        <div>
                                            <div className="text-sm font-bold text-white">단독 추모실 이용</div>
                                            <div className="text-[11px] text-gray-500">보호자님만을 위한 프라이빗한 이별 공간</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </main>

            <div className="absolute bottom-0 w-full px-6 py-6 z-40 bg-gradient-to-t from-[#0A0A0B] via-[#0A0A0B]/90 to-transparent">
                <button
                    disabled={!isNextEnabled}
                    onClick={handleNext}
                    className={`w-full py-5 rounded-[2rem] font-bold text-[17px] transition-all duration-300 flex items-center justify-center gap-2
                        ${isNextEnabled
                            ? isFuneral 
                                ? "bg-amber-500 text-[#0A0A0B] shadow-[0_0_30px_rgba(245,158,11,0.2)] hover:bg-amber-400 active:scale-[0.98]" 
                                : "bg-foon-lime text-[#0A0A0B] shadow-[0_0_30px_rgba(163,223,70,0.2)] hover:bg-[#bbf080] active:scale-[0.98]"
                            : "bg-[#161618] text-gray-600 border border-white/5 cursor-not-allowed"
                        }`}
                >
                    {step === (isFuneral ? 2 : 1) ? `${service.title} 예약 확정하기` : "다음으로"} <ArrowRight className="w-5 h-5" />
                </button>
            </div>
            
            <style jsx global>{`
                .scrollbar-hide::-webkit-scrollbar { display: none; }
                .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div>
    );
}

function TimeSlot({ time, selected, onClick, isFuneral }: { time: string, selected: boolean, onClick: () => void, isFuneral: boolean }) {
    const [hour, minute] = time.split(':').map(Number);
    const period = hour < 12 ? "오전" : "오후";
    const displayHour = hour > 12 ? hour - 12 : hour;

    return (
        <button
            onClick={onClick}
            className={`
                flex flex-col items-center justify-center py-3.5 rounded-[1rem] border transition-all text-sm font-medium
                ${selected
                    ? `bg-[#1C1C1E] border-foon-lime text-foon-lime`
                    : "bg-[#161618] border-white/5 text-gray-400 hover:bg-[#1C1C1E] hover:text-gray-300"
                }
            `}
        >
            <span className={`text-xs mb-1 ${selected ? "text-foon-lime" : "text-gray-500"}`}>{period}</span>
            <span className={`font-bold ${selected ? "text-foon-lime" : "text-gray-300"}`}>{displayHour}:{minute.toString().padStart(2, '0')}</span>
        </button>
    );
}