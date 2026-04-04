"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Calendar, User, Trophy, Menu, X, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomNav() {
    const pathname = usePathname();
    const [isVisible, setIsVisible] = useState(true);
    const [isMenuOpen, setIsMenuOpen] = useState(false); // Hamburger Menu State

    useEffect(() => {
        // Only apply scroll behavior on the contest page on mobile
        if (pathname !== "/contest") {
            setIsVisible(true);
            return;
        }

        let lastScrollY = window.scrollY;

        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            const direction = currentScrollY > lastScrollY ? "down" : "up";

            if (direction === "down" && currentScrollY > 10 && (window.innerHeight + currentScrollY) < document.body.offsetHeight) {
                setIsVisible(false);
            } else if (direction === "up" || currentScrollY < 10) {
                setIsVisible(true);
            }

            lastScrollY = currentScrollY > 0 ? currentScrollY : 0;
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [pathname]);

    // Close menu on navigation
    useEffect(() => {
        setIsMenuOpen(false);
    }, [pathname]);


    // Hide BottomNav on booking new page and MBTI pages and intro pages
    if (pathname.startsWith("/booking/new") || pathname.startsWith("/mbti") || pathname.startsWith("/intro")) return null;

    const tabs = [
        { name: "홈", href: "/", icon: Home },
        { name: "펫픽", href: "/community/petpick", icon: Sparkles },
        { name: "콘테스트", href: "/contest", icon: Trophy },
        { name: "예약하기", href: "/booking", icon: Calendar },
        { name: "내 정보", href: "/mypage", icon: User },
    ];

    return (
        <>
            {/* 1. Mobile Bottom Bar (Hidden on Large Screens) */}
            <nav
                className={cn(
                    "lg:hidden fixed bottom-6 left-3 right-3 z-50 bg-bg-card/90 backdrop-blur-md rounded-3xl border border-[#333] shadow-2xl p-2 px-4 transition-transform duration-300",
                    !isVisible && "translate-y-[200%]"
                )}
            >
                <div className="flex justify-between items-center h-14 max-w-[480px] mx-auto w-full">
                    {tabs.map((tab) => {
                        const isActive = pathname === tab.href;
                        return (
                            <Link
                                key={tab.name}
                                href={tab.href}
                                className={cn(
                                    "flex flex-col items-center justify-center w-full h-full space-y-1 transition-all relative",
                                    isActive ? "text-foon-lime scale-105" : "text-gray-500 hover:text-gray-300"
                                )}
                            >
                                {/* Neon Glow for Active State */}
                                {isActive && (
                                    <div className="absolute -top-1 w-8 h-8 bg-foon-lime rounded-full blur-[15px] opacity-20 pointer-events-none"></div>
                                )}

                                <tab.icon size={22} strokeWidth={isActive ? 2.5 : 2} className="relative z-10" />
                                <span className="text-[10px] font-medium relative z-10">{tab.name}</span>
                            </Link>
                        );
                    })}
                </div>
            </nav>

            {/* 2. Desktop Hamburger Button (Visible only on Large Screens) */}
            <button
                onClick={() => setIsMenuOpen(true)}
                className="hidden lg:flex fixed top-8 right-8 z-50 w-12 h-12 bg-[#2A2A2C] border border-white/10 rounded-full items-center justify-center text-white hover:text-foon-lime hover:border-foon-lime/30 transition-all shadow-lg active:scale-95 group"
            >
                <Menu className="w-6 h-6 group-hover:scale-110 transition-transform" />
            </button>

            {/* 3. Hamburger Menu Modal/Drawer */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-[60] flex justify-end">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
                        onClick={() => setIsMenuOpen(false)}
                    />

                    {/* Menu Content */}
                    <div className="relative w-80 h-full bg-[#1c1c1e] border-l border-white/10 shadow-2xl p-8 flex flex-col animate-in slide-in-from-right duration-300">
                        {/* Header */}
                        <div className="flex justify-between items-center mb-12">
                            <span className="text-xl font-bold text-white">Menu</span>
                            <button
                                onClick={() => setIsMenuOpen(false)}
                                className="w-10 h-10 rounded-full bg-[#333] flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Navigation Links */}
                        <div className="space-y-4 flex-1">
                            {tabs.map((tab) => {
                                const isActive = pathname === tab.href;
                                return (
                                    <Link
                                        key={tab.name}
                                        href={tab.href}
                                        onClick={() => setIsMenuOpen(false)}
                                        className={cn(
                                            "flex items-center gap-4 p-4 rounded-2xl transition-all border border-transparent",
                                            isActive
                                                ? "bg-foon-lime/10 text-foon-lime border-foon-lime/20 font-bold"
                                                : "hover:bg-[#2A2A2C] text-gray-400 hover:text-white hover:border-white/5"
                                        )}
                                    >
                                        <tab.icon className={cn("w-6 h-6", isActive ? "text-foon-lime" : "text-gray-500")} />
                                        <span className="text-lg">{tab.name}</span>
                                    </Link>
                                )
                            })}
                        </div>

                        {/* Quick Action / Footer */}
                        <div className="pt-8 border-t border-white/10">
                            <div className="text-xs text-gray-500 text-center">
                                © 2025 foon
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
