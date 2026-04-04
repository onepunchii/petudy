"use client";

import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { User, Plus } from "lucide-react";
import PetSelectionSheet from "@/components/shared/PetSelectionSheet";
import { Pet } from "@/actions/pet";
import { usePets } from "@/hooks/usePets";
import PetPickWidget from "./PetPickWidget";
import { Poll } from "@/actions/poll";

interface HomePageClientProps {
    initialPoll?: Poll | null;
}

export default function HomePageClient({ initialPoll }: HomePageClientProps) {
    const { data: initialPets = [] } = usePets();
    const [currentPet, setCurrentPet] = useState<Pet | null>(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    useEffect(() => {
        // Only set default pet if we have pets and haven't selected one yet
        if (initialPets.length > 0 && !currentPet) {
            const storedId = localStorage.getItem("foon_current_pet_id");
            const found = initialPets.find((p: Pet) => p.id === storedId);

            if (found) {
                setCurrentPet(found);
            } else {
                setCurrentPet(initialPets[0]);
            }
        }
    }, [initialPets, currentPet]);

    const handleSelectPet = (pet: Pet) => {
        setCurrentPet(pet);
        localStorage.setItem("foon_current_pet_id", pet.id);
    };

    const hasPet = !!currentPet;
    const petName = currentPet ? currentPet.name : "보호자";
    const petPhoto = currentPet ? currentPet.photo_url : null;

    // Services Definition
    interface ServiceItem {
        title: string;
        icon: string | React.ReactNode;
        href: string;
        isVertical?: boolean;
        isBanner?: boolean;
        isMbti?: boolean;
        isAi?: boolean;
    }

    const services: ServiceItem[] = [
        { title: "펫장례", icon: "🕊️", href: "/intro?category=FUNERAL", isVertical: true },
        { title: "건강검진", icon: "🩺", href: "/intro?category=CHECKUP", isVertical: true },
        {
            title: "펫터디 AI 상담사",
            icon: (
                <div className="w-full h-full transform scale-150">
                    <DotLottieReact
                        src="https://lottie.host/fbd4eadc-be4a-44a3-adfb-0630b5bf1647/tBSDMcctNr.lottie"
                        loop
                        autoplay
                    />
                </div>
            ),
            href: "/consult",
            isBanner: true,
            isAi: true
        }, // AI Counselor Banner
        { title: "펫보험", icon: "🛡️", href: "/life/insurance" },
        { title: "펫상조", icon: "🌺", href: "/life/sangjo" },
        { title: "펫여행", icon: "🚗", href: "/life/travel" }, // Updated icon to Car for Travel
        { title: "멍BTI", icon: "🧠", href: "/mbti", isMbti: true },
    ];

    return (
        <div className="bg-bg-main min-h-screen text-white px-6 py-8 flex flex-col relative overflow-hidden pb-32">

            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-foon-lime rounded-full blur-[150px] opacity-10 pointer-events-none"></div>

            {/* Header */}
            <header className="flex justify-between items-center mb-8 z-10">
                <div>
                    <h1 className="text-2xl font-bold leading-tight">
                        안녕하세요,<br />
                        <span className="text-foon-lime">{petName === "보호자" ? "예비" : petName}</span> {petName === "보호자" ? "보호자님!" : "보호자님!"}
                    </h1>
                </div>
                <button
                    onClick={() => setIsSheetOpen(true)}
                    className="w-12 h-12 bg-bg-input rounded-full border border-[#333] flex items-center justify-center overflow-hidden shadow-md active:scale-95 transition-transform relative group"
                >
                    {petPhoto ? (
                        <>
                            <div className="relative w-full h-full">
                                <Image
                                    src={petPhoto}
                                    alt="Profile"
                                    fill
                                    className="object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                                    sizes="48px"
                                />
                            </div>
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                        </>
                    ) : (
                        <User className="text-gray-400 w-6 h-6" />
                    )}
                    {/* Add badge if has pet, indicating "Add another" or "Edit" */}
                    {hasPet && (
                        <div className="absolute bottom-0 right-0 w-4 h-4 bg-foon-lime rounded-full border-2 border-bg-main flex items-center justify-center">
                            <Plus className="w-2.5 h-2.5 text-bg-main stroke-[3]" />
                        </div>
                    )}
                </button>
            </header>

            {/* Hero Section: Mobility or Registration */}
            <section className="bg-bg-card rounded-[32px] p-6 mb-6 relative shadow-lg">
                {!hasPet ? (
                    // Registration Hero
                    <>
                        <div className="flex justify-between items-start">
                            <div>
                                <span className="bg-bg-input text-foon-lime text-xs font-bold px-3 py-1 rounded-full">foon FAMILY</span>
                                <h2 className="text-xl font-bold mt-3 leading-tight">우리 아이를<br />등록해주세요</h2>
                                <p className="text-gray-400 text-sm mt-2">맞춤형 케어 서비스 시작하기</p>
                            </div>
                            <div className="w-24 h-24 bg-gradient-to-br from-bg-input to-black rounded-full flex items-center justify-center text-4xl shadow-inner">
                                🐶
                            </div>
                        </div>
                        <Link href="/register">
                            <button className="w-full mt-6 bg-foon-lime text-bg-main font-bold py-4 rounded-2xl hover:bg-foon-soft transition-colors shadow-[0_4px_14px_rgba(163,223,70,0.4)] active:scale-95">
                                등록하러 가기
                            </button>
                        </Link>
                    </>
                ) : (
                    // Mobility Hero (Default as per design)
                    <>
                        <div className="flex justify-between items-start">
                            <div>
                                <span className="bg-bg-input text-foon-lime text-xs font-bold px-3 py-1 rounded-full">foon MOBILITY</span>
                                <h2 className="text-xl font-bold mt-3 leading-tight">어디로<br />떠나시나요?</h2>
                                <p className="text-gray-400 text-sm mt-2">안전한 펫택시 예약하기</p>
                            </div>
                            <div className="w-24 h-24 bg-gradient-to-br from-bg-input to-black rounded-full flex items-center justify-center text-4xl shadow-inner">
                                🚕
                            </div>
                        </div>
                        <Link href="/booking/new?category=TAXI">
                            <button className="w-full mt-6 bg-foon-lime text-bg-main font-bold py-4 rounded-2xl hover:bg-foon-soft transition-colors shadow-[0_4px_14px_rgba(163,223,70,0.4)] active:scale-95">
                                지금 호출하기
                            </button>
                        </Link>
                    </>
                )}
            </section>

            {/* Services Grid */}
            <div className="grid grid-cols-2 gap-4 z-10 auto-dense">
                {services.map((s, idx) => (
                    <Link
                        key={idx}
                        href={s.href}
                        className={`bg-bg-card rounded-3xl p-5 flex items-center justify-center gap-3 hover:bg-[#252527] transition-all relative overflow-hidden group active:scale-[0.98] 
                        ${s.isVertical ? "row-span-2 h-full flex-col" : ""} 
                        ${s.isBanner
                                ? s.isAi
                                    ? "col-span-2 aspect-[4/1] flex-row px-8 justify-between bg-gradient-to-r from-[#1c1c1e] to-foon-lime/10 border border-foon-lime/30"
                                    : "col-span-2 aspect-[4/1] flex-row px-8 justify-between bg-gradient-to-r from-[#2c2c2e] to-[#1c1c1e] border border-[#333]"
                                : ""
                            } 
                        ${!s.isVertical && !s.isBanner ? "aspect-[4/3] flex-col" : ""}
                        ${s.isMbti ? "border border-foon-lime/20" : ""}
                        `}
                    >
                        {s.isMbti && <div className="absolute top-3 right-3 w-2 h-2 bg-foon-lime rounded-full animate-pulse shadow-[0_0_8px_#A3DF46]"></div>}
                        {s.isAi && <div className="absolute top-0 right-0 w-20 h-20 bg-foon-lime blur-[50px] opacity-20 pointer-events-none"></div>}

                        <div className={`w-14 h-14 bg-bg-input rounded-full flex items-center justify-center text-3xl shadow-sm group-hover:scale-110 transition-transform duration-300 ${s.isBanner ? "order-2" : ""}`}>
                            {s.icon}
                        </div>

                        <div className={s.isBanner ? "order-1" : ""}>
                            <span className={`font-medium text-gray-200 ${s.isBanner ? "text-lg font-bold" : "text-sm"}`}>
                                {s.title}
                            </span>
                            {s.isBanner && (
                                <p className={`text-xs mt-1 font-light ${s.isAi ? "text-foon-lime" : "text-gray-400"}`}>
                                    {s.isAi ? "무엇이든 물어보세요" : "프리미엄 혜택 받기"}
                                </p>
                            )}
                        </div>
                    </Link>
                ))}
            </div>

            {/* Pet Pick Voting Widget */}
            <div className="mt-6 z-10">
                <PetPickWidget initialPoll={initialPoll || null} />
            </div>

            <PetSelectionSheet
                isOpen={isSheetOpen}
                onClose={() => setIsSheetOpen(false)}
                currentPetId={currentPet?.id || null}
                pets={initialPets}
                onSelectPet={handleSelectPet}
            />
        </div >
    );
}
