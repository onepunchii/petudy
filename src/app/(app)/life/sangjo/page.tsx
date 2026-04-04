"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Flower2, Star, Clock } from "lucide-react";

export default function SangjoPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-bg-main text-white relative flex flex-col">
            {/* Header */}
            <header className="h-14 flex items-center px-4 border-b border-[#333] sticky top-0 bg-bg-main/80 backdrop-blur-md z-50">
                <button onClick={() => router.back()} className="p-2 -ml-2">
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <h1 className="font-bold text-lg ml-2">펫상조</h1>
            </header>

            <main className="flex-1 overflow-y-auto pb-24">
                {/* Hero Section */}
                <div className="relative h-64 w-full bg-gradient-to-br from-[#1c1c1e] to-black flex flex-col justify-center px-6 border-b border-[#333]">
                    <div className="absolute right-6 top-10 opacity-30">
                        <Flower2 className="w-32 h-32 text-gray-400" />
                    </div>
                    <span className="text-gray-400 font-bold text-sm mb-2">프리미엄 장례 서비스</span>
                    <h2 className="text-3xl font-bold leading-tight mb-4">
                        마지막 이별의 순간까지<br />
                        <span className="text-white">아름답게 기억되도록</span>
                    </h2>
                    <p className="text-gray-400 text-sm">
                        24시간 전문 장례지도사가<br />
                        모든 절차를 정성껏 도와드립니다.
                    </p>
                </div>

                {/* Content Section */}
                <div className="p-6 space-y-8">
                    {/* Services */}
                    <section>
                        <h3 className="text-xl font-bold mb-4">주요 서비스 안내</h3>
                        <div className="grid gap-4">
                            <div className="bg-bg-card p-5 rounded-2xl border border-[#333] flex items-start gap-4">
                                <div className="p-3 bg-bg-input rounded-full text-white">
                                    <Clock className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold mb-1">24시간 긴급 출동</h4>
                                    <p className="text-sm text-gray-400 leading-relaxed">
                                        언제 어떤 상황에서도 당황하지 않도록<br />
                                        전문가와 전용 차량이 즉시 출동합니다.
                                    </p>
                                </div>
                            </div>
                            <div className="bg-bg-card p-5 rounded-2xl border border-[#333] flex items-start gap-4">
                                <div className="p-3 bg-bg-input rounded-full text-white">
                                    <Star className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold mb-1">품격 있는 추모실</h4>
                                    <p className="text-sm text-gray-400 leading-relaxed">
                                        독립된 공간에서 아이와의 추억을<br />
                                        충분히 되새길 수 있습니다.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Process Steps */}
                    <section>
                        <h3 className="text-xl font-bold mb-4">진행 절차</h3>
                        <div className="bg-bg-card rounded-2xl p-6 border border-[#333] relative overflow-hidden">
                            {/* Line connector */}
                            <div className="absolute left-[39px] top-6 bottom-6 w-[2px] bg-[#333]" />

                            <div className="space-y-6 relative">
                                <Step number="01" title="상담 및 접수" desc="24시간 고객센터 연결" />
                                <Step number="02" title="차량 픽업" desc="전용 운구 차량으로 이동" />
                                <Step number="03" title="염습 및 입관" desc="아이를 깨끗이 단장" />
                                <Step number="04" title="추모 및 화장" desc="개별 화장 진행" />
                                <Step number="05" title="유골 안치" desc="봉안당 또는 스톤 제작" />
                            </div>
                        </div>
                    </section>
                </div>
            </main>

            {/* Bottom CTA */}
            <div className="fixed bottom-0 left-0 w-full p-6 bg-gradient-to-t from-bg-main via-bg-main to-transparent z-50">
                <button
                    onClick={() => router.push('/booking/new?category=MUTUAL_AID')}
                    className="w-full bg-white text-black font-bold text-lg py-4 rounded-xl shadow-lg hover:bg-gray-200 transition-colors active:scale-95"
                >
                    장례 서비스 신청하기
                </button>
            </div>
        </div>
    );
}

function Step({ number, title, desc }: { number: string; title: string; desc: string }) {
    return (
        <div className="flex items-start gap-4 z-10 relative">
            <div className="w-8 h-8 rounded-full bg-[#333] flex items-center justify-center text-xs font-bold text-white border border-gray-600">
                {number}
            </div>
            <div>
                <h4 className="font-bold">{title}</h4>
                <p className="text-sm text-gray-400">{desc}</p>
            </div>
        </div>
    );
}
