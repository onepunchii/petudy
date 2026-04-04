"use client";

import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { Plus, Check, Pencil, Trash2, IdCard, ArrowUpDown, GripVertical, Star, X, Home } from "lucide-react";
import { useRouter } from "next/navigation";
import { Pet, deletePet, PetFormData } from "@/actions/pet";
import Link from "next/link";
import RegistrationSuccess3D from "@/components/register/RegistrationSuccess3D";
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

interface PetSelectionSheetProps {
    isOpen: boolean;
    onClose: () => void;
    currentPetId: string | null;
    pets: Pet[];
    onSelectPet: (pet: Pet) => void;
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

    return (
        <div
            ref={setNodeRef}
            style={style}
            onClick={() => !isEditMode && onSelect()} // Allow selection on click
            className={`bg-[#252527] rounded-[24px] p-4 shadow-lg border relative group transition-all touch-manipulation
            ${isSelected && !isEditMode ? 'border-foon-lime/50 ring-1 ring-foon-lime/20' : 'border-[#333] hover:border-gray-500'}
            ${isDragging ? 'opacity-80 scale-105 shadow-2xl bg-[#2D2D30]' : ''}
            ${!isEditMode ? 'cursor-pointer hover:bg-[#2a2a2c]' : ''}`} // Add cursor pointer
        >
            {/* Top Part: Info (Allow pointer events for Avatar click) */}
            <div className="flex items-start justify-between mb-4 relative z-10 bg-transparent">
                <div className="flex items-center gap-4">
                    {/* Avatar - Click to View Card */}
                    <div
                        className="relative"
                    >
                        <div className="w-12 h-12 rounded-full bg-[#333] flex-shrink-0 border border-[#444] overflow-hidden relative shadow-md">
                            {pet.photo_url ? (
                                <img src={pet.photo_url} alt={pet.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-xl">🐶</div>
                            )}
                        </div>
                        {/* Star Badge (Moved Inside here) */}
                        {index === 0 && !isEditMode && (
                            <div className="absolute -top-1.5 -left-1.5 z-20 bg-yellow-400 text-bg-main w-5 h-5 rounded-full flex items-center justify-center shadow-md border-[1.5px] border-[#252527]">
                                <Star className="w-3 h-3 fill-current stroke-[3]" />
                            </div>
                        )}
                    </div>

                    {/* Text Info */}
                    <div>
                        <div className="flex items-center gap-2 mb-0.5">
                            <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${pet.gender === "male" ? "bg-blue-500/20 text-blue-400" : "bg-pink-500/20 text-pink-400"}`}>
                                {pet.gender === "male" ? "♂" : "♀"}
                            </div>
                            <span className="text-base font-black text-white tracking-tight">{pet.name}</span>
                            {isSelected && !isEditMode && <Check className="w-4 h-4 text-foon-lime" />}
                        </div>
                        <div className="text-gray-400 text-[11px] font-medium tracking-tight">
                            {pet.breed || "믹스"} · {calculateAge(pet.birth_date)}
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side: Actions + Drag Handle (MOVED OUTSIDE: Explicitly Interactive & High Z-Index) */}
            <div className="absolute top-4 right-4 flex items-center gap-1.5 z-30 h-8" onClick={(e) => e.stopPropagation()}>
                {isEditMode ? (
                    /* Drag Handle - Only Visible in Edit Mode */
                    <div
                        {...attributes}
                        {...listeners}
                        className="w-10 h-10 -mr-2 rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing text-gray-400 hover:text-white hover:bg-[#333] transition-colors touch-none animate-in fade-in zoom-in duration-200"
                    >
                        <GripVertical className="w-6 h-6" />
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
                            className="w-8 h-8 rounded-full bg-[#333] border border-[#444] flex items-center justify-center text-gray-400 hover:text-foon-lime hover:border-foon-lime/30 transition-colors active:scale-90"
                            title="펫 패스 보기"
                        >
                            <IdCard className="w-4 h-4" />
                        </button>

                        <Link
                            href={`/settings/pets/${pet.id}/edit`}
                            onClick={(e) => e.stopPropagation()}
                            className="w-8 h-8 rounded-full bg-[#333] border border-[#444] flex items-center justify-center text-gray-400 hover:text-white transition-colors active:scale-90"
                            title="수정하기"
                        >
                            <Pencil className="w-3.5 h-3.5" />
                        </Link>
                        <button
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onDelete();
                            }}
                            className="w-8 h-8 rounded-full bg-[#333] border border-[#444] flex items-center justify-center text-gray-400 hover:text-red-400 hover:border-red-400/30 transition-colors active:scale-90"
                            title="삭제하기"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                        </button>
                    </>
                )}
            </div>

            {/* Concerns Tags */}
            <div className="flex flex-wrap gap-1.5 relative z-10 pointer-events-none">
                {pet.concerns && pet.concerns.length > 0 ? (
                    pet.concerns.slice(0, 3).map((concern, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded-[6px] bg-[#333] text-gray-400 text-[10px] font-medium border border-transparent">
                            {CONCERN_LABELS[concern] || concern}
                        </span>
                    ))
                ) : (
                    <span className="text-gray-600 text-[10px]">등록된 고민 없음</span>
                )}
                {pet.concerns && pet.concerns.length > 3 && (
                    <span className="px-2 py-0.5 rounded-[6px] bg-[#333] text-gray-400 text-[10px]">+{pet.concerns.length - 3}</span>
                )}
            </div>
        </div>
    );
}

export default function PetSelectionSheet({ isOpen, onClose, currentPetId, pets: initialPets, onSelectPet }: PetSelectionSheetProps) {
    const router = useRouter();
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
            await deletePet(deletingPetId);
            setPets((prev) => prev.filter((p) => p.id !== deletingPetId));
            setDeletingPetId(null);
            router.refresh(); // Refresh server components
        } catch (error) {
            console.error("Failed to delete pet:", error);
            alert("반려동물 삭제에 실패했습니다.");
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
        <div className="fixed inset-0 z-[60] flex items-end justify-center pointer-events-auto">
            {/* Backdrop */}
            <div
                className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ease-in-out ${isVisible ? "opacity-100" : "opacity-0"}`}
                onClick={onClose}
            />

            {/* Sheet Container */}
            <div
                className={`w-full max-w-[512px] bg-[#1c1c1e] rounded-t-[32px] pt-4 flex flex-col max-h-[85vh] shadow-[0_-10px_40px_rgba(0,0,0,0.6)] z-[70]`}
                style={{
                    transform: isSheetDragging ? `translateY(${dragOffset}px)` : isVisible ? "translateY(0)" : "translateY(100%)",
                    transition: isSheetDragging ? 'none' : 'transform 0.5s cubic-bezier(0.32, 0.72, 0, 1)'
                }}
            >
                {/* Drag Handle Area */}
                <div
                    className="w-full flex justify-center py-3 touch-none cursor-grab active:cursor-grabbing"
                    onPointerDown={handleDragStart}
                    onPointerMove={handleDragMove}
                    onPointerUp={handleDragEndSheet}
                    onPointerCancel={handleDragEndSheet}
                >
                    <div className="w-10 h-1 rounded-full bg-gray-600/50" />
                </div>

                {/* Header */}
                <div className="px-6 pb-4 flex justify-between items-center bg-[#1c1c1e] z-10 sticky top-0">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        반려동물 선택
                        <span className="text-foon-lime text-sm font-normal">({pets.length})</span>
                    </h2>
                    <button
                        onClick={() => setIsEditMode(!isEditMode)}
                        className={`text-sm px-3 py-1.5 rounded-full border transition-all ${isEditMode
                            ? "bg-foon-lime text-bg-main border-foon-lime font-bold"
                            : "text-gray-400 border-gray-600 hover:text-white hover:border-white"
                            }`}
                    >
                        {isEditMode ? "완료" : "순서 바꾸기"}
                    </button>
                </div>

                {/* Pet List - Scrollable with Sortable Context */}
                <div className="flex-1 overflow-y-auto custom-scrollbar mb-6 p-2 mx-4" onTouchStart={(e) => e.stopPropagation()}>
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={pets.map(p => p.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            <div className="space-y-4 pb-2">
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
                                    <div className="text-center py-8 text-gray-500 text-sm">
                                        등록된 반려동물이 없습니다.
                                    </div>
                                )}
                            </div>
                        </SortableContext>
                    </DndContext>
                </div>

                {/* Add New Pet Button - Hidden in Edit Mode */}
                {!isEditMode && (
                    <div className="px-4 w-full mb-8 shrink-0">
                        <button
                            onClick={() => router.push("/register")}
                            className="w-full py-4 rounded-2xl border border-dashed border-[#444] text-gray-400 font-bold flex items-center justify-center gap-2 hover:bg-[#222] hover:text-foon-lime hover:border-foon-lime/50 transition-all active:scale-[0.99] group animate-in fade-in slide-in-from-bottom-2 duration-300"
                            onTouchStart={(e) => e.stopPropagation()}
                        >
                            <div className="w-5 h-5 rounded-full border border-current flex items-center justify-center group-hover:bg-foon-lime group-hover:border-foon-lime group-hover:text-bg-main transition-colors">
                                <Plus className="w-3 h-3" />
                            </div>
                            새로운 아이 등록하기
                        </button>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {
                deletingPetId && (
                    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-in fade-in duration-200" onClick={(e) => e.stopPropagation()}>
                        <div className="bg-[#1E1E20] border border-[#333] p-6 rounded-2xl w-[90%] max-w-[320px] text-center shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
                            <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
                                <Trash2 className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">정말 삭제하시겠습니까?</h3>
                            <p className="text-gray-400 text-sm mb-6 break-keep">
                                삭제된 데이터는 복구할 수 없습니다.<br />
                                신중하게 결정해주세요.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setDeletingPetId(null)}
                                    className="flex-1 py-3 rounded-xl bg-[#333] text-gray-300 font-bold hover:bg-[#444] transition-colors"
                                >
                                    취소
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="flex-1 py-3 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-900/20"
                                >
                                    삭제하기
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Pet Pass Viewer Modal */}
            {viewingPet && (
                <div className="fixed inset-0 z-[100] bg-bg-main animate-in fade-in duration-300">
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
