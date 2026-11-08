"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PawPrint } from "lucide-react";
import { getPets, type Pet } from "@/actions/pet";
import { Container, ICON_STROKE, pillClass } from "@/components/site/ui";
import { cn } from "@/lib/utils";

/** 지금 고른 아이. 예전 앱 홈(HomePageClient)과 같은 키를 씁니다 */
const CURRENT_PET_KEY = "foon_current_pet_id";

/** @supabase/ssr 기본 로그인 쿠키(sb-<ref>-auth-token, 길면 .0/.1 로 나뉨). 없으면 서버에 묻지 않습니다 */
const AUTH_COOKIE = /(?:^|;\s*)sb-[^=;]*-auth-token/;

function readStoredPetId(): string | null {
    try {
        return localStorage.getItem(CURRENT_PET_KEY);
    } catch {
        return null;
    }
}

function storePetId(id: string) {
    try {
        localStorage.setItem(CURRENT_PET_KEY, id);
    } catch {
        // 저장소 접근 불가(사생활 보호 모드 등): 선택은 이 화면에서만 유지
    }
}

/** 생일(YYYY-MM-DD)로 "N개월" / "N살". 없거나 잘못된 값, 미래 날짜는 "나이 미상" */
function ageLabel(birth: string | null): string {
    const m = birth ? /^(\d{4})-(\d{2})-(\d{2})/.exec(birth) : null;
    if (!m) return "나이 미상";
    const [by, bm, bd] = [Number(m[1]), Number(m[2]), Number(m[3])];
    const date = new Date(by, bm - 1, bd);
    if (date.getFullYear() !== by || date.getMonth() !== bm - 1 || date.getDate() !== bd) return "나이 미상";
    const now = new Date();
    const months = (now.getFullYear() - by) * 12 + (now.getMonth() - (bm - 1)) - (now.getDate() < bd ? 1 : 0);
    if (months < 0) return "나이 미상";
    return months < 12 ? `${months}개월` : `${Math.floor(months / 12)}살`;
}

const SPECIES: Record<string, string> = { dog: "강아지", cat: "고양이" };

function PetAvatar({ pet, size, decorative }: { pet: Pet; size: number; decorative?: boolean }) {
    if (pet.photo_url) {
        return (
            // 사용자 업로드 사진이라 next/image 원격 도메인 설정에 묶이지 않도록 일반 img 를 씁니다
            // eslint-disable-next-line @next/next/no-img-element
            <img
                src={pet.photo_url}
                alt={decorative ? "" : pet.name}
                width={size}
                height={size}
                loading="lazy"
                decoding="async"
                className="shrink-0 rounded-full bg-paper-2 object-cover"
                style={{ width: size, height: size }}
            />
        );
    }
    return (
        <span
            className="flex shrink-0 items-center justify-center rounded-full bg-paper-2 text-ink-3"
            style={{ width: size, height: size }}
            role={decorative ? undefined : "img"}
            aria-label={decorative ? undefined : pet.name}
            aria-hidden={decorative || undefined}
        >
            <PawPrint style={{ width: size * 0.42, height: size * 0.42 }} strokeWidth={ICON_STROKE} aria-hidden />
        </span>
    );
}

/**
 * 홈의 "내 아이" 카드. 로그인해 아이를 등록한 보호자에게만 보입니다.
 * 서버 렌더·로딩 중·비회원·아이 없음일 때는 아무것도 그리지 않아 검색엔진과 비회원 화면은 그대로입니다.
 * 위아래 간격도 이 안에 두어, 안 보일 때 빈 틈이 생기지 않습니다.
 */
export function MyPets() {
    /** null = 아직 모름(서버 렌더·로딩 중) */
    const [pets, setPets] = useState<Pet[] | null>(null);
    const [currentId, setCurrentId] = useState<string | null>(null);

    useEffect(() => {
        // 로그인 쿠키가 없으면 비회원: 서버 액션을 부르지 않고 그대로 둡니다
        if (!AUTH_COOKIE.test(document.cookie)) return;
        let alive = true;
        getPets()
            .then((list) => {
                if (!alive) return;
                const stored = readStoredPetId();
                setPets(list);
                setCurrentId(list.find((p) => p.id === stored)?.id ?? list[0]?.id ?? null);
            })
            .catch(() => {
                // 불러오지 못하면 카드를 숨긴 채로 둡니다(홈의 나머지는 영향 없음)
            });
        return () => {
            alive = false;
        };
    }, []);

    if (!pets || pets.length === 0) return null;
    const current = pets.find((p) => p.id === currentId) ?? pets[0];
    const meta = [current.breed?.trim() || (current.species ? SPECIES[current.species] : null), ageLabel(current.birth_date)]
        .filter(Boolean)
        .join(" · ");

    const select = (id: string) => {
        setCurrentId(id);
        storePetId(id);
    };

    return (
        <section aria-labelledby="home-my-pets" className="pt-10 sm:pt-12">
            <Container>
                <h2 id="home-my-pets" className="text-[13px] font-semibold text-ink-3">
                    내 아이
                </h2>
                <div className="mt-3 flex flex-col gap-5 rounded-[24px] bg-pass p-5 shadow-[0_24px_48px_-30px_rgb(31_39_66/0.35)] ring-1 ring-line sm:flex-row sm:items-center sm:gap-6 sm:p-6">
                    <div className="flex min-w-0 flex-1 items-center gap-4">
                        <PetAvatar pet={current} size={56} />
                        <div className="min-w-0">
                            <p className="truncate text-[18px] font-bold leading-snug text-ink">{current.name}</p>
                            <p className="mt-0.5 truncate text-[14px] text-ink-2">{meta}</p>
                        </div>
                    </div>

                    {pets.length > 1 && (
                        <ul className="flex flex-wrap items-center gap-2" aria-label="아이 바꾸기">
                            {pets.map((p) => {
                                const on = p.id === current.id;
                                return (
                                    <li key={p.id}>
                                        <button
                                            type="button"
                                            onClick={() => select(p.id)}
                                            aria-pressed={on}
                                            aria-label={`${p.name} 보기`}
                                            className={cn(
                                                "block rounded-full transition-shadow focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink motion-reduce:transition-none",
                                                on ? "ring-2 ring-ink ring-offset-2 ring-offset-pass" : "opacity-80 hover:opacity-100",
                                            )}
                                        >
                                            <PetAvatar pet={p} size={36} decorative />
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    )}

                    <div className="flex flex-wrap gap-2">
                        <Link href="/mypage#my-pets" className={pillClass({ size: "sm" })}>
                            펫패스·아이 관리
                        </Link>
                        <Link href="/memorial" className={pillClass({ variant: "ghost", size: "sm" })}>
                            추억상자
                        </Link>
                    </div>
                </div>
            </Container>
        </section>
    );
}
