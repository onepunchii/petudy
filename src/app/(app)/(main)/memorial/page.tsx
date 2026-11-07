"use client";

import { Image as ImageIcon, Mail, PawPrint, PenLine, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { APP_ICON_STROKE, AppBody, AppButton, AppEmpty, AppHero, AppLinkButton, BRAND_ICON, skeletonClass } from "@/components/app/ui";
import { PassCard } from "@/components/site/PassCard";
import { usePets } from "@/hooks/usePets";
import { cn } from "@/lib/utils";

/*
 * 추억상자 (떠난 뒤 = 별자리). 차분한 화면이라 라임·이모지·캐릭터를 쓰지 않습니다.
 * 위쪽 밤 머리(작은 별자리) -> 달빛 본문(아이마다 탑승권 카드 한 장, 절취선 아래에 편지·사진·부고장).
 */

/** 머리 오른쪽의 작은 별자리 (장식) */
function Constellation() {
    const stars: [number, number, number][] = [
        [8, 46, 1.6],
        [32, 30, 2.2],
        [56, 40, 1.5],
        [78, 14, 2.6],
        [98, 26, 1.7],
    ];
    return (
        <svg width="106" height="60" viewBox="0 0 106 60" fill="none" aria-hidden className="block">
            <polyline
                points={stars.map(([x, y]) => `${x},${y}`).join(" ")}
                className="stroke-star-3"
                strokeOpacity={0.55}
                strokeWidth={1}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            {stars.map(([x, y, r]) => (
                <circle key={`${x}-${y}`} cx={x} cy={y} r={r} className="fill-star" />
            ))}
        </svg>
    );
}

const memoryLinkClass =
    "flex flex-col items-center gap-1.5 py-2.5 text-[13.5px] font-semibold text-ink-2 transition-colors hover:text-ink active:translate-y-px focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ink";

export default function MemorialPage() {
    const { data: pets = [], isLoading, isError, refetch } = usePets();

    return (
        <div className="min-h-full">
            <AppHero title="추억상자" action={<Constellation />} />

            <AppBody>
                {isLoading ? (
                    <div className="space-y-4" role="status" aria-live="polite">
                        <div className={cn(skeletonClass, "h-[164px]")} aria-hidden />
                        <div className={cn(skeletonClass, "h-[164px]")} aria-hidden />
                        <p className="pt-2 text-center text-[13px] text-ink-3">아이 목록을 불러오는 중이에요</p>
                    </div>
                ) : isError ? (
                    <AppEmpty
                        title={
                            <span role="heading" aria-level={2}>
                                목록을 불러오지 못했어요
                            </span>
                        }
                        description="잠시 후 다시 시도해 주세요."
                        action={
                            <AppButton variant="secondary" onClick={() => refetch()}>
                                다시 불러오기
                            </AppButton>
                        }
                    />
                ) : pets.length === 0 ? (
                    <AppEmpty
                        icon={BRAND_ICON.memorial}
                        title={
                            <span role="heading" aria-level={2}>
                                아이를 먼저 등록해 주세요
                            </span>
                        }
                        description="등록한 아이의 편지·사진·부고장을 추억상자에 담을 수 있어요."
                        action={
                            <AppLinkButton href="/register" variant="primary">
                                <Plus className="h-4 w-4" strokeWidth={APP_ICON_STROKE} aria-hidden />
                                아이 등록하기
                            </AppLinkButton>
                        }
                    />
                ) : (
                    <ul className="space-y-4">
                        {pets.map((pet) => (
                            <PassCard
                                key={pet.id}
                                as="li"
                                stubPosition="bottom"
                                mainClassName="p-5 sm:p-5"
                                stubClassName="p-0 sm:min-w-0 sm:p-0"
                                stub={
                                    <div className="grid grid-cols-3 divide-x divide-line px-1 py-2">
                                        <Link href={`/memorial/${pet.id}/letters`} className={memoryLinkClass}>
                                            <PenLine className="h-5 w-5 text-pine" strokeWidth={APP_ICON_STROKE} aria-hidden />
                                            편지
                                        </Link>
                                        <Link href={`/memorial/${pet.id}/photos`} className={memoryLinkClass}>
                                            <ImageIcon className="h-5 w-5 text-pine" strokeWidth={APP_ICON_STROKE} aria-hidden />
                                            사진
                                        </Link>
                                        <Link href={`/memorial/${pet.id}/obituary`} className={memoryLinkClass}>
                                            <Mail className="h-5 w-5 text-pine" strokeWidth={APP_ICON_STROKE} aria-hidden />
                                            부고장
                                        </Link>
                                    </div>
                                }
                            >
                                <div className="flex items-center gap-4">
                                    <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-paper-2 text-ink-3 ring-1 ring-inset ring-line">
                                        {pet.photo_url ? (
                                            <Image src={pet.photo_url} alt={`${pet.name} 사진`} fill sizes="56px" className="object-cover" />
                                        ) : (
                                            <PawPrint className="h-6 w-6" strokeWidth={APP_ICON_STROKE} aria-hidden />
                                        )}
                                    </div>
                                    <div className="min-w-0">
                                        <h2 className="truncate text-[18px] font-bold leading-snug text-ink">{pet.name}</h2>
                                        <p className="mt-0.5 truncate text-[14px] text-ink-3">
                                            {pet.species === "cat" ? "고양이" : "강아지"}
                                            {pet.breed ? ` · ${pet.breed}` : ""}
                                        </p>
                                    </div>
                                </div>
                            </PassCard>
                        ))}
                    </ul>
                )}
            </AppBody>
        </div>
    );
}
