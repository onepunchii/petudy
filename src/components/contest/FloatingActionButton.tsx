"use client";

import { Camera } from "lucide-react";
import { cn } from "@/lib/utils";

interface FloatingActionButtonProps {
    onClick: () => void;
    className?: string;
}

export function FloatingActionButton({ onClick, className }: FloatingActionButtonProps) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "fixed bottom-28 right-4 z-40 bg-foon-lime text-bg-main p-4 rounded-full shadow-[0_4px_20px_rgba(163,223,70,0.4)] hover:bg-[#bbf080] transition-all hover:scale-105 active:scale-95 flex items-center gap-2 pr-6 border border-bg-main/10",
                className
            )}
        >
            <Camera className="w-6 h-6" />
            <span className="font-bold text-sm">내 새꾸 자랑</span>
        </button>
    );
}
