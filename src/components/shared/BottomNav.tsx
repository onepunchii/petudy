"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Calendar, User, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomNav() {
    const pathname = usePathname();
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        setIsVisible(true);
    }, [pathname]);

    if (pathname.startsWith("/booking/new") || pathname.startsWith("/mbti") || pathname.startsWith("/intro")) return null;

    const tabs = [
        { name: "홈", href: "/", icon: Home },
        { name: "예약하기", href: "/booking", icon: Calendar },
        { name: "추억상자", href: "/memorial", icon: Heart },
        { name: "내 정보", href: "/mypage", icon: User },
    ];

    return (
        <nav
            className={cn(
                "fixed bottom-6 left-3 right-3 z-50 bg-bg-card/90 backdrop-blur-md rounded-3xl border border-[#333] shadow-2xl p-2 px-4 transition-transform duration-300 max-w-[480px] mx-auto",
                !isVisible && "translate-y-[200%]"
            )}
        >
            <div className="flex justify-between items-center h-14 w-full max-w-[480px] mx-auto">
                {tabs.map((tab) => {
                    const isActive = pathname === tab.href;
                    return (
                        <Link
                            key={tab.name}
                            href={tab.href}
                            className={cn(
                                "flex flex-col items-center justify-center w-full h-full space-y-1 transition-all relative py-2",
                                isActive ? "text-foon-lime scale-105" : "text-gray-500 hover:text-gray-300"
                            )}
                        >
                            {isActive && (
                                <div className="absolute -top-1 w-8 h-8 bg-foon-lime rounded-full blur-[15px] opacity-20 pointer-events-none"></div>
                            )}

                            <tab.icon size={24} strokeWidth={isActive ? 2.5 : 2} className="relative z-10" />
                            <span className="text-[10px] font-medium relative z-10">{tab.name}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
