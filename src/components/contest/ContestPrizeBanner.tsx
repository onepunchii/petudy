"use client";

import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { Gift, Sparkles, X } from "lucide-react";

interface ContestPrizeBannerProps {
    onClose: () => void;
}

export function ContestPrizeBanner({ onClose }: ContestPrizeBannerProps) {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Content Card */}
            <div className="bg-gradient-to-br from-[#2C2C2E] to-[#1c1c1e] w-full max-w-sm rounded-[32px] p-6 relative z-10 border border-white/10 shadow-2xl animate-in zoom-in-95 fade-in slide-in-from-bottom-4 duration-300">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 bg-white/10 p-2 rounded-full text-white/70 hover:text-white hover:bg-white/20 transition-all z-20"
                >
                    <span className="sr-only">닫기</span>
                    <X className="w-5 h-5" />
                </button>

                {/* Animation & Title */}
                <div className="text-center mb-6">
                    <div className="w-32 h-32 mx-auto bg-foon-lime/5 rounded-full flex items-center justify-center relative mb-4">
                        <div className="absolute inset-0 scale-125">
                            <DotLottieReact
                                src="https://lottie.host/cf598b05-7b3e-49d8-ad6b-f96754f1651c/CUv1G5wTha.lottie"
                                loop
                                autoplay
                            />
                        </div>
                    </div>

                    <div className="inline-flex items-center gap-2 bg-foon-lime/20 border border-foon-lime/30 px-3 py-1 rounded-full mb-3">
                        <span className="w-2 h-2 rounded-full bg-foon-lime animate-pulse" />
                        <span className="text-foon-lime text-xs font-bold">12월 스페셜 리워드</span>
                    </div>

                    <h2 className="text-2xl font-bold text-white mb-2">
                        이달의 모델 시상 품목 🏆
                    </h2>
                    <p className="text-gray-400 text-sm">
                        랭킹 1위~3위에게는 특별한 선물이 쏟아져요!
                    </p>
                </div>

                {/* Prizes Grid */}
                <div className="space-y-3">
                    {/* 1st Place */}
                    <div className="bg-black/40 rounded-2xl p-4 flex items-center gap-4 border border-foon-lime/30 relative overflow-hidden group">
                        <div className="w-12 h-12 rounded-xl bg-foon-lime/10 flex items-center justify-center shrink-0">
                            <span className="text-2xl">🥇</span>
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-0.5">
                                <span className="bg-foon-lime text-black text-[10px] font-bold px-1.5 py-0.5 rounded">1등</span>
                                <span className="text-white font-bold">프리미엄 개모차</span>
                            </div>
                            <span className="text-xs text-gray-500">50만원 상당의 최고급 유모차</span>
                        </div>
                    </div>

                    {/* 2nd Place */}
                    <div className="bg-black/40 rounded-2xl p-4 flex items-center gap-4 border border-white/5 relative overflow-hidden group">
                        <div className="w-12 h-12 rounded-xl bg-gray-700/30 flex items-center justify-center shrink-0">
                            <span className="text-2xl">🥈</span>
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-0.5">
                                <span className="bg-gray-400 text-black text-[10px] font-bold px-1.5 py-0.5 rounded">2등</span>
                                <span className="text-white font-bold">펫 호텔 숙박권</span>
                            </div>
                            <span className="text-xs text-gray-500">20만원 상당 (1박 2일)</span>
                        </div>
                    </div>

                    {/* 3rd Place */}
                    <div className="bg-black/40 rounded-2xl p-4 flex items-center gap-4 border border-white/5 relative overflow-hidden group">
                        <div className="w-12 h-12 rounded-xl bg-orange-900/20 flex items-center justify-center shrink-0">
                            <span className="text-2xl">🥉</span>
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-0.5">
                                <span className="bg-orange-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">3등</span>
                                <span className="text-white font-bold">수제 간식 박스</span>
                            </div>
                            <span className="text-xs text-gray-500">5만원 상당의 건강 간식</span>
                        </div>
                    </div>
                </div>

                {/* Footer Action */}
                <button
                    onClick={onClose}
                    className="w-full mt-6 bg-foon-lime text-bg-main font-bold py-3.5 rounded-xl hover:bg-lime-400 transition-colors shadow-[0_4px_20px_rgba(163,223,70,0.3)] text-sm"
                >
                    확인했어요
                </button>
            </div>
        </div>
    );
}
