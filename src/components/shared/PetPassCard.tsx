"use client";

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dog, Zap, Crown, Home } from 'lucide-react';

export type MbtiType = 'ENERGIZER' | 'PRINCESS' | 'HOMEBODY' | 'SOCIAL';

interface PetPassCardProps {
    petName: string;
    petImage: string;
    registrationNumber: string;
    mbtiType?: MbtiType;
}

export const mbtiConfig = {
    ENERGIZER: {
        label: "파워 에너자이저",
        icon: <Zap className="w-4 h-4 text-yellow-500 fill-current" />,
        color: "bg-yellow-100 text-yellow-700 border-yellow-300",
        desc: "지치지 않는 체력왕"
    },
    PRINCESS: {
        label: "유리멘탈 공주님",
        icon: <Crown className="w-4 h-4 text-pink-500 fill-current" />,
        color: "bg-pink-100 text-pink-700 border-pink-300",
        desc: "섬세한 케어 필요"
    },
    HOMEBODY: {
        label: "방구석 여포",
        icon: <Home className="w-4 h-4 text-blue-500 fill-current" />,
        color: "bg-blue-100 text-blue-700 border-blue-300",
        desc: "집이 제일 좋아"
    },
    SOCIAL: {
        label: "핵인싸 골목대장",
        icon: <Dog className="w-4 h-4 text-foon-lime fill-current" />,
        color: "bg-green-100 text-green-700 border-green-300",
        desc: "친구야 반가워!"
    }
};

export function PetPassCard({ petName, petImage, registrationNumber, mbtiType }: PetPassCardProps) {
    const badgeInfo = mbtiType ? mbtiConfig[mbtiType] : null;

    return (
        <div className="relative w-full max-w-sm mx-auto perspective-1000">
            {/* Outer Glow/Border */}
            <div className="relative p-[1px] rounded-2xl bg-gradient-to-br from-[#333] via-[#444] to-[#222] shadow-2xl">
                <div className="absolute inset-0 bg-foon-lime/20 blur-xl opacity-20 rounded-2xl"></div>

                <div className="bg-[#1c1c1e] backdrop-blur-md rounded-xl overflow-hidden h-full relative z-10">
                    {/* Header */}
                    <div className="bg-[#2C2C2E] p-3 flex justify-between items-center border-b border-[#333]">
                        <span className="text-foon-lime font-bold tracking-widest text-sm">foon PASS</span>
                        {badgeInfo && (
                            <div className={`flex gap-1 items-center px-2 py-1 rounded-full border bg-black/30 border-white/10`}>
                                {badgeInfo.icon}
                                <span className="text-xs font-bold text-gray-200">{badgeInfo.label}</span>
                            </div>
                        )}
                    </div>

                    <div className="p-6 flex flex-col items-center gap-5">
                        {/* Profile Image */}
                        <div className="relative w-32 h-32">
                            <div className="absolute inset-0 bg-foon-lime/20 rounded-full blur-md animate-pulse"></div>
                            <img
                                src={petImage}
                                alt={petName}
                                className="w-full h-full object-cover rounded-full border-4 border-[#2C2C2E] shadow-lg relative z-10"
                            />
                            {badgeInfo && (
                                <div className="absolute -bottom-2 -right-2 bg-[#2C2C2E] p-1.5 rounded-full shadow-lg border border-[#444] transform rotate-12 z-20">
                                    {badgeInfo.icon}
                                </div>
                            )}
                        </div>

                        {/* Info */}
                        <div className="text-center space-y-1">
                            <h2 className="text-2xl font-bold text-white">{petName}</h2>
                            <p className="text-xs text-gray-500 tracking-widest font-mono">{registrationNumber}</p>
                        </div>

                        {/* Description or CTA */}
                        {badgeInfo ? (
                            <div className="w-full bg-[#2C2C2E]/50 p-3 rounded-xl text-center mt-2 border border-white/5">
                                <p className="text-sm font-medium text-gray-300">"{badgeInfo.desc}"</p>
                                <p className="text-xs text-foon-lime/80 mt-1">맞춤 서비스 추천 가능</p>
                            </div>
                        ) : (
                            <div className="w-full border-2 border-dashed border-[#444] p-3 rounded-xl text-center mt-2 cursor-pointer hover:bg-[#2C2C2E] transition-colors group">
                                <p className="text-sm text-gray-500 group-hover:text-foon-lime transition-colors">멍BTI 검사하고 뱃지 받기 +</p>
                            </div>
                        )}
                    </div>

                    {/* Bottom Barcode */}
                    <div className="bg-[#2C2C2E] p-3 flex justify-center border-t border-[#333]">
                        <div className="h-6 w-3/4 opacity-40 flex items-center justify-center tracking-[0.5em] font-mono text-xs text-white">
                            ||| || ||| || |||
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
