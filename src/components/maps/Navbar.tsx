import Link from 'next/link';
import React from 'react';

interface NavbarProps {
    onOpenInquiry?: () => void;
}

export default function Navbar({ onOpenInquiry }: NavbarProps) {
    return (
        <header className="fixed top-0 left-0 w-full z-50 glass-header border-b border-white/5">
            <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
                {/* Left: Brand Logo */}
                <Link href="/" className="flex items-center gap-3 group">
                    <span className="text-2xl font-bold text-white tracking-tight">MAPS</span>
                    <span className="text-xs text-[#666] font-medium tracking-wide hidden sm:block border-l border-white/10 pl-3">
                        모빌리티 올펫 서비스
                    </span>
                    <div className="w-1.5 h-1.5 rounded-full bg-[#FF5500] group-hover:shadow-[0_0_10px_#FF5500] transition-shadow"></div>
                </Link>

                {/* Right: CTA */}
                <div className="flex items-center gap-6">
                    <button
                        onClick={onOpenInquiry}
                        className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[var(--primary-gradient-start)] to-[var(--primary-gradient-end)] text-white text-sm font-bold shadow-[0_0_20px_rgba(255,85,0,0.3)] hover:shadow-[0_0_30px_rgba(255,85,0,0.5)] hover:scale-105 transition-all duration-300"
                    >
                        무료상담
                    </button>
                </div>
            </div>
        </header>
    );
}
