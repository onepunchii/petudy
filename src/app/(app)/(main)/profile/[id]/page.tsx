"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Camera, Grid, Heart, PawPrint } from "lucide-react"; // Icons
import { useParams } from "next/navigation";
import { getProfileWithPosts, getIsFollowing, followUser, unfollowUser } from "@/actions/social";
import { createClient } from "@/lib/supabase/client";
import { APP_ICON_STROKE, AppBody, AppButton, AppEmpty, AppTopBar, skeletonClass } from "@/components/app/ui";
import { PassCard } from "@/components/site/PassCard";
import { cn } from "@/lib/utils";

// Types matching action return
type ProfileData = Awaited<ReturnType<typeof getProfileWithPosts>>;

export default function PublicProfilePage() {
    const [data, setData] = useState<ProfileData | null>(null);
    const [isFollowing, setIsFollowing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState<string | null>(null);

    // Next 16: 클라이언트 컴포넌트는 props.params 대신 useParams 로 읽음
    const { id: userId } = useParams<{ id: string }>();

    useEffect(() => {
        const loadProfile = async () => {
            try {
                // Get Current User
                const supabase = createClient();
                const { data: { user } } = await supabase.auth.getUser();
                setCurrentUser(user?.id || null);

                // Fetch Profile Data
                const profileData = await getProfileWithPosts(userId);
                setData(profileData);

                // Check Follow Status
                if (user && user.id !== userId) {
                    const following = await getIsFollowing(userId);
                    setIsFollowing(following);
                }
            } catch (error) {
                console.error("Failed to load profile", error);
            } finally {
                setLoading(false);
            }
        };
        loadProfile();
    }, [userId]);

    const handleFollowToggle = async () => {
        if (!currentUser) {
            alert("로그인이 필요합니다.");
            return;
        }

        // Optimistic UI
        const prev = isFollowing;
        setIsFollowing(!prev);

        if (prev) {
            await unfollowUser(userId);
        } else {
            await followUser(userId);
        }
    };

    if (loading) {
        return (
            <div className="min-h-full">
                <AppTopBar />
                <AppBody>
                    <div role="status">
                        <span className="sr-only">Loading...</span>
                        <div className={cn(skeletonClass, "h-[264px]")} aria-hidden />
                        <div className={cn(skeletonClass, "mt-8 h-40")} aria-hidden />
                    </div>
                </AppBody>
            </div>
        );
    }
    if (!data) {
        return (
            <div className="min-h-full">
                <AppTopBar />
                <AppBody>
                    <AppEmpty icon={<PawPrint className="h-7 w-7" strokeWidth={APP_ICON_STROKE} aria-hidden />} title="User not found" />
                </AppBody>
            </div>
        );
    }

    const { user: profileUser, pets, posts, stats } = data;
    const mainPet = pets[0]; // Assuming first pet is main for now

    return (
        <div className="min-h-full">
            {/* Header */}
            <AppTopBar title={profileUser.nickname} />

            <AppBody>
                {/* Profile Header: 탑승권 카드 (절취선 아래 수치) */}
                <PassCard
                    as="section"
                    stubPosition="bottom"
                    mainClassName="p-5 sm:p-5"
                    stubClassName="px-3 py-4 sm:px-3 sm:py-4"
                    stub={
                        /* Stats */
                        <dl className="grid grid-cols-3 text-center">
                            <div className="flex flex-col-reverse">
                                <dt className="mt-0.5 text-[13px] text-ink-3">게시물</dt>
                                <dd className="text-[18px] font-bold tabular-nums text-ink">{stats.postCount}</dd>
                            </div>
                            <div className="flex flex-col-reverse">
                                <dt className="mt-0.5 text-[13px] text-ink-3">팬</dt>
                                <dd className="text-[18px] font-bold tabular-nums text-ink">{stats.followers}</dd>
                            </div>
                            <div className="flex flex-col-reverse">
                                <dt className="mt-0.5 text-[13px] text-ink-3">팔로잉</dt>
                                <dd className="text-[18px] font-bold tabular-nums text-ink">{stats.following}</dd>
                            </div>
                        </dl>
                    }
                >
                    <div className="flex items-center gap-4">
                        {/* Avatar */}
                        <div className="relative h-20 w-20 shrink-0">
                            <div className="h-20 w-20 overflow-hidden rounded-full bg-paper-2 ring-1 ring-line">
                                {mainPet?.profilePhotoUrl ? (
                                    <Image src={mainPet.profilePhotoUrl} alt="Profile" width={80} height={80} className="h-full w-full object-cover" />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center text-ink-3">
                                        <PawPrint className="h-8 w-8" strokeWidth={APP_ICON_STROKE} aria-hidden />
                                    </div>
                                )}
                            </div>
                            {/* Level/Badge could go here */}
                        </div>

                        {/* Bio */}
                        <div className="min-w-0">
                            <h2 className="truncate text-[21px] font-bold leading-snug text-ink">{mainPet?.petName || "이름없음"}</h2>
                            <p className="mt-0.5 text-[14px] text-ink-2">{mainPet?.breed} • {mainPet?.gender === 'MALE' ? '남아' : '여아'}</p>
                        </div>
                    </div>

                    <p className="mt-4 text-[15px] leading-relaxed text-ink-2">
                        {/* Bio mock for now */}
                        안녕하세요! 우리 {mainPet?.petName}의 일상입니다
                    </p>

                    {/* Actions */}
                    {currentUser !== userId && (
                        <AppButton
                            onClick={handleFollowToggle}
                            variant={isFollowing ? "secondary" : "accent"}
                            block
                            className="mt-5"
                        >
                            {isFollowing ? "단짝 끊기" : "단짝 맺기"}
                        </AppButton>
                    )}
                </PassCard>

                <section className="mt-8">
                    {/* Content Tabs */}
                    <div className="flex border-b border-line">
                        <button type="button" className="-mb-px flex flex-1 items-center justify-center border-b-2 border-ink py-3 text-ink">
                            <Grid className="h-5 w-5" strokeWidth={APP_ICON_STROKE} />
                        </button>
                        <button type="button" className="-mb-px flex flex-1 items-center justify-center border-b-2 border-transparent py-3 text-ink-3 transition-colors hover:text-ink-2">
                            <Heart className="h-5 w-5" strokeWidth={APP_ICON_STROKE} />
                        </button>
                    </div>

                    {/* Photo Grid */}
                    {posts.length > 0 ? (
                        <div className="mt-4 grid grid-cols-3 gap-1 overflow-hidden rounded-[20px]">
                            {posts.map((post) => (
                                <div key={post.id} className="group relative aspect-square cursor-pointer bg-paper-2 transition-opacity hover:opacity-90">
                                    <Image
                                        src={post.imageUrl}
                                        alt={post.caption || "Post"}
                                        fill
                                        className="object-cover"
                                        sizes="33vw"
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <AppEmpty
                            className="mt-4"
                            icon={<Camera className="h-7 w-7" strokeWidth={APP_ICON_STROKE} aria-hidden />}
                            title="아직 게시물이 없어요"
                        />
                    )}
                </section>
            </AppBody>
        </div>
    );
}
