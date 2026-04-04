"use client";

import { ContestEntry } from "./types";
import { Crown } from "lucide-react";

interface RankingBannerProps {
    topEntries: ContestEntry[];
}

export function RankingBanner({ topEntries }: RankingBannerProps) {
    const winner = topEntries[0];
    const runnerUp = topEntries[1];
    const thirdPlace = topEntries[2];

    if (!winner) return null;

    return (
        <div className="w-full bg-gradient-to-b from-[#1E1E20] to-bg-main px-4 py-6 border-b border-[#333]">
            <div className="mb-6 text-center">
                <h2 className="text-lg font-bold text-white flex items-center justify-center gap-2">
                    <Crown className="w-5 h-5 text-foon-lime fill-current drop-shadow-[0_0_8px_rgba(163,223,70,0.6)]" />
                    실시간 랭킹
                </h2>
                <p className="text-xs text-gray-400 mt-1">현재 가장 인기있는 펫터디 모델 후보들이에요!</p>
            </div>

            <div className="flex justify-center items-end gap-3 max-w-md mx-auto">
                {/* 2nd Place */}
                {runnerUp && (
                    <div className="flex flex-col items-center w-1/3 max-w-[100px]">
                        <div className="relative w-16 h-16 mb-3 rounded-full ring-2 ring-gray-600 p-0.5 bg-[#2C2C2E]">
                            <img
                                src={runnerUp.imageUrl}
                                alt={runnerUp.petName}
                                className="w-full h-full rounded-full object-cover grayscale-[30%]"
                            />
                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-gray-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                                2위
                            </div>
                        </div>
                        <span className="font-semibold text-sm truncate w-full text-center text-gray-200">{runnerUp.petName}</span>
                        <span className="text-xs text-gray-500 font-medium">{runnerUp.voteCount}표</span>
                    </div>
                )}

                {/* 1st Place */}
                <div className="flex flex-col items-center w-1/3 max-w-[120px] -mb-2 z-10 shrink-0">
                    <div className="relative mb-3">
                        <Crown className="absolute -top-6 left-1/2 -translate-x-1/2 w-8 h-8 text-foon-lime fill-foon-lime animate-bounce drop-shadow-[0_0_10px_rgba(163,223,70,0.8)]" />
                        <div className="w-24 h-24 rounded-full ring-4 ring-foon-lime p-1 bg-[#1E1E20] shadow-[0_0_20px_rgba(163,223,70,0.3)] relative overflow-hidden">
                            <img
                                src={winner.imageUrl}
                                alt={winner.petName}
                                className="w-full h-full rounded-full object-cover"
                            />
                        </div>
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-foon-lime text-bg-main text-xs font-bold px-3 py-1 rounded-full shadow-lg whitespace-nowrap">
                            1위
                        </div>
                    </div>
                    <span className="font-bold text-base mt-2 truncate w-full text-center text-white">{winner.petName}</span>
                    <span className="text-sm text-foon-lime font-bold">{winner.voteCount}표</span>
                </div>

                {/* 3rd Place */}
                {thirdPlace && (
                    <div className="flex flex-col items-center w-1/3 max-w-[100px]">
                        <div className="relative w-16 h-16 mb-3 rounded-full ring-2 ring-orange-900/50 p-0.5 bg-[#2C2C2E]">
                            <img
                                src={thirdPlace.imageUrl}
                                alt={thirdPlace.petName}
                                className="w-full h-full rounded-full object-cover grayscale-[50%]"
                            />
                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-orange-900/80 text-orange-200 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                                3위
                            </div>
                        </div>
                        <span className="font-semibold text-sm truncate w-full text-center text-gray-200">{thirdPlace.petName}</span>
                        <span className="text-xs text-gray-500 font-medium">{thirdPlace.voteCount}표</span>
                    </div>
                )}
            </div>
        </div>
    );
}
