"use client";

import { useEffect, useState } from "react";
import { X, Camera, Image as ImageIcon } from "lucide-react";

import { getPets } from "@/actions/pet";

interface Pet {
    id: string;
    name: string;
    photo_url: string | null;
    breed: string | null;
}

interface UploadEntrySheetProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: { petId: string; image: File | null; caption: string }) => Promise<void>;
}

export function UploadEntrySheet({ isOpen, onClose, onSubmit }: UploadEntrySheetProps) {
    const [shouldRender, setShouldRender] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [caption, setCaption] = useState("");
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    // Pet Selection
    const [pets, setPets] = useState<Pet[]>([]);
    const [selectedPet, setSelectedPet] = useState<Pet | null>(null);

    useEffect(() => {
        if (isOpen) {
            setShouldRender(true);
            const timer = setTimeout(() => setIsVisible(true), 10);

            // Fetch Pets
            getPets().then(data => {
                if (data && data.length > 0) {
                    setPets(data);
                    setSelectedPet(data[0]);
                }
            });

            return () => clearTimeout(timer);
        } else {
            setIsVisible(false);
            const timer = setTimeout(() => setShouldRender(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCreateSubmit = async () => {
        if (!selectedPet || !imageFile) return;

        setLoading(true);
        try {
            await onSubmit({ petId: selectedPet.id, image: imageFile, caption });
            setCaption("");
            setSelectedImage(null);
            setImageFile(null);
            onClose();
        } catch (error) {
            console.error(error);
            alert("업로드에 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };

    if (!shouldRender) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-end justify-center">
            {/* Backdrop */}
            <div
                className={`absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${isVisible ? "opacity-100" : "opacity-0"
                    }`}
                onClick={onClose}
            />

            {/* Bottom Sheet */}
            <div
                className={`w-full max-w-[480px] bg-bg-card rounded-t-[32px] p-6 pb-10 relative z-10 transition-transform duration-300 transform border-t border-[#333] max-h-[90vh] overflow-y-auto ${isVisible ? "translate-y-0" : "translate-y-full"
                    }`}
                style={{ transitionTimingFunction: "cubic-bezier(0.32, 0.72, 0, 1)" }}
            >
                {/* Handle Bar */}
                <div className="w-10 h-1 bg-gray-600 rounded-full mx-auto mb-6"></div>

                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white">콘테스트 참여하기</h3>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" strokeWidth={3} />
                    </button>
                </div>

                <div className="space-y-6">
                    {/* Pet Selection */}
                    <div>
                        <label className="block text-sm font-bold text-gray-400 mb-2">참여할 아이</label>
                        {pets.length > 0 && selectedPet ? (
                            <div className="flex items-center gap-3 p-3 bg-bg-input border border-[#333] rounded-2xl">
                                <div className="w-10 h-10 bg-bg-card rounded-full flex items-center justify-center text-lg shadow-sm border border-[#333] overflow-hidden">
                                    {selectedPet.photo_url ? (
                                        <img src={selectedPet.photo_url} alt={selectedPet.name} className="w-full h-full object-cover" />
                                    ) : "🐶"}
                                </div>
                                <div className="flex-1">
                                    <p className="font-bold text-white">{selectedPet.name}</p>
                                    <p className="text-xs text-foon-lime font-medium">{selectedPet.breed || "대표 반려동물"}</p>
                                </div>
                                {/* Simple toggle for demo or fetch list */}
                                {pets.length > 1 && (
                                    <button
                                        onClick={() => {
                                            const currentIndex = pets.findIndex(p => p.id === selectedPet.id);
                                            const nextIndex = (currentIndex + 1) % pets.length;
                                            setSelectedPet(pets[nextIndex]);
                                        }}
                                        className="text-xs text-gray-500 underline hover:text-gray-300"
                                    >
                                        변경
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="text-gray-500 text-sm">반려동물을 등록해주세요.</div>
                        )}
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-bold text-gray-400 mb-2">사진 업로드</label>
                        <div className="relative aspect-[4/3] w-full bg-bg-input border-2 border-dashed border-[#444] rounded-2xl flex flex-col items-center justify-center overflow-hidden hover:bg-[#333] transition-colors group">
                            {selectedImage ? (
                                <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <>
                                    <div className="w-12 h-12 bg-[#2C2C2E] rounded-full flex items-center justify-center shadow-sm mb-3 group-hover:scale-110 transition-transform border border-[#333]">
                                        <ImageIcon className="w-6 h-6 text-gray-400" />
                                    </div>
                                    <p className="text-sm text-gray-500 font-medium">사진을 선택해주세요</p>
                                </>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                onChange={handleImageChange}
                            />
                        </div>
                    </div>

                    {/* Caption */}
                    <div>
                        <label className="block text-sm font-bold text-gray-400 mb-2">한마디 (50자)</label>
                        <input
                            type="text"
                            placeholder="우리 아이의 매력을 자랑해주세요!"
                            className="w-full p-4 bg-bg-input border border-[#333] rounded-xl focus:outline-none focus:border-foon-lime focus:ring-1 focus:ring-foon-lime transition-all font-medium text-white placeholder-gray-600"
                            maxLength={50}
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                        />
                        <div className="text-right mt-2 text-xs text-gray-500">
                            {caption.length}/50
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        className="w-full bg-foon-lime text-bg-main font-bold py-4 rounded-xl text-lg shadow-[0_4px_14px_rgba(163,223,70,0.4)] hover:bg-[#bbf080] active:scale-[0.98] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        disabled={!selectedImage || !caption}
                        onClick={handleCreateSubmit}
                    >
                        참여 완료하기
                    </button>
                </div>
            </div>
        </div>
    );
}
