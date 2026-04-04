import { ArrowRight, Sparkles, Building2, Car } from "lucide-react";
import Link from "next/link";

export default function ServiceBannerSidebar() {
    return (
        <aside className="hidden lg:flex flex-col justify-center items-start w-full max-w-[calc(50%-256px)] h-full fixed right-0 top-0 p-12 z-0">
            <div className="max-w-md w-full space-y-6 animate-in fade-in slide-in-from-right-10 duration-700 delay-100">

                {/* Banner 1: Franchise Recruitment */}
                <div className="group relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#2A2A2C] to-[#1E1E20] border border-white/5 hover:border-foon-lime/50 transition-all duration-300 shadow-2xl hover:shadow-[0_0_30px_rgba(163,223,70,0.1)]">
                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                        <Building2 className="w-32 h-32 rotate-12" />
                    </div>

                    <div className="relative p-8 z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-foon-lime/10 text-foon-lime text-xs font-bold mb-4 border border-foon-lime/20">
                            <Sparkles className="w-3 h-3 fill-current" />
                            가맹점 모집
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">
                            펫터디와 함께할<br />
                            파트너를 찾습니다
                        </h3>
                        <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                            반려동물 이동 서비스의 새로운 표준,<br />
                            펫터디의 성공 노하우를 공유합니다.
                        </p>

                        <Link href="/partner/inquiry" className="inline-flex items-center gap-2 text-white font-bold group-hover:text-foon-lime transition-colors">
                            상담 신청하기 <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>

                {/* Banner 2: Service Highlight - Mobility Funeral */}
                <div className="group relative overflow-hidden rounded-[32px] bg-[#1c1c1e] border border-white/5 p-8 hover:bg-[#252527] transition-all duration-300">
                    <div className="absolute -bottom-4 -right-4 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Car className="w-24 h-24 -rotate-12" />
                    </div>

                    <h3 className="text-lg font-bold text-white mb-1">
                        모빌리티 장례
                    </h3>
                    <p className="text-gray-500 text-xs mb-4">
                        반려동물의 마지막 길을 정성껏 모십니다
                    </p>

                    <div className="flex flex-col gap-3">
                        <div className="flex gap-2">
                            <div className="bg-[#333] px-3 py-1.5 rounded-lg text-xs text-gray-300 border border-white/5">
                                🕊️ 전문 지도사 동행
                            </div>
                            <div className="bg-[#333] px-3 py-1.5 rounded-lg text-xs text-gray-300 border border-white/5">
                                🚐 전용 운구 차량
                            </div>
                        </div>

                        <Link href="/regulatory-notice" className="w-full py-2 rounded-xl bg-[#2A2A2C] border border-white/10 hover:bg-[#333] hover:border-foon-lime/30 text-xs text-gray-400 hover:text-white transition-all flex items-center justify-center gap-1.5 group-hover:shadow-lg">
                            <span>📄 실증특례 이용자 고지 보기</span>
                            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                    </div>
                </div>

                {/* Banner 3: App Link (Simple) */}
                <div className="flex gap-4">
                    <div className="flex-1 bg-[#2A2A2C] rounded-2xl p-4 flex items-center justify-center gap-2 border border-white/5 cursor-pointer hover:bg-[#333] transition-colors">
                        <span className="text-2xl">🍎</span>
                        <div className="text-left">
                            <div className="text-[10px] text-gray-500">Download on the</div>
                            <div className="text-xs font-bold text-gray-300">App Store</div>
                        </div>
                    </div>
                    <div className="flex-1 bg-[#2A2A2C] rounded-2xl p-4 flex items-center justify-center gap-2 border border-white/5 cursor-pointer hover:bg-[#333] transition-colors">
                        <span className="text-2xl">🤖</span>
                        <div className="text-left">
                            <div className="text-[10px] text-gray-500">GET IT ON</div>
                            <div className="text-xs font-bold text-gray-300">Google Play</div>
                        </div>
                    </div>
                </div>

            </div>
        </aside>
    );
}
