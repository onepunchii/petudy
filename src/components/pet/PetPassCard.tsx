"use client";

import React, { forwardRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { GraduationCap, PawPrint, Ruler, Smile, Sparkles, Trees, type LucideIcon } from "lucide-react";

import { APP_ICON_STROKE } from "@/components/app/tokens";
import { cn } from "@/lib/utils";
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

/**
 * 펫패스 (반려동물 여권). 사이트 PassCard 와 같은 흰 탑승권(globals.css .pass)으로,
 * 위쪽은 아이 정보, 점선 절취선 아래(stub)는 성향 막대입니다.
 * - 400x640 고정: 등록 완료 화면에서 이 요소를 html2canvas 로 그대로 이미지 저장합니다.
 * - html2canvas 가 읽을 수 있도록 투명도 수식어(/70 등, color-mix)와 Tailwind rotate/scale 대신
 *   불투명 토큰 색과 인라인 transform 을 씁니다. html2canvas 는 mask 를 그리지 않아
 *   저장 이미지에서는 반원 홈 없이 둥근 카드로 나옵니다.
 */
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

    // MBTI Badge Info
    const badgeInfo = mbtiType ? mbtiConfig[mbtiType] : null;

    return (
        <div
            ref={ref}
            className="pet-pass-card pass"
            data-stub="bottom"
            data-tone="light"
            data-radius="tile"
            style={{
                width: "400px",
                height: "640px",
                position: "relative",
                // 위 정보 칸이 남는 높이를 모두 쓰고, 성향 막대(stub)는 내용만큼
                gridTemplateRows: "minmax(0, 1fr) auto",
            }}
        >
            {/* 멍BTI 도장: 여권에 찍힌 도장처럼 기울여 설명 칸 오른쪽에 둡니다 (설명 칸은 그만큼 오른쪽을 비움) */}
            {badgeInfo && (
                <div
                    className="pointer-events-none absolute right-[26px] top-[124px] z-30 flex flex-col items-center"
                    style={{ transform: "rotate(12deg)" }}
                >
                    <div className="flex h-20 w-20 items-center justify-center rounded-full border-[3px] border-double border-pine bg-pass text-pine">
                        <div style={{ transform: "scale(1.5)" }}>{badgeInfo.icon}</div>
                    </div>
                    <div className="mt-2 rounded-full bg-pine px-2.5 py-1 text-[13px] font-bold text-star">
                        {data.gender === 'male' ? badgeInfo.label.replace("공주님", "왕자님") : badgeInfo.label}
                    </div>
                </div>
            )}

            <div className="pass-main flex flex-col px-7 pb-6 pt-7">
                {/* Header Row: Owner, Name, Photo, QR */}
                <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 flex-col">
                        {/* Owner Badge */}
                        <span className="self-start rounded-full bg-paper-2 px-2.5 py-1 text-[13px] font-semibold text-ink-2">
                            {data.ownerName}
                        </span>

                        {/* Name & Photo */}
                        <div className="mt-2 flex items-center gap-3">
                            <span className="text-[34px] font-extrabold leading-tight tracking-[-0.03em] text-ink">
                                {data.name}
                            </span>
                            <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-paper-2 text-ink-3 ring-2 ring-line">
                                {data.photo ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={data.photo}
                                        alt="Profile"
                                        className="h-full w-full object-cover"
                                        crossOrigin="anonymous"
                                    />
                                ) : (
                                    <PawPrint className="h-5 w-5" strokeWidth={APP_ICON_STROKE} aria-hidden />
                                )}
                            </span>
                        </div>
                        <span className="mt-1 text-[13px] text-ink-3 tabular-nums">
                            등록번호 ({data.regNum})
                        </span>
                    </div>

                    {/* QR Code: 읽히도록 흰 바탕에 짙은 글자색(ink) */}
                    <div className="mt-1 shrink-0 rounded-xl bg-pass p-1 ring-1 ring-line">
                        <QRCodeSVG
                            value={`foon-${data.petId}`}
                            size={62}
                            bgColor="#FCFCFD"
                            fgColor="#10131A"
                            level="M"
                        />
                    </div>
                </div>

                {/* Description Box (높이 고정: 문구 길이에 따라 흔들리지 않게) */}
                <div
                    className={cn(
                        "mt-4 flex h-[100px] items-center justify-center overflow-hidden whitespace-pre-wrap break-keep rounded-xl bg-moon text-center text-[14px] font-medium leading-[1.6] text-ink-2",
                        badgeInfo ? "pl-4 pr-[104px]" : "px-4",
                    )}
                >
                    {data.description}
                </div>

                {/* Info List */}
                <dl className="mt-auto flex flex-col pt-3">
                    <InfoRow label="생일" value={birthDisplay} />
                    <InfoRow label="품종" value={data.breed} />
                    <InfoRow label="색상" value={data.color} />
                    <InfoRow label="성별" value={genderDisplay} />
                    <InfoRow label="중성화" value={neuterDisplay} />
                </dl>
            </div>

            {/* Stats Bar Chart Section (절취선 너머) */}
            <div className="pass-stub flex flex-col gap-[9px] px-7 py-5">
                <StatRow label="크기" score={data.stats.size} icon={Ruler} />
                <StatRow label="털빠짐" score={data.stats.shedding} icon={Sparkles} />
                <StatRow label="친화력" score={data.stats.social} icon={Smile} />
                <StatRow label="학습력" score={data.stats.smart} icon={GraduationCap} />
                <StatRow label="실내/외" score={data.stats.indoor} icon={Trees} />
            </div>
        </div>
    );
});

PetPassCard.displayName = "PetPassCard";

// Helper Components

const InfoRow = ({ label, value }: { label: string; value: string }) => (
    <div className="flex items-baseline justify-between gap-4 border-b border-line py-[5px] last:border-b-0">
        <dt className="shrink-0 text-[13px] text-ink-3">{label}</dt>
        <dd className="min-w-0 text-right text-[14.5px] font-semibold text-ink">{value}</dd>
    </div>
);

const StatRow = ({
    label,
    score,
    icon: Icon,
}: {
    label: string;
    score: number;
    icon: LucideIcon;
}) => (
    <div className="flex items-center gap-3">
        <Icon className="h-4 w-4 shrink-0 text-ink-3" strokeWidth={APP_ICON_STROKE} aria-hidden />
        <span className="w-[52px] shrink-0 text-[13px] font-medium text-ink-2">{label}</span>
        <div className="flex h-1.5 flex-1 gap-1">
            {[1, 2, 3, 4, 5].map((step) => (
                <div
                    key={step}
                    className={cn("flex-1 rounded-full", step <= score ? "bg-pine" : "bg-line")}
                />
            ))}
        </div>
    </div>
);
