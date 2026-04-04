"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { PetFormData } from "@/actions/pet";

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

    // -------------------------------------------------------------------------
    // 1. State Management
    // -------------------------------------------------------------------------
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [formData, setFormData] = useState<Partial<PetFormData>>(initialData || {
        neuter: null, // Initialize strict null for boolean
        concern: []
    });
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [createdPetId, setCreatedPetId] = useState<string | null>(null);

    // Modals
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [openDateField, setOpenDateField] = useState<"birth" | "adoptionDate" | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);

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

    const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                // Dynamic import to avoid SSR issues with browser-image-compression
                const imageCompression = (await import("browser-image-compression")).default;

                const options = {
                    maxSizeMB: 1, // Max size 1MB
                    maxWidthOrHeight: 1920, // Max dimension
                    useWebWorker: true,
                    fileType: "image/webp" // Force convert to WebP
                };

                const compressedFile = await imageCompression(file, options);

                // Create a new File object with .webp extension to ensure consistency
                const webpFile = new File([compressedFile], "image.webp", { type: "image/webp" });

                setPhotoFile(webpFile);
                setFormData(prev => ({ ...prev, photo: URL.createObjectURL(webpFile) }));
            } catch (error) {
                console.error("Image compression failed:", error);
                // Fallback to original file if compression fails
                setPhotoFile(file);
                setFormData(prev => ({ ...prev, photo: URL.createObjectURL(file) }));
            }
        }
    };

    const handleImport = (data: any) => {
        setFormData(prev => ({
            ...prev,
            reg_number: data.regNumber,
            name: data.petName || prev.name,
            species: data.species || prev.species,
            breed: data.breed || prev.breed,
            gender: data.gender || prev.gender,
            neuter: data.neuter === "yes" ? true : data.neuter === "no" ? false : prev.neuter, // Convert imported string to boolean
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
        if (!isFirstStep) setCurrentStepIndex(prev => prev - 1);
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            // Photo Upload
            let finalPhotoUrl = formData.photo;
            if (photoFile) {
                const { uploadPetPhoto } = await import("@/actions/storage");
                const formDataPhoto = new FormData();
                formDataPhoto.append("file", photoFile);
                const res = await uploadPetPhoto(formDataPhoto);
                if (!res.success) throw new Error(res.error || "Upload failed");
                finalPhotoUrl = res.url;
            }

            // Payload Construction
            const payload = {
                name: formData.name,
                species: formData.species || "dog",
                breed: formData.breed || null,
                gender: formData.gender,
                neuter: formData.neuter, // Boolean
                birth: formData.birth || null,
                weight: formData.weight || null,
                color: formData.color || null,
                concern: formData.concern || [],
                photo: finalPhotoUrl,
                reg_number: formData.reg_number || null,
                adoptionDate: formData.adoptionDate || null,
            };

            const { createPet, updatePet } = await import("@/actions/pet");

            if (isEditMode && petId) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                await updatePet(petId, payload as any);
            } else {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const result = await createPet(payload as any);
                if (result && result.petId) {
                    setCreatedPetId(result.petId);
                }
            }

            // Update local state with the uploaded photo URL so the Success Screen can use it for OG generation
            if (finalPhotoUrl) {
                setFormData(prev => ({ ...prev, photo: finalPhotoUrl }));
            }

            setIsCompleted(true);
        } catch (error) {
            console.error(error);
            alert("처리 중 오류가 발생했습니다: " + (error as Error).message);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Validation
    const isStepValid = () => {
        switch (currentStepId) {
            case "name": return !!formData.name;
            case "species": return !!formData.species;
            case "breed": return !!formData.breed;
            case "gender": return !!formData.gender;
            case "birth": return true; // Optional
            case "weight": return !!formData.weight;
            case "color": return !!formData.color;
            case "concern": return formData.concern && formData.concern.length > 0;
            case "photo": return true; // Optional
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
                onComplete={() => router.push("/")}
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
                return <StepDate formData={{ ...formData, birth: formData.birth || undefined, adoptionDate: formData.adoptionDate || undefined }} onOpenPicker={setOpenDateField} />;
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
                return <StepPhoto formData={{ ...formData, photo: formData.photo || undefined }} onFileSelect={handlePhotoSelect} />;
            case "review":
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                return <StepReview formData={formData as any} />;
            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col h-full w-full absolute inset-0 bg-bg-main touch-none text-white overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-foon-lime rounded-full blur-[150px] opacity-10 pointer-events-none"></div>

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

            {/* Header */}
            <header className="px-4 py-2 flex items-center justify-between sticky top-0 z-10 w-full max-w-[430px] mx-auto">
                <div className="flex items-center gap-2">
                    {isFirstStep ? (
                        <Link href="/">
                            <X className="w-6 h-6 text-gray-400 hover:text-white transition-colors" />
                        </Link>
                    ) : (
                        <button onClick={handlePrev} className="p-1 rounded-full hover:bg-white/10 transition-colors">
                            <ChevronLeft className="w-6 h-6 text-gray-300" />
                        </button>
                    )}
                </div>
                {/* Progress Bar */}
                <div className="flex gap-1">
                    {STEP_IDS.map((id, i) => (
                        <div
                            key={id}
                            className={`h-1.5 rounded-full transition-all duration-300 ${i <= currentStepIndex ? "w-6 bg-foon-lime shadow-[0_0_10px_#A3DF46]" : "w-1.5 bg-[#333]"
                                } `}
                        />
                    ))}
                </div>
                <div className="w-6" />
            </header>

            {/* Main Content */}
            <main className="flex-1 px-6 flex flex-col justify-center max-w-[430px] mx-auto w-full pb-20 relative z-0">
                <div className="p-8 rounded-[32px] bg-bg-card border border-[#333] shadow-lg animate-fade-in-up min-h-[400px]">
                    {renderStepContent()}
                </div>
            </main>

            {/* Bottom Navigation - Hidden when Breed Drawer is Open */}
            <div
                className={`absolute bottom-0 w-full p-4 pb-10 flex justify-center z-50 transition-transform duration-300 ${isBreedDrawerOpen ? "translate-y-full" : "translate-y-0"
                    }`}
            >
                <div className="w-full max-w-[430px] flex items-center justify-center gap-3">
                    {!isFirstStep && (
                        <button
                            onClick={handlePrev}
                            className="w-14 h-14 rounded-2xl bg-[#2C2C2E] border border-[#333] flex items-center justify-center text-gray-400 hover:bg-[#3A3A3D] transition-colors hover:text-white"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                    )}
                    <button
                        onClick={handleNext}
                        disabled={!isStepValid() || isSubmitting}
                        className={`h-14 rounded-2xl font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-2 flex-1 ${isStepValid()
                            ? "bg-foon-lime text-bg-main shadow-[0_4px_14px_rgba(163,223,70,0.4)] active:scale-[0.98]"
                            : "bg-[#2C2C2E] text-gray-600 border border-[#333] cursor-not-allowed"
                            } `}
                    >
                        {isSubmitting ? "처리중..." : isLastStep ? "등록 완료" : "다음"}
                        {!isLastStep && <ChevronRight className="w-5 h-5" />}
                    </button>
                </div>
            </div>
        </div>
    );
}

