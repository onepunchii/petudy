"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Camera, Check, ChevronRight, Activity, Bone, Apple, Smile, Scale, Heart, Eye, Brain, Calendar as CalendarIcon, Hash, LoaderCircle, PawPrint } from "lucide-react";
import { PetFormData } from "@/actions/pet";
import DatePickerModal from "@/components/register/DatePickerModal";
import BreedSelectDrawer from "@/components/register/steps/BreedSelectDrawer";
import { updatePet } from "@/actions/pet";
import { APP_ICON_STROKE, AppBody, AppBottomAction, AppButton, AppSection, appChipClass, appInputClass, appLabelClass, appOptionClass } from "@/components/app/ui";
import { PET_NAME_MAX, PET_REG_NUMBER_MAX, PET_WEIGHT_MAX, PET_WEIGHT_MIN, petDatesError, regNumberError, weightError } from "@/lib/pet-rules";
import { cn } from "@/lib/utils";

/** 칸 아래 오류 문구 */
function FieldError({ id, children }: { id: string; children: React.ReactNode }) {
    return (
        <p id={id} role="alert" className="mt-1.5 text-[13px] font-semibold leading-snug text-danger">
            {children}
        </p>
    );
}
const invalidRing = "ring-2 ring-danger focus:ring-danger";

// Reuse Concern Options
const CONCERN_OPTIONS = [
    { value: "skin", label: "피부 / 알러지", icon: Activity },
    { value: "joint", label: "관절 / 뼈", icon: Bone },
    { value: "digestive", label: "소화기 / 위장", icon: Apple },
    { value: "dental", label: "치아 / 구강", icon: Smile },
    { value: "weight", label: "비만 / 체중", icon: Scale },
    { value: "heart", label: "심장 / 호흡기", icon: Heart },
    { value: "eye", label: "눈 / 귀", icon: Eye },
    { value: "behavior", label: "행동 / 분리불안", icon: Brain },
];

/** 입력창처럼 생긴 선택 버튼 (품종, 날짜) */
const pickerButtonClass = cn(appInputClass, "flex items-center gap-2 text-left transition-colors hover:bg-paper-2/60 active:bg-paper-2");

/** 큰 선택 카드 오른쪽 위 체크 (선택됨 = 남색 테두리 2px + 체크) */
function OptionCheck() {
    return (
        <span className="absolute right-2.5 top-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-night text-star" aria-hidden>
            <Check className="h-3 w-3" strokeWidth={3} />
        </span>
    );
}

interface EditPetFormProps {
    petId: string;
    initialData: Record<string, any>;
}

export default function EditPetForm({ petId, initialData }: EditPetFormProps) {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form State
    const [formData, setFormData] = useState<Partial<PetFormData>>({
        name: initialData.name || "",
        species: initialData.species || "dog",
        breed: initialData.breed || "",
        gender: initialData.gender || "male",
        neuter: initialData.neuter,
        birth: initialData.birth,
        adoptionDate: initialData.adoptionDate,
        weight: initialData.weight,
        color: initialData.color,
        concern: initialData.concern || [],
        photo: initialData.photo,
        reg_number: initialData.reg_number
    });

    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [submitError, setSubmitError] = useState<string | null>(null);

    // 입력 규칙 (등록 화면·서버와 같은 규칙)
    const nameError = !formData.name?.trim() ? "이름을 입력해 주세요" : null;
    const regError = regNumberError(formData.reg_number);
    const wError = weightError(formData.weight);
    const datesError = petDatesError({ birth: formData.birth, adoptionDate: formData.adoptionDate });
    const hasError = !!(nameError || regError || wError || datesError);

    // Modals
    const [openDateField, setOpenDateField] = useState<"birth" | "adoptionDate" | null>(null);
    const [isBreedDrawerOpen, setIsBreedDrawerOpen] = useState(false);

    // Handlers
    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleConcernChange = (value: string) => {
        setFormData(prev => {
            const current = prev.concern || [];
            if (value === "none") {
                return { ...prev, concern: current.includes("none") ? [] : ["none"] };
            }
            let newConcerns = current.filter(c => c !== "none");
            if (newConcerns.includes(value)) {
                newConcerns = newConcerns.filter(v => v !== value);
            } else {
                newConcerns.push(value);
            }
            return { ...prev, concern: newConcerns };
        });
    };

    const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                const imageCompression = (await import("browser-image-compression")).default;
                const options = { maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: true, fileType: "image/webp" };
                const compressedFile = await imageCompression(file, options);
                const webpFile = new File([compressedFile], "image.webp", { type: "image/webp" });

                setPhotoFile(webpFile);
                setFormData(prev => ({ ...prev, photo: URL.createObjectURL(webpFile) }));
            } catch (error) {
                console.error("Image compression failed:", error);
                setPhotoFile(file);
                setFormData(prev => ({ ...prev, photo: URL.createObjectURL(file) }));
            }
        }
    };

    const handleSubmit = async () => {
        if (hasError) return;

        setIsSubmitting(true);
        setSubmitError(null);
        try {
            let finalPhotoUrl = formData.photo || null;
            if (photoFile) {
                const { uploadPetPhoto } = await import("@/actions/storage");
                const formDataPhoto = new FormData();
                formDataPhoto.append("file", photoFile);
                const res = await uploadPetPhoto(formDataPhoto);
                if (!res.success) {
                    setSubmitError(res.error);
                    return;
                }
                finalPhotoUrl = res.url;
                setPhotoFile(null);
                setFormData(prev => ({ ...prev, photo: res.url }));
            }

            const result = await updatePet(petId, { ...formData, photo: finalPhotoUrl } as PetFormData);
            if (!result.success) {
                setSubmitError(result.error);
                return;
            }

            // Invalidate cache to force refresh on Home Page
            await queryClient.invalidateQueries({ queryKey: ["pets"] });

            router.push("/app");
            router.refresh();
        } catch (error) {
            console.error(error);
            setSubmitError("연결이 불안정해요. 잠시 후 다시 시도해 주세요.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="relative flex flex-1 flex-col">
            <AppBody className="flex-1 pb-4">

                {/* 1. Photo Section */}
                <div className="flex flex-col items-center gap-3">
                    <label className="group relative cursor-pointer">
                        <span className="relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-paper-2 ring-1 ring-line transition-transform group-active:translate-y-px motion-reduce:transition-none">
                            {formData.photo ? (
                                <Image src={formData.photo} alt="Profile" fill sizes="112px" className="object-cover" />
                            ) : (
                                <PawPrint className="h-10 w-10 text-ink-3" strokeWidth={APP_ICON_STROKE} aria-hidden />
                            )}
                        </span>
                        <span className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full bg-night text-star ring-[3px] ring-moon">
                            <Camera className="h-4 w-4" strokeWidth={APP_ICON_STROKE} aria-hidden />
                        </span>
                        <input type="file" accept="image/*" className="hidden" onChange={handlePhotoSelect} />
                    </label>
                    <span className="text-[13px] text-ink-3">프로필 사진 변경</span>
                </div>

                {/* 2. Basic Info Section */}
                <AppSection title="기본 정보">
                    <div className="space-y-5">

                        {/* Name */}
                        <div>
                            <label htmlFor="pet-name" className={appLabelClass}>이름</label>
                            <input
                                id="pet-name"
                                type="text"
                                maxLength={PET_NAME_MAX}
                                value={formData.name || ""}
                                onChange={(e) => handleChange("name", e.target.value)}
                                aria-invalid={!!nameError}
                                aria-describedby={nameError ? "pet-name-error" : undefined}
                                className={cn(appInputClass, "font-medium", nameError && invalidRing)}
                                placeholder="이름을 입력해주세요"
                            />
                            {nameError && <FieldError id="pet-name-error">{nameError}</FieldError>}
                        </div>

                        {/* Registraion Number */}
                        <div>
                            <label htmlFor="pet-reg-number" className={appLabelClass}>
                                동물등록번호 <span className="font-normal text-ink-3">(선택)</span>
                            </label>
                            <div className="relative">
                                <input
                                    id="pet-reg-number"
                                    type="text"
                                    inputMode="numeric"
                                    autoComplete="off"
                                    maxLength={PET_REG_NUMBER_MAX + 4}
                                    value={formData.reg_number || ""}
                                    onChange={(e) => handleChange("reg_number", e.target.value)}
                                    aria-invalid={!!regError}
                                    aria-describedby={regError ? "pet-reg-number-error" : undefined}
                                    className={cn(appInputClass, "pl-10 font-medium tabular-nums", regError && invalidRing)}
                                    placeholder="등록번호 15자리"
                                />
                                <Hash className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-3" strokeWidth={APP_ICON_STROKE} aria-hidden />
                            </div>
                            {regError && <FieldError id="pet-reg-number-error">{regError}</FieldError>}
                        </div>

                        {/* Species & Gender Row */}
                        <div className="grid grid-cols-2 gap-3">
                            <div role="group" aria-labelledby="pet-species-label">
                                <p id="pet-species-label" className={appLabelClass}>종류</p>
                                <div className="flex gap-2">
                                    {[
                                        { id: "dog", label: "강아지" },
                                        { id: "cat", label: "고양이" }
                                    ].map(opt => (
                                        <button
                                            key={opt.id}
                                            type="button"
                                            aria-pressed={formData.species === opt.id}
                                            onClick={() => handleChange("species", opt.id)}
                                            className={appChipClass(formData.species === opt.id, "h-12 flex-1 px-2")}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div role="group" aria-labelledby="pet-gender-label">
                                <p id="pet-gender-label" className={appLabelClass}>성별</p>
                                <div className="flex gap-2">
                                    {[
                                        { id: "male", label: "남아" },
                                        { id: "female", label: "여아" }
                                    ].map(opt => (
                                        <button
                                            key={opt.id}
                                            type="button"
                                            aria-pressed={formData.gender === opt.id}
                                            onClick={() => handleChange("gender", opt.id)}
                                            className={appChipClass(formData.gender === opt.id, "h-12 flex-1 px-2")}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Breed */}
                        <div>
                            <p id="pet-breed-label" className={appLabelClass}>품종</p>
                            <button
                                type="button"
                                aria-labelledby="pet-breed-label pet-breed-value"
                                onClick={() => setIsBreedDrawerOpen(true)}
                                className={cn(pickerButtonClass, "justify-between")}
                            >
                                <span id="pet-breed-value" className={formData.breed ? "truncate font-medium text-ink" : "text-ink-3"}>
                                    {formData.breed || "품종을 선택해주세요"}
                                </span>
                                <ChevronRight className="h-4 w-4 shrink-0 text-ink-3" strokeWidth={APP_ICON_STROKE} aria-hidden />
                            </button>
                        </div>
                    </div>
                </AppSection>

                {/* 3. Details Section */}
                <AppSection title="상세 정보">
                    <div className="space-y-5">

                        {/* Dates */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <p id="pet-birth-label" className={appLabelClass}>
                                    생일 <span className="font-normal text-ink-3">(선택)</span>
                                </p>
                                <button
                                    type="button"
                                    aria-labelledby="pet-birth-label pet-birth-value"
                                    onClick={() => setOpenDateField("birth")}
                                    className={cn(pickerButtonClass, "px-3.5")}
                                >
                                    <CalendarIcon className="h-4 w-4 shrink-0 text-ink-3" strokeWidth={APP_ICON_STROKE} aria-hidden />
                                    <span id="pet-birth-value" className={formData.birth ? "truncate font-medium tabular-nums text-ink" : "text-ink-3"}>
                                        {formData.birth || "선택"}
                                    </span>
                                </button>
                            </div>
                            <div>
                                <p id="pet-adoption-label" className={appLabelClass}>
                                    입양일 <span className="font-normal text-ink-3">(선택)</span>
                                </p>
                                <button
                                    type="button"
                                    aria-labelledby="pet-adoption-label pet-adoption-value"
                                    onClick={() => setOpenDateField("adoptionDate")}
                                    className={cn(pickerButtonClass, "px-3.5")}
                                >
                                    <CalendarIcon className="h-4 w-4 shrink-0 text-ink-3" strokeWidth={APP_ICON_STROKE} aria-hidden />
                                    <span id="pet-adoption-value" className={formData.adoptionDate ? "truncate font-medium tabular-nums text-ink" : "text-ink-3"}>
                                        {formData.adoptionDate || "선택"}
                                    </span>
                                </button>
                            </div>
                            {datesError && (
                                <div className="col-span-2 -mt-1">
                                    <FieldError id="pet-dates-error">{datesError}</FieldError>
                                </div>
                            )}
                            {(formData.birth || formData.adoptionDate) && (
                                <div className="col-span-2 -mt-1 flex gap-3 text-[13px] text-ink-3">
                                    {formData.birth && (
                                        <button type="button" onClick={() => handleChange("birth", null)} className="underline underline-offset-2 hover:text-ink">
                                            생일 지우기
                                        </button>
                                    )}
                                    {formData.adoptionDate && (
                                        <button type="button" onClick={() => handleChange("adoptionDate", null)} className="underline underline-offset-2 hover:text-ink">
                                            입양일 지우기
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Physical */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label htmlFor="pet-weight" className={appLabelClass}>몸무게 (kg)</label>
                                <input
                                    id="pet-weight"
                                    type="number"
                                    inputMode="decimal"
                                    min={PET_WEIGHT_MIN}
                                    max={PET_WEIGHT_MAX}
                                    value={formData.weight || ""}
                                    onChange={(e) => handleChange("weight", e.target.value)}
                                    aria-invalid={!!wError}
                                    aria-describedby={wError ? "pet-weight-error" : undefined}
                                    className={cn(appInputClass, "font-medium tabular-nums", wError && invalidRing)}
                                    placeholder="0.0"
                                    step="0.1"
                                />
                                {wError && <FieldError id="pet-weight-error">{wError}</FieldError>}
                            </div>
                            <div>
                                <label htmlFor="pet-color" className={appLabelClass}>모색</label>
                                <input
                                    id="pet-color"
                                    type="text"
                                    value={formData.color || ""}
                                    onChange={(e) => handleChange("color", e.target.value)}
                                    className={cn(appInputClass, "font-medium")}
                                    placeholder="예: 갈색"
                                />
                            </div>
                        </div>

                        {/* Neuter Checkbox */}
                        <div className="flex min-h-12 items-center gap-3 rounded-xl bg-pass px-4 py-3 ring-1 ring-inset ring-line">
                            <input
                                type="checkbox"
                                id="neuter"
                                className="h-5 w-5 cursor-pointer rounded accent-night"
                                checked={formData.neuter === true}
                                onChange={(e) => handleChange("neuter", e.target.checked)}
                            />
                            <label htmlFor="neuter" className="flex-1 cursor-pointer text-[15px] font-medium text-ink">
                                중성화 수술을 했어요
                            </label>
                        </div>
                    </div>
                </AppSection>

                {/* 4. Concerns Section */}
                <AppSection title="건강 고민">
                    <div className="grid grid-cols-2 gap-2.5">
                        <button
                            type="button"
                            aria-pressed={!!formData.concern?.includes("none")}
                            onClick={() => handleConcernChange("none")}
                            className={appOptionClass(!!formData.concern?.includes("none"), "relative col-span-2 min-h-[52px] py-3 pr-10 text-[14px] font-semibold text-ink")}
                        >
                            고민 없어요 (건강함)
                            {formData.concern?.includes("none") && <OptionCheck />}
                        </button>
                        {CONCERN_OPTIONS.map((opt) => {
                            const selected = !!formData.concern?.includes(opt.value);
                            return (
                                <button
                                    key={opt.value}
                                    type="button"
                                    aria-pressed={selected}
                                    onClick={() => handleConcernChange(opt.value)}
                                    className={appOptionClass(selected, "relative flex min-h-[60px] items-center gap-2.5 py-3 pr-9")}
                                >
                                    <opt.icon className={cn("h-5 w-5 shrink-0", selected ? "text-ink" : "text-ink-3")} strokeWidth={APP_ICON_STROKE} aria-hidden />
                                    <span className="min-w-0 text-[14px] font-semibold leading-snug text-ink">{opt.label}</span>
                                    {selected && <OptionCheck />}
                                </button>
                            );
                        })}
                    </div>
                </AppSection>
            </AppBody>

            {/* Sticky Bottom Button */}
            <AppBottomAction>
                {submitError && (
                    <p role="alert" className="mb-3 rounded-xl bg-pass px-4 py-3 text-[14px] font-semibold leading-snug text-danger ring-1 ring-inset ring-danger/30">
                        {submitError}
                    </p>
                )}
                <AppButton
                    variant="primary"
                    size="lg"
                    block
                    onClick={handleSubmit}
                    disabled={isSubmitting || hasError}
                >
                    {isSubmitting ? (
                        <>
                            <LoaderCircle className="h-5 w-5 animate-spin motion-reduce:animate-none" strokeWidth={APP_ICON_STROKE} aria-hidden />
                            <span className="sr-only">저장 중</span>
                        </>
                    ) : "저장하기"}
                </AppButton>
            </AppBottomAction>

            {/* Drawers & Modals */}
            <DatePickerModal
                isOpen={!!openDateField}
                onClose={() => setOpenDateField(null)}
                title={openDateField === "adoptionDate" ? "입양일 선택" : "생일 선택"}
                onSelect={(date) => {
                    if (openDateField) handleChange(openDateField, date);
                    setOpenDateField(null);
                }}
                initialDate={openDateField ? (formData[openDateField] || undefined) : undefined}
            />

            <BreedSelectDrawer
                isOpen={isBreedDrawerOpen}
                onClose={() => setIsBreedDrawerOpen(false)}
                onSelect={(breed) => handleChange("breed", breed)}
                species={(formData.species as "dog" | "cat") || "dog"}
            />
        </div>
    );
}
