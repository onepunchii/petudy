"use client";

/* 내 정보 화면 본문. 로그인 확인은 src/app/(app)/(main)/mypage/page.tsx(서버)가 먼저 합니다 */

import { signOutAction } from "@/actions/user";
import Image from "next/image";
import { CalendarDays, LogOut, User } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { APP_ICON_STROKE, AppBody, AppHero, AppList, AppListItem, skeletonClass } from "@/components/app/ui";
import MyPetsSection from "@/components/mypage/MyPetsSection";
import { PassCard } from "@/components/site/PassCard";
import { cn } from "@/lib/utils";

type Profile = NonNullable<ReturnType<typeof useProfile>["data"]>;

export default function MyPageClient() {
    const { data: profile, isLoading } = useProfile();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !profile) {
            // 보던 중 세션이 끊긴 경우의 예비 처리. replace 라 뒤로 가기가 /mypage ↔ /login 을 맴돌지 않습니다
            router.replace("/login?next=%2Fmypage");
        }
    }, [isLoading, profile, router]);

    if (isLoading) {
        return (
            <div className="min-h-full bg-moon">
                <AppHero title="내 정보" />
                <AppBody>
                    <div className={cn(skeletonClass, "h-[104px]")} aria-hidden />
                    <div className={cn(skeletonClass, "mt-4 h-14")} aria-hidden />
                    <p role="status" className="sr-only">
                        불러오는 중
                    </p>
                </AppBody>
            </div>
        );
    }

    if (!profile) return null; // Redirecting or waiting for profile

    return <MyPageContent profile={profile} />;
}


// Extracted for clean render
function MyPageContent({ profile }: { profile: Profile }) {
    return (
        <div className="min-h-full bg-moon">
            <AppHero title="내 정보" />

            <AppBody>
                {/* 프로필: 탑승권 카드 (절취선 없는 기본형) */}
                <PassCard mainClassName="flex items-center gap-4 p-5 sm:p-5">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-paper-2 ring-1 ring-line">
                        {profile.avatarUrl ? (
                            <Image src={profile.avatarUrl} alt="Avatar" width={64} height={64} className="h-full w-full object-cover" />
                        ) : (
                            <User className="h-7 w-7 text-ink-3" strokeWidth={APP_ICON_STROKE} aria-hidden />
                        )}
                    </div>
                    <div className="min-w-0">
                        <h2 className="flex flex-wrap items-center gap-2 text-[18px] font-bold leading-snug text-ink">
                            {profile.nickname}
                            <span className="rounded-full bg-pine-soft px-2.5 py-0.5 text-[13px] font-semibold tracking-[0.02em] text-pine">MEMBER</span>
                        </h2>
                        <p className="mt-0.5 truncate text-[14px] text-ink-3">{profile.email}</p>
                    </div>
                </PassCard>

                {/* 내 아이: 펫 패스, 수정, 삭제, 순서, 추가 (예전 앱 홈에서 옮겨 옴) */}
                <MyPetsSection />

                {/* 계정 */}
                <AppList className="mt-8" aria-label="계정">
                    <AppListItem
                        href="/booking"
                        icon={<CalendarDays className="h-[18px] w-[18px]" strokeWidth={APP_ICON_STROKE} aria-hidden />}
                        label="내 상담 내역"
                    />
                    <li>
                        <form action={signOutAction}>
                            <button
                                type="submit"
                                className="flex min-h-[56px] w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-paper-2/70 active:bg-paper-2"
                            >
                                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-paper-2 text-ink-2">
                                    <LogOut className="h-[18px] w-[18px]" strokeWidth={APP_ICON_STROKE} aria-hidden />
                                </span>
                                <span className="min-w-0 flex-1 text-[15.5px] font-semibold text-ink">로그아웃</span>
                            </button>
                        </form>
                    </li>
                </AppList>
            </AppBody>
        </div>
    );
}
