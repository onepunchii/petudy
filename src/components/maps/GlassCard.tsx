"use client";

import React, { useRef, useState } from 'react';
import Link from 'next/link';

interface GlassCardProps {
    title: string;
    description: string;
    href: string;
    icon: React.ReactNode;
    className?: string; // Allow custom classes for Bento Grid sizing
}

export default function GlassCard({ title, description, href, icon, className = "" }: GlassCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [opacity, setOpacity] = useState(0);
    const [showOptions, setShowOptions] = useState(false);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;

        const div = cardRef.current;
        const rect = div.getBoundingClientRect();

        setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    const handleFocus = () => {
        setOpacity(1);
    };

    const handleBlur = () => {
        setOpacity(0);
    };

    const handleMouseEnter = () => {
        setOpacity(1);
    };

    const handleMouseLeave = () => {
        setOpacity(0);
        setShowOptions(false); // Reset on mouse leave? Optional, maybe keeping it open is better for UX.
    };

    return (
        <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={`bento-card bento-card-hover flex flex-col items-start p-8 relative group ${className}`}
        >
            <div
                className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100"
                style={{
                    background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(255, 85, 0, 0.15), transparent 40%)`,
                }}
            />

            {showOptions ? (
                <div className="z-20 w-full h-full flex flex-col animate-fadeIn">
                    <div className="flex items-center justify-between w-full mb-6">
                        <button
                            onClick={() => setShowOptions(false)}
                            className="text-[#B0B0B0] hover:text-white transition-colors flex items-center gap-2 text-sm"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                            Back
                        </button>
                        <h3 className="text-lg font-bold text-white">Select Type</h3>
                    </div>

                    <div className="flex flex-col gap-3 w-full flex-grow">
                        <Link href={`${href}?type=standard`} className="flex-1 rounded-xl bg-white/5 border border-white/10 hover:border-[#FF5500]/50 hover:bg-white/10 transition-all p-4 flex items-center justify-between group/item">
                            <div>
                                <div className="text-white font-bold mb-1">일반형 (Standard)</div>
                                <div className="text-xs text-[#888888]">Basic Configuration</div>
                            </div>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#FF5500] opacity-0 group-hover/item:opacity-100 transition-opacity"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                        </Link>
                        <Link href={`${href}?type=advanced`} className="flex-1 rounded-xl bg-white/5 border border-white/10 hover:border-[#FF5500]/50 hover:bg-white/10 transition-all p-4 flex items-center justify-between group/item">
                            <div>
                                <div className="text-white font-bold mb-1">고급형 (Advanced)</div>
                                <div className="text-xs text-[#888888]">Full Option & Premium</div>
                            </div>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#FF5500] opacity-0 group-hover/item:opacity-100 transition-opacity"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                        </Link>
                    </div>
                </div>
            ) : (
                <>
                    <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-6 text-[#FF5500] z-10 border border-white/10 group-hover:border-[#FF5500]/50 transition-colors">
                        {icon}
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-white z-10">{title}</h3>
                    <p className="text-sm text-[#B0B0B0] mb-8 flex-grow z-10 leading-relaxed font-light">{description}</p>

                    <button
                        onClick={() => setShowOptions(true)}
                        className="w-full card-btn flex items-center justify-between px-5 py-3 bg-white/5 rounded-full text-white text-sm font-medium transition-all duration-300 hover:bg-gradient-to-r hover:from-[var(--primary-gradient-start)] hover:to-[var(--primary-gradient-end)] hover:shadow-[0_0_20px_rgba(255,85,0,0.4)] z-10 border border-white/5 hover:border-transparent text-left"
                    >
                        <span>상세보기</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                    </button>
                </>
            )}
        </div>
    );
}
