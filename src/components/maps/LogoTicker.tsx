"use client";

import React from 'react';

export default function LogoTicker() {
    // Grayscale logos using text placeholders for now to simulate the effect
    // In a real app, these would be SVGs
    const logos = [
        "ACME Corp", "Quantum", "Echo", "Nebula", "Vertex",
        "Horizon", "Pinnacle", "Zenith"
    ];

    return (
        <div className="w-full overflow-hidden border-y border-white/5 bg-[#0A0A0A]/50 py-8 relative">
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[var(--bg-main)] to-transparent z-10"></div>
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[var(--bg-main)] to-transparent z-10"></div>

            <div className="flex animate-scroll whitespace-nowrap gap-16 items-center">
                {/* Double the list for seamless loop */}
                {[...logos, ...logos, ...logos].map((logo, index) => (
                    <span
                        key={index}
                        className="text-xl font-bold text-[#666666] uppercase tracking-widest opacity-50 hover:opacity-100 hover:text-white transition-all cursor-default"
                    >
                        {logo}
                    </span>
                ))}
            </div>

            <style jsx>{`
            @keyframes scroll {
                0% { transform: translateX(0); }
                100% { transform: translateX(-33.33%); }
            }
            .animate-scroll {
                animation: scroll 30s linear infinite;
            }
        `}</style>
        </div>
    );
}
