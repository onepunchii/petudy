"use client";

import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { User, Plus } from "lucide-react";
import PetSelectionSheet from "@/components/shared/PetSelectionSheet";
import { Pet } from "@/actions/pet";
import { usePets } from "@/hooks/usePets";

export default function HomePageClient() {
    const { data: initialPets = [] } = usePets();
    const [currentPet, setCurrentPet] = useState<Pet | null>(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    useEffect(() => {
        if (initialPets.length > 0 && !currentPet) {
            const storedId = localStorage.getItem("foon_current_pet_id");
            const found = initialPets.find((p: Pet) => p.id === storedId);
            setCurrentPet(found || initialPets[0]);
        }
    }, [initialPets, currentPet]);

    const handleSelectPet = (pet: Pet) => {
        setCurrentPet(pet);
        localStorage.setItem("foon_current_pet_id", pet.id);
    };

    const petName = currentPet ? currentPet.name : "보호자";
    const petPhoto = currentPet ? currentPet.photo_url : null;

    return (
        <div className="bg-[#0A0A0B] min-h-screen text-white px-6 py-10 flex flex-col relative overflow-x-hidden pb-32">
            
            <div className="absolute top-[-5%] left-[-10%] w-[300px] h-[300px] bg-foon-lime/5 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute top-[-5%] right-[-10%] w-[300px] h-[300px] bg-foon-lime/5 rounded-full blur-[120px] pointer-events-none"></div>

            <header className="flex justify-between items-end mb-10 z-10">
                <div>
                    <h1 className="text-3xl font-bold leading-tight tracking-tight">
                        <span className="text-foon-lime">{petName === "보호자" ? "예비" : petName}</span> 보호자님,<br />
                        반가워요!
                    </h1>
                </div>
                <button
                    onClick={() => setIsSheetOpen(true)}
                    className="relative w-14 h-14 rounded-2xl bg-[#1A1A1C] border border-white/10 flex items-center justify-center p-1 overflow-hidden shadow-2xl active:scale-95 transition-all"
                >
                    {petPhoto ? (
                        <Image src={petPhoto} alt="Profile" fill className="object-cover" />
                    ) : (
                        <User className="text-gray-500 w-6 h-6" />
                    )}
                    <div className="absolute bottom-1 right-1 w-4 h-4 bg-foon-lime rounded-lg border-2 border-[#1A1A1C] flex items-center justify-center">
                        <Plus className="w-2.5 h-2.5 text-black stroke-[4]" />
                    </div>
                </button>
            </header>

            <div className="grid grid-cols-2 gap-4 z-10 auto-rows-[170px]">
                
                <Link 
                    href="/intro?category=FUNERAL"
                    className="row-span-2 group relative overflow-hidden rounded-[2.5rem] border border-white/5 bg-[#161618] shadow-2xl"
                >
                    <video className="absolute inset-0 w-full h-full object-cover opacity-60" autoPlay muted loop playsInline>
                        <source src="/Pets_Cosmic_Ascent.mp4" type="video/mp4" />
                    </video>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B] via-transparent to-transparent" />
                    <div className="absolute bottom-8 left-7">
                        <h2 className="text-2xl font-bold text-white mb-1">펫장례</h2>
                        <p className="text-gray-400 text-xs leading-relaxed">마지막 온기를<br/>잇는 따뜻한 이별</p>
                    </div>
                </Link>

                <Link
                    href="/life/sangjo"
                    className="bg-[#161618] rounded-[2rem] p-6 flex flex-col justify-between border border-white/5 hover:bg-[#1C1C1E] transition-all group"
                >
                    <div className="w-12 h-12 bg-[#252527] rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">🌺</div>
                    <div className="text-right">
                        <span className="font-bold text-gray-300 text-lg">펫상조</span>
                    </div>
                </Link>

                <Link
                    href="/intro?category=CHECKUP"
                    className="bg-[#161618] rounded-[2rem] p-6 flex flex-col justify-between border border-white/5 hover:bg-[#1C1C1E] transition-all group"
                >
                    <div className="w-12 h-12 bg-[#252527] rounded-2xl flex items-center justify-center text-2xl group-hover:rotate-12 transition-transform">🩺</div>
                    <div className="text-right">
                        <span className="font-bold text-gray-300 text-lg">건강검진</span>
                    </div>
                </Link>

                <Link
                    href="/mbti"
                    className="bg-[#161618] rounded-[2rem] p-6 flex flex-col justify-between border border-white/5 hover:bg-[#1C1C1E] transition-all group"
                >
                    <div className="w-12 h-12 bg-[#252527] rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">🧠</div>
                    <span className="font-bold text-gray-300 text-lg">펫 MBTI</span>
                </Link>

                <Link
                    href="/consult"
                    className="row-span-2 bg-[#1C1C1E] rounded-[2.5rem] p-8 flex flex-col justify-between border border-foon-lime/20 hover:border-foon-lime/40 transition-all relative overflow-hidden group shadow-2xl"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-foon-lime/10 blur-[50px] pointer-events-none"></div>
                    <div className="relative z-10 w-20 h-20 bg-[#252527] rounded-3xl flex items-center justify-center shadow-inner self-center mt-10">
                        <div className="w-16 h-16 transform scale-[2]">
                            <DotLottieReact src="https://lottie.host/fbd4eadc-be4a-44a3-adfb-0630b5bf1647/tBSDMcctNr.lottie" loop autoplay />
                        </div>
                    </div>
                    <div className="relative z-10">
                        <h2 className="text-2xl font-bold text-white mb-1 text-balance">Po-ON AI 상담사</h2>
                        <p className="text-gray-400 text-xs leading-relaxed">무엇이든 물어보세요</p>
                    </div>
                </Link>

                <Link
                    href="/life/insurance"
                    className="bg-[#161618] rounded-[2rem] p-6 flex flex-col justify-between border border-white/5 hover:bg-[#1C1C1E] transition-all group"
                >
                    <div className="w-12 h-12 bg-[#252527] rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">🛡️</div>
                    <span className="font-bold text-gray-300 text-lg">펫보험</span>
                </Link>

            </div>

            <PetSelectionSheet
                isOpen={isSheetOpen}
                onClose={() => setIsSheetOpen(false)}
                currentPetId={currentPet?.id || null}
                pets={initialPets}
                onSelectPet={handleSelectPet}
            />
        </div>
    );
}