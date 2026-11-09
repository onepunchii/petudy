"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { PetActionResult, PetFormData } from "@/actions/pet";
import { APP_ICON_STROKE, AppBody, AppBottomAction, AppButton, AppProgress, AppTopBar, appBackButtonClass } from "@/components/app/ui";
import { petDatesError, petNameError, weightError } from "@/lib/pet-rules";
import { PET_PHOTO_READ_ERROR, preparePetPhoto } from "@/lib/prepare-pet-photo";
import { cn } from "@/lib/utils";

// Components
import RegistrationSuccess3D from "./RegistrationSuccess3D";
import ImportRegistrationModal from "./ImportRegistrationModal";
import DatePickerModal from "./DatePickerModal";

// Step Components
import StepBasicInfo from "./steps/StepBasicInfo";
import StepGender from "./steps/StepGender";
import StepDate from "./steps/StepDate";
import StepPhysical from "./steps/StepPhysical";
import StepConcerns from "./steps/StepConcerns";
import StepPhoto from "./steps/StepPhoto";
import StepReview from "./steps/StepReview";

// Step ID List for Navigation Order
const STEP_IDS = [
    "name",
    "species",
    "breed",
    "gender",
    "birth", // Includes adoption date in the same UI
    "weight",
    "color",
    "concern",
    "photo",
    "review"
] as const;

type StepId = typeof STEP_IDS[number];

interface RegistrationWizardProps {
    onComplete?: () => void;
    initialData?: Record<string, any>;
    isEditMode?: boolean;
    petId?: string;
}

export default function RegistrationWizard({
    onComplete,
    initialData,
    isEditMode = false,
    petId
}: RegistrationWizardProps) {
    const router = useRouter();
    const queryClient = useQueryClient();

    // -------------------------------------------------------------------------
    // 1. State Management
    // -------------------------------------------------------------------------
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [formData, setFormData] = useState<Partial<PetFormData>>(initialData || {
        neuter: null, // Initialize strict null for boolean
        concern: []
    });
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    /** 사진을 줄이는 중이면 '다음'을 막습니다 (끝나기 전에 넘어가면 사진이 빠짐) */
    const [isPhotoBusy, setIsPhotoBusy] = useState(false);
    const [photoError, setPhotoError] = useState<string | null>(null);
    const [createdPetId, setCreatedPetId] = useState<string | null>(null);

    // Modals
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [openDateField, setOpenDateField] = useState<"birth" | "adoptionDate" | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    /** 저장 실패 문구 (버튼 위에 보여 줍니다). auth 면 로그인 링크를 함께 보여 줍니다 */
    const [submitError, setSubmitError] = useState<{ message: string; needsLogin: boolean } | null>(null);

    // State for Breed Selection Drawer (Lifted up to control footer visibility)
    const [isBreedDrawerOpen, setIsBreedDrawerOpen] = useState(false);

    // Derived State
    const currentStepId = STEP_IDS[currentStepIndex];
    const isFirstStep = currentStepIndex === 0;
    const isLastStep = currentStepIndex === STEP_IDS.length - 1;

    // -------------------------------------------------------------------------
    // 2. Handlers
    // -------------------------------------------------------------------------

    // Unified Change Handler
    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Sub-handlers
    const handleConcernChange = (value: string) => {
        setFormData(prev => {
            const current: string[] = prev.concern || [];
            if (value === "none") {
                return { ...prev, concern: current.includes("none") ? [] : ["none"] };
            }
            if (current.includes("none")) {
                return { ...prev, concern: [value] };
            }
            if (current.includes(value)) {
                return { ...prev, concern: current.filter(v => v !== value) };
            }
            return { ...prev, concern: [...current, value] };
        });
    };

    /** 미리보기 주소를 바꾸고, 앞서 만든 임시 주소(blob:)는 정리합니다 */
    const setPhotoPreview = (url: string | null) => {
        // 사진을 준비하는 동안에는 사진을 바꿀 수 없으므로 지금 화면의 주소가 곧 앞서 만든 주소입니다
        const previous = formData.photo;
        if (previous?.startsWith("blob:")) URL.revokeObjectURL(previous);
        setFormData(prev => ({ ...prev, photo: url }));
    };

    const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        e.target.value = ""; // 같은 사진을 다시 골라도 다시 확인하도록
        if (!file) return;

        setPhotoError(null);
        setIsPhotoBusy(true);
        try {
            // 고른 자리에서 줄이고 형식·크기를 확인합니다. 못 쓰는 사진은 여기서 바로 알려 주고, 앞서 고른 사진은 그대로 둡니다
            const prepared = await preparePetPhoto(file);
            if (!prepared.ok) {
                setPhotoError(prepared.error);
                return;
            }
            setPhotoFile(prepared.file);
            setPhotoPreview(URL.createObjectURL(prepared.file));
        } catch (error) {
            // preparePetPhoto 는 문구를 돌려주지만, 그 밖의 뜻밖의 오류에도 안내 없이 끝나지 않게 합니다
            console.error("Photo select failed:", error);
            setPhotoError(PET_PHOTO_READ_ERROR);
        } finally {
            setIsPhotoBusy(false);
        }
    };

    const handlePhotoRemove = () => {
        if (isSubmitting) return;
        setPhotoFile(null);
        setPhotoError(null);
        setPhotoPreview(null);
    };

    const handleImport = (data: any) => {
        setFormData(prev => ({
            ...prev,
            reg_number: data.regNumber,
            name: data.petName || prev.name,
            species: data.species || prev.species,
            breed: data.breed || prev.breed,
            gender: data.gender || prev.gender,
            // 등록 정보의 중성화 여부는 true/false 로 옵니다. 알 수 없으면(null) 지금 값을 그대로 둡니다
            neuter: typeof data.neuter === "boolean" ? data.neuter : prev.neuter,
        }));
        setIsImportModalOpen(false);
        alert(`동물등록번호(${data.regNumber}) 정보가 입력되었습니다!`);
    };

    const handleDateSelect = (date: string) => {
        if (openDateField) {
            setFormData(prev => ({ ...prev, [openDateField]: date }));
            setOpenDateField(null);
        }
    };

    const handleDateClear = (field: "birth" | "adoptionDate") => {
        setFormData(prev => ({ ...prev, [field]: null }));
    };

    // -------------------------------------------------------------------------
    // 3. Navigation & Submission
    // -------------------------------------------------------------------------
    const handleNext = async () => {
        if (isLastStep) {
            await handleSubmit();
        } else {
            setCurrentStepIndex(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        // 등록하는 중에는 이전 단계로 가서 사진·입력을 바꿀 수 없게 합니다 (이미 보낸 값과 화면이 달라짐)
        if (isSubmitting) return;
        setSubmitError(null);
        if (!isFirstStep) setCurrentStepIndex(prev => prev - 1);
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setSubmitError(null);
        try {
            // 사진 올리기 (한 번 올린 뒤 다시 시도할 때는 올린 주소를 그대로 씁니다)
            let finalPhotoUrl = formData.photo || null;
            if (photoFile) {
                const { uploadPetPhoto } = await import("@/actions/storage");
                const formDataPhoto = new FormData();
                formDataPhoto.append("file", photoFile);
                const res = await uploadPetPhoto(formDataPhoto);
                if (!res.success) {
                    setSubmitError({ message: res.error, needsLogin: res.code === "auth" });
                    return;
                }
                finalPhotoUrl = res.url;
                setPhotoFile(null);
                setFormData(prev => ({ ...prev, photo: res.url }));
            }

            const payload: PetFormData = {
                name: formData.name ?? "",
                species: formData.species || "dog",
                breed: formData.breed || null,
                gender: formData.gender ?? "male",
                neuter: formData.neuter ?? null,
                birth: formData.birth || null,
                weight: formData.weight || null,
                color: formData.color || null,
                concern: formData.concern || [],
                photo: finalPhotoUrl,
                reg_number: formData.reg_number || null,
                adoptionDate: formData.adoptionDate || null,
            };

            const { createPet, updatePet } = await import("@/actions/pet");
            const result: PetActionResult = isEditMode && petId ? await updatePet(petId, payload) : await createPet(payload);

            if (!result.success) {
                setSubmitError({ message: result.error, needsLogin: result.code === "auth" });
                return;
            }
            if (result.petId && !isEditMode) setCreatedPetId(result.petId);

            // 홈·아이 선택 시트의 목록을 바로 새로 받습니다 (기본 캐시 60초를 기다리지 않음)
            await queryClient.invalidateQueries({ queryKey: ["pets"] });
            setIsCompleted(true);
        } catch (error) {
            // 네트워크 끊김 등 서버 액션 호출 자체가 실패한 경우
            console.error(error);
            setSubmitError({ message: "연결이 불안정해요. 잠시 후 다시 시도해 주세요.", needsLogin: false });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Validation
    const isStepValid = () => {
        switch (currentStepId) {
            case "name": return !petNameError(formData.name);
            case "species": return !!formData.species;
            case "breed": return !!formData.breed;
            case "gender": return !!formData.gender;
            case "birth": return !petDatesError({ birth: formData.birth, adoptionDate: formData.adoptionDate }); // 선택 항목, 고르면 규칙 확인
            case "weight": return !!formData.weight && !weightError(formData.weight);
            case "color": return !!formData.color;
            case "concern": return formData.concern && formData.concern.length > 0;
            case "photo": return !isPhotoBusy; // 선택 항목. 사진을 준비하는 동안만 막습니다
            case "review": return true;
            default: return false;
        }
    };

    // -------------------------------------------------------------------------
    // 4. Render
    // -------------------------------------------------------------------------

    if (isCompleted) {
        return (
            <RegistrationSuccess3D
                onComplete={() => router.push("/mypage#my-pets")}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formData={formData as any}
                petId={createdPetId || petId}
            />
        );
    }

    const renderStepContent = () => {
        // We cast formData to any here because step components define their own precise interfaces
        // but the state is a Partial<PetFormData>. The runtime values match.

        switch (currentStepId) {
            case "name":
            case "species":
            case "breed":
                return (
                    <StepBasicInfo
                        stepId={currentStepId}
                        formData={{
                            ...formData,
                            name: formData.name || "",
                            species: formData.species || null, // Removed default "dog"
                            breed: formData.breed || null,
                        }}
                        onChange={handleChange}
                        // 빈칸일 때는 버튼만 막고, 글자 수를 넘었을 때(불러온 이름 등)만 문구를 보여 줍니다
                        nameError={formData.name?.trim() ? petNameError(formData.name) : null}
                        onOpenImport={() => setIsImportModalOpen(true)}
                        isBreedDrawerOpen={isBreedDrawerOpen}
                        onBreedDrawerOpenChange={setIsBreedDrawerOpen}
                    />
                );
            case "gender":
                return (
                    <StepGender
                        formData={{
                            ...formData,
                            gender: formData.gender, // Removed fallback "male"
                            neuter: formData.neuter ?? null
                        }}
                        onChange={handleChange}
                    />
                );
            case "birth":
                return (
                    <StepDate
                        formData={{ ...formData, birth: formData.birth || undefined, adoptionDate: formData.adoptionDate || undefined }}
                        onOpenPicker={setOpenDateField}
                        onClear={handleDateClear}
                        error={petDatesError({ birth: formData.birth, adoptionDate: formData.adoptionDate })}
                    />
                );
            case "weight":
            case "color": // Added color case
                return (
                    <StepPhysical
                        stepId={currentStepId as "weight" | "color"}
                        formData={{
                            ...formData,
                            weight: formData.weight || undefined,
                            color: formData.color || undefined
                        }}
                        onChange={handleChange}
                    />
                );
            case "concern":
                return <StepConcerns formData={{ ...formData, concern: formData.concern || [] }} onChange={handleConcernChange} />;
            case "photo":
                return (
                    <StepPhoto
                        formData={{ ...formData, photo: formData.photo || undefined }}
                        onFileSelect={handlePhotoSelect}
                        onRemove={handlePhotoRemove}
                        busy={isPhotoBusy}
                        error={photoError}
                        disabled={isSubmitting}
                    />
                );
            case "review":
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                return <StepReview formData={formData as any} />;
            default:
                return null;
        }
    };

    return (
        <div className="flex flex-1 flex-col bg-moon text-ink">
            {/* Modals */}
            <ImportRegistrationModal
                isOpen={isImportModalOpen}
                onClose={() => setIsImportModalOpen(false)}
                onImport={handleImport}
            />
            <DatePickerModal
                isOpen={!!openDateField}
                onClose={() => setOpenDateField(null)}
                title={openDateField === "adoptionDate" ? "입양일 선택" : "생일 선택"}
                onSelect={handleDateSelect}
                initialDate={openDateField ? (formData[openDateField] || undefined) : undefined}
            />

            {/* Header: 첫 단계는 내 정보의 내 아이 목록으로 닫기(X), 이후 단계는 이전 단계로 + 진행 표시 */}
            <AppTopBar
                title={isEditMode ? "반려가족 수정" : "펫패스 만들기"}
                leading={
                    isFirstStep ? (
                        <Link href="/mypage#my-pets" aria-label="닫기" className={appBackButtonClass("onNight", "ml-0")}>
                            <X className="h-6 w-6" strokeWidth={APP_ICON_STROKE} aria-hidden />
                        </Link>
                    ) : undefined
                }
                onBack={isFirstStep ? undefined : handlePrev}
                backDisabled={isSubmitting}
                backLabel="이전 단계"
                action={
                    <span className="shrink-0 pr-2 text-[13px] font-semibold tabular-nums text-star-3">
                        {currentStepIndex + 1}/{STEP_IDS.length}
                    </span>
                }
            >
                <AppProgress value={(currentStepIndex + 1) / STEP_IDS.length} />
            </AppTopBar>

            {/* Main Content */}
            <AppBody className="flex flex-1 flex-col pb-4 pt-8">{renderStepContent()}</AppBody>

            {/* Bottom Navigation - Hidden when Breed Drawer is Open */}
            <AppBottomAction
                className={cn(
                    "transition-transform duration-300 motion-reduce:transition-none",
                    isBreedDrawerOpen ? "translate-y-full" : "translate-y-0",
                )}
            >
                {submitError && (
                    <div role="alert" className="mb-3 rounded-xl bg-pass px-4 py-3 text-[14px] font-semibold leading-snug text-danger ring-1 ring-inset ring-danger/30">
                        {submitError.message}
                        {submitError.needsLogin && (
                            <Link href="/login?next=%2Fregister" className="ml-2 font-bold text-ink underline underline-offset-2">
                                로그인하기
                            </Link>
                        )}
                    </div>
                )}
                <div className="flex items-center gap-3">
                    {!isFirstStep && (
                        <AppButton variant="secondary" size="lg" onClick={handlePrev} disabled={isSubmitting} aria-label="이전 단계" className="w-14 shrink-0 px-0">
                            <ChevronLeft className="h-6 w-6" strokeWidth={APP_ICON_STROKE} aria-hidden />
                        </AppButton>
                    )}
                    <AppButton variant="accent" size="lg" onClick={handleNext} disabled={!isStepValid() || isSubmitting} className="flex-1 font-bold">
                        {isSubmitting ? "처리중..." : isLastStep ? "등록 완료" : "다음"}
                        {!isLastStep && <ChevronRight className="h-5 w-5" strokeWidth={APP_ICON_STROKE} aria-hidden />}
                    </AppButton>
                </div>
            </AppBottomAction>
        </div>
    );
}
