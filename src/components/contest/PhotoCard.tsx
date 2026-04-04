"use client";

import { Heart } from "lucide-react";
import { ContestEntry } from "./types";
import { cn } from "@/lib/utils";

interface PhotoCardProps {
    entry: ContestEntry;
    onVote: (id: number) => void;
    isVoted?: boolean;
    onClick?: () => void;
}

export function PhotoCard({ entry, onVote, isVoted = false, onClick }: PhotoCardProps) {
    return (
        <div
            onClick={onClick}
            className={cn(
                "break-inside-avoid mb-4 group relative overflow-hidden rounded-[20px] bg-bg-card shadow-lg border border-[#333] transition-all hover:border-foon-lime/50",
                onClick && "cursor-pointer active:scale-98"
            )}
        >
            {/* Image Container with Aspect Ratio */}
            <div className="relative w-full overflow-hidden">
                <img
                    src={entry.imageUrl}
                    alt={`${entry.petName}의 사진`}
                    className="w-full h-auto object-cover transform transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Rank Badge if exists */}
                {entry.rank && entry.rank <= 3 && (
                    <div className={cn(
                        "absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-bold text-bg-main shadow-md",
                        entry.rank === 1 ? "bg-foon-lime" :
                            entry.rank === 2 ? "bg-gray-300" :
                                "bg-orange-300"
                    )}>
                        {entry.rank}위
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h3 className="font-bold text-white line-clamp-1">{entry.petName}</h3>
                        <p className="text-xs text-gray-400 line-clamp-1">by {entry.ownerName}</p>
                    </div>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            onVote(entry.id);
                        }}
                        className={cn(
                            "flex items-center space-x-1 px-3 py-1.5 rounded-full transition-all border",
                            isVoted
                                ? "bg-red-500/20 text-red-500 border-red-500/50"
                                : "bg-[#2C2C2E] text-gray-400 border-[#444] hover:bg-[#3A3A3D] hover:text-white"
                        )}
                    >
                        <Heart
                            size={14}
                            className={cn("transition-transform", isVoted && "fill-current scale-110")}
                        />
                        <span className="text-xs font-medium">{entry.voteCount}</span>
                    </button>
                </div>

                {entry.caption && (
                    <p className="text-sm text-gray-400 line-clamp-2 text-xs leading-relaxed">
                        {entry.caption}
                    </p>
                )}
            </div>
        </div>
    );
}
