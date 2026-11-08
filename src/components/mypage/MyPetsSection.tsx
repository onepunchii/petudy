"use client";

import { ChevronRight, PawPrint, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import type { Pet } from "@/actions/pet";
import { APP_ICON_STROKE, AppButton, AppEmpty, AppLinkButton, AppList, AppSection, skeletonClass } from "@/components/app/ui";
import PetSelectionSheet from "@/components/shared/PetSelectionSheet";
import { usePets } from "@/hooks/usePets";
import { cn } from "@/lib/utils";

/** 지금 고른 아이. 홈(HomePageClient)과 같은 키를 씁니다 */
const CURRENT_PET_KEY = "foon_current_pet_id";

/** 불러오는 동안에도 같은 배열을 넘겨 시트가 매번 다시 맞추지 않게 합니다 */
const NO_PETS: Pet[] = [];

function readStoredPetId(): string | null {
    try {
        return localStorage.getItem(CURRENT_PET_KEY);
    } catch {
        return null;
    }
}

/** 1살 미만은 "N개월", 그 뒤로는 "N살", 생일이 없으면 "나이 미상" */
function formatAge(birthDate: string | null): string {
    if (!birthDate) return "나이 미상";
    const birth = new Date(birthDate);
    if (Number.isNaN(birth.getTime())) return "나이 미상";

    const today = new Date();
    let months = (today.getFullYear() - birth.getFullYear()) * 12 + (today.getMonth() - birth.getMonth());
    if (today.getDate() < birth.getDate()) months -= 1;
    months = Math.max(0, months);

    return months < 12 ? `${months}개월` : `${Math.floor(months / 12)}살`;
}

function speciesLabel(species: string | null): string | null {
    if (species === "dog") return "강아지";
    if (species === "cat") return "고양이";
    return null;
}

/** "품종 · 나이". 품종이 없으면 종류(강아지·고양이)로, 그것도 없으면 나이만 */
function petMeta(pet: Pet): string {
    return [pet.breed || speciesLabel(pet.species), formatAge(pet.birth_date)].filter(Boolean).join(" · ");
}

function PetAvatar({ pet }: { pet: Pet }) {
    if (pet.photo_url) {
        return (
            // 펫 사진은 업로드 주소가 여러 형태라 next/image 대신 그대로 그립니다 (PetSelectionSheet 와 같음)
            // eslint-disable-next-line @next/next/no-img-element
            <img src={pet.photo_url} alt="" width={44} height={44} className="h-11 w-11 shrink-0 rounded-full object-cover ring-1 ring-line" />
        );
    }
    return (
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-paper-2 text-ink-3 ring-1 ring-line" aria-hidden>
            <PawPrint className="h-5 w-5" strokeWidth={APP_ICON_STROKE} />
        </span>
    );
}

/**
 * 내 정보의 "내 아이" 묶음. 예전 앱 홈에 있던 아이 관리(펫 패스, 수정, 삭제, 추가)를 여기서 합니다.
 * 줄을 누르면 PetSelectionSheet 가 열리고, 시트에서 고른 아이가 홈의 "내 아이" 카드에 보입니다("홈에 표시").
 * 순서 바꾸기는 아직 저장되지 않아 이 화면에서는 숨깁니다(allowReorder={false}).
 */
export default function MyPetsSection() {
    const { data, isLoading, isError, refetch } = usePets();
    const pets = data ?? NO_PETS;
    const [selectedPetId, setSelectedPetId] = useState<string | null>(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    // 펫 목록은 클라이언트에서만 채워지므로(서버 prefetch 없음) 여기서 localStorage 를 읽어도 안전합니다.
    const currentPetId = useMemo<string | null>(() => {
        if (pets.length === 0) return null;
        const id = selectedPetId ?? readStoredPetId();
        return (pets.find((p: Pet) => p.id === id) ?? pets[0]).id;
    }, [pets, selectedPetId]);

    const handleSelectPet = (pet: Pet) => {
        setSelectedPetId(pet.id);
        try {
            localStorage.setItem(CURRENT_PET_KEY, pet.id);
        } catch {
            // 저장소 접근 불가(사생활 보호 모드 등): 선택은 이번 방문에만 유지
        }
    };

    let body: React.ReactNode;
    if (isLoading) {
        body = (
            <>
                <div className={cn(skeletonClass, "h-[72px]")} aria-hidden />
                <p role="status" className="sr-only">
                    아이 목록을 불러오는 중
                </p>
            </>
        );
    } else if (isError) {
        body = (
            <AppEmpty
                className="py-8"
                title="아이 목록을 불러오지 못했어요"
                description="잠시 뒤 다시 시도해 주세요"
                action={
                    <AppButton variant="secondary" onClick={() => refetch()}>
                        다시 불러오기
                    </AppButton>
                }
            />
        );
    } else if (pets.length === 0) {
        body = (
            <AppEmpty
                className="py-8"
                icon={<PawPrint className="h-7 w-7" strokeWidth={APP_ICON_STROKE} aria-hidden />}
                title="아직 등록한 아이가 없어요"
                action={
                    <AppLinkButton href="/register" variant="primary">
                        아이 등록하기
                    </AppLinkButton>
                }
            />
        );
    } else {
        body = (
            <>
                <AppList aria-label="내 아이 목록">
                    {pets.map((pet: Pet) => {
                        const isCurrent = pet.id === currentPetId;
                        return (
                            <li key={pet.id}>
                                <button
                                    type="button"
                                    onClick={() => setIsSheetOpen(true)}
                                    aria-haspopup="dialog"
                                    className="flex min-h-[72px] w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-paper-2/70 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ink active:bg-paper-2"
                                >
                                    <PetAvatar pet={pet} />
                                    <span className="min-w-0 flex-1">
                                        <span className="flex min-w-0 items-center gap-2">
                                            <span className="truncate text-[16px] font-semibold text-ink">{pet.name}</span>
                                            {isCurrent && (
                                                <span className="shrink-0 rounded-full bg-pine-soft px-2 py-0.5 text-[12px] font-semibold text-pine">홈에 표시</span>
                                            )}
                                        </span>
                                        <span className="mt-0.5 block truncate text-[13px] text-ink-3">{petMeta(pet)}</span>
                                    </span>
                                    <ChevronRight className="h-4 w-4 shrink-0 text-ink-3" strokeWidth={APP_ICON_STROKE} aria-hidden />
                                </button>
                            </li>
                        );
                    })}
                </AppList>
                <AppLinkButton href="/register" variant="secondary" block className="mt-3">
                    <Plus className="h-[18px] w-[18px]" strokeWidth={APP_ICON_STROKE} aria-hidden />
                    아이 추가하기
                </AppLinkButton>
            </>
        );
    }

    return (
        <div id="my-pets" className="mt-8 scroll-mt-6">
            <AppSection title="내 아이" id="my-pets-title">
                {body}
            </AppSection>

            <PetSelectionSheet
                allowReorder={false}
                isOpen={isSheetOpen}
                onClose={() => setIsSheetOpen(false)}
                currentPetId={currentPetId}
                pets={pets}
                onSelectPet={handleSelectPet}
            />
        </div>
    );
}
