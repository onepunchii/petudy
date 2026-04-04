import React from 'react';

export default function DashboardShowcase() {
    return (
        <div className="relative w-full max-w-6xl mx-auto rounded-xl overflow-hidden shadow-2xl border border-white/10 bg-[#141414] aspect-[16/9] group">
            {/* Mockup Frame Header */}
            <div className="absolute top-0 left-0 w-full h-8 bg-[#1F1F1F] flex items-center px-4 border-b border-white/5 z-20">
                <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#FF5F56]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#27C93F]"></div>
                </div>
            </div>

            {/* Content Placeholder (Simulating High-Res Dashboard) */}
            <div className="absolute inset-0 pt-8 bg-[#0A0A0A] flex p-6 gap-6 transition-transform duration-700 ease-out group-hover:scale-[1.01]">
                {/* Sidebar */}
                <div className="w-64 h-full bg-[#141414] rounded-lg border border-white/5 p-4 flex flex-col gap-4">
                    <div className="h-8 bg-white/5 rounded w-3/4"></div>
                    <div className="h-4 bg-white/5 rounded w-1/2 opacity-50"></div>
                    <div className="h-4 bg-white/5 rounded w-2/3 opacity-50"></div>
                    <div className="mt-auto h-12 bg-[#FF5500]/10 border border-[#FF5500]/20 rounded flex items-center justify-center text-[#FF5500] text-xs font-bold uppercase">
                        New Session
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col gap-6">
                    {/* Header Chart Area */}
                    <div className="h-1/3 w-full bg-[#141414] rounded-lg border border-white/5 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-[#FF5500]/10 to-transparent bottom-0 h-1/2"></div>
                        <div className="absolute bottom-4 left-4 right-4 h-32 flex items-end gap-2">
                            {[40, 60, 45, 70, 50, 80, 65, 90, 75, 55, 60, 85].map((h, i) => (
                                <div key={i} className="flex-1 bg-[#FF5500] opacity-80 rounded-t-sm hover:opacity-100 transition-opacity" style={{ height: `${h}%` }}></div>
                            ))}
                        </div>
                    </div>

                    {/* Lower Grid */}
                    <div className="flex-1 grid grid-cols-3 gap-6">
                        <div className="bg-[#141414] rounded-lg border border-white/5"></div>
                        <div className="bg-[#141414] rounded-lg border border-white/5 relative overflow-hidden">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-24 h-24 rounded-full border-4 border-[#FF5500] border-t-transparent animate-spin-slow opacity-50"></div>
                            </div>
                        </div>
                        <div className="bg-[#141414] rounded-lg border border-white/5"></div>
                    </div>
                </div>
            </div>

            {/* Gloss Reflection Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none z-10"></div>
        </div>
    );
}
