"use client";

import React, { forwardRef } from "react";
import { QRCodeSVG } from "qrcode.react";

import { mbtiConfig, MbtiType } from "../shared/PetPassCard";

export interface PetPassStats {
    size: number;
    shedding: number;
    social: number;
    smart: number;
    indoor: number;
}

export interface PetPassData {
    petId: string;
    name: string;
    breed: string;
    regNum: string;
    photo?: string | null;
    birth: string | null;
    gender: "male" | "female" | "unknown";
    neuter: boolean;
    color: string;
    ownerName: string;
    description: string;
    stats: PetPassStats;
}

interface PetPassCardProps {
    data: PetPassData;
    mbtiType?: MbtiType;
}

export const PetPassCard = forwardRef<HTMLDivElement, PetPassCardProps>(({ data, mbtiType }, ref) => {
    const genderDisplay =
        data.gender === "male"
            ? "수컷 (Male)"
            : data.gender === "female"
                ? "암컷 (Female)"
                : "미상";
    const neuterDisplay = data.neuter ? "완료 (Yes)" : "안함 (No)";

    let birthDisplay = "-";
    if (data.birth) {
        const date = new Date(data.birth);
        if (!isNaN(date.getTime())) {
            birthDisplay = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(
                2,
                "0"
            )}.${String(date.getDate()).padStart(2, "0")}`;
        }
    }


    // Determine background color for stat bars
    const limeColor = "#a3df46";
    const inactiveColor = "rgba(255,255,255,0.1)";

    // MBTI Badge Info
    const badgeInfo = mbtiType ? mbtiConfig[mbtiType] : null;

    return (
        <div
            ref={ref}
            className="pet-pass-card"
            style={{
                width: "400px",
                height: "640px",
                position: "relative",
                borderRadius: "30px",
                overflow: "hidden",
                boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
                fontFamily: '"Noto Sans KR", sans-serif',
                background: "linear-gradient(135deg, #1f1f1f 0%, #0d0d0d 100%)", // base dark
            }}
        >
            {/* Holographic Overlay Layer - Improved */}
            <div
                className="absolute inset-0 pointer-events-none z-0"
                style={{
                    background: `
                    linear-gradient(
                        115deg, 
                        transparent 0%, 
                        rgba(255, 0, 150, 0.1) 25%, 
                        rgba(0, 200, 255, 0.1) 35%, 
                        rgba(0, 255, 200, 0.1) 45%, 
                        rgba(255, 255, 0, 0.1) 55%, 
                        rgba(255, 0, 0, 0.1) 65%, 
                        transparent 100%
                    )
                `,
                    backgroundSize: "200% 200%",
                    backgroundPosition: "0% 0%",
                    filter: "brightness(1.3) contrast(1.1)",
                    mixBlendMode: "screen", // Easier to see on dark bg than color-dodge
                    opacity: 0.6,
                    animation: "holographic-shimmer 4s linear infinite",
                }}
            >
                {/* Texture noise */}
                <div style={{
                    position: "absolute",
                    inset: 0,
                    opacity: 0.15,
                    backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSIvPgo8L3N2Zz4=')",
                    mixBlendMode: "overlay",
                }} />
            </div>

            {/* Global Styles for Keyframes */}
            <style dangerouslySetInnerHTML={{
                __html: `
            @keyframes holographic-shimmer {
                0% { background-position: 200% 0%; }
                100% { background-position: -200% 0%; }
            }
            @keyframes badge-pulse {
                0% { transform: scale(1) rotate(12deg); box-shadow: 0 0 0 0 rgba(163, 223, 70, 0.7); }
                70% { transform: scale(1.05) rotate(12deg); box-shadow: 0 0 0 10px rgba(163, 223, 70, 0); }
                100% { transform: scale(1) rotate(12deg); box-shadow: 0 0 0 0 rgba(163, 223, 70, 0); }
            }
        `}} />

            {/* MBTI Badge Stamp Effect */}
            {badgeInfo && (
                <div
                    className="absolute top-[180px] right-[30px] z-30 flex flex-col items-center justify-center pointer-events-none"
                    style={{
                        transform: "rotate(12deg)",
                        // animation: "badge-pulse 2s infinite" // Validation: User requested to remove blinking square
                    }}
                >
                    <div className="rounded-full bg-black/80 backdrop-blur-md border-[3px] border-foon-lime p-3 shadow-[0_0_20px_rgba(163,223,70,0.5)] flex items-center justify-center w-20 h-20">
                        <div className="transform scale-150">
                            {badgeInfo.icon}
                        </div>
                    </div>
                    <div className="mt-2 bg-foon-lime text-black font-black text-xs px-2 py-1 rounded-full shadow-lg border border-white/20">
                        {data.gender === 'male' ? badgeInfo.label.replace("공주님", "왕자님") : badgeInfo.label}
                    </div>
                </div>
            )}

            {/* Content Container (z-10 to sit above holo) */}
            <div className="relative z-10 w-full h-full flex flex-col p-[30px] text-white">

                {/* Header Row: Badge, Name, Photo, QR */}
                <div className="flex justify-between items-start mb-6">
                    <div className="flex flex-col">
                        {/* Owner Badge */}
                        <div
                            style={{
                                backgroundColor: limeColor,
                                color: "#000",
                                fontSize: "12px",
                                fontWeight: "bold",
                                padding: "4px 10px",
                                borderRadius: "12px",
                                alignSelf: "flex-start",
                                marginBottom: "8px",
                            }}
                        >
                            {data.ownerName}
                        </div>

                        {/* Name & Photo */}
                        <div className="flex items-center gap-3">
                            <span style={{ fontSize: "36px", fontWeight: "900" }}>
                                {data.name}
                            </span>
                            {/* Larger Photo Circle */}
                            <div
                                className="rounded-full overflow-hidden flex items-center justify-center"
                                style={{
                                    width: "48px",
                                    height: "48px",
                                    border: "2px solid rgba(255,255,255,0.5)",
                                    backgroundColor: "#ffffff",
                                }}
                            >
                                {data.photo ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={data.photo}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                        crossOrigin="anonymous"
                                    />
                                ) : (
                                    <span style={{ fontSize: "20px" }}>🐶</span>
                                )}
                            </div>
                        </div>
                        <span style={{ fontSize: "12px", color: "#aaaaaa", marginTop: "4px" }}>
                            등록번호 ({data.regNum})
                        </span>
                    </div>

                    {/* QR Code */}
                    <div
                        className="rounded-lg mt-2"
                        style={{
                            width: "70px",
                            height: "70px",
                            backgroundColor: "#ffffff",
                            padding: "4px"
                        }}
                    >
                        <QRCodeSVG
                            value={`foon-${data.petId}`}
                            size={62}
                            bgColor="#FFFFFF"
                            fgColor="#000000"
                            level="M"
                        />
                    </div>
                </div>

                {/* Description Box */}
                <div
                    className="rounded-2xl p-4 text-center mb-6"
                    style={{
                        backgroundColor: "rgba(255,255,255,0.08)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        color: "#ddd",
                        fontSize: "13px",
                        fontWeight: "500",
                        lineHeight: "1.6", // Explicit line height
                        wordBreak: "keep-all", // Better Korean wrapping
                        whiteSpace: "pre-wrap", // Handle newlines
                        letterSpacing: "0.5px", // Slight spacing
                        height: "110px", // Fixed height to prevent shift
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden", // Clip overflow
                    }}
                >
                    {data.description}
                </div>

                {/* Info List */}
                <div className="flex flex-col mb-6" style={{ fontSize: "13px", gap: "8px" }}>
                    <InfoRow label="생일" value={birthDisplay} />
                    <InfoRow label="품종" value={data.breed} />
                    <InfoRow label="색상" value={data.color} />
                    <InfoRow label="성별" value={genderDisplay} />
                    <InfoRow label="중성화" value={neuterDisplay} />
                </div>

                {/* Stats Bar Chart Section */}
                <div
                    className="flex-1 rounded-2xl p-4 flex flex-col justify-between"
                    style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
                >
                    <StatRow
                        label="크기"
                        score={data.stats.size}
                        icon="🐘" // Using elephant for size as placeholder or keep existing
                        activeColor={limeColor}
                        inactiveColor={inactiveColor}
                    />
                    <StatRow
                        label="털빠짐"
                        score={data.stats.shedding}
                        icon="✨"
                        activeColor={limeColor}
                        inactiveColor={inactiveColor}
                    />
                    <StatRow
                        label="친화력"
                        score={data.stats.social}
                        icon="🥰"
                        activeColor={limeColor}
                        inactiveColor={inactiveColor}
                    />
                    <StatRow
                        label="학습력"
                        score={data.stats.smart}
                        icon="🎓"
                        activeColor={limeColor}
                        inactiveColor={inactiveColor}
                    />
                    <StatRow
                        label="실내/외"
                        score={data.stats.indoor}
                        icon="🏞️"
                        activeColor={limeColor}
                        inactiveColor={inactiveColor}
                    />
                </div>
            </div>
        </div>
    );
});

PetPassCard.displayName = "PetPassCard";

// Helper Components

const InfoRow = ({ label, value }: { label: string; value: string }) => (
    <div
        className="flex justify-between pb-1"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}
    >
        <span style={{ color: "#888888" }}>{label}</span>
        <span style={{ fontWeight: "bold" }}>{value}</span>
    </div>
);

const StatRow = ({
    label,
    score,
    icon,
    activeColor,
    inactiveColor,
}: {
    label: string;
    score: number;
    icon: string;
    activeColor: string;
    inactiveColor: string;
}) => (
    <div className="flex items-center justify-between">
        <span className="text-xs text-[#aaa] w-[50px]">{label}</span>
        <div className="flex gap-1 flex-1 mx-3 h-[6px]">
            {[1, 2, 3, 4, 5].map((step) => (
                <div
                    key={step}
                    className="flex-1 rounded-sm"
                    style={{
                        backgroundColor: step <= score ? activeColor : inactiveColor,
                    }}
                />
            ))}
        </div>
        <span className="text-sm">{icon}</span>
    </div>
);
