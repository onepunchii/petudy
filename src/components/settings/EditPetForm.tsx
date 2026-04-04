"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Camera, ChevronRight, Activity, Bone, Apple, Smile, Scale, Heart, Eye, Brain, Calendar as CalendarIcon, Hash } from "lucide-react";
import { PetFormData } from "@/actions/pet";
import DatePickerModal from "@/components/register/DatePickerModal";
import BreedSelectDrawer from "@/components/register/steps/BreedSelectDrawer";
import { updatePet } from "@/actions/pet";

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
        if (!formData.name) return alert("이름을 입력해주세요.");

        setIsSubmitting(true);
        try {
            let finalPhotoUrl = formData.photo;
            if (photoFile) {
                const { uploadPetPhoto } = await import("@/actions/storage");
                const formDataPhoto = new FormData();
                formDataPhoto.append("file", photoFile);
                const res = await uploadPetPhoto(formDataPhoto);
                if (!res.success) throw new Error(res.error || "Upload failed");
                finalPhotoUrl = res.url;
            }

            await updatePet(petId, { ...formData, photo: finalPhotoUrl } as PetFormData);

            // Invalidate cache to force refresh on Home Page
            await queryClient.invalidateQueries({ queryKey: ["pets"] });

            router.push("/");
            router.refresh();
        } catch (error) {
            console.error(error);
            alert("저장 중 오류가 발생했습니다.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-bg-main text-white relative pb-32">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-foon-lime rounded-full blur-[150px] opacity-10 pointer-events-none"></div>

            <div className="px-6 pt-6 flex flex-col gap-8 relative z-10 text-sm">

                {/* 1. Photo Section */}
                <div className="flex flex-col items-center gap-3">
                    <label className="relative cursor-pointer group">
                        <div className="w-28 h-28 rounded-full bg-[#2C2C2E] border-2 border-[#333] overflow-hidden flex items-center justify-center relative shadow-lg group-active:scale-95 transition-transform">
                            {formData.photo ? (
                                <Image src={formData.photo} alt="Profile" fill className="object-cover" />
                            ) : (
                                <span className="text-4xl">🐶</span>
                            )}
                        </div>
                        <div className="absolute bottom-0 right-0 w-8 h-8 bg-foon-lime rounded-full flex items-center justify-center text-bg-main shadow-md border-2 border-bg-main">
                            <Camera className="w-4 h-4" />
                        </div>
                        <input type="file" accept="image/*" className="hidden" onChange={handlePhotoSelect} />
                    </label>
                    <span className="text-gray-400 text-xs">프로필 사진 변경</span>
                </div>

                {/* 2. Basic Info Section */}
                <section className="space-y-4">
                    <h3 className="text-lg font-bold text-gray-200">기본 정보</h3>

                    {/* Name */}
                    <div className="space-y-2">
                        <label className="text-gray-400 text-xs pl-1">이름</label>
                        <input
                            type="text"
                            value={formData.name || ""}
                            onChange={(e) => handleChange("name", e.target.value)}
                            className="w-full bg-bg-input border border-[#333] rounded-xl px-4 py-3 text-white focus:border-foon-lime outline-none transition-colors font-medium"
                            placeholder="이름을 입력해주세요"
                        />
                    </div>

                    {/* Registraion Number */}
                    <div className="space-y-2">
                        <label className="text-gray-400 text-xs pl-1">동물등록번호 (선택)</label>
                        <div className="relative">
                            <input
                                type="text"
                                value={formData.reg_number || ""}
                                onChange={(e) => handleChange("reg_number", e.target.value)}
                                className="w-full bg-bg-input border border-[#333] rounded-xl px-4 py-3 pl-10 text-white focus:border-foon-lime outline-none transition-colors font-medium"
                                placeholder="등록번호 15자리"
                            />
                            <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        </div>
                    </div>

                    {/* Species & Gender Row */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                            <label className="text-gray-400 text-xs pl-1">종류</label>
                            <div className="flex bg-bg-input rounded-xl p-1 border border-[#333]">
                                {[
                                    { id: "dog", label: "강아지" },
                                    { id: "cat", label: "고양이" }
                                ].map(opt => (
                                    <button
                                        key={opt.id}
                                        onClick={() => handleChange("species", opt.id)}
                                        className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${formData.species === opt.id
                                            ? "bg-[#3A3A3C] text-white shadow-sm"
                                            : "text-gray-500 hover:text-gray-300"
                                            }`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-gray-400 text-xs pl-1">성별</label>
                            <div className="flex bg-bg-input rounded-xl p-1 border border-[#333]">
                                {[
                                    { id: "male", label: "남아" },
                                    { id: "female", label: "여아" }
                                ].map(opt => (
                                    <button
                                        key={opt.id}
                                        onClick={() => handleChange("gender", opt.id)}
                                        className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${formData.gender === opt.id
                                            ? (opt.id === 'male' ? "bg-blue-500/20 text-blue-400" : "bg-pink-500/20 text-pink-400")
                                            : "text-gray-500 hover:text-gray-300"
                                            }`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Breed */}
                    <div className="space-y-2">
                        <label className="text-gray-400 text-xs pl-1">품종</label>
                        <button
                            onClick={() => setIsBreedDrawerOpen(true)}
                            className="w-full bg-bg-input border border-[#333] rounded-xl px-4 py-3 text-left flex justify-between items-center group active:bg-[#252527] transition-colors"
                        >
                            <span className={formData.breed ? "text-white font-medium" : "text-gray-500"}>
                                {formData.breed || "품종을 선택해주세요"}
                            </span>
                            <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
                        </button>
                    </div>
                </section>

                <hr className="border-[#222]" />

                {/* 3. Details Section */}
                <section className="space-y-4">
                    <h3 className="text-lg font-bold text-gray-200">상세 정보</h3>

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                            <label className="text-gray-400 text-xs pl-1">생일</label>
                            <button
                                onClick={() => setOpenDateField("birth")}
                                className="w-full bg-bg-input border border-[#333] rounded-xl px-3 py-3 text-left flex items-center gap-2 group active:bg-[#252527]"
                            >
                                <CalendarIcon className="w-4 h-4 text-gray-500" />
                                <span className={formData.birth ? "text-white font-medium text-sm" : "text-gray-500 text-sm"}>
                                    {formData.birth || "선택"}
                                </span>
                            </button>
                        </div>
                        <div className="space-y-2">
                            <label className="text-gray-400 text-xs pl-1">입양일 (선택)</label>
                            <button
                                onClick={() => setOpenDateField("adoptionDate")}
                                className="w-full bg-bg-input border border-[#333] rounded-xl px-3 py-3 text-left flex items-center gap-2 group active:bg-[#252527]"
                            >
                                <CalendarIcon className="w-4 h-4 text-gray-500" />
                                <span className={formData.adoptionDate ? "text-white font-medium text-sm" : "text-gray-500 text-sm"}>
                                    {formData.adoptionDate || "선택"}
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Physical */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                            <label className="text-gray-400 text-xs pl-1">몸무게 (kg)</label>
                            <input
                                type="number"
                                value={formData.weight || ""}
                                onChange={(e) => handleChange("weight", e.target.value)}
                                className="w-full bg-bg-input border border-[#333] rounded-xl px-4 py-3 text-white focus:border-foon-lime outline-none transition-colors font-medium placeholder-gray-600"
                                placeholder="0.0"
                                step="0.1"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-gray-400 text-xs pl-1">모색</label>
                            <input
                                type="text"
                                value={formData.color || ""}
                                onChange={(e) => handleChange("color", e.target.value)}
                                className="w-full bg-bg-input border border-[#333] rounded-xl px-4 py-3 text-white focus:border-foon-lime outline-none transition-colors font-medium placeholder-gray-600"
                                placeholder="예: 갈색"
                            />
                        </div>
                    </div>

                    {/* Neuter Checkbox */}
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-bg-input border border-[#333]">
                        <input
                            type="checkbox"
                            id="neuter"
                            className="w-5 h-5 accent-foon-lime rounded cursor-pointer"
                            checked={formData.neuter === true}
                            onChange={(e) => handleChange("neuter", e.target.checked)}
                        />
                        <label htmlFor="neuter" className="text-sm font-medium text-gray-300 flex-1 cursor-pointer">
                            중성화 수술을 했어요
                        </label>
                    </div>
                </section>

                <hr className="border-[#222]" />

                {/* 4. Concerns Section */}
                <section className="space-y-4">
                    <h3 className="text-lg font-bold text-gray-200">건강 고민</h3>
                    <div className="grid grid-cols-4 gap-2">
                        <button
                            onClick={() => handleConcernChange("none")}
                            className={`col-span-4 p-3 rounded-xl border transition-all text-xs font-bold ${formData.concern?.includes("none")
                                ? "bg-foon-lime/20 border-foon-lime text-foon-lime"
                                : "bg-bg-input border-[#333] text-gray-400 hover:bg-[#252527]"
                                }`}
                        >
                            고민 없어요 (건강함)
                        </button>
                        {CONCERN_OPTIONS.map((opt) => (
                            <button
                                key={opt.value}
                                onClick={() => handleConcernChange(opt.value)}
                                className={`flex flex-col items-center justify-center gap-2 p-2 h-20 rounded-xl border transition-all ${formData.concern?.includes(opt.value)
                                    ? "bg-foon-lime/20 border-foon-lime text-foon-lime"
                                    : "bg-bg-input border-[#333] text-gray-400 hover:bg-[#252527]"
                                    }`}
                            >
                                <opt.icon className="w-5 h-5" />
                                <span className="text-[10px] font-bold text-center leading-tight">{opt.label}</span>
                            </button>
                        ))}
                    </div>
                </section>
            </div>

            {/* Sticky Bottom Button */}
            <div className="fixed bottom-0 left-0 right-0 p-4 pb-8 bg-gradient-to-t from-bg-main via-bg-main to-transparent z-50">
                <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="w-full max-w-[430px] mx-auto bg-foon-lime text-bg-main font-bold py-4 rounded-2xl shadow-[0_4px_14px_rgba(163,223,70,0.4)] active:scale-95 transition-transform disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2"
                >
                    {isSubmitting ? <span className="animate-spin text-xl">⏳</span> : "저장하기"}
                </button>
            </div>

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
