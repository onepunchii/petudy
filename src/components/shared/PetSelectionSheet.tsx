"use client";

import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { Plus, Check, Pencil, Trash2, IdCard, GripVertical, Star, Mars, Venus, PawPrint } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Pet, deletePet } from "@/actions/pet";
import Link from "next/link";
import RegistrationSuccess3D from "@/components/register/RegistrationSuccess3D";
import { APP_ICON_STROKE, AppButton, AppEmpty, SheetHeader, SheetPanel, appButtonClass, appOptionClass, dialogPanelClass, sheetBackdropClass } from "@/components/app/ui";
import { cn } from "@/lib/utils";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    TouchSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Health Concern Mapping
const CONCERN_LABELS: Record<string, string> = {
    skin: "피부 / 알러지",
    joint: "관절 / 뼈",
    digestive: "소화기 / 위장",
    dental: "치아 / 구강",
    weight: "비만 / 체중",
    heart: "심장 / 호흡기",
    eye: "눈 / 귀",
    eye_ear: "눈 / 귀", // Added legacy tag
    behavior: "행동 / 분리불안",
    none: "건강함"
};

/** 카드 오른쪽 위 동그란 아이콘 버튼 (펫 패스, 수정, 삭제) */
const iconButtonClass =
    "flex h-10 w-10 items-center justify-center rounded-full bg-paper-2 text-ink-2 transition-colors active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink";

interface PetSelectionSheetProps {
    isOpen: boolean;
    onClose: () => void;
    currentPetId: string | null;
    pets: Pet[];
    onSelectPet: (pet: Pet) => void;
    /** 순서 바꾸기 버튼 표시. 순서는 아직 저장되지 않아 내 정보에서는 숨깁니다 */
    allowReorder?: boolean;
}

// Sortable Item Component
function SortablePetItem({
    pet,
    index,
    isSelected,
    isEditMode,
    onSelect,
    onDelete,
    calculateAge,
    onViewPass // Add prop
}: {
    pet: Pet;
    index: number;
    isSelected: boolean;
    isEditMode: boolean;
    onSelect: () => void;
    onDelete: () => void;
    calculateAge: (date: string | null) => string;
    onViewPass: (pet: Pet) => void; // Add type
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: pet.id, disabled: !isEditMode });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 1, // Elevate when dragging
    };

    // 선택된 아이 = 남색 테두리 2px + 체크 (순서 바꾸기 중에는 표시하지 않음)
    const showSelected = isSelected && !isEditMode;

    return (
        <div
            ref={setNodeRef}
            style={style}
            onClick={() => !isEditMode && onSelect()} // Allow selection on click
            className={cn(
                appOptionClass(showSelected, "group relative touch-manipulation"),
                isDragging && "opacity-80 shadow-[0_18px_36px_-14px_rgb(31_39_66/0.35)]",
                !isEditMode && "cursor-pointer",
            )}
        >
            {/* Top Part: Info (Allow pointer events for Avatar click) */}
            <div className={cn("relative z-10 mb-3 flex items-start justify-between", isEditMode ? "pr-12" : "pr-[132px]")}>
                <div className="flex min-w-0 items-center gap-3.5">
                    {/* Avatar - Click to View Card */}
                    <div
                        className="relative shrink-0"
                    >
                        <div className="relative h-12 w-12 overflow-hidden rounded-full bg-paper-2 ring-1 ring-line">
                            {pet.photo_url ? (
                                <img src={pet.photo_url} alt={pet.name} className="h-full w-full object-cover" />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center text-ink-3">
                                    <PawPrint className="h-5 w-5" strokeWidth={APP_ICON_STROKE} aria-hidden />
                                </div>
                            )}
                        </div>
                        {/* Star Badge (Moved Inside here) */}
                        {index === 0 && !isEditMode && (
                            <div className="absolute -left-1 -top-1 z-20 flex h-5 w-5 items-center justify-center rounded-full bg-night text-star ring-2 ring-pass">
                                <Star className="h-2.5 w-2.5 fill-current" strokeWidth={2.5} aria-hidden />
                            </div>
                        )}
                    </div>

                    {/* Text Info */}
                    <div className="min-w-0">
                        <div className="mb-0.5 flex items-center gap-1.5">
                            <span
                                role="img"
                                aria-label={pet.gender === "male" ? "남아" : "여아"}
                                className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-paper-2 text-ink-2"
                            >
                                {pet.gender === "male" ? (
                                    <Mars className="h-3 w-3" strokeWidth={2.25} aria-hidden />
                                ) : (
                                    <Venus className="h-3 w-3" strokeWidth={2.25} aria-hidden />
                                )}
                            </span>
                            <span className="truncate text-[16px] font-bold tracking-tight text-ink">{pet.name}</span>
                            {showSelected && (
                                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-night text-star">
                                    <Check className="h-3 w-3" strokeWidth={3} aria-hidden />
                                </span>
                            )}
                        </div>
                        <div className="truncate text-[13px] text-ink-3">
                            {pet.breed || "믹스"} · {calculateAge(pet.birth_date)}
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side: Actions + Drag Handle (MOVED OUTSIDE: Explicitly Interactive & High Z-Index) */}
            <div className="absolute right-3 top-3 z-30 flex h-10 items-center gap-1" onClick={(e) => e.stopPropagation()}>
                {isEditMode ? (
                    /* Drag Handle - Only Visible in Edit Mode */
                    <div
                        {...attributes}
                        {...listeners}
                        className="flex h-10 w-10 cursor-grab touch-none items-center justify-center rounded-full text-ink-3 transition-colors hover:bg-paper-2 hover:text-ink active:cursor-grabbing"
                    >
                        <GripVertical className="h-6 w-6" strokeWidth={APP_ICON_STROKE} />
                    </div>
                ) : (
                    /* Standard Actions - Hidden in Edit Mode */
                    <>
                        {/* Pet Pass Button */}
                        <button
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onViewPass(pet);
                            }}
                            className={cn(iconButtonClass, "hover:bg-line hover:text-ink")}
                            title="펫 패스 보기"
                            aria-label="펫 패스 보기"
                        >
                            <IdCard className="h-4 w-4" strokeWidth={APP_ICON_STROKE} />
                        </button>

                        <Link
                            href={`/settings/pets/${pet.id}/edit`}
                            onClick={(e) => e.stopPropagation()}
                            className={cn(iconButtonClass, "hover:bg-line hover:text-ink")}
                            title="수정하기"
                            aria-label="수정하기"
                        >
                            <Pencil className="h-3.5 w-3.5" strokeWidth={APP_ICON_STROKE} />
                        </Link>
                        <button
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onDelete();
                            }}
                            className={cn(iconButtonClass, "hover:bg-danger/10 hover:text-danger")}
                            title="삭제하기"
                            aria-label="삭제하기"
                        >
                            <Trash2 className="h-3.5 w-3.5" strokeWidth={APP_ICON_STROKE} />
                        </button>
                    </>
                )}
            </div>

            {/* Concerns Tags */}
            <div className="pointer-events-none relative z-10 flex flex-wrap gap-1.5">
                {pet.concerns && pet.concerns.length > 0 ? (
                    pet.concerns.slice(0, 3).map((concern, idx) => (
                        <span key={idx} className="rounded-full bg-paper-2 px-2.5 py-1 text-[13px] font-medium leading-none text-ink-2">
                            {CONCERN_LABELS[concern] || concern}
                        </span>
                    ))
                ) : (
                    <span className="text-[13px] text-ink-3">등록된 고민 없음</span>
                )}
                {pet.concerns && pet.concerns.length > 3 && (
                    <span className="rounded-full bg-paper-2 px-2.5 py-1 text-[13px] font-medium leading-none tabular-nums text-ink-2">+{pet.concerns.length - 3}</span>
                )}
            </div>
        </div>
    );
}

export default function PetSelectionSheet({ isOpen, onClose, currentPetId, pets: initialPets, onSelectPet, allowReorder = true }: PetSelectionSheetProps) {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [shouldRender, setShouldRender] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    // Local state
    const [pets, setPets] = useState<Pet[]>(initialPets);
    const [isEditMode, setIsEditMode] = useState(false); // New Edit Mode State

    // View Card Modal State
    const [deletingPetId, setDeletingPetId] = useState<string | null>(null);
    const [viewingPet, setViewingPet] = useState<Pet | null>(null);

    // Sheet Drag Logic State
    const [dragOffset, setDragOffset] = useState(0);
    const [isSheetDragging, setIsSheetDragging] = useState(false);
    const startY = useRef<number>(0);

    // DnD Sensors
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(TouchSensor, { activationConstraint: { delay: 0, tolerance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    // Is Mounted Check for Hydration Safety (Critical for DnD)
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
        setPets(initialPets);
    }, [initialPets]);

    // Handle Open/Close Animation
    useEffect(() => {
        if (isOpen) {
            setShouldRender(true);
            requestAnimationFrame(() => setIsVisible(true));
        } else {
            setIsVisible(false);
            const timer = setTimeout(() => setShouldRender(false), 300); // 300ms transition
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    // Sheet Drag Handlers
    const handleDragStart = (e: React.PointerEvent) => {
        setIsSheetDragging(true);
        startY.current = e.clientY;
    };

    const handleDragMove = (e: React.PointerEvent) => {
        if (!isSheetDragging) return;
        const currentY = e.clientY;
        const diff = currentY - startY.current;
        if (diff > 0) {
            setDragOffset(diff);
        }
    };

    const handleDragEndSheet = () => {
        setIsSheetDragging(false);
        if (dragOffset > 150) {
            onClose();
        }
        setDragOffset(0);
    };

    // Drag End Handler
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            setPets((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    // Delete Handler
    const handleDelete = async () => {
        if (!deletingPetId) return;
        try {
            const result = await deletePet(deletingPetId);
            if (!result.success) {
                alert(result.error);
                setDeletingPetId(null);
                return;
            }
            setPets((prev) => prev.filter((p) => p.id !== deletingPetId));
            setDeletingPetId(null);
            // 홈 인사말·아이 목록이 지운 아이를 계속 보여 주지 않도록 캐시를 바로 비웁니다
            await queryClient.invalidateQueries({ queryKey: ["pets"] });
            router.refresh(); // Refresh server components
        } catch (error) {
            console.error("Failed to delete pet:", error);
            alert("삭제하지 못했어요. 잠시 후 다시 시도해 주세요.");
            setDeletingPetId(null);
        }
    };

    // Helper to convert Pet to FormData for Pass Card
    const getPetPassFormData = (pet: Pet): any => {
        return {
            name: pet.name,
            species: (pet.species === "cat" ? "cat" : "dog") as "cat" | "dog",
            breed: pet.breed,
            gender: pet.gender,
            neuter: pet.neuter,
            birth: pet.birth_date,
            weight: pet.weight,
            color: pet.color,
            concern: pet.concerns,
            photo: pet.photo_url,
            reg_number: pet.registration_number,
            adoptionDate: pet.adoption_date,
            petId: pet.id,
            ownerName: "소유자",
        };
    };

    // Age Calculation Helper
    const calculateAge = (birthDateStr: string | null) => {
        if (!birthDateStr) return "나이 미상";
        const birthDate = new Date(birthDateStr);
        if (isNaN(birthDate.getTime())) return "나이 미상";

        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        // Show months for puppies/kittens under 1 year
        if (age === 0) {
            const months = (today.getFullYear() - birthDate.getFullYear()) * 12 + (today.getMonth() - birthDate.getMonth());
            return `${Math.max(0, months)}개월`;
        }

        return `${age}살`;
    };

    if (!shouldRender || !isMounted) return null;

    return createPortal(
        // 포털은 body 아래에 붙으므로 .app 범위(글꼴·토큰)를 다시 씌웁니다
        <div className="app pointer-events-auto fixed inset-0 z-[60]">
            {/* Backdrop */}
            <div
                className={cn(sheetBackdropClass, "transition-opacity duration-500 ease-in-out motion-reduce:transition-none", isVisible ? "opacity-100" : "opacity-0")}
                onClick={onClose}
            />

            {/* Sheet Container */}
            <SheetPanel
                aria-label="반려동물 선택"
                className="flex max-h-[85vh] flex-col"
                style={{
                    transform: isSheetDragging ? `translateY(${dragOffset}px)` : isVisible ? "translateY(0)" : "translateY(100%)",
                    transition: isSheetDragging ? 'none' : 'transform 0.5s cubic-bezier(0.32, 0.72, 0, 1)'
                }}
            >
                {/* Drag Handle Area */}
                <div
                    className="w-full shrink-0 cursor-grab touch-none pb-3 active:cursor-grabbing"
                    onPointerDown={handleDragStart}
                    onPointerMove={handleDragMove}
                    onPointerUp={handleDragEndSheet}
                    onPointerCancel={handleDragEndSheet}
                >
                    <SheetHeader />
                </div>

                {/* Header */}
                <div className="flex shrink-0 items-center justify-between gap-3 px-5 pb-4">
                    <h2 className="flex items-baseline gap-1.5 text-[18px] font-bold text-ink">
                        반려동물 선택
                        <span className="text-[15px] font-semibold tabular-nums text-ink-3">({pets.length})</span>
                    </h2>
                    {allowReorder && (
                        <button
                            type="button"
                            onClick={() => setIsEditMode(!isEditMode)}
                            className={appButtonClass({ variant: isEditMode ? "primary" : "secondary", size: "sm" })}
                        >
                            {isEditMode ? "완료" : "순서 바꾸기"}
                        </button>
                    )}
                </div>

                {/* Pet List - Scrollable with Sortable Context */}
                <div className="flex-1 overflow-y-auto overscroll-contain px-5 pb-4 pt-1" onTouchStart={(e) => e.stopPropagation()}>
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={pets.map(p => p.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            <div className="space-y-3">
                                {pets.length > 0 ? (
                                    pets.map((pet, index) => (
                                        <SortablePetItem
                                            key={pet.id}
                                            pet={pet}
                                            index={index}
                                            isSelected={currentPetId === pet.id}
                                            isEditMode={isEditMode}
                                            onSelect={() => { if (!isEditMode) { onSelectPet(pet); onClose(); } }}
                                            onDelete={() => setDeletingPetId(pet.id)}
                                            calculateAge={calculateAge}
                                            onViewPass={setViewingPet} // Pass handler
                                        />
                                    ))
                                ) : (
                                    <AppEmpty
                                        className="py-8"
                                        icon={<PawPrint className="h-7 w-7" strokeWidth={APP_ICON_STROKE} aria-hidden />}
                                        title="등록된 반려동물이 없습니다."
                                    />
                                )}
                            </div>
                        </SortableContext>
                    </DndContext>
                </div>

                {/* Add New Pet Button - Hidden in Edit Mode */}
                {!isEditMode && (
                    <div className="w-full shrink-0 px-5 pt-1">
                        <AppButton
                            variant="secondary"
                            size="lg"
                            block
                            onClick={() => router.push("/register")}
                            onTouchStart={(e) => e.stopPropagation()}
                        >
                            <Plus className="h-[18px] w-[18px]" strokeWidth={APP_ICON_STROKE} aria-hidden />
                            새로운 아이 등록하기
                        </AppButton>
                    </div>
                )}
            </SheetPanel>

            {/* Delete Confirmation Modal */}
            {
                deletingPetId && (
                    <div className={cn(sheetBackdropClass, "z-[80] flex items-center justify-center px-6")} onClick={(e) => e.stopPropagation()}>
                        <div role="alertdialog" aria-modal="true" aria-labelledby="pet-delete-title" className={cn(dialogPanelClass, "max-w-[340px] text-center")}>
                            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-danger/10 text-danger">
                                <Trash2 className="h-6 w-6" strokeWidth={APP_ICON_STROKE} aria-hidden />
                            </div>
                            <h3 id="pet-delete-title" className="mb-2 text-[18px] font-bold text-ink">정말 삭제하시겠습니까?</h3>
                            <p className="mb-6 text-[15px] leading-relaxed text-ink-2">
                                삭제된 데이터는 복구할 수 없습니다.<br />
                                신중하게 결정해주세요.
                            </p>
                            <div className="flex gap-3">
                                <AppButton
                                    variant="secondary"
                                    className="flex-1"
                                    onClick={() => setDeletingPetId(null)}
                                >
                                    취소
                                </AppButton>
                                <AppButton
                                    variant="danger"
                                    className="flex-1"
                                    onClick={handleDelete}
                                >
                                    삭제하기
                                </AppButton>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Pet Pass Viewer Modal (3D 펫 패스: 짧은 전체 화면 연출이라 밤 바탕) */}
            {viewingPet && (
                <div className="fixed inset-0 z-[100] bg-night">
                    <RegistrationSuccess3D
                        formData={getPetPassFormData(viewingPet)}
                        petId={viewingPet.id}
                        onComplete={() => setViewingPet(null)}
                        viewMode={true}
                    />
                </div>
            )}
        </div>,
        document.body
    );
}
