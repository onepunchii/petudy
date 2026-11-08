"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Crown, PawPrint, Zap } from "lucide-react";

import { getPets } from "@/actions/pet";
import { APP_ICON_STROKE, AppBody, AppBottomAction, AppButton, AppHero, BRAND_ICON } from "@/components/app/ui";
import { PassCard } from "@/components/site/PassCard";
import { Porthole } from "@/components/site/ui";
import { cn } from "@/lib/utils";

// Helper type for the pet object returned by getPets (inferred)
type Pet = Awaited<ReturnType<typeof getPets>>[number];

export default function MbtiIntroPage() {
    const router = useRouter();
    const [pets, setPets] = useState<Pet[]>([]);
    const [selectedPet, setSelectedPet] = useState<Pet | null>(null);

    // Fallback loading state
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadPetData = async () => {
            try {
                // 1. Try fetching from DB
                const fetchedPets = await getPets();
                if (fetchedPets && fetchedPets.length > 0) {
                    setPets(fetchedPets);
                    setSelectedPet(fetchedPets[0]);
                } else {
                    // Fallback to localStorage dummy logic if absolutely no DB data
                    // For now, if no pets, we might want to prompt creation or show dummy
                    // Keeping existing fallback for consistency but adapted
                    const storedName = localStorage.getItem("petName");
                    const dummyPet = { id: "temp", name: storedName || "두부", photo_url: localStorage.getItem("petPhoto") } as Pet;
                    setPets([dummyPet]);
                    setSelectedPet(dummyPet);
                }
            } catch (error) {
                console.error("Failed to load pet data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadPetData();
    }, []);

    const handleStart = () => {
        // Optionally save the selected pet ID to storage or URL for the test to use
        if (selectedPet) {
            localStorage.setItem("currentPetId", selectedPet.id);
            localStorage.setItem("petName", selectedPet.name); // Keep legacy sync
            if (selectedPet.photo_url) localStorage.setItem("petPhoto", selectedPet.photo_url);
        }
        router.push("/mbti/test");
    };

    return (
        // 멍BTI 화면은 하단 탭이 없으므로 (main) 레이아웃의 pb-28 을 상쇄해 아래 버튼이 화면 바닥에 붙게 합니다
        <div className="-mb-28 flex min-h-[100dvh] flex-col bg-moon lg:-mb-10 lg:min-h-[calc(100dvh-4rem)]">
            <AppHero
                back="/"
                top={<span className="text-[15px] font-semibold text-star-2">멍BTI 분석</span>}
                title={
                    <>
                        우리 {selectedPet?.name || "아이"},<br />사실 사람 아닐까?
                    </>
                }
                subtitle={
                    <>
                        행동 분석을 통해 아이의 성향을 파악하고 딱 맞는 <span className="font-semibold text-star">맞춤 서비스</span>를 추천해드려요.
                    </>
                }
                action={<Porthole src={BRAND_ICON.mbti} size={76} />}
            >
                {/* Pet Selection Area */}
                <div>
                    <p id="mbti-pet-label" className="text-[13px] font-medium text-star-3">분석할 아이를 선택해주세요</p>
                    <div role="group" aria-labelledby="mbti-pet-label" className="scrollbar-hide -mx-5 mt-3 flex gap-4 overflow-x-auto px-5 py-1">
                        {pets.map((pet) => {
                            const isSelected = selectedPet?.id === pet.id;
                            return (
                                <button
                                    key={pet.id}
                                    type="button"
                                    onClick={() => setSelectedPet(pet)}
                                    aria-pressed={isSelected}
                                    className="flex w-16 shrink-0 flex-col items-center gap-2 active:translate-y-px"
                                >
                                    <span
                                        className={cn(
                                            "relative block h-14 w-14 overflow-hidden rounded-full bg-night-3 transition-[box-shadow,opacity] duration-200 motion-reduce:transition-none",
                                            isSelected ? "ring-2 ring-star ring-offset-2 ring-offset-night" : "opacity-60 ring-1 ring-white/10 hover:opacity-90",
                                        )}
                                    >
                                        {pet.photo_url ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={pet.photo_url} alt={pet.name} className="h-full w-full object-cover" />
                                        ) : (
                                            <span className="flex h-full w-full items-center justify-center text-star-3">
                                                <PawPrint className="h-6 w-6" strokeWidth={APP_ICON_STROKE} aria-hidden />
                                            </span>
                                        )}
                                    </span>
                                    <span className={cn("max-w-full truncate text-[13px]", isSelected ? "font-bold text-star" : "font-medium text-star-3")}>
                                        {pet.name}
                                    </span>
                                </button>
                            );
                        })}
                        {/* 'Add Pet' placeholder if needed, omitted for now to keep it clean */}
                    </div>
                </div>
            </AppHero>

            <AppBody className="flex-1">
                {/* 결과 예시: 탑승권 한 장, 절취선 너머에 기록 안내 */}
                <PassCard
                    stubPosition="bottom"
                    mainClassName="p-0 sm:p-0"
                    stubClassName="px-5 py-4 sm:px-5 sm:py-4"
                    stub={
                        <p className="text-[13px] leading-relaxed text-ink-3">
                            결과는 <b className="font-semibold text-ink-2">반려동물 등록증</b>에 뱃지로 기록됩니다.
                        </p>
                    }
                >
                    <div className="divide-y divide-line">
                        <div className="flex items-center gap-4 px-5 py-4">
                            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-paper-2 text-ink-2">
                                <Zap className="h-5 w-5" strokeWidth={APP_ICON_STROKE} aria-hidden />
                            </span>
                            <div>
                                <h3 className="text-[15.5px] font-bold text-ink">파워 에너자이저</h3>
                                <p className="mt-0.5 text-[13.5px] text-ink-2">지치지 않는 체력왕</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 px-5 py-4">
                            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-paper-2 text-ink-2">
                                <Crown className="h-5 w-5" strokeWidth={APP_ICON_STROKE} aria-hidden />
                            </span>
                            <div>
                                <h3 className="text-[15.5px] font-bold text-ink">유리멘탈 공주님</h3>
                                <p className="mt-0.5 text-[13.5px] text-ink-2">섬세한 케어 요망</p>
                            </div>
                        </div>
                    </div>
                </PassCard>
            </AppBody>

            <AppBottomAction>
                <AppButton variant="accent" size="lg" block onClick={handleStart}>
                    검사 시작하기
                    <ArrowRight className="h-5 w-5" strokeWidth={APP_ICON_STROKE} aria-hidden />
                </AppButton>
            </AppBottomAction>
        </div>
    );
}
