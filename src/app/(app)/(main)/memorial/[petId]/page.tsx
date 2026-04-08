"use client";

import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function MemorialPetPage() {
    return (
        <div className="min-h-screen bg-[#0A0A0B]">
            <header className="sticky top-0 z-50 bg-[#0A0A0B]/80 backdrop-blur-md border-b border-white/5 h-14 flex items-center px-4">
                <Link href="/memorial" className="p-2 -ml-2 text-white hover:text-gray-300 transition-colors">
                    <ChevronLeft className="w-6 h-6" />
                </Link>
                <h1 className="absolute left-1/2 -translate-x-1/2 text-lg font-bold text-white">추억상자</h1>
            </header>

            <main className="p-4 max-w-[480px] mx-auto">
                <p className="text-gray-400 text-center py-10">반려동물 추모실 페이지</p>
            </main>
        </div>
    );
}
