"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Car, Bath } from "lucide-react";
import { cn } from "@/lib/utils";

type InquiryType = "funeral" | "bath";

export default function PartnerInquiryPage() {
    const [inquiryType, setInquiryType] = useState<InquiryType>("funeral");
    const [formData, setFormData] = useState({
        name: "",
        contact: "",
        region: "",
        message: ""
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Implement submission logic here
        alert("상담 신청이 접수되었습니다.");
    };

    return (
        <div className="min-h-screen bg-[#121212] flex justify-center text-white">
            <div className="w-full max-w-[512px] bg-bg-main min-h-screen border-x border-[#121212] relative flex flex-col">

                {/* Header */}
                <header className="sticky top-0 z-50 bg-[#121212]/80 backdrop-blur-md border-b border-white/5 h-14 flex items-center px-4">
                    <Link href="/" className="p-2 -ml-2 text-white hover:text-gray-300 transition-colors">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <h1 className="absolute left-1/2 -translate-x-1/2 text-lg font-bold">
                        가맹점 상담 신청
                    </h1>
                </header>

                <div className="flex-1 overflow-y-auto p-6 pb-20">
                    <div className="space-y-8">

                        {/* Intro Text */}
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold">
                                펫터디와 새로운 가치를<br />
                                만들어갈 파트너님을 모십니다
                            </h2>
                            <p className="text-gray-400 text-sm">
                                관심 있는 서비스 분야를 선택하고 상담을 신청해주세요.<br />
                                담당자가 확인 후 빠르게 연락드리겠습니다.
                            </p>
                        </div>

                        {/* Category Selection */}
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => setInquiryType("funeral")}
                                className={cn(
                                    "relative p-6 rounded-2xl border transition-all duration-200 flex flex-col items-center gap-3 group",
                                    inquiryType === "funeral"
                                        ? "bg-[#1E1E20] border-foon-lime text-white ring-1 ring-foon-lime/50"
                                        : "bg-[#1c1c1e] border-white/5 text-gray-400 hover:bg-[#252527] hover:border-white/10"
                                )}
                            >
                                <div className={cn(
                                    "w-12 h-12 rounded-full flex items-center justify-center transition-colors",
                                    inquiryType === "funeral" ? "bg-foon-lime/20 text-foon-lime" : "bg-[#333] text-gray-500"
                                )}>
                                    <Car className="w-6 h-6" />
                                </div>
                                <span className={cn("font-bold", inquiryType === "funeral" ? "text-foon-lime" : "text-gray-400")}>
                                    모빌리티 장례
                                </span>
                                {inquiryType === "funeral" && (
                                    <div className="absolute top-3 right-3 text-foon-lime">
                                        <Check className="w-4 h-4" />
                                    </div>
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={() => setInquiryType("bath")}
                                className={cn(
                                    "relative p-6 rounded-2xl border transition-all duration-200 flex flex-col items-center gap-3 group",
                                    inquiryType === "bath"
                                        ? "bg-[#1E1E20] border-foon-lime text-white ring-1 ring-foon-lime/50"
                                        : "bg-[#1c1c1e] border-white/5 text-gray-400 hover:bg-[#252527] hover:border-white/10"
                                )}
                            >
                                <div className={cn(
                                    "w-12 h-12 rounded-full flex items-center justify-center transition-colors",
                                    inquiryType === "bath" ? "bg-foon-lime/20 text-foon-lime" : "bg-[#333] text-gray-500"
                                )}>
                                    <Bath className="w-6 h-6" />
                                </div>
                                <span className={cn("font-bold", inquiryType === "bath" ? "text-foon-lime" : "text-gray-400")}>
                                    모빌리티 목욕
                                </span>
                                {inquiryType === "bath" && (
                                    <div className="absolute top-3 right-3 text-foon-lime">
                                        <Check className="w-4 h-4" />
                                    </div>
                                )}
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-300 mb-2">
                                        신청하시는 분 (업체명)
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="홍길동 (펫터디 동물병원)"
                                        className="w-full h-12 px-4 bg-[#2C2C2E] border border-transparent rounded-xl focus:border-foon-lime focus:outline-none transition-colors text-white placeholder:text-gray-600"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-300 mb-2">
                                        연락처
                                    </label>
                                    <input
                                        type="tel"
                                        placeholder="010-1234-5678"
                                        className="w-full h-12 px-4 bg-[#2C2C2E] border border-transparent rounded-xl focus:border-foon-lime focus:outline-none transition-colors text-white placeholder:text-gray-600"
                                        value={formData.contact}
                                        onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-300 mb-2">
                                        희망 지역
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="서울시 강남구"
                                        className="w-full h-12 px-4 bg-[#2C2C2E] border border-transparent rounded-xl focus:border-foon-lime focus:outline-none transition-colors text-white placeholder:text-gray-600"
                                        value={formData.region}
                                        onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-300 mb-2">
                                        문의 내용
                                    </label>
                                    <textarea
                                        placeholder="궁금하신 점이나 문의 내용을 자유롭게 적어주세요."
                                        className="w-full h-32 p-4 bg-[#2C2C2E] border border-transparent rounded-xl focus:border-foon-lime focus:outline-none transition-colors text-white placeholder:text-gray-600 resize-none"
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-4 bg-foon-lime text-[#121212] font-black rounded-2xl text-lg hover:bg-[#b0ef5d] active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(163,223,70,0.2)]"
                            >
                                상담 신청하기
                            </button>
                        </form>

                    </div>
                </div>
            </div>
        </div>
    );
}
