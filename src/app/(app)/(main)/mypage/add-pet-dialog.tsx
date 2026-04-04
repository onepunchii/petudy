"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { addPetAction } from "@/actions/user";
import { cn } from "@/lib/utils";

export function AddPetDialog() {
    const [isOpen, setIsOpen] = useState(false);
    const [isPending, setIsPending] = useState(false);

    async function handleSubmit(formData: FormData) {
        setIsPending(true);
        try {
            const res = await addPetAction(formData);
            if (res?.success) {
                setIsOpen(false);
            }
        } finally {
            setIsPending(false);
        }
    }

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-1.5 text-foon-lime font-bold text-sm bg-foon-lime/10 px-3 py-1.5 rounded-full border border-foon-lime/20 hover:bg-foon-lime/20 transition-all"
            >
                <Plus size={14} />
                추가하기
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-[#1E1E20] border border-[#333] rounded-[24px] w-full max-w-sm p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                        >
                            <X size={24} />
                        </button>
                        <h3 className="text-xl font-bold mb-6 text-white">반려동물 등록</h3>

                        <form action={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-1.5 ml-1">
                                    이름
                                </label>
                                <input
                                    name="name"
                                    type="text"
                                    required
                                    placeholder="예: 뽀삐"
                                    className="w-full px-4 py-3 bg-[#2C2C2E] border border-[#333] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-foon-lime focus:ring-1 focus:ring-foon-lime transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-1.5 ml-1">
                                    종류
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    <label className="cursor-pointer group">
                                        <input type="radio" name="type" value="dog" className="peer sr-only" defaultChecked />
                                        <div className="text-center py-3 rounded-xl border border-[#333] bg-[#2C2C2E] text-gray-400 peer-checked:bg-foon-lime/10 peer-checked:border-foon-lime peer-checked:text-foon-lime font-bold transition-all group-hover:bg-[#333]">
                                            강아지
                                        </div>
                                    </label>
                                    <label className="cursor-pointer group">
                                        <input type="radio" name="type" value="cat" className="peer sr-only" />
                                        <div className="text-center py-3 rounded-xl border border-[#333] bg-[#2C2C2E] text-gray-400 peer-checked:bg-foon-lime/10 peer-checked:border-foon-lime peer-checked:text-foon-lime font-bold transition-all group-hover:bg-[#333]">
                                            고양이
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-1.5 ml-1">
                                    품종
                                </label>
                                <input
                                    name="breed"
                                    type="text"
                                    required
                                    placeholder="예: 말티즈"
                                    className="w-full px-4 py-3 bg-[#2C2C2E] border border-[#333] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-foon-lime focus:ring-1 focus:ring-foon-lime transition-all"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 mb-1.5 ml-1">
                                        생년월일
                                    </label>
                                    <input
                                        name="birthDate"
                                        type="date"
                                        required
                                        className="w-full px-4 py-3 bg-[#2C2C2E] border border-[#333] rounded-xl text-white focus:outline-none focus:border-foon-lime focus:ring-1 focus:ring-foon-lime transition-all [color-scheme:dark]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 mb-1.5 ml-1">
                                        성별
                                    </label>
                                    <div className="relative">
                                        <select name="gender" className="w-full px-4 py-3 bg-[#2C2C2E] border border-[#333] rounded-xl text-white appearance-none focus:outline-none focus:border-foon-lime focus:ring-1 focus:ring-foon-lime transition-all">
                                            <option value="MALE">수컷</option>
                                            <option value="FEMALE">암컷</option>
                                        </select>
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-1.5 ml-1">
                                    중성화 여부
                                </label>
                                <div className="flex bg-[#2C2C2E] rounded-xl p-1 border border-[#333]">
                                    <label className="flex-1 cursor-pointer">
                                        <input type="radio" name="neutered" value="Y" className="peer sr-only" defaultChecked />
                                        <div className="text-center py-2 rounded-lg text-sm text-gray-400 peer-checked:bg-[#3A3A3D] peer-checked:text-white font-bold transition-all">
                                            예
                                        </div>
                                    </label>
                                    <label className="flex-1 cursor-pointer">
                                        <input type="radio" name="neutered" value="N" className="peer sr-only" />
                                        <div className="text-center py-2 rounded-lg text-sm text-gray-400 peer-checked:bg-[#3A3A3D] peer-checked:text-white font-bold transition-all">
                                            아니오
                                        </div>
                                    </label>
                                    <label className="flex-1 cursor-pointer">
                                        <input type="radio" name="neutered" value="UNKNOWN" className="peer sr-only" />
                                        <div className="text-center py-2 rounded-lg text-sm text-gray-400 peer-checked:bg-[#3A3A3D] peer-checked:text-white font-bold transition-all">
                                            모름
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <input type="hidden" name="regStatus" value="N" />

                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-1.5 ml-1">
                                    몸무게 (kg)
                                </label>
                                <input
                                    name="weight"
                                    type="number"
                                    step="0.1"
                                    placeholder="5.2"
                                    className="w-full px-4 py-3 bg-[#2C2C2E] border border-[#333] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-foon-lime focus:ring-1 focus:ring-foon-lime transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-1.5 ml-1">
                                    특이사항 (선택)
                                </label>
                                <textarea
                                    name="specifics"
                                    placeholder="예: 낯가림이 심해요"
                                    className="w-full px-4 py-3 bg-[#2C2C2E] border border-[#333] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-foon-lime focus:ring-1 focus:ring-foon-lime h-20 resize-none transition-all"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isPending}
                                className={cn(
                                    "w-full py-4 rounded-xl text-bg-main font-black text-lg shadow-[0_4px_14px_rgba(163,223,70,0.4)] transition-all active:scale-[0.98]",
                                    isPending ? "bg-gray-600 cursor-not-allowed" : "bg-foon-lime hover:bg-[#bbf080]"
                                )}
                            >
                                {isPending ? "등록 중..." : "등록완료"}
                            </button>
                        </form>
                    </div >
                </div >
            )
            }
        </>
    );
}
