"use client";

import { useState } from 'react';
import Navbar from '@/components/maps/Navbar';
import Footer from '@/components/maps/Footer';
import Section from '@/components/maps/Section';
import LightRays from '@/components/maps/LightRays';
import GlassCard from '@/components/maps/GlassCard';
import ElectricBorder from '@/components/maps/ElectricBorder';
import InquiryPopup from '@/components/maps/InquiryPopup';

export default function MapsPage() {
    const [isInquiryOpen, setIsInquiryOpen] = useState(false);

    return (
        <main className="min-h-screen relative overflow-hidden pt-20">
            <Navbar onOpenInquiry={() => setIsInquiryOpen(true)} />

            {/* 1. Hero Section */}
            <section id="home" className="min-h-screen flex items-center justify-center text-center relative overflow-hidden">
                {/* Eclipse Background */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] bg-[radial-gradient(circle,rgba(255,85,0,0.08)_0%,transparent_60%)] blur-[100px] pointer-events-none transition-opacity duration-1000 animate-pulse-slow"></div>

                {/* LightRays Animation */}
                <div className="absolute inset-0 z-0 opacity-80 pointer-events-none md:pointer-events-auto">
                    <LightRays
                        raysOrigin="top-center"
                        raysColor="#FF5500"
                        raysSpeed={0.5}
                        lightSpread={0.5}
                        rayLength={1.5}
                        pulsating={true}
                        fadeDistance={1.0}
                        saturation={1.2}
                        mouseInfluence={0.2}
                        noiseAmount={0.02}
                    />
                </div>

                <div className="relative z-10 max-w-5xl px-4 flex flex-col items-center">
                    <span className="mb-6 px-4 py-1.5 rounded-full border border-[#FF5500]/30 bg-[#FF5500]/10 text-[#FF5500] text-sm font-bold tracking-wider uppercase backdrop-blur-md">
                        Premier Special Vehicle Manufacturer
                    </span>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-8 tracking-tight text-white leading-tight break-keep">
                        움직이는 비즈니스의 시작, <br />
                        <span className="orange-gradient-text text-glow">당신의 상상을 현실로.</span>
                    </h1>
                    <p className="text-[#B0B0B0] text-lg md:text-xl max-w-2xl mb-12 font-light leading-relaxed break-keep">
                        대한민국 펫코노미(Pet-conomy) 시대의 리더를 위한 맞춤형 특장 솔루션.<br className="hidden md:block" />
                        반려동물 장례부터 미용까지, 가장 완벽한 파트너가 되어 드립니다.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={() => setIsInquiryOpen(true)}
                            className="px-8 py-4 rounded-full bg-gradient-to-r from-[var(--primary-gradient-start)] to-[var(--primary-gradient-end)] text-white font-bold text-lg shadow-[0_0_30px_rgba(255,85,0,0.4)] hover:shadow-[0_0_50px_rgba(255,85,0,0.6)] hover:scale-105 transition-all duration-300"
                        >
                            무료 견적 및 상담
                        </button>
                    </div>
                </div>
            </section>

            {/* 2. Market Trend (Why) */}
            <section className="py-20 border-b border-white/5 bg-[#050505] relative">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h3 className="text-[#FF5500] font-bold uppercase tracking-widest mb-4">Why Mobile Service?</h3>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">찾아가는 서비스,<br />이제는 선택이 아닌 필수입니다.</h2>
                    <p className="text-[#B0B0B0] text-lg leading-relaxed mb-10 break-keep">
                        반려동물 양육 인구 1,500만 시대. 고객은 이제 직접 방문하는 불편함 대신, <strong>내 집 앞으로 찾아오는 프리미엄 서비스</strong>를 원합니다.
                        높은 임대료 걱정 없는 창업, 전국 어디든 찾아가는 기동성으로 성공적인 비즈니스를 시작하세요.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { label: "Market Size", value: "6조+", desc: "펫 시장 규모 돌파" },
                            { label: "Target", value: "1500만", desc: "반려동물 양육 인구" },
                            { label: "Solution", value: "All-in-One", desc: "완벽한 모바일 솔루션" }
                        ].map((stat, i) => (
                            <div key={i} className="p-6 rounded-2xl bg-[#0A0A0A] border border-white/5">
                                <div className="text-sm text-[#666666] uppercase mb-2">{stat.label}</div>
                                <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
                                <div className="text-[#B0B0B0]">{stat.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3. Core Business Areas (Bento) */}
            <Section id="features" className="py-32">
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white tracking-tight">Core Business Areas</h2>
                    <p className="text-[#B0B0B0] text-lg max-w-2xl mx-auto">
                        성공적인 비즈니스를 위한 최적의 공간을 설계합니다.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[350px]">
                    {/* Large Vertical Card */}
                    <GlassCard
                        className="md:col-span-1 md:row-span-2 bg-[#0F0F0F]"
                        title="이동식 반려동물 장례"
                        description="무연/무취 화장로 기술과 엄숙한 추모 공간. 법적 기준을 충족하는 완벽한 설비로 마지막 배웅을 품격 있게 준비합니다."
                        href="#"
                        icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21a9 9 0 0 0 9-9c0-4.97-4.03-9-9-9s-9 4.03-9 9 0 0 0 9 9Z" /><path d="M10 10h4" /><path d="M12 8v4" /></svg>}
                    />

                    {/* Square Card */}
                    <GlassCard
                        className="md:col-span-2"
                        title="이동식 펫 살롱 (Grooming)"
                        description="샵 퀄리티 그대로. 대용량 청수/오수 탱크와 하이드로 바스, 최적의 작업 동선을 갖춘 럭셔리 미용 차량."
                        href="#"
                        icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 11c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3Z" /><path d="M16 13c-3 0-7.33 1-8 5v3h16v-3c-.67-4-5-5-8-5Z" /><path d="M4.5 10.5 7 8" /></svg>}
                    />

                    {/* Square Card */}
                    <GlassCard
                        className="md:col-span-2"
                        title="Custom Utility Vehicles"
                        description="푸드트럭부터 이동형 사무실, 진료소까지. 고객의 비즈니스 목적에 딱 맞는 커스텀 모빌리티."
                        href="#"
                        icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" /><path d="M7 15h.01" /><path d="M17 15h.01" /></svg>}
                    />
                </div>
            </Section>

            {/* 4. Competitiveness (Why Choose Us) */}
            <Section className="py-24 border-t border-white/5 bg-[#050505]">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">Why Choose Us?</h2>
                    <p className="text-[#B0B0B0]">우리가 만드는 차량은 다릅니다.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { title: "Legal Complience", subtitle: "법규 준수", desc: "TS한국교통안전공단 튜닝 승인 완벽 지원. 100% 합법적 구조 변경.", icon: "⚖️" },
                        { title: "Safety First", subtitle: "안전 설계", desc: "무게 중심과 밸런스를 고려한 정밀 설계. 최고급 자재 사용.", icon: "🛡️" },
                        { title: "User Centric", subtitle: "사용자 중심", desc: "현장 경험을 반영한 작업 동선 설계와 브랜드 맞춤 디자인.", icon: "👥" },
                        { title: "A/S Guarantee", subtitle: "확실한 관리", desc: "제작 후에도 신속한 유지보수와 관리를 약속합니다.", icon: "🔧" }
                    ].map((item, i) => (
                        <div key={i} className="p-8 rounded-2xl bg-[#0F0F0F] border border-white/5 hover:border-[#FF5500]/50 transition-colors group">
                            <div className="text-4xl mb-6 group-hover:scale-110 transition-transform duration-300">{item.icon}</div>
                            <h4 className="text-[#FF5500] text-xs font-bold uppercase tracking-wider mb-2">{item.title}</h4>
                            <h3 className="text-xl font-bold text-white mb-3">{item.subtitle}</h3>
                            <p className="text-[#666666] text-sm group-hover:text-[#B0B0B0] transition-colors">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </Section>

            {/* 5. Pricing Models */}
            <Section className="py-32 bg-[#050505]">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">Models & Pricing</h2>
                    <p className="text-[#B0B0B0]">합리적인 비용으로 시작하는 비즈니스</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
                    <ElectricBorder color="#FF5500" speed={0.5} thickness={2} className="rounded-2xl bg-[#0A0A0A] p-8 min-h-[400px] flex flex-col items-center justify-center text-center">
                        <div className="text-sm font-bold text-[#FF5500] uppercase tracking-wider mb-2">Best Seller</div>
                        <h3 className="text-2xl font-bold text-white mb-4">모빌리티 장례차</h3>
                        <div className="text-4xl font-bold text-white mb-6">6,000<span className="text-lg font-normal text-[#666666]">만원</span></div>
                        <ul className="text-[#B0B0B0] text-sm space-y-2 mb-8">
                            <li>무연/무취 화장로</li>
                            <li>고급 추모실 인테리어</li>
                            <li>TS 구조변경 승인 완료</li>
                        </ul>
                    </ElectricBorder>

                    <ElectricBorder color="#0099FF" speed={0.4} thickness={2} className="rounded-2xl bg-[#0A0A0A] p-8 min-h-[400px] flex flex-col items-center justify-center text-center">
                        <div className="text-sm font-bold text-[#0099FF] uppercase tracking-wider mb-2">Startup Choice</div>
                        <h3 className="text-2xl font-bold text-white mb-4">모빌리티 미용/목욕</h3>
                        <div className="text-4xl font-bold text-white mb-6">3,000<span className="text-lg font-normal text-[#666666]">만원</span></div>
                        <ul className="text-[#B0B0B0] text-sm space-y-2 mb-8">
                            <li>대용량 청수/오수 탱크</li>
                            <li>하이드로 바스 시스템</li>
                            <li>최적화된 작업 동선</li>
                        </ul>
                    </ElectricBorder>

                    <ElectricBorder color="#00FF99" speed={0.6} thickness={2} className="rounded-2xl bg-[#0A0A0A] p-8 min-h-[400px] flex flex-col items-center justify-center text-center">
                        <div className="text-sm font-bold text-[#00FF99] uppercase tracking-wider mb-2">Custom Utility</div>
                        <h3 className="text-2xl font-bold text-white mb-4">모빌리티 캠핑</h3>
                        <div className="text-4xl font-bold text-white mb-6">4,000<span className="text-lg font-normal text-[#666666]">만원</span></div>
                        <ul className="text-[#B0B0B0] text-sm space-y-2 mb-8">
                            <li>고효율 배터리 시스템</li>
                            <li>확장형 캐빈 구조</li>
                            <li>친환경 자재 마감</li>
                        </ul>
                    </ElectricBorder>
                </div>
            </Section>

            {/* 6 & 7. Combined Process & Final CTA */}
            <section className="relative bg-[#050505] overflow-hidden">
                {/* Unified Background Gradients */}
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#FF5500]/5 to-transparent pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[#FF5500]/10 to-transparent pointer-events-none"></div>

                {/* Process Section Content */}
                <div className="py-24 px-6 md:px-8 max-w-7xl mx-auto relative z-10">
                    <div className="mb-16 text-center md:text-left">
                        <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">Process</h2>
                        <p className="text-[#B0B0B0]">체계적인 제작 프로세스로 신뢰를 더합니다.</p>
                    </div>

                    <div className="relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-[2.5rem] left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-[#FF5500]/30 to-transparent z-0"></div>

                        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative z-10 px-4">
                            {[
                                { step: "01", title: "상담 및 기획", desc: "사용 목적과 예산에 따른 1:1 맞춤 컨설팅" },
                                { step: "02", title: "설계 및 디자인", desc: "3D 모델링을 통한 구조 및 설비 시뮬레이션" },
                                { step: "03", title: "특장 제작", desc: "전문 엔지니어의 정밀 가공 및 설비 장착" },
                                { step: "04", title: "인허가 승인", desc: "교통안전공단 검사 및 구조 변경 행정 대행" },
                                { step: "05", title: "검수 및 출고", desc: "최종 테스트 및 안전 교육 후 고객 인도" }
                            ].map((process, i) => (
                                <div key={i} className="flex flex-col items-center text-center group">
                                    <div className="w-full max-w-[140px] py-3 rounded-full bg-[#141414] border border-[#FF5500]/30 flex items-center justify-center text-xl font-bold text-[#FF5500] mb-8 shadow-[0_0_20px_rgba(255,85,0,0.1)] relative z-10 group-hover:scale-105 group-hover:bg-[#FF5500] group-hover:text-white group-hover:shadow-[0_0_40px_rgba(255,85,0,0.4)] transition-all duration-300">
                                        {process.step}
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-4 group-hover:text-[#FF5500] transition-colors">{process.title}</h3>
                                    <p className="text-sm text-[#888888] break-keep px-2 leading-relaxed group-hover:text-[#B0B0B0] transition-colors">{process.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Final CTA Content (Seamlessly connected) */}
                <div className="py-32 px-6 text-center relative z-10">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 tracking-tight break-keep">
                            상상하던 비즈니스,<br />이제 시동을 걸 시간입니다.
                        </h2>
                        <p className="text-[#B0B0B0] mb-12 text-lg">
                            가장 효율적이고 합리적인 솔루션을 제안해 드립니다.
                        </p>
                        <div className="flex flex-col items-center gap-6">
                            <button
                                onClick={() => setIsInquiryOpen(true)}
                                className="inline-block px-12 py-5 rounded-full bg-[#FF5500] text-white font-bold text-xl shadow-[0_0_50px_rgba(255,85,0,0.5)] hover:shadow-[0_0_80px_rgba(255,85,0,0.7)] hover:scale-105 transition-all duration-300"
                            >
                                지금 문의하기
                            </button>
                            <div className="flex gap-6 mt-4 text-[#666666] text-sm md:text-base">
                                <span>📞 010-XXXX-XXXX</span>
                                <span>✉️ expert@example.com</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
            <InquiryPopup isOpen={isInquiryOpen} onClose={() => setIsInquiryOpen(false)} />
        </main>
    );
}
