"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, ShieldCheck, HeartPulse, Wallet } from "lucide-react";
import Image from "next/image";

export default function InsurancePage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-bg-main text-white relative flex flex-col">
            {/* Header */}
            <header className="h-14 flex items-center px-4 border-b border-[#333] sticky top-0 bg-bg-main/80 backdrop-blur-md z-50">
                <button onClick={() => router.back()} className="p-2 -ml-2">
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <h1 className="font-bold text-lg ml-2">펫보험</h1>
            </header>

            <main className="flex-1 overflow-y-auto pb-24">
                {/* Hero Section */}
                <div className="relative h-64 w-full bg-gradient-to-br from-foon-lime/20 to-bg-main flex flex-col justify-center px-6">
                    <div className="absolute right-4 top-8 opacity-20">
                        <ShieldCheck className="w-40 h-40 text-foon-lime" />
                    </div>
                    <span className="text-foon-lime font-bold text-sm mb-2">든든한 보장</span>
                    <h2 className="text-3xl font-bold leading-tight mb-4">
                        병원비 걱정 없이<br />
                        <span className="text-foon-lime">마음껏 사랑하세요</span>
                    </h2>
                    <p className="text-gray-300 text-sm">
                        갑작스러운 질병과 사고에도<br />
                        펫보험이 곁에 있습니다.
                    </p>
                </div>

                {/* Content Section */}
                <div className="p-6 space-y-8">
                    {/* Key Benefits */}
                    <section>
                        <h3 className="text-xl font-bold mb-4">왜 펫보험이 필요한가요?</h3>
                        <div className="grid gap-4">
                            <div className="bg-bg-card p-5 rounded-2xl border border-[#333] flex items-start gap-4">
                                <div className="p-3 bg-bg-input rounded-full text-foon-lime">
                                    <Wallet className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold mb-1">병원비 부담 감소</h4>
                                    <p className="text-sm text-gray-400 leading-relaxed">
                                        CT, MRI 촬영 등 고액 검사비부터<br />
                                        슬개골 탈구 수술비까지 지원합니다.
                                    </p>
                                </div>
                            </div>
                            <div className="bg-bg-card p-5 rounded-2xl border border-[#333] flex items-start gap-4">
                                <div className="p-3 bg-bg-input rounded-full text-foon-lime">
                                    <HeartPulse className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold mb-1">노령동물 케어</h4>
                                    <p className="text-sm text-gray-400 leading-relaxed">
                                        나이가 들어도 안심할 수 있도록,<br />
                                        만성 질환 통원 치료비를 보장합니다.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Coverage Info */}
                    <section>
                        <h3 className="text-xl font-bold mb-4">주요 보장 내용</h3>
                        <div className="bg-bg-card rounded-2xl p-6 border border-[#333] space-y-4">
                            <ul className="space-y-3">
                                <li className="flex items-center gap-3 text-sm">
                                    <span className="w-1.5 h-1.5 bg-foon-lime rounded-full" />
                                    <span>입원/통원 의료비 (일 최대 15만원)</span>
                                </li>
                                <li className="flex items-center gap-3 text-sm">
                                    <span className="w-1.5 h-1.5 bg-foon-lime rounded-full" />
                                    <span>수술비 지원 (연간 2회)</span>
                                </li>
                                <li className="flex items-center gap-3 text-sm">
                                    <span className="w-1.5 h-1.5 bg-foon-lime rounded-full" />
                                    <span>배상책임 보장 (최대 1천만원)</span>
                                </li>
                                <li className="flex items-center gap-3 text-sm">
                                    <span className="w-1.5 h-1.5 bg-foon-lime rounded-full" />
                                    <span>반려견 장례비 지원</span>
                                </li>
                            </ul>
                        </div>
                    </section>
                </div>
            </main>

            {/* Bottom CTA */}
            <div className="fixed bottom-0 left-0 w-full p-6 bg-gradient-to-t from-bg-main via-bg-main to-transparent z-50">
                <button
                    onClick={() => router.push('/booking/new?category=INSURANCE')}
                    className="w-full bg-foon-lime text-black font-bold text-lg py-4 rounded-xl shadow-[0_0_20px_rgba(163,223,70,0.3)] hover:bg-[#bbf080] transition-colors active:scale-95"
                >
                    무료 상담 신청하기
                </button>
            </div>
        </div>
    );
}
