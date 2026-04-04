"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, MapPin, Car, Tent } from "lucide-react";

export default function TravelPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-bg-main text-white relative flex flex-col">
            {/* Header */}
            <header className="h-14 flex items-center px-4 border-b border-[#333] sticky top-0 bg-bg-main/80 backdrop-blur-md z-50">
                <button onClick={() => router.back()} className="p-2 -ml-2">
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <h1 className="font-bold text-lg ml-2">펫여행</h1>
            </header>

            <main className="flex-1 overflow-y-auto pb-24">
                {/* Hero Section */}
                <div className="relative h-64 w-full bg-gradient-to-br from-blue-900/40 to-bg-main flex flex-col justify-center px-6">
                    <div className="absolute right-4 top-8 opacity-20">
                        <MapPin className="w-40 h-40 text-blue-400" />
                    </div>
                    <span className="text-blue-400 font-bold text-sm mb-2">설레는 여행</span>
                    <h2 className="text-3xl font-bold leading-tight mb-4">
                        아이와 함께 떠나는<br />
                        <span className="text-blue-400">행복한 추억 만들기</span>
                    </h2>
                    <p className="text-gray-300 text-sm">
                        숙소부터 이동수단까지<br />
                        펫터디가 모두 준비했습니다.
                    </p>
                </div>

                {/* Content Section */}
                <div className="p-6 space-y-8">
                    {/* Features */}
                    <section>
                        <h3 className="text-xl font-bold mb-4">펫터디 트래블만의 혜택</h3>
                        <div className="grid gap-4">
                            <div className="bg-bg-card p-5 rounded-2xl border border-[#333] flex items-start gap-4">
                                <div className="p-3 bg-bg-input rounded-full text-blue-400">
                                    <Tent className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold mb-1">검증된 펫 전용 숙소</h4>
                                    <p className="text-sm text-gray-400 leading-relaxed">
                                        미끄럼 방지 매트, 전용 식기 등<br />
                                        반려동물을 위한 시설이 완비된 곳만 엄선합니다.
                                    </p>
                                </div>
                            </div>
                            <div className="bg-bg-card p-5 rounded-2xl border border-[#333] flex items-start gap-4">
                                <div className="p-3 bg-bg-input rounded-full text-blue-400">
                                    <Car className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold mb-1">편안한 이동 서비스</h4>
                                    <p className="text-sm text-gray-400 leading-relaxed">
                                        장거리 여행도 걱정 없도록,<br />
                                        넓고 쾌적한 펫 전용 차량을 지원합니다.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Popular Destinations */}
                    <section>
                        <h3 className="text-xl font-bold mb-4">인기 여행지</h3>
                        <div className="bg-bg-card rounded-2xl p-6 border border-[#333] space-y-4">
                            <PlaceCard name="강릉 멍비치" desc="아이들이 마음껏 뛰어노는 전용 해변" tag="#바다" />
                            <PlaceCard name="제주 애견 동반 펜션" desc="감귤밭 산책로가 있는 독채 숙소" tag="#제주" />
                            <PlaceCard name="가평 풀빌라" desc="사계절 온수풀이 있는 프라이빗 공간" tag="#수영" />
                        </div>
                    </section>
                </div>
            </main>

            {/* Bottom CTA */}
            <div className="fixed bottom-0 left-0 w-full p-6 bg-gradient-to-t from-bg-main via-bg-main to-transparent z-50">
                <button
                    onClick={() => router.push('/booking/new?category=TRAVEL')}
                    className="w-full bg-blue-500 text-white font-bold text-lg py-4 rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.5)] hover:bg-blue-400 transition-colors active:scale-95"
                >
                    여행 패키지 예약하기
                </button>
            </div>
        </div>
    );
}

function PlaceCard({ name, desc, tag }: { name: string; desc: string; tag: string }) {
    return (
        <div className="flex justify-between items-center border-b border-[#333] pb-3 last:border-0 last:pb-0">
            <div>
                <h4 className="font-bold">{name}</h4>
                <p className="text-xs text-gray-400 mt-1">{desc}</p>
            </div>
            <span className="text-xs font-bold text-blue-400 bg-blue-400/10 px-2 py-1 rounded">{tag}</span>
        </div>
    );
}
