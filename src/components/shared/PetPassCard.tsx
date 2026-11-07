"use client";

import { Badge } from "@/components/ui/badge";
import { Crown, Dog, Home, PawPrint, Zap } from 'lucide-react';
import { APP_ICON_STROKE } from "@/components/app/tokens";

export type MbtiType = 'ENERGIZER' | 'PRINCESS' | 'HOMEBODY' | 'SOCIAL';

interface PetPassCardProps {
    petName: string;
    petImage: string;
    registrationNumber: string;
    mbtiType?: MbtiType;
}

/**
 * 멍BTI 유형. icon 은 글자색(currentColor)을 따르므로 놓이는 자리에서 색을 정합니다.
 * color 는 배지 칸에 쓰는 토큰 클래스입니다.
 */
export const mbtiConfig = {
    ENERGIZER: {
        label: "파워 에너자이저",
        icon: <Zap className="h-4 w-4" strokeWidth={APP_ICON_STROKE} aria-hidden />,
        color: "bg-pine-soft text-pine border-line",
        desc: "지치지 않는 체력왕"
    },
    PRINCESS: {
        label: "유리멘탈 공주님",
        icon: <Crown className="h-4 w-4" strokeWidth={APP_ICON_STROKE} aria-hidden />,
        color: "bg-pine-soft text-pine border-line",
        desc: "섬세한 케어 필요"
    },
    HOMEBODY: {
        label: "방구석 여포",
        icon: <Home className="h-4 w-4" strokeWidth={APP_ICON_STROKE} aria-hidden />,
        color: "bg-pine-soft text-pine border-line",
        desc: "집이 제일 좋아"
    },
    SOCIAL: {
        label: "핵인싸 골목대장",
        icon: <Dog className="h-4 w-4" strokeWidth={APP_ICON_STROKE} aria-hidden />,
        color: "bg-pine-soft text-pine border-line",
        desc: "친구야 반가워!"
    }
};

/**
 * 작은 펫패스. 사이트 PassCard 와 같은 흰 탑승권(globals.css .pass): 위는 아이 정보, 점선 절취선 아래는 바코드.
 */
export function PetPassCard({ petName, petImage, registrationNumber, mbtiType }: PetPassCardProps) {
    const badgeInfo = mbtiType ? mbtiConfig[mbtiType] : null;

    return (
        <div className="relative mx-auto w-full max-w-sm perspective-1000">
            <div className="pass" data-stub="bottom" data-tone="light" data-radius="card">
                <div className="pass-main">
                    {/* Header */}
                    <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-3.5">
                        <span className="text-[13px] font-bold tracking-[0.12em] text-ink">foon PASS</span>
                        {badgeInfo && (
                            <Badge>
                                {badgeInfo.icon}
                                {badgeInfo.label}
                            </Badge>
                        )}
                    </div>

                    <div className="flex flex-col items-center gap-5 p-6">
                        {/* Profile Image */}
                        <div className="relative h-32 w-32">
                            {petImage ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={petImage}
                                    alt={petName}
                                    className="h-full w-full rounded-full object-cover ring-4 ring-paper-2"
                                />
                            ) : (
                                <span className="flex h-full w-full items-center justify-center rounded-full bg-paper-2 text-ink-3">
                                    <PawPrint className="h-10 w-10" strokeWidth={APP_ICON_STROKE} aria-hidden />
                                </span>
                            )}
                            {badgeInfo && (
                                <span className="absolute -bottom-1 -right-1 flex h-9 w-9 rotate-12 items-center justify-center rounded-full bg-pass text-pine ring-1 ring-line">
                                    {badgeInfo.icon}
                                </span>
                            )}
                        </div>

                        {/* Info */}
                        <div className="space-y-1 text-center">
                            <h2 className="text-[24px] font-bold text-ink">{petName}</h2>
                            <p className="text-[13px] tracking-[0.2em] text-ink-3 tabular-nums">{registrationNumber}</p>
                        </div>

                        {/* Description or CTA */}
                        {badgeInfo ? (
                            <div className="w-full rounded-xl bg-paper-2 p-3 text-center">
                                <p className="text-[14px] font-medium text-ink">{`"${badgeInfo.desc}"`}</p>
                                <p className="mt-1 text-[13px] text-pine">맞춤 서비스 추천 가능</p>
                            </div>
                        ) : (
                            <div className="group w-full cursor-pointer rounded-xl border-2 border-dashed border-line p-3 text-center transition-colors hover:bg-paper-2">
                                <p className="text-[14px] text-ink-2 transition-colors group-hover:text-pine">멍BTI 검사하고 뱃지 받기 +</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Bottom Barcode (절취선 너머) */}
                <div className="pass-stub flex justify-center px-5 py-4">
                    <div aria-hidden className="flex h-6 w-3/4 items-center justify-center text-[13px] tracking-[0.5em] text-ink-3">
                        ||| || ||| || |||
                    </div>
                </div>
            </div>
        </div>
    );
}
