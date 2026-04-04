import Link from "next/link";
import { ArrowLeft, CheckCircle2, ShieldCheck, Truck, Scale, MapPin, FileText } from "lucide-react";

export default function RegulatoryNoticePage() {
    return (
        <div className="min-h-screen bg-[#121212] flex justify-center overflow-y-auto">
            <div className="w-full max-w-[512px] bg-bg-main min-h-screen border-x border-[#121212] relative flex flex-col">

                {/* Header */}
                <header className="sticky top-0 z-50 bg-[#121212]/80 backdrop-blur-md border-b border-white/5 h-14 flex items-center px-4">
                    <Link href="/" className="p-2 -ml-2 text-white hover:text-gray-300 transition-colors">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <h1 className="absolute left-1/2 -translate-x-1/2 text-lg font-bold text-white">
                        이용자 고지 사항
                    </h1>
                </header>

                {/* Content */}
                <div className="p-6 space-y-8 pb-20">

                    {/* Document Header */}
                    <div className="text-center space-y-2 py-4">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold border border-blue-500/20 mb-2">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            제381호
                        </div>
                        <h2 className="text-2xl font-black text-white leading-tight">
                            실증을 위한 규제특례 확인서
                        </h2>
                        <p className="text-sm text-gray-500">
                            산업통상자원부 장관 확인 (2023년 11월 6일)
                        </p>
                    </div>

                    {/* Company Info Box */}
                    <div className="bg-[#1E1E20] rounded-2xl p-6 border border-white/5 space-y-4">
                        <div className="flex justify-between items-start border-b border-white/5 pb-4">
                            <span className="text-gray-400 text-sm">신청인</span>
                            <span className="text-white font-bold">펫터디 주식회사 (대표 최정환)</span>
                        </div>
                        <div className="space-y-1">
                            <span className="text-gray-400 text-xs block">사업자등록번호</span>
                            <span className="text-gray-200 text-sm font-mono">110-86-18965</span>
                        </div>
                        <div className="space-y-1">
                            <span className="text-gray-400 text-xs block">주소</span>
                            <span className="text-gray-200 text-sm">서울시 구로구 디지털로 32길 30 코오롱빌란트 715호</span>
                        </div>
                    </div>

                    {/* Service Description */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Truck className="w-5 h-5 text-foon-lime" />
                            <h3 className="text-lg font-bold text-white">서비스 명칭 및 내용</h3>
                        </div>
                        <div className="bg-[#1E1E20] rounded-2xl p-6 border border-white/5 text-gray-300 text-sm leading-relaxed break-keep">
                            <strong className="text-white block mb-2 text-base">이동식 반려동물 화장 및 찾아가는 장례 서비스</strong>
                            반려동물 집을 방문하여 염습 및 추모 후, 사체를 차량으로 옮겨 지정된 장소에서 화장 진행 후, 분골하여 유골함에 담은 후 보호자에게 전달하는 장례 서비스입니다.
                        </div>
                    </div>

                    {/* Validity Period */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-foon-lime" />
                            <h3 className="text-lg font-bold text-white">유효 기간</h3>
                        </div>
                        <div className="bg-[#1E1E20] rounded-2xl p-6 border border-white/5 text-gray-300 text-sm leading-relaxed">
                            <p>책임보험에 가입하고 사업 개시 확인서의 사업 개시일로부터 <span className="text-foon-lime font-bold">2년</span></p>
                        </div>
                    </div>

                    {/* Key Conditions */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2">
                            <Scale className="w-5 h-5 text-foon-lime" />
                            <h3 className="text-lg font-bold text-white">주요 실증 조건</h3>
                        </div>

                        <ul className="space-y-4">
                            <li className="bg-[#1E1E20] rounded-xl p-5 border border-white/5">
                                <div className="flex gap-3 mb-2">
                                    <div className="w-6 h-6 rounded-full bg-[#333] flex items-center justify-center text-xs font-bold text-gray-400 shrink-0">1</div>
                                    <h4 className="text-white font-bold text-sm pt-1">기록 및 보고</h4>
                                </div>
                                <p className="text-gray-400 text-xs pl-9 leading-relaxed">
                                    차량에 대한 실시간 관리를 위해 24시간 기록 가능한 영상정보처리기기(CCTV), GPS 등을 설치하고 보고 의무를 준수합니다. (30일 이상 녹화 기록 보관)
                                </p>
                            </li>

                            <li className="bg-[#1E1E20] rounded-xl p-5 border border-white/5">
                                <div className="flex gap-3 mb-2">
                                    <div className="w-6 h-6 rounded-full bg-[#333] flex items-center justify-center text-xs font-bold text-gray-400 shrink-0">2</div>
                                    <h4 className="text-white font-bold text-sm pt-1">개인정보 보호</h4>
                                </div>
                                <p className="text-gray-400 text-xs pl-9 leading-relaxed">
                                    영업상 취득한 개인정보(성명, 연락처 등)는 용도 외 목적으로 사용하지 않으며, 사업 종료 후 DB 정보를 안전하게 파기합니다.
                                </p>
                            </li>

                            <li className="bg-[#1E1E20] rounded-xl p-5 border border-white/5">
                                <div className="flex gap-3 mb-2">
                                    <div className="w-6 h-6 rounded-full bg-[#333] flex items-center justify-center text-xs font-bold text-gray-400 shrink-0">3</div>
                                    <h4 className="text-white font-bold text-sm pt-1">안전 및 환경 기준 준수</h4>
                                </div>
                                <p className="text-gray-400 text-xs pl-9 leading-relaxed">
                                    자동차관리법, 대기환경보전법 등 타법령에 위반되지 않는 범위 내에서 서비스를 제공하며, 강화된 환경 기준을 준수합니다.
                                </p>
                            </li>

                            <li className="bg-[#1E1E20] rounded-xl p-5 border border-white/5">
                                <div className="flex gap-3 mb-2">
                                    <div className="w-6 h-6 rounded-full bg-[#333] flex items-center justify-center text-xs font-bold text-gray-400 shrink-0">4</div>
                                    <h4 className="text-white font-bold text-sm pt-1">운영 지역 및 비용</h4>
                                </div>
                                <p className="text-gray-400 text-xs pl-9 leading-relaxed">
                                    지자체와 협의된 장소에서만 화장이 가능하며, 실증 기간 동안 서비스 가격은 실비 수준으로 청구됩니다.
                                </p>
                            </li>
                        </ul>
                    </div>

                    {/* Official Stamp Section (Visual) */}
                    <div className="mt-12 pt-8 border-t border-white/10 flex flex-col items-center justify-center gap-4 opacity-80">
                        <div className="w-20 h-20 rounded-full border-4 border-red-500/50 flex items-center justify-center rotate-12 mask-image-stamp">
                            <span className="text-red-500/80 font-black text-xs text-center leading-tight">
                                산업통상<br />자원부<br />장관인
                            </span>
                        </div>
                        <p className="text-xs text-gray-600 font-serif">
                            위와 같이 「산업융합 촉진법」에 따라 실증을 위한 규제특례 확인서를 발급합니다.
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
}
